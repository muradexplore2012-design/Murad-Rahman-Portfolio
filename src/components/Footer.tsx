import React from 'react';
import { ArrowUp, Lock, Heart, Globe, Mail, Phone } from 'lucide-react';
import type { SiteProfile, SiteSettings } from '../types';

interface FooterProps {
  profile: SiteProfile;
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ profile, settings }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  // Social links that have actual values
  const validSocialLinks = Object.entries(profile.socialLinks || {}).filter(
    ([_, url]) => url && url.trim().length > 0
  );

  return (
    <footer className="relative bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Bio */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-500/40">
                <img
                  src={profile.profileImage || "/images/murad-rahman.jpg"}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                {profile.name}
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
              {settings?.footerBio ||
                'পরিচ্ছন্ন ডিজাইন এবং আধুনিক ওয়েব ইন্টারফেস নিয়ে কাজ করা গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার। প্রতিটি কাজে সর্বোচ্চ গুণগত মান বজায় রাখতে প্রতিশ্রুতিবদ্ধ।'}
            </p>

            {/* Social Links (only visible if configured) */}
            {validSocialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {validSocialLinks.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors capitalize"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              নেভিগেশন
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#home" className="hover:text-blue-400 transition-colors">হোম</a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-400 transition-colors">আমার সম্পর্কে</a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-400 transition-colors">সার্ভিসসমূহ</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-blue-400 transition-colors">পোর্টফোলিও</a>
              </li>
              <li>
                <a href="#skills" className="hover:text-blue-400 transition-colors">দক্ষতা</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-blue-400 transition-colors">যোগাযোগ</a>
              </li>
            </ul>
          </div>

          {/* Direct Channels */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              সরাসরি যোগাযোগ
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
              {(profile.whatsapp || profile.phone) && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{profile.whatsapp || profile.phone}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            {settings?.copyrightText || `© ${currentYear} ${profile.name}. সর্বস্বত্ব সংরক্ষিত।`}
          </div>

          <div className="flex items-center gap-6">
            <a
              href="/admin"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="উপরে যান"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
