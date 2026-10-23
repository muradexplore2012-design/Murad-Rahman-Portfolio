import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { SiteProfile } from '../types';

interface HeroSectionProps {
  profile: SiteProfile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasSettled, setHasSettled] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  const fullBio =
    profile.heroSubheadline ||
    "I'm a passionate Graphic Designer & Web Developer specializing in high-impact YouTube thumbnails that boost CTR and modern, responsive websites designed to engage visitors and drive conversions.";

  const [displayedBio, setDisplayedBio] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // 1. Initial entrance for right-side image card
    const enterTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    const settleTimer = setTimeout(() => {
      setHasSettled(true);
    }, 1350);

    // 2. Synchronized Progress Bar & Typewriter Effect
    let charIndex = 0;
    setDisplayedBio('');
    setProgressWidth(0);
    setShowCursor(true);

    let typingInterval: ReturnType<typeof setInterval> | null = null;
    let cursorTimeout: ReturnType<typeof setTimeout> | null = null;

    // Both progress bar and typing take ~3.2 seconds total, finishing at the exact same instant
    const targetDurationMs = 3200;
    const speedMs = Math.max(8, Math.round(targetDurationMs / fullBio.length));

    const startTypingTimer = setTimeout(() => {
      typingInterval = setInterval(() => {
        charIndex++;
        if (charIndex <= fullBio.length) {
          setDisplayedBio(fullBio.slice(0, charIndex));
          setProgressWidth((charIndex / fullBio.length) * 100);
        } else {
          setProgressWidth(100);
          if (typingInterval) clearInterval(typingInterval);
          cursorTimeout = setTimeout(() => {
            setShowCursor(false);
          }, 2000);
        }
      }, speedMs);
    }, 200);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(settleTimer);
      clearTimeout(startTypingTimer);
      if (typingInterval) clearInterval(typingInterval);
      if (cursorTimeout) clearTimeout(cursorTimeout);
    };
  }, [fullBio]);

  return (
    <section id="home" className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Headline, Progress Bar Line, Typewriter Bio, "Contact Us >" Button */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            
            {/* 1. Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.12]">
              Hi, I am <br />
              <span className="font-extrabold text-slate-900">
                {profile.name || 'Murad Rahman'}
              </span>
            </h1>

            {/* 2. Progress Bar Line 100% synchronized with text typing */}
            <div className="w-48 sm:w-64 h-2 sm:h-2.5 bg-sky-50 rounded-full overflow-hidden relative mt-3 mb-6 sm:mb-8 border border-sky-100 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-400 via-[#0284c7] to-[#0369a1] relative transition-[width] duration-75 ease-linear shadow-xs"
                style={{ width: `${progressWidth}%` }}
              >
                {/* Moving light shimmer sweep inside progress bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-progress-shimmer pointer-events-none" />
              </div>
            </div>

            {/* 3. Bio Text with Realistic Typewriter Effect (Click to instantly reveal) */}
            <div
              className="relative w-full max-w-xl mb-8 cursor-pointer select-text"
              onClick={() => {
                setDisplayedBio(fullBio);
                setProgressWidth(100);
                setShowCursor(false);
              }}
              title="সম্পূর্ণ লেখা দেখতে ক্লিক করুন"
            >
              {/* Ghost text to reserve exact height and prevent layout jump */}
              <p
                className="text-sm sm:text-base lg:text-lg text-transparent select-none pointer-events-none leading-relaxed font-normal"
                aria-hidden="true"
              >
                {fullBio}
              </p>

              {/* Real-time typing text stream */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal absolute inset-0">
                {displayedBio}
                {showCursor && (
                  <span className="inline-block w-[3px] h-4 sm:h-5 bg-[#0284c7] ml-1 rounded-full animate-cursor-blink align-middle" />
                )}
              </p>
            </div>

            {/* 4. Action Button: "Contact Us >" */}
            <div>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white font-bold rounded-xl shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 text-base group animate-btn-glow cursor-pointer"
              >
                <span>Contact Us</span>
                <span className="text-lg transition-transform duration-200 group-hover:translate-x-1.5">›</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Framed Studio Card Photo of Murad Rahman with entrance & float animation */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-md lg:max-w-lg flex items-center justify-center">
              
              {/* Soft Ambient Aura Glow Behind the Portrait Card */}
              <div
                className={`absolute -inset-4 sm:-inset-6 bg-gradient-to-tr from-sky-500/25 via-[#0284c7]/20 to-purple-600/25 rounded-[44px] blur-2xl transition-opacity duration-1000 pointer-events-none ${
                  isLoaded ? 'opacity-100 animate-hero-glow' : 'opacity-0'
                }`}
              />

              {/* Main Card with First Entrance Animation & Gentle Idle Float */}
              <div
                className={`relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-2xl shadow-sky-950/15 border-4 border-white bg-slate-100 group transition-transform duration-300 hover:scale-[1.01] ${
                  isLoaded ? 'animate-hero-entrance' : 'opacity-0'
                }`}
                style={{ animationFillMode: 'forwards' }}
              >
                {/* Floating wrapper once settled */}
                <div className={`w-full h-full relative ${hasSettled ? 'animate-hero-float' : ''}`}>
                  <img
                    src={profile.profileImage || "/images/murad-rahman.jpg"}
                    alt={profile.name || "Murad Rahman"}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/murad-rahman.jpg";
                    }}
                  />

                  {/* Glossy light reflection sheen on initial entrance */}
                  {isLoaded && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none animate-shimmer-sweep"
                      style={{ animationFillMode: 'forwards' }}
                    />
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Subtle bottom wave / divider curve matching screenshot */}
      <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-14 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
    </section>
  );
};
