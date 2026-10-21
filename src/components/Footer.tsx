import React from 'react';
import { ArrowUp, Lock, Globe, Mail, Phone } from 'lucide-react';
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

  const validSocialLinks = Object.entries(profile.socialLinks || {}).filter(
    ([_, url]) => url && url.trim().length > 0
  );

  return (
    <footer className="relative bg-[#14532d] text-white pt-16 pb-12 overflow-hidden border-t-4 border-[#15803d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Bio */}
          <div className="md:col-span-5">
            <h3 className="text-2xl font-black tracking-wider uppercase mb-3">
              {profile.name || 'MURAD RAHMAN'}
            </h3>

            <p className="text-sm text-emerald-100 leading-relaxed mb-6 max-w-sm font-normal">
              {settings?.footerBio ||
                'পরিচ্ছন্ন ডিজাইন এবং আধুনিক ওয়েব ইন্টারফেস নিয়ে কাজ করা গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার। প্রতিটি কাজে সর্বোচ্চ গুণগত মান বজায় রাখতে প্রতিশ্রুতিবদ্ধ।'}
            </p>

            {/* Social Links */}
            {validSocialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {validSocialLinks.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-emerald-700/60 text-xs font-semibold text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors capitalize"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-wider mb-4">
              নেভিগেশন
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-100 font-medium">
              <li>
                <a href="#home" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">Service</a>
              </li>
              <li>
                <a href="#projects" className="hover:text-white transition-colors">Portfolio</a>
              </li>
              <li>
                <a href="#skills" className="hover:text-white transition-colors">Skills</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Direct Channels */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-bold text-emerald-200 uppercase tracking-wider mb-4">
              সরাসরি যোগাযোগ
            </h4>
            <div className="space-y-3 text-sm text-emerald-100 font-medium">
              {profile.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-300 shrink-0" />
                  <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">
                    {profile.email}
                  </a>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>{profile.location}</span>
                </div>
              )}
              {(profile.whatsapp || profile.phone) && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>{profile.whatsapp || profile.phone}</span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200">
          <div>
            {settings?.copyrightText || `© ${currentYear} ${profile.name}. All rights reserved.`}
          </div>

          <div className="flex items-center gap-6">
            <a
              href="/admin"
              className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors font-semibold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-emerald-900 border border-emerald-700 text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
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
