import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  Sparkles,
  LogOut,
  User as UserIcon,
  Clock,
  Check
} from 'lucide-react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { signInWithGoogle, signOutUser } from '../lib/auth';
import { submitContactMessage, getSiteProfile, getSiteSettings } from '../services/firestoreService';
import { starterProfile, starterSettings } from '../services/starterData';
import type { SiteProfile, SiteSettings } from '../types';
import { SignInModal } from '../components/SignInModal';

// Multi-color Google official SVG icon
const GoogleSvgIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const QUICK_TOPICS = [
  'লোগো ও গ্রাফিক্স ডিজাইন',
  'ওয়েবসাইট তৈরি / ডেভেলপমেন্ট',
  'ফেসবুক ও ইউটিউব বিজ্ঞাপন',
  'জরুরি প্রজেক্ট আলোচনা',
];

/**
 * Automatically formats message text into clean 2-3 line segments (max ~38 chars per line)
 * so that Google Sheets cells auto-wrap and expand vertically without overflowing.
 */
function formatMessageForSheet(text: string, maxLineLength = 38): string {
  if (!text) return '';
  const paragraphs = text.split('\n');
  const formattedParagraphs = paragraphs.map((p) => {
    const trimmed = p.trim();
    if (!trimmed) return '';
    const words = trimmed.split(/\s+/);
    let currentLine = '';
    const lines: string[] = [];
    for (const w of words) {
      if (!currentLine) {
        currentLine = w;
      } else if (currentLine.length + 1 + w.length <= maxLineLength) {
        currentLine += ' ' + w;
      } else {
        lines.push(currentLine);
        currentLine = w;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.join('\n');
  });
  return formattedParagraphs.join('\n');
}

interface SentMessageItem {
  id: string;
  subject: string;
  message: string;
  time: string;
}

export const ContactPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [profile, setProfile] = useState<SiteProfile>(starterProfile);
  const [settings, setSettings] = useState<SiteSettings>(starterSettings);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('নতুন প্রজেক্ট আলোচনা');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  // Keep track of sent messages in this session
  const [sentMessages, setSentMessages] = useState<SentMessageItem[]>([]);

  // Listen to auth state
  useEffect(() => {
    if (!auth) {
      setIsAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
      if (user) {
        setName(user.displayName || '');
        setEmail(user.email || '');
      }
    });

    return () => unsubscribe();
  }, []);

  // Load site profile and settings
  useEffect(() => {
    async function loadSiteData() {
      try {
        const [prof, setts] = await Promise.all([
          getSiteProfile(),
          getSiteSettings(),
        ]);
        if (prof) setProfile(prof);
        if (setts) setSettings(setts);
      } catch (err) {
        console.warn('Error loading site data:', err);
      }
    }
    loadSiteData();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleSigningIn(true);
      setStatus({ type: 'idle', message: '' });
      const user = await signInWithGoogle();
      setCurrentUser(user);
      setName(user.displayName || '');
      setEmail(user.email || '');
      setStatus({ type: 'success', message: 'সফলভাবে সাইন-ইন হয়েছে! এখন মেসেজ লিখতে পারেন।' });
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setStatus({ type: 'error', message: err.message || 'গুগল সাইন-ইন ব্যর্থ হয়েছে।' });
      }
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setStatus({ type: 'error', message: 'মেসেজ পাঠানোর পূর্বে দয়া করে সাইন-ইন করুন।' });
      return;
    }

    if (!message.trim()) {
      setStatus({ type: 'error', message: 'অনুগ্রহ করে মেসেজটি লিখুন।' });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: 'idle', message: '' });

      const finalName = name.trim() || currentUser.displayName || 'সম্মানিত ক্লায়েন্ট';
      const finalEmail = email.trim() || currentUser.email || '';
      const finalSubject = subject.trim() || 'Website Inquiry';
      const finalMessage = message.trim();
      const finalPhone = phone.trim();

      // 1. Save to Firestore
      const newDocId = await submitContactMessage({
        name: finalName,
        email: finalEmail,
        phone: finalPhone,
        subject: finalSubject,
        message: finalMessage,
        userId: currentUser.uid,
        userPhoto: currentUser.photoURL || undefined,
      });

      // 2. Trigger Google Sheets & Gmail Webhook if configured
      const webhookUrl =
        settings.googleSheetWebhookUrl?.trim() ||
        'https://script.google.com/macros/s/AKfycbzi1_nElsw85vuLxhhMJKXEykbbdH68G_SSFshflYZtK_mT6aVv34cnCDDAfwnbJe56/exec';
      if (webhookUrl && webhookUrl.startsWith('http')) {
        try {
          const payload = {
            timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
            name: finalName,
            email: finalEmail,
            phone: finalPhone || '-',
            subject: finalSubject,
            message: formatMessageForSheet(finalMessage, 38),
            userId: currentUser.uid,
          };

          // mode: 'no-cors' allows safe submission to Google Apps Script without preflight blocks
          await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(payload),
          });
        } catch (webhookErr) {
          console.warn('Google Sheets Webhook error:', webhookErr);
        }
      }

      // 3. Add to local session sent messages
      const sentTime = new Date().toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setSentMessages((prev) => [
        {
          id: newDocId || String(Date.now()),
          subject: finalSubject,
          message: finalMessage,
          time: sentTime,
        },
        ...prev,
      ]);

      // 4. Success feedback & clear message box
      setMessage('');
      setStatus({
        type: 'success',
        message: 'ধন্যবাদ! আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে। দ্রুত আপনার সাথে যোগাযোগ করা হবে।',
      });
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setStatus({
        type: 'error',
        message: err.message || 'মেসেজ পাঠাতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setName('');
      setEmail('');
      setStatus({ type: 'idle', message: '' });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white flex flex-col">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#0284c7] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>হোমপেজে ফিরে যান</span>
          </Link>

          <Link to="/" className="text-lg font-black tracking-tight text-slate-900">
            Murad <span className="text-[#0284c7]">Rahman</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-[#0284c7] text-xs font-bold shadow-xs">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>সরাসরি যোগাযোগ ও ইনকোয়ারি</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            মুরাদ রহমানের সাথে কথা বলুন
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            আপনার নতুন প্রজেক্ট, গ্রাফিক্স ডিজাইন বা ওয়েবসাইট নিয়ে যেকোনো প্রশ্ন থাকলে মেসেজ পাঠান। খুব দ্রুত রিপ্লাই দেওয়া হবে।
          </p>
        </div>

        {/* Status Notification */}
        {status.type !== 'idle' && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 transition-all ${
              status.type === 'success'
                ? 'bg-sky-50 border border-sky-300 text-sky-900'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#0284c7] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 font-medium">{status.message}</div>
          </div>
        )}

        {/* Two-Column Grid: Form on Left, Contact Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Interactive Contact / Chat Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            
            {/* Auth Gate: Check if user is logged in */}
            {isAuthLoading ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                লগইন স্ট্যাটাস চেক করা হচ্ছে...
              </div>
            ) : !currentUser ? (
              /* User is NOT logged in: Friendly prompt with 1-click Google Sign-in */
              <div className="py-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center mx-auto text-[#0284c7]">
                  <Shield className="w-8 h-8" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    মেসেজ পাঠাতে অনুগ্রহ করে সাইন-ইন করুন
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    নিরাপদ ও নির্ভরযোগ্য যোগাযোগের জন্য আপনার গুগল বা ইমেইল অ্যাকাউন্ট দিয়ে ১ ক্লিকে সাইন-ইন করুন।
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleSigningIn}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <GoogleSvgIcon />
                    <span>{isGoogleSigningIn ? 'লগইন হচ্ছে...' : 'Google দিয়ে সাইন-ইন'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSignInModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-slate-600" />
                    <span>ইমেইল দিয়ে সাইন-ইন</span>
                  </button>
                </div>
              </div>
            ) : (
              /* User IS logged in: Show active message form */
              <div className="space-y-6">
                
                {/* Logged in User Pill */}
                <div className="p-3 sm:p-4 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User'}
                        className="w-10 h-10 rounded-full object-cover border border-sky-300 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#0284c7] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {currentUser.displayName || 'Signed in Client'}
                        </p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <Check className="w-3 h-3" /> লগইন আছেন
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 shrink-0 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="সাইন আউট"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">লগআউট</span>
                  </button>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Topic / Subject Quick Chips */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      কী বিষয় নিয়ে কথা বলতে চান?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_TOPICS.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setSubject(topic)}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                            subject === topic
                              ? 'bg-[#0284c7] text-white border-[#0284c7] font-semibold'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-sky-300 hover:text-[#0284c7]'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Phone Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        আপনার নাম *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="আপনার পুরো নাম"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ফোন / হোয়াটসঅ্যাপ (ঐচ্ছিক)
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+8801..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                      />
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      মেসেজের বিষয় *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="যেমন: নতুন ওয়েবসাইট তৈরি সংক্রান্ত"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                    />
                  </div>

                  {/* Message Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        আপনার মেসেজ *
                      </label>
                      <span className="text-[11px] text-slate-400">
                        {message.length} অক্ষর
                      </span>
                    </div>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="আপনার কাজের বিবরণ, বাজেট ও সময়সীমা সংক্ষেপে লিখুন..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'মেসেজ পাঠানো হচ্ছে...' : 'মেসেজ পাঠান'}</span>
                    </button>
                  </div>
                </form>

                {/* Sent Messages History for this session */}
                {sentMessages.length > 0 && (
                  <div className="pt-6 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>এই সেশনে পাঠানো মেসেজ ({sentMessages.length})</span>
                    </h3>
                    <div className="space-y-2">
                      {sentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{msg.subject}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {msg.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Murad's Profile Card & Alternative Quick Contact */}
          <div className="space-y-6">
            
            {/* Quick Profile Summary */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <img
                  src={profile.profileImage || '/images/murad-rahman.jpg'}
                  alt={profile.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-sky-100 shadow-md mx-auto"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" title="অনলাইন" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{profile.name}</h3>
                <p className="text-xs text-[#0284c7] font-semibold mt-0.5">{profile.title}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-left text-xs">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Mail className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <a
                    href={`mailto:${profile.email || 'muradexplore2012@gmail.com'}`}
                    className="hover:text-[#0284c7] font-medium truncate"
                  >
                    {profile.email || 'muradexplore2012@gmail.com'}
                  </a>
                </div>

                {profile.whatsapp && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a
                      href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-600 font-medium truncate"
                    >
                      WhatsApp: {profile.whatsapp}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-2.5 text-slate-500 text-[11px] pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>সাধারণত ১-২ ঘণ্টার মধ্যে রিপ্লাই দেওয়া হয়</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Murad, I visited your portfolio and would like to discuss a project.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-5 rounded-3xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-all text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
                  সরাসরি WhatsApp-এ কথা বলুন
                </h4>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  ইনস্ট্যান্ট চ্যাট ও ফাইল শেয়ারের জন্য
                </p>
              </a>
            )}

          </div>

        </div>

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>{settings.copyrightText || `© ${new Date().getFullYear()} Murad Rahman. All rights reserved.`}</p>
      </footer>

      {/* Reusable Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccess={() => {
          setIsSignInModalOpen(false);
          setStatus({ type: 'success', message: 'সফলভাবে সাইন-ইন সম্পন্ন হয়েছে!' });
        }}
      />

    </div>
  );
};
