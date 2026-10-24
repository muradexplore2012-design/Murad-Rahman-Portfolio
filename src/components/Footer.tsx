import React, { useState } from 'react';
import { ArrowUp, X } from 'lucide-react';
import type { SiteProfile, SiteSettings } from '../types';

interface FooterProps {
  profile: SiteProfile;
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ profile, settings }) => {
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();
  const facebookUrl = profile.socialLinks?.facebook?.trim() || "https://www.facebook.com/profile.php?id=100085471628384";

  const handleOpenInfoModal = (title: string, content: string, e: React.MouseEvent) => {
    e.preventDefault();
    setModalContent({ title, content });
  };

  const privacyText = `মুরাদ রহমান পোর্টফোলিও ওয়েবসাইটে আপনার তথ্যের গোপনীয়তা রক্ষা করা আমাদের অঙ্গীকার। এই ওয়েবসাইটে কন্টাক্ট ফর্ম বা যোগাযোগের মাধ্যমে সংগৃহীত নাম, ইমেইল বা ফোন নম্বর শুধুমাত্র সার্ভিস সংক্রান্ত আলোচনার উদ্দেশ্যে ব্যবহার করা হয় এবং তৃতীয় কোনো পক্ষের কাছে তা স্থানান্তর করা হয় না।`;

  const termsText = `মুরাদ রহমানের পোর্টফোলিওতে প্রদর্শিত গ্রাফিক্স ডিজাইন, ওয়েব ইন্টারফেস এবং কনটেন্ট তাঁর ব্যক্তিগত মেধা ও ক্লায়েন্টদের জন্য তৈরি কাজ। অনুমোদন ব্যতীত কোনো কনটেন্ট কপি বা অননুমোদিত বাণিজ্যিক উদ্দেশ্যে পুনর্ব্যবহার করা নিষেধ। ক্লায়েন্ট প্রজেক্টের প্রতিটি কাজ পারস্পরিক আলোচনার ভিত্তিতে চুক্তি অনুযায়ী পরিচালিত হয়।`;

  const returnText = `ডিজিটাল ডিজাইন ও ওয়েব ডেভেলপমেন্ট প্রজেক্টের ক্ষেত্রে প্রতিটি ধাপে ক্লায়েন্টের মতামত ও রিভিশন নিয়ে কাজ সম্পন্ন করা হয়। কাজ শুরু করার পূর্বে স্পষ্ট ব্রিফিং নেওয়া হয় যাতে সন্তোষজনক ফলাফল নিশ্চিত করা সম্ভব হয়। রিভিশন ও ডেলিভারি সংক্রান্ত নিয়ম আলোচনা সাপেক্ষে নির্ধারিত থাকে।`;

  return (
    <footer className="relative bg-[#0284c7] text-white overflow-hidden">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-12">
        
        {/* Desktop 4-Column Layout (Hidden on Mobile) */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Murad Rahman Info & Social Icons (Span 5) */}
          <div className="lg:col-span-5 pr-0 lg:pr-6">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-3 uppercase">
              {profile.name || 'Murad Rahman'}
            </h3>
            
            <p className="text-sm text-white/90 leading-relaxed mb-6 font-normal">
              {profile.aboutBio ||
                'মুরাদ রহমান একজন দক্ষ গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার, যিনি ব্যক্তি ও ব্যবসার জন্য আধুনিক ও পরিচ্ছন্ন ডিজাইন এবং কার্যকর রেসপনসিভ ওয়েব ইন্টারফেস তৈরিতে প্রতিশ্রুতিবদ্ধ। এই সময়ে তিনি আধুনিক ডিজাইন কৌশল এবং ওয়েবসাইট তৈরিতে গভীর দক্ষতা অর্জন করেছেন।'}
            </p>

            {/* Social Media Circular Buttons (Matching Reference Exactly) */}
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                aria-label="Facebook Profile"
                title="মুরাদ রহমানের ফেসবুক প্রোফাইল"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href={profile.socialLinks?.twitter || "https://x.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                aria-label="X (Twitter)"
                title="X (Twitter)"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href={profile.socialLinks?.youtube || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                aria-label="YouTube"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href={profile.socialLinks?.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                aria-label="Instagram"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Important (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-4">
              Important
            </h4>
            <ul className="space-y-3 text-sm text-white/90 font-medium">
              <li>
                <a href="#home" className="hover:text-white hover:underline transition-colors block">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white hover:underline transition-colors block">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white hover:underline transition-colors block">
                  Service
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-white hover:underline transition-colors block">
                  Portfolio
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Service (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-4">
              Service
            </h4>
            <ul className="space-y-3 text-sm text-white/90 font-medium">
              <li>
                <a href="#services" className="hover:text-white hover:underline transition-colors block">
                  Template
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white hover:underline transition-colors block">
                  Plugin
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white hover:underline transition-colors block">
                  Ecommerce
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white hover:underline transition-colors block">
                  LMS Website
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Information (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-4">
              Information
            </h4>
            <ul className="space-y-3 text-sm text-white/90 font-medium">
              <li>
                <a href="#about" className="hover:text-white hover:underline transition-colors block">
                  About Us
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleOpenInfoModal('Privacy Policy (গোপনীয়তা নীতি)', privacyText, e)}
                  className="hover:text-white hover:underline transition-colors block text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleOpenInfoModal('Terms & Conditions (শর্তাবলী)', termsText, e)}
                  className="hover:text-white hover:underline transition-colors block text-left cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={(e) => handleOpenInfoModal('Return & Revision Policy', returnText, e)}
                  className="hover:text-white hover:underline transition-colors block text-left cursor-pointer"
                >
                  Return Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Mobile View: Sleek & Compact Short Footer */}
        <div className="md:hidden space-y-5 text-center">
          {/* Brand & Micro Tagline */}
          <div>
            <h3 className="text-xl font-black text-white tracking-wide uppercase mb-1">
              {profile.name || 'Murad Rahman'}
            </h3>
            <p className="text-xs text-white/80 max-w-xs mx-auto leading-relaxed">
              {profile.title || 'Graphics Designer & Web Developer'}
            </p>
          </div>

          {/* Social Icons Centered */}
          <div className="flex items-center justify-center gap-3">
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
              aria-label="Facebook Profile"
              title="মুরাদ রহমানের ফেসবুক প্রোফাইল"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            <a
              href={profile.socialLinks?.twitter || "https://x.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
              aria-label="X (Twitter)"
              title="X (Twitter)"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href={profile.socialLinks?.youtube || "https://youtube.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
              aria-label="YouTube"
              title="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            <a
              href={profile.socialLinks?.instagram || "https://instagram.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
              aria-label="Instagram"
              title="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>

          {/* Quick Essential Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-semibold text-white/90 pt-1">
            <a href="#home" className="hover:underline transition-colors">Home</a>
            <span>•</span>
            <a href="#about" className="hover:underline transition-colors">About</a>
            <span>•</span>
            <a href="#services" className="hover:underline transition-colors">Services</a>
            <span>•</span>
            <a href="#projects" className="hover:underline transition-colors">Portfolio</a>
            <span>•</span>
            <a href="/contact" className="hover:underline transition-colors">Contact</a>
          </div>

          {/* Policy Links */}
          <div className="flex items-center justify-center gap-3 text-[11px] text-white/70">
            <button
              type="button"
              onClick={(e) => handleOpenInfoModal('Privacy Policy (গোপনীয়তা নীতি)', privacyText, e)}
              className="hover:underline transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={(e) => handleOpenInfoModal('Terms & Conditions (শর্তাবলী)', termsText, e)}
              className="hover:underline transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Design By Bar (Matching Reference Exactly) */}
      <div className="bg-[#0369a1] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex flex-row items-center justify-between gap-2 text-[11px] sm:text-sm text-white font-medium">
          
          {/* Left: Copyright */}
          <div>
            © {currentYear} {profile.name || 'Murad Rahman'}
          </div>

          {/* Right: Design by Murad Rahman (with Facebook Profile Link) */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="text-[11px] sm:text-sm text-white font-medium">
              <span>Design by </span>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-bold hover:underline transition-colors"
                title="মুরাদ রহমানের ফেসবুক প্রোফাইল"
              >
                Murad Rahman
              </a>
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="p-1 sm:p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="উপরে যান"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Lightweight Policy & Terms Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-7 shadow-2xl text-slate-800 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {modalContent.title}
              </h3>
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-normal mb-6">
              {modalContent.content}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="px-5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};
