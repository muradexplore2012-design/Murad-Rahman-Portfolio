import React, { useEffect, useRef, useState } from 'react';
import type { SiteProfile } from '../types';

interface AboutSectionProps {
  profile: SiteProfile;
}

interface CounterBoxProps {
  targetValue: string;
  suffix?: string;
  label: string;
  inView: boolean;
}

const CounterBox: React.FC<CounterBoxProps> = ({ targetValue, suffix = '+', label, inView }) => {
  const rawNum = parseInt(targetValue.replace(/[^0-9]/g, ''), 10) || 0;
  const hasLeadingZero = targetValue.trim().startsWith('0') && targetValue.trim().length > 1;

  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!inView) {
      setCount(1);
      return;
    }

    if (rawNum <= 1) {
      setCount(rawNum);
      return;
    }

    const start = 1;
    const duration = 2000; // 2 seconds count-up duration
    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const current = Math.floor(start + (rawNum - start) * easedProgress);
      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(rawNum);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [inView, rawNum]);

  const formattedCount = hasLeadingZero && count < 10 ? `0${count}` : `${count}`;

  return (
    <div className="bg-gradient-to-b from-sky-50/70 via-sky-50/20 to-white border border-sky-200/90 rounded-2xl p-3 sm:p-4.5 md:p-5 text-left shadow-sm hover:shadow-md hover:border-[#0284c7] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full group">
      <div className="text-xl sm:text-2xl md:text-3xl font-black text-[#0284c7] leading-none mb-1.5 sm:mb-2 tabular-nums tracking-tight">
        {formattedCount}
        {suffix}
      </div>
      <div className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-900 leading-snug">
        {label}
      </div>
    </div>
  );
};

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const counters = profile.counters && profile.counters.length > 0
    ? profile.counters
    : [
        { id: "1", label: "Project Completed", value: "550", suffix: "+", isVisible: true },
        { id: "2", label: "Satisfied Client", value: "450", suffix: "+", isVisible: true },
        { id: "3", label: "Years of Experience", value: "04", suffix: "+", isVisible: true }
      ];

  const visibleCounters = counters.filter((c) => c.isVisible);

  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    let isDone = false;

    const checkVisibility = () => {
      if (isDone || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // Ensure the section has significantly scrolled into view (at least 220px deep from bottom),
      // preventing premature trigger when the user is still viewing Hero section at top
      if (rect.top < viewportHeight - 220) {
        setInView(true);
        isDone = true;
        window.removeEventListener('scroll', checkVisibility);
        window.removeEventListener('resize', checkVisibility);
      }
    };

    // Initial check (only activates if user already loaded page scrolled down)
    checkVisibility();

    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="pt-10 sm:pt-14 pb-16 sm:pb-20 relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Title with Rise-Up Entrance Animation */}
        <div
          className={`text-center max-w-2xl mx-auto mb-8 sm:mb-12 transition-all duration-700 ease-out will-change-transform ${
            inView
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0284c7] tracking-tight">
            আমার সম্পর্কে
          </h2>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Landscape Workspace Photo Card with Rise-Up Entrance Animation */}
          <div
            className={`lg:col-span-6 flex justify-center transition-all duration-900 delay-150 ease-out will-change-transform ${
              inView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16'
            }`}
          >
            <div className="w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-200 bg-slate-900 transition-all duration-500 hover:-translate-y-1.5 group">
              <img
                src={
                  profile.aboutImage ||
                  "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80"
                }
                alt="Murad Rahman Workspace"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>
          </div>

          {/* Right Column: Bio Copy, 'More About Me' Button, and 3 Counter Boxes with Rise-Up Animation */}
          <div
            className={`lg:col-span-6 flex flex-col justify-center transition-all duration-900 delay-300 ease-out will-change-transform ${
              inView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16'
            }`}
          >
            
            {/* Paragraph 1 */}
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal mb-5">
              {profile.aboutBio ||
                'মুরাদ রহমান একজন অভিজ্ঞ গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার, যিনি ব্যক্তি ও ব্যবসার জন্য আধুনিক ও পরিচ্ছন্ন ডিজাইন এবং কার্যকর রেসপনসিভ ওয়েবসাইট তৈরিতে কাজ করছেন। এই সময়ে তিনি উন্নত ডিজাইন কৌশল এবং আধুনিক টুলস সম্পর্কে গভীর দক্ষতা অর্জন করেছেন, যা ব্যবসাকে দ্রুত স্কেল করতে এবং অসাধারণ ফলাফল পেতে সাহায্য করে।'}
            </p>

            {/* Paragraph 2 */}
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal mb-8">
              {profile.aboutSecondaryBio ||
                'তিনি ব্যবহারবান্ধব ডিজিটাল সলিউশন তৈরি করতে বিশেষ পারদর্শী, যা সঠিক অডিয়েন্সকে টার্গেট করে সর্বোচ্চ রিচ, এনগেজমেন্ট এবং ব্র্যান্ডের প্রফেশনাল ইমেজ নিশ্চিত করে।'}
            </p>

            {/* Button: "More About Me" */}
            <div className="mb-8">
              <a
                href={profile.resumeUrl || "#contact"}
                target={profile.resumeUrl && profile.resumeUrl.startsWith('http') ? '_blank' : undefined}
                rel={profile.resumeUrl && profile.resumeUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg shadow-sky-600/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <span>More About Me</span>
                <span className="text-base font-bold transition-transform duration-200 group-hover:translate-x-1">→</span>
              </a>
            </div>

            {/* 3 Counter Boxes in a Row with smooth staggered rise-up & count-up */}
            {visibleCounters.length > 0 && (
              <div ref={countersRef} className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-5 w-full">
                {visibleCounters.map((counter, idx) => (
                  <div
                    key={counter.id}
                    className={`transition-all duration-700 ease-out will-change-transform ${
                      inView
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-12'
                    }`}
                    style={{ transitionDelay: `${450 + idx * 120}ms` }}
                  >
                    <CounterBox
                      targetValue={counter.value}
                      suffix={counter.suffix || '+'}
                      label={counter.label}
                      inView={inView}
                    />
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
