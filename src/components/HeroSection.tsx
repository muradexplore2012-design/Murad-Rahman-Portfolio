import React from 'react';
import { ArrowRight, Eye, Sparkles, MapPin, Mail, ExternalLink } from 'lucide-react';
import type { SiteProfile } from '../types';

interface HeroSectionProps {
  profile: SiteProfile;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/15 via-purple-600/10 to-amber-500/10 blur-[130px] -z-10 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-purple-600/15 blur-[120px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Islamic Greeting & Availability Tag */}
            <div className="inline-flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 text-xs sm:text-sm font-medium bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {profile.greeting || 'আসসালামুয়ালাইকুম, আপনাকে স্বাগতম'}
              </span>

              {profile.isAvailable && (
                <span className="px-3 py-1 text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  {profile.availabilityText || 'Available for Work'}
                </span>
              )}
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5">
              {profile.heroHeadline || (
                <>
                  হ্যালো, আমি <span className="text-gradient">মুরাদ রহমান</span> — Graphics Design ও Web Development নিয়ে কাজ করি।
                </>
              )}
            </h1>

            {/* Subheadline / Intro */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8 font-normal">
              {profile.heroSubheadline ||
                'আমি ব্যক্তি, উদ্যোক্তা ও ছোট ব্যবসার জন্য পরিষ্কার, আধুনিক এবং ব্যবহারবান্ধব ডিজাইন ও ওয়েব অভিজ্ঞতা তৈরি করি।'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-8">
              <a
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <span>যোগাযোগ করুন</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#projects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700/80 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                <Eye className="w-4 h-4 text-blue-400" />
                <span>পোর্টফোলিও দেখুন</span>
              </a>
            </div>

            {/* Quick Details Pills */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
              {profile.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{profile.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Murad Rahman's Real Photo with Creative Badges */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="relative w-72 sm:w-84 md:w-96 aspect-square">
              
              {/* Outer decorative glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600/30 via-purple-600/30 to-amber-500/20 blur-2xl transform scale-105" />

              {/* Main Photo Card */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-slate-700/80 bg-slate-900 shadow-2xl">
                <img
                  src={profile.profileImage || "/images/murad-rahman.jpg"}
                  alt={profile.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/murad-rahman.jpg";
                  }}
                />
                
                {/* Overlay bottom subtle gradient */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="text-white font-bold text-lg">{profile.name}</h3>
                    <p className="text-blue-400 text-xs font-medium">{profile.title}</p>
                  </div>
                </div>
              </div>

              {/* Floating Creative Software Badges matching Murad's Adobe skills */}
              {/* Adobe Photoshop */}
              <div className="absolute -top-3 -left-3 glass-card px-3 py-1.5 rounded-xl shadow-lg border border-blue-500/40 flex items-center gap-2 transform -rotate-3 hover:rotate-0 transition-transform">
                <span className="w-7 h-7 rounded-lg bg-[#001e36] text-[#31a8ff] font-bold text-xs flex items-center justify-center border border-[#31a8ff]/40 shadow-sm">
                  Ps
                </span>
                <span className="text-xs font-semibold text-white">Photoshop</span>
              </div>

              {/* Adobe Illustrator */}
              <div className="absolute -top-3 -right-3 glass-card px-3 py-1.5 rounded-xl shadow-lg border border-amber-500/40 flex items-center gap-2 transform rotate-3 hover:rotate-0 transition-transform">
                <span className="w-7 h-7 rounded-lg bg-[#330000] text-[#ff9a00] font-bold text-xs flex items-center justify-center border border-[#ff9a00]/40 shadow-sm">
                  Ai
                </span>
                <span className="text-xs font-semibold text-white">Illustrator</span>
              </div>

              {/* Adobe Premiere Pro */}
              <div className="absolute -bottom-3 -left-3 glass-card px-3 py-1.5 rounded-xl shadow-lg border border-purple-500/40 flex items-center gap-2 transform rotate-2 hover:rotate-0 transition-transform">
                <span className="w-7 h-7 rounded-lg bg-[#00005b] text-[#ea77ff] font-bold text-xs flex items-center justify-center border border-[#ea77ff]/40 shadow-sm">
                  Pr
                </span>
                <span className="text-xs font-semibold text-white">Premiere Pro</span>
              </div>

              {/* Web Development / Blogger */}
              <div className="absolute -bottom-3 -right-3 glass-card px-3 py-1.5 rounded-xl shadow-lg border border-emerald-500/40 flex items-center gap-2 transform -rotate-2 hover:rotate-0 transition-transform">
                <span className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40 shadow-sm">
                  &lt;/&gt;
                </span>
                <span className="text-xs font-semibold text-white">Web & Blogger</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
