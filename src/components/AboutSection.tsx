import React from 'react';
import { User, Download, CheckCircle2, MapPin, Mail, Globe, Sparkles } from 'lucide-react';
import type { SiteProfile } from '../types';

interface AboutSectionProps {
  profile: SiteProfile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const visibleCounters = profile.counters?.filter((c) => c.isVisible && c.value) || [];

  return (
    <section id="about" className="py-20 relative bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching the screenshot title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15803d] tracking-tight">
            আমার সম্পর্কে
          </h2>
          <div className="w-16 h-1 bg-[#15803d] mx-auto mt-3 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Profile Photo & Quick Details */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-64 sm:w-72 aspect-square rounded-2xl overflow-hidden border-4 border-slate-100 shadow-xl mb-6 bg-slate-900">
              <img
                src={profile.profileImage || "/images/murad-rahman.jpg"}
                alt={profile.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/murad-rahman.jpg";
                }}
              />
            </div>

            {/* Quick Details Card */}
            <div className="w-full max-w-sm card-light rounded-2xl p-5 space-y-3 bg-[#FAF8F5]">
              <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-200">
                <span className="text-slate-600 flex items-center gap-2 font-medium">
                  <User className="w-4 h-4 text-[#15803d]" />
                  <span>নাম</span>
                </span>
                <span className="font-bold text-slate-900">{profile.name}</span>
              </div>

              <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-200">
                <span className="text-slate-600 flex items-center gap-2 font-medium">
                  <Globe className="w-4 h-4 text-[#15803d]" />
                  <span>পেশা</span>
                </span>
                <span className="font-bold text-slate-900 text-right">{profile.title}</span>
              </div>

              {profile.location && (
                <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-200">
                  <span className="text-slate-600 flex items-center gap-2 font-medium">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>অবস্থান</span>
                  </span>
                  <span className="font-bold text-slate-900">{profile.location}</span>
                </div>
              )}

              {profile.email && (
                <div className="flex items-center justify-between text-sm py-1.5">
                  <span className="text-slate-600 flex items-center gap-2 font-medium">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>ইমেইল</span>
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-medium text-[#15803d] hover:underline truncate max-w-[180px]"
                  >
                    {profile.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Biography Text */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-5 leading-snug">
              পরিচ্ছন্ন ডিজাইন ও আধুনিক ওয়েব অভিজ্ঞতা
            </h3>

            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              <p>
                {profile.aboutBio ||
                  'আমি ব্যক্তি, উদ্যোক্তা ও ছোট ব্যবসার জন্য পরিষ্কার, আধুনিক এবং ব্যবহারবান্ধব ডিজাইন ও ওয়েব অভিজ্ঞতা তৈরি করি। Graphics Design, Blogger-ভিত্তিক আধুনিক/custom website এবং responsive web interface নিয়ে কাজ করি। প্রতিটি প্রজেক্টে ব্যবহারকারীর অভিজ্ঞতা, পরিচ্ছন্ন ডিজাইন ও ধারাবাহিক উন্নতিকে গুরুত্ব দিই।'}
              </p>

              {profile.aboutSecondaryBio && (
                <p className="text-slate-600">
                  {profile.aboutSecondaryBio}
                </p>
              )}
            </div>

            {/* Core Values Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              <div className="flex items-start gap-2.5 text-sm text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#15803d] shrink-0 mt-0.5" />
                <span>ব্যক্তিগত ও বাণিজ্যিক ব্র্যান্ডিং ও লোগো ডিজাইন</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#15803d] shrink-0 mt-0.5" />
                <span>সোশ্যাল মিডিয়া ব্যানার ও প্রমোশনাল কনটেন্ট</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#15803d] shrink-0 mt-0.5" />
                <span>ক্লিন কোড ও সম্পূর্ণ রেসপনসিভ ওয়েবসাইট</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#15803d] shrink-0 mt-0.5" />
                <span>কাস্টম ব্লগার থিম সেটআপ ও এসইও ফ্রেন্ডলি কাঠামো</span>
              </div>
            </div>

            {/* Counters (only shown if configured) */}
            {visibleCounters.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-slate-200 mb-6">
                {visibleCounters.map((counter) => (
                  <div key={counter.id} className="text-center">
                    <div className="text-2xl font-black text-[#15803d]">
                      {counter.value}
                      {counter.suffix}
                    </div>
                    <div className="text-xs text-slate-600 mt-1 font-semibold">{counter.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#15803d] hover:bg-[#166534] text-white font-bold rounded-lg shadow-sm transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>জীবনবৃত্তান্ত (CV) ডাউনলোড করুন</span>
                </a>
              ) : null}

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-lg border-2 border-slate-300 transition-colors text-sm"
              >
                <Sparkles className="w-4 h-4 text-[#15803d]" />
                <span>প্রজেক্ট নিয়ে আলোচনা করুন</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
