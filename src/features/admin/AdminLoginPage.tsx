import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { verifyAdminStatus, ADMIN_EMAIL, signInWithGoogle, subscribeToAuthState } from '../../lib/auth';
import { Lock, Mail, KeyRound, ArrowLeft, AlertCircle, Shield } from 'lucide-react';

const GoogleSvgIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState(ADMIN_EMAIL || '');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      if (user) {
        const authorized = await verifyAdminStatus(user);
        if (authorized) {
          navigate('/admin', { replace: true });
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMsg('');
      const user = await signInWithGoogle();
      const isAuthorized = await verifyAdminStatus(user);

      if (!isAuthorized) {
        setErrorMsg(`"${user.email}" অ্যাকাউন্টটির এডমিন এক্সেস নেই। শুধুমাত্র অনুমোদিত এডমিন লগইন করতে পারেন।`);
        return;
      }

      navigate('/admin');
    } catch (err: any) {
      console.error("Google Admin Login failed:", err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err.message || 'গুগল দিয়ে লগইন করা যায়নি।');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setErrorMsg('Firebase Auth চালু নেই। দয়া করে আপনার .env কনফিগারেশন চেক করুন।');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');

      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const isAuthorized = await verifyAdminStatus(userCredential.user);

      if (!isAuthorized) {
        setErrorMsg('এই অ্যাকাউন্টটির এডমিন এক্সেস নেই। শুধুমাত্র অনুমোদিত এডমিন লগইন করতে পারেন।');
        return;
      }

      navigate('/admin');
    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMsg('ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
      } else if (err.code === 'auth/user-not-found') {
        setErrorMsg('এই ইমেইলে কোনো একাউন্ট পাওয়া যায়নি। Firebase Console থেকে Admin User তৈরি করুন।');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('অতিরিক্ত চেষ্টার কারণে সাময়িকভাবে বন্ধ আছে। কিছুক্ষণ পর চেষ্টা করুন।');
      } else {
        setErrorMsg(err.message || 'লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background subtle primary glow */}
      <div className="absolute w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#0284c7] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>পোর্টফোলিওতে ফিরে যান</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 p-8 shadow-xl bg-white backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7] flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin CMS Portal</h1>
              <p className="text-xs text-slate-500">Murad Rahman Portfolio Management</p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* 1-Click Google Admin Sign-in */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow transition-all cursor-pointer mb-5 disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
            ) : (
              <GoogleSvgIcon />
            )}
            <span>Google দিয়ে ১ ক্লিকে এডমিন লগইন</span>
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white px-3 text-slate-400 font-medium">
                অথবা পাসওয়ার্ড দিয়ে
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                এডমিন ইমেইল
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] text-sm shadow-xs transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] text-sm shadow-xs transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] disabled:opacity-50 text-white font-semibold rounded-xl shadow-md shadow-sky-700/20 transition-all text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>প্রবেশ করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>লগইন করুন</span>
                </>
              )}
            </button>
          </form>

          {/* Admin Email helper note */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">অনুমোদিত এডমিন: </span>
            <span className="text-[#0284c7] font-medium">{ADMIN_EMAIL}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
