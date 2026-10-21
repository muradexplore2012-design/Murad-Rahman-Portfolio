import React from 'react';
import type { SiteProfile } from '../types';

interface HeroSectionProps {
  profile: SiteProfile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  return (
    <section id="home" className="relative min-h-[82vh] flex items-center pt-8 sm:pt-12 pb-12 sm:pb-16 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Greeting, Headline, Bio, Buttons */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            
            {/* Greeting: "Hi There," */}
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {profile.greeting || 'Hi There,'}
            </h3>

            {/* Main Headline: "I'm Murad Rahman" in bold green */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#15803d] leading-none mb-6">
              I'm {profile.name || 'Murad Rahman'}
            </h1>

            {/* Bio text in Bangla */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl mb-8 font-normal">
              {profile.aboutBio ||
                'মুরাদ রহমান একজন দক্ষ গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার, যিনি ব্যক্তি ও ব্যবসার জন্য আধুনিক ও পরিচ্ছন্ন ডিজাইন এবং কার্যকর রেসপনসিভ ওয়েব ইন্টারফেস তৈরিতে প্রতিশ্রুতিবদ্ধ।'}
            </p>

            {/* Two Action Buttons side by side (Exactly like screenshot) */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                href={
                  profile.whatsapp
                    ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`
                    : `mailto:${profile.email || 'muradrahman2026@gmail.com'}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] text-white font-bold rounded-lg shadow-sm transition-all duration-200 text-sm"
              >
                Contact Me
              </a>

              <a
                href="#services"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 bg-transparent hover:bg-[#15803d]/5 text-[#15803d] font-bold rounded-lg border-2 border-[#15803d] transition-all duration-200 text-sm"
              >
                My Service
              </a>
            </div>

          </div>

          {/* Right Column: Murad Rahman's Cutout Standing Naturally Over Green Paint Splash (No Card / No Box) */}
          <div className="lg:col-span-5 flex justify-center items-end relative pt-6 lg:pt-0">
            <div className="relative w-80 sm:w-96 md:w-[440px] flex items-center justify-center">
              
              {/* Green Brush Paint Splash Graphic directly behind Murad's body matching Reference */}
              <div className="absolute inset-0 -z-0 flex items-center justify-center pointer-events-none transform scale-110 sm:scale-125">
                <svg
                  viewBox="0 0 500 500"
                  className="w-full h-full text-[#4ade80] opacity-90 filter drop-shadow-xs"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M432.5,296.5Q417,343,382,376.5Q347,410,298.5,427Q250,444,203,425Q156,406,116.5,373.5Q77,341,61.5,295.5Q46,250,67.5,205.5Q89,161,123.5,127.5Q158,94,204,74.5Q250,55,297.5,72.5Q345,90,381.5,124Q418,158,433,204Q448,250,432.5,296.5Z" />
                </svg>
                {/* Secondary accent soft glow */}
                <div className="absolute w-72 h-72 bg-[#22c55e]/25 rounded-full blur-2xl" />
              </div>

              {/* Murad Rahman's Clean Transparent Cutout Portrait */}
              <div className="relative z-10 w-full flex items-end justify-center">
                <img
                  src="/images/murad-rahman-transparent.png"
                  alt={profile.name || "Murad Rahman"}
                  className="w-full max-h-[460px] sm:max-h-[520px] object-contain drop-shadow-md select-none transition-transform duration-300 hover:scale-[1.02]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = profile.profileImage || "/images/murad-rahman.jpg";
                  }}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
