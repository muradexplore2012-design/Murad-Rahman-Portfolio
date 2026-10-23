import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { verifyAdminStatus, ADMIN_EMAIL } from '../../lib/auth';
import { Lock, Mail, KeyRound, ArrowLeft, AlertCircle, Shield } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState(ADMIN_EMAIL || '');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
