import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { SiteProfile } from '../types';

interface NavbarProps {
  profile: SiteProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Service', href: '#services' },
    { label: 'Portfolio', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Reviews', href: '#testimonials' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#15803d] shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand / Logo */}
          <a
            href="#home"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <span className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase">
              {profile.name || 'MURAD RAHMAN'}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-white/95 hover:text-white hover:opacity-80 transition-opacity"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Outlined Contact Me Button (Direct WhatsApp or Email) */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={
                profile.whatsapp
                  ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`
                  : `mailto:${profile.email || 'muradrahman2026@gmail.com'}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 text-sm font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-[#15803d] transition-all duration-200 shadow-sm"
            >
              Contact Me
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#166534] border-t border-white/10 px-4 pt-3 pb-6 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={
                profile.whatsapp
                  ? `https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`
                  : `mailto:${profile.email || 'muradrahman2026@gmail.com'}`
              }
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 text-center px-4 py-2.5 text-sm font-bold text-[#15803d] bg-white rounded-lg shadow-md transition-colors"
            >
              Contact Me
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
