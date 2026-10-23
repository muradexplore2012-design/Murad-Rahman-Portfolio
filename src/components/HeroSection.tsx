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

          {/* Right Column: Murad Rahman's Cutout Standing Over the Authentic Green Brush Splash */}
          <div className="lg:col-span-5 flex justify-center items-end relative pt-6 lg:pt-0">
            <div className="relative w-80 sm:w-96 md:w-[460px] lg:w-[480px] flex items-center justify-center">
              
              {/* Authentic Watercolor Green Brush Stroke Graphic (from reference) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-0">
                <img
                  src="/images/green-brush-splash.png"
                  alt="Brush paint splash"
                  className="w-[118%] h-[118%] max-w-none object-contain select-none pointer-events-none filter drop-shadow-xs transition-transform duration-500"
                  aria-hidden="true"
                />
              </div>

              {/* Murad Rahman's Clean Cutout Portrait */}
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
