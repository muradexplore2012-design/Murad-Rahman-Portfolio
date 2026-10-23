import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { SiteProfile } from '../types';

const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface NavbarProps {
  profile: SiteProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'About Us', href: '#about' },
    { label: 'Portfolio', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Reviews', href: '#testimonials' },
  ];

  const socialLinks = profile.socialLinks || {};

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand: Text "Murad Rahman" on left as requested (no circle MR icon) */}
          <a
            href="#home"
            className="flex items-center gap-2 group focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-[#0284c7] transition-colors">
              {profile.name || 'Murad Rahman'}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-600 hover:text-[#0284c7] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Area: Social Icons + Sign in + Contact Us Button (Matching Screenshot) */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
            
            {/* Social Icons */}
            <div className="flex items-center gap-1.5 mr-1">
              <a
                href={socialLinks.facebook || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0284c7] hover:border-[#0284c7] hover:bg-sky-50/50 transition-all"
              >
                <FacebookIcon />
              </a>

              <a
                href={socialLinks.twitter || "https://x.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0284c7] hover:border-[#0284c7] hover:bg-sky-50/50 transition-all"
              >
                <TwitterXIcon />
              </a>

              <a
                href={socialLinks.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0284c7] hover:border-[#0284c7] hover:bg-sky-50/50 transition-all"
              >
                <InstagramIcon />
              </a>

              <a
                href={socialLinks.youtube || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0284c7] hover:border-[#0284c7] hover:bg-sky-50/50 transition-all"
              >
                <YoutubeIcon />
              </a>
            </div>

            {/* Sign in button (links directly to Admin) */}
            <a
              href="/admin/login"
              className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Sign in
            </a>

            {/* Contact Us Primary Button */}
            <a
              href={
                profile.whatsapp
                  ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`
                  : `mailto:${profile.email || 'muradrahman2026@gmail.com'}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] rounded-lg shadow-xs hover:shadow transition-all duration-200"
            >
              Contact Us
            </a>

          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200 shadow-lg">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0284c7] rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            
            {/* Mobile Socials */}
            <div className="flex items-center gap-2 py-3 px-3 border-y border-slate-100 mt-2">
              <a
                href={socialLinks.facebook || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600"
              >
                <FacebookIcon />
              </a>
              <a
                href={socialLinks.twitter || "https://x.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600"
              >
                <TwitterXIcon />
              </a>
              <a
                href={socialLinks.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600"
              >
                <InstagramIcon />
              </a>
              <a
                href={socialLinks.youtube || "https://youtube.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600"
              >
                <YoutubeIcon />
              </a>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href="/admin/login"
                className="flex-1 text-center py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg"
              >
                Sign in
              </a>
              <a
                href={
                  profile.whatsapp
                    ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`
                    : `mailto:${profile.email || 'muradrahman2026@gmail.com'}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 text-sm font-bold text-white bg-[#0284c7] rounded-lg"
              >
                Contact Us
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
