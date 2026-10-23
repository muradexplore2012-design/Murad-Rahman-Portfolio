import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import type { SiteProfile } from '../types';
import { submitContactMessage } from '../services/firestoreService';

interface ContactSectionProps {
  profile: SiteProfile;
  prefilledSubject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile, prefilledSubject = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: prefilledSubject || '',
    message: '',
    honeypot: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
  }>({
    type: 'idle',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.honeypot) {
      console.warn("Spam submission blocked.");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        type: 'error',
        message: 'অনুগ্রহ করে আপনার নাম, ইমেইল এবং মেসেজ পূরণ করুন।',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: 'idle', message: '' });

      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      setStatus({
        type: 'success',
        message: 'ধন্যবাদ! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমি দ্রুত যোগাযোগ করব ইনশাআল্লাহ।',
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        honeypot: '',
      });
    } catch (err: any) {
      console.error("Submission failed:", err);
      setStatus({
        type: 'error',
        message: err.message || 'মেসেজ পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে সরাসরি ইমেইল করুন।',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0284c7] tracking-tight">
            যোগাযোগ করুন
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            নতুন কোনো প্রজেক্ট, গ্রাফিক্স ডিজাইন বা ওয়েবসাইট নিয়ে আলোচনার জন্য সরাসরি বার্তা পাঠান।
          </p>
          <div className="w-16 h-1 bg-[#0284c7] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Information Cards (Left) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-light rounded-2xl p-6 sm:p-8 bg-white border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                সরাসরি যোগাযোগের ঠিকানা
              </h3>

              <div className="space-y-6">
                {/* Email */}
                {profile.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        ইমেইল এড্রেস
                      </h4>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-sm font-bold text-slate-900 hover:text-[#0284c7] transition-colors"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Location */}
                {profile.location && (
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        অবস্থান
                      </h4>
                      <p className="text-sm font-bold text-slate-900">
                        {profile.location}
                      </p>
                    </div>
                  </div>
                )}

                {/* WhatsApp / Phone if configured */}
                {(profile.whatsapp || profile.phone) && (
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        ফোন / হোয়াটসঅ্যাপ
                      </h4>
                      <a
                        href={`https://wa.me/${(profile.whatsapp || profile.phone || '').replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-slate-900 hover:text-[#0284c7] transition-colors"
                      >
                        {profile.whatsapp || profile.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Working Availability */}
                <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                  <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-[#0284c7] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      রেসপন্স সময়
                    </h4>
                    <p className="text-sm font-medium text-slate-600">
                      সাধারণত দ্রুততম সময়ে মেসেজের উত্তর দেওয়া হয়।
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Privacy note */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-sky-50/60 border border-sky-200 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-[#0284c7] shrink-0" />
              <span>
                আপনার দেওয়া সকল তথ্য ও ইমেইল সুরক্ষিত রাখা হয় এবং স্প্যাম বা তৃতীয় কোনো পক্ষের সাথে শেয়ার করা হয় না।
              </span>
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="lg:col-span-7">
            <div className="card-light rounded-2xl p-6 sm:p-8 bg-white border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                একটি বার্তা পাঠান
              </h3>

              {/* Status Alert */}
              {status.type === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200 text-[#0284c7] flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{status.message}</p>
                </div>
              )}

              {status.type === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{status.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Honeypot field */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      আপনার নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মোঃ সাব্বির আহমেদ"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      ইমেইল এড্রেস <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      ফোন / হোয়াটসঅ্যাপ (ঐচ্ছিক)
                    </label>
                    <input
                      type="tel"
                      placeholder="017XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      বিষয় / সেবার নাম
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: লোগো ডিজাইন / ওয়েবসাইট"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    বিস্তারিত বার্তা <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="আপনার প্রজেক্টের বিস্তারিত এবং কি ধরনের সাহায্য প্রয়োজন তা এখানে লিখুন..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent text-sm resize-none"
                  />
                </div>

                {/* Submit button in solid primary color */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-all duration-200 text-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <span>মেসেজ সেন্ড করুন</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
