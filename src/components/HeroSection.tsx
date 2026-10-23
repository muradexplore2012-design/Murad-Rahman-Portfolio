import React from 'react';
import type { SiteProfile } from '../types';

interface HeroSectionProps {
  profile: SiteProfile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  return (
    <section id="home" className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Greeting Headline, Underline Bar, English Bio, "Contact Us >" Button */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            
            {/* Main Headline: "Hi, I am Murad Rahman" matching screenshot */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.12]">
              Hi, I am <br />
              <span className="font-extrabold text-slate-900">
                {profile.name || 'Murad Rahman'}
              </span>
            </h1>

            {/* Colored primary underline bar matching screenshot */}
            <div className="w-48 sm:w-64 h-1.5 bg-[#0284c7] rounded-full mt-3 mb-6 sm:mb-8" />

            {/* Professional English Bio matching screenshot */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl mb-8 font-normal">
              {profile.heroSubheadline ||
                "I'm a passionate Graphic Designer & Web Developer specializing in high-impact YouTube thumbnails that boost CTR and modern, responsive websites designed to engage visitors and drive conversions."}
            </p>

            {/* Single Action Button: "Contact Us >" matching user instruction */}
            <div>
              <a
                href={
                  profile.whatsapp
                    ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`
                    : profile.phone
                    ? `tel:${profile.phone}`
                    : `mailto:${profile.email || 'muradrahman2026@gmail.com'}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-base group"
              >
                <span>Contact Us</span>
                <span className="text-lg transition-transform group-hover:translate-x-1">›</span>
              </a>
            </div>

          </div>

          {/* Right Column: Framed Studio Card Photo of Murad Rahman matching screenshot */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-square sm:aspect-[4/3] lg:aspect-square rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl shadow-sky-950/10 border-4 border-white bg-slate-100 group transition-transform duration-300 hover:scale-[1.01]">
              <img
                src={profile.profileImage || "/images/murad-rahman.jpg"}
                alt={profile.name || "Murad Rahman"}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/murad-rahman.jpg";
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Subtle bottom wave / divider curve matching screenshot */}
      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-14 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
    </section>
  );
};
