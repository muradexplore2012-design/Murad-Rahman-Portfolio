import React from 'react';
import type { SiteProfile } from '../types';

interface AboutSectionProps {
  profile: SiteProfile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const counters = profile.counters && profile.counters.length > 0
    ? profile.counters
    : [
        { id: "1", label: "Project Completed", value: "550", suffix: "+", isVisible: true },
        { id: "2", label: "Satisfied Client", value: "450", suffix: "+", isVisible: true },
        { id: "3", label: "Years of Experience", value: "04", suffix: "+", isVisible: true }
      ];

  const visibleCounters = counters.filter((c) => c.isVisible);

  return (
    <section id="about" className="pt-10 sm:pt-14 pb-16 sm:pb-20 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0284c7] tracking-tight">
            আমার সম্পর্কে
          </h2>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Landscape Workspace Photo Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900">
              <img
                src={
                  profile.aboutImage ||
                  "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80"
                }
                alt="Murad Rahman Workspace"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>
          </div>

          {/* Right Column: Bio Copy, 'More About Me' Button, and 3 Counter Boxes */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
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

            {/* Button: "More About Me" (Outlined primary color) */}
            <div className="mb-8">
              <a
                href={profile.resumeUrl || "#contact"}
                className="inline-flex items-center justify-center px-6 py-2.5 border-2 border-[#0284c7] text-[#0284c7] hover:bg-[#0284c7] hover:text-white font-bold text-sm rounded-lg transition-all duration-200 shadow-2xs"
              >
                More About Me
              </a>
            </div>

            {/* 3 Counter Boxes in a Row (Bordered primary boxes) */}
            {visibleCounters.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {visibleCounters.map((counter) => (
                  <div
                    key={counter.id}
                    className="border border-[#0284c7]/40 p-4 sm:p-5 bg-white text-left transition-transform hover:-translate-y-0.5 shadow-2xs rounded-lg"
                  >
                    <div className="text-2xl sm:text-3xl font-black text-[#0284c7] leading-none mb-2">
                      {counter.value}
                      {counter.suffix || '+'}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">
                      {counter.label}
                    </div>
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
