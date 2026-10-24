import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type User
} from 'firebase/auth';
import { auth } from './firebase';

/* 
=============================================================================
🔶 ADMIN IDENTITY CONFIGURATION 🔶
=============================================================================
Configured in .env / .env.local:
VITE_INITIAL_ADMIN_UID and VITE_INITIAL_ADMIN_EMAIL
=============================================================================
*/
const ADMIN_UID = import.meta.env.VITE_INITIAL_ADMIN_UID || "VBYGRdOew4NAXcdKTmIgEXd79Sv2";
const ADMIN_EMAIL = (import.meta.env.VITE_INITIAL_ADMIN_EMAIL || "muradexplore2012@gmail.com").toLowerCase();

/**
 * Checks if a given Firebase Auth user is an authorized administrator.
 * Verifies UID, email, or custom claim (admin === true).
 */
export async function verifyAdminStatus(user: User | null): Promise<boolean> {
  if (!user) return false;

  // 1. Check configured initial UID
  if (ADMIN_UID && user.uid === ADMIN_UID) {
    return true;
  }

  // 2. Check configured admin email
  if (ADMIN_EMAIL && user.email && user.email.toLowerCase() === ADMIN_EMAIL) {
    return true;
  }

  // 3. Check custom claims if set via Firebase Admin SDK
  try {
    const idTokenResult = await user.getIdTokenResult();
    if (idTokenResult.claims && idTokenResult.claims.admin === true) {
      return true;
    }
  } catch (err) {
    console.error("Error inspecting user ID token claims:", err);
  }

  return false;
}

/**
 * User Sign-in with Google popup
 */
export async function signInWithGoogle(): Promise<User> {
  if (!auth) throw new Error("Firebase Auth is not initialized.");
  const provider = new GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);

  // Guarantee photoURL & displayName are synced to root user profile
  const photo = result.user.photoURL || result.user.providerData?.find(p => p.photoURL)?.photoURL;
  const name = result.user.displayName || result.user.providerData?.find(p => p.displayName)?.displayName;

  if ((!result.user.photoURL && photo) || (!result.user.displayName && name)) {
    try {
      await updateProfile(result.user, {
        ...(photo ? { photoURL: photo } : {}),
        ...(name ? { displayName: name } : {})
      });
    } catch (e) {
      console.warn("Could not sync Google profile data to Firebase user:", e);
    }
  }

  return result.user;
}

/**
 * User Sign-in with Email & Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  if (!auth) throw new Error("Firebase Auth is not initialized.");
  const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return result.user;
}

/**
 * User Registration / Sign-up with Email & Password
 */
export async function signUpWithEmail(name: string, email: string, pass: string): Promise<User> {
  if (!auth) throw new Error("Firebase Auth is not initialized.");
  const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (name.trim()) {
    try {
      await updateProfile(result.user, { displayName: name.trim() });
    } catch (e) {
      console.warn("Could not set displayName:", e);
    }
  }
  return result.user;
}

/**
 * Sign out helper
 */
export async function signOutAdmin(): Promise<void> {
  if (auth) {
    await firebaseSignOut(auth);
  }
}

export const signOutUser = signOutAdmin;

/**
 * Listen to auth state changes
 */
export function subscribeToAuthState(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, async (user) => {
    if (user && !user.displayName) {
      const emailLower = (user.email || '').toLowerCase().trim();
      if (
        emailLower === ADMIN_EMAIL.toLowerCase() ||
        emailLower === 'muradrahman2026@gmail.com'
      ) {
        try {
          await updateProfile(user, { displayName: 'Murad Rahman' });
        } catch {}
      }
    }
    callback(user);
  });
}

export { ADMIN_UID, ADMIN_EMAIL };
