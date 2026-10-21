import React from 'react';
import { User, Download, CheckCircle2, MapPin, Mail, Globe, Award, Sparkles } from 'lucide-react';
import type { SiteProfile } from '../types';

interface AboutSectionProps {
  profile: SiteProfile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const visibleCounters = profile.counters?.filter((c) => c.isVisible && c.value) || [];

  return (
    <section id="about" className="py-20 relative bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <User className="w-3.5 h-3.5" />
            <span>পরিচিতি</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            আমার সম্পর্কে বিস্তারিত
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Profile Photo & Quick Details */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-64 sm:w-72 aspect-square rounded-2xl overflow-hidden border-2 border-slate-700 p-1.5 bg-slate-800 shadow-xl mb-6">
              <img
                src={profile.profileImage || "/images/murad-rahman.jpg"}
                alt={profile.name}
                className="w-full h-full object-cover object-center rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/murad-rahman.jpg";
                }}
              />
            </div>

            {/* Quick Details Card */}
            <div className="w-full max-w-sm glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-sm py-1 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  <span>নাম</span>
                </span>
                <span className="font-semibold text-white">{profile.name}</span>
              </div>

              <div className="flex items-center justify-between text-sm py-1 border-b border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span>পেশা</span>
                </span>
                <span className="font-semibold text-white text-right">{profile.title}</span>
              </div>

              {profile.location && (
                <div className="flex items-center justify-between text-sm py-1 border-b border-slate-800">
                  <span className="text-slate-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>অবস্থান</span>
                  </span>
                  <span className="font-semibold text-white">{profile.location}</span>
                </div>
              )}

              {profile.email && (
                <div className="flex items-center justify-between text-sm py-1">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>ইমেইল</span>
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-medium text-blue-400 hover:underline truncate max-w-[180px]"
                  >
                    {profile.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Biography Text & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
              সৃজনশীল ডিজাইন এবং ব্যবহারবান্ধব ওয়েব সলিউশন
            </h3>

            <div className="space-y-4 text-slate-300 text-base leading-relaxed mb-6 font-normal">
              <p>
                {profile.aboutBio ||
                  'আমি ব্যক্তি, উদ্যোক্তা ও ছোট ব্যবসার জন্য পরিষ্কার, আধুনিক এবং ব্যবহারবান্ধব ডিজাইন ও ওয়েব অভিজ্ঞতা তৈরি করি। Graphics Design, Blogger-ভিত্তিক আধুনিক/custom website এবং responsive web interface নিয়ে কাজ করি। প্রতিটি প্রজেক্টে ব্যবহারকারীর অভিজ্ঞতা, পরিচ্ছন্ন ডিজাইন ও ধারাবাহিক উন্নতিকে গুরুত্ব দিই।'}
              </p>

              {profile.aboutSecondaryBio && (
                <p className="text-slate-400">
                  {profile.aboutSecondaryBio}
                </p>
              )}
            </div>

            {/* Core Values Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              <div className="flex items-start gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>ব্যক্তিগত ও বাণিজ্যিক ব্র্যান্ডিং ও লোগো ডিজাইন</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>সোশ্যাল মিডিয়া ব্যানার ও প্রমোশনাল কনটেন্ট</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>ক্লিন কোড ও সম্পূর্ণ রেসপনসিভ ওয়েবসাইট</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>কাস্টম ব্লগার থিম সেটআপ ও এসইও ফ্রেন্ডলি কাঠামো</span>
              </div>
            </div>

            {/* Real Stats / Counters (Only displayed if admin explicitly enables them) */}
            {visibleCounters.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 mb-6">
                {visibleCounters.map((counter) => (
                  <div key={counter.id} className="text-center">
                    <div className="text-2xl font-black text-white">
                      {counter.value}
                      {counter.suffix}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-medium">{counter.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Resume / Action Button */}
            <div className="flex flex-wrap items-center gap-4">
              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>জীবনবৃত্তান্ত (CV) ডাউনলোড করুন</span>
                </a>
              ) : null}

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>প্রজেক্ট নিয়ে আলোচনা করুন</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
