import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { User as UserIcon } from 'lucide-react';
import { ADMIN_EMAIL } from '../lib/auth';

interface UserAvatarProps {
  user: User | null;
  className?: string;
  adminFallbackImage?: string;
}

/**
 * Resolves the candidate avatar URL for any authenticated user:
 * 1. user.photoURL (Direct Google / Firebase photo)
 * 2. Provider data photoURL (from Google OAuth provider)
 * 3. Murad Rahman's portfolio portrait if email matches admin
 * 4. Fallback to unavatar.io for public email avatar (Gravatar/Google)
 */
export function getCandidateAvatarUrl(user: User | null, adminFallbackImage?: string): string | null {
  if (!user) return null;

  // 1. Direct photoURL (Google sign-in)
  if (user.photoURL && user.photoURL.trim()) {
    return user.photoURL.trim();
  }

  // 2. Google provider data photoURL
  if (user.providerData && user.providerData.length > 0) {
    for (const p of user.providerData) {
      if (p.photoURL && p.photoURL.trim()) {
        return p.photoURL.trim();
      }
    }
  }

  // 3. Cached Google profile photo in localStorage
  const emailLower = (user.email || '').toLowerCase().trim();
  if (emailLower && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('user_avatar_' + emailLower);
      if (cached && cached.trim()) return cached.trim();
    } catch {}
  }

  // 4. Murad Rahman / Admin Account
  if (
    emailLower === ADMIN_EMAIL.toLowerCase() ||
    emailLower === 'muradrahman2026@gmail.com'
  ) {
    return adminFallbackImage || '/images/murad-rahman-hero.png';
  }

  // 5. Any email user: Try public Gravatar / unavatar fetcher
  if (emailLower) {
    return `https://unavatar.io/${encodeURIComponent(emailLower)}?fallback=false`;
  }

  return null;
}

/**
 * Resolves a friendly, formatted display name for any user:
 * 1. user.displayName (Google profile name or registration name)
 * 2. Provider data displayName
 * 3. If admin / Murad Rahman -> "Murad Rahman"
 * 4. Pretty-printed name from email prefix (e.g. "muradexplore" -> "Murad Explore")
 */
export function getUserDisplayName(user: User | null, siteOwnerName = 'Murad Rahman'): string {
  if (!user) return 'User';

  if (user.displayName && user.displayName.trim()) {
    return user.displayName.trim();
  }

  if (user.providerData && user.providerData.length > 0) {
    for (const p of user.providerData) {
      if (p.displayName && p.displayName.trim()) {
        return p.displayName.trim();
      }
    }
  }

  const emailLower = (user.email || '').toLowerCase().trim();
  if (
    emailLower === ADMIN_EMAIL.toLowerCase() ||
    emailLower === 'muradrahman2026@gmail.com'
  ) {
    return siteOwnerName || 'Murad Rahman';
  }

  if (user.email) {
    const prefix = user.email.split('@')[0];
    const cleaned = prefix
      .replace(/[._\-+0-9]+/g, ' ')
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    return cleaned || prefix;
  }

  return 'User';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  className = 'w-7 h-7',
  adminFallbackImage = '/images/murad-rahman-hero.png'
}) => {
  const [hasError, setHasError] = useState(false);
  const avatarUrl = getCandidateAvatarUrl(user, adminFallbackImage);

  if (avatarUrl && !hasError) {
    return (
      <img
        src={avatarUrl}
        alt={user?.displayName || user?.email || 'User'}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`${className} rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100 shadow-2xs`}
      />
    );
  }

  // If Murad Rahman is logged in and error occurred, force portfolio portrait
  const emailLower = (user?.email || '').toLowerCase().trim();
  if (
    emailLower === ADMIN_EMAIL.toLowerCase() ||
    emailLower === 'muradrahman2026@gmail.com'
  ) {
    return (
      <img
        src="/images/murad-rahman-hero.png"
        alt="Murad Rahman"
        className={`${className} rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100 shadow-2xs`}
      />
    );
  }

  // Clean fallback: Elegant neutral user silhouette (no ugly letter badge)
  return (
    <div
      className={`${className} rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center shrink-0 shadow-2xs`}
    >
      <UserIcon className="w-3.5 h-3.5" />
    </div>
  );
};
