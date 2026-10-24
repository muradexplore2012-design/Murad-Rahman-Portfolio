import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, Shield, User } from 'lucide-react';
import type { SiteProfile } from '../types';
import { SignInModal } from './SignInModal';
import { UserAvatar, getUserDisplayName } from './UserAvatar';
import { subscribeToAuthState, signOutUser, verifyAdminStatus } from '../lib/auth';
import type { User as FirebaseUser } from 'firebase/auth';

const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={`${className} fill-current transition-transform duration-200 group-hover:scale-125`} viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterXIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={`${className} fill-current transition-transform duration-200 group-hover:scale-125`} viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={`${className} fill-current transition-transform duration-200 group-hover:scale-125`} viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YoutubeIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={`${className} fill-current transition-transform duration-200 group-hover:scale-125`} viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface NavbarProps {
  profile: SiteProfile;
}

export const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      setCurrentUser(user);
      if (user) {
        const adminStatus = await verifyAdminStatus(user);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'About Us', href: '#about' },
    { label: 'Portfolio', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Reviews', href: '#testimonials' },
  ];

  const socialLinks = profile.socialLinks || {};

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setUserDropdownOpen(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand: Text "Murad Rahman" on left as requested */}
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

            {/* Right Action Area: Social Icons + Sign in / Profile + Contact Us Button (Matching Screenshot) */}
            <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
              
              {/* Social Icons with Smooth Zoom on Hover */}
              <div className="flex items-center gap-1.5 mr-1">
                <a
                  href={socialLinks.facebook?.trim() || "https://www.facebook.com/profile.php?id=100085471628384"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#1877F2] hover:border-[#1877F2] hover:bg-blue-50/60 hover:scale-110 active:scale-95 transition-all duration-200 group shadow-2xs cursor-pointer"
                >
                  <FacebookIcon />
                </a>

                <a
                  href={socialLinks.twitter?.trim() || "https://x.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter"
                  title="X (Twitter)"
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-black hover:border-black hover:bg-slate-100 hover:scale-110 active:scale-95 transition-all duration-200 group shadow-2xs cursor-pointer"
                >
                  <TwitterXIcon />
                </a>

                <a
                  href={socialLinks.instagram?.trim() || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#E4405F] hover:border-[#E4405F] hover:bg-pink-50/60 hover:scale-110 active:scale-95 transition-all duration-200 group shadow-2xs cursor-pointer"
                >
                  <InstagramIcon />
                </a>

                <a
                  href={socialLinks.youtube?.trim() || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="YouTube"
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#FF0000] hover:border-[#FF0000] hover:bg-red-50/60 hover:scale-110 active:scale-95 transition-all duration-200 group shadow-2xs cursor-pointer"
                >
                  <YoutubeIcon />
                </a>
              </div>

              {/* User Sign In / Profile Area */}
              {currentUser ? (
                /* Authenticated User Menu */
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <UserAvatar user={currentUser} className="w-7 h-7" adminFallbackImage={profile.profileImage} />
                    <span className="text-xs font-bold text-slate-800 max-w-[120px] truncate">
                      {getUserDisplayName(currentUser, profile.name)}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2.5">
                        <UserAvatar user={currentUser} className="w-9 h-9" adminFallbackImage={profile.profileImage} />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {getUserDisplayName(currentUser, profile.name)}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {currentUser.email}
                          </p>
                        </div>
                      </div>

                      <div className="py-1">
                        {isAdmin && (
                          <a
                            href="/admin"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0284c7] hover:bg-sky-50 rounded-lg transition-colors"
                          >
                            <Shield className="w-3.5 h-3.5 text-[#0284c7]" />
                            <span>Admin CMS Dashboard</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out (লগআউট)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Unauthenticated Sign in Button (Matching exact reference button style) */
                <button
                  type="button"
                  onClick={() => setIsSignInOpen(true)}
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              )}

              {/* Contact Us Primary Button */}
              <Link
                to="/contact"
                className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] rounded-lg shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
              >
                Contact Us
              </Link>

            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              {currentUser && (
                <UserAvatar user={currentUser} className="w-8 h-8" adminFallbackImage={profile.profileImage} />
              )}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
                  href={socialLinks.facebook?.trim() || "https://www.facebook.com/profile.php?id=100085471628384"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#0284c7] hover:border-[#0284c7] hover:scale-110 transition-all duration-200 group"
                >
                  <FacebookIcon />
                </a>
                <a
                  href={socialLinks.twitter?.trim() || "https://x.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#0284c7] hover:border-[#0284c7] hover:scale-110 transition-all duration-200 group"
                >
                  <TwitterXIcon />
                </a>
                <a
                  href={socialLinks.instagram?.trim() || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#0284c7] hover:border-[#0284c7] hover:scale-110 transition-all duration-200 group"
                >
                  <InstagramIcon />
                </a>
                <a
                  href={socialLinks.youtube?.trim() || "https://youtube.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#0284c7] hover:border-[#0284c7] hover:scale-110 transition-all duration-200 group"
                >
                  <YoutubeIcon />
                </a>
              </div>

              {/* Mobile Sign In / Profile Actions */}
              <div className="pt-3 flex flex-col gap-2">
                {currentUser ? (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar user={currentUser} className="w-9 h-9" adminFallbackImage={profile.profileImage} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {getUserDisplayName(currentUser, profile.name)}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    {isAdmin && (
                      <a
                        href="/admin"
                        className="w-full py-2 px-3 bg-white text-[#0284c7] border border-sky-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Admin CMS Dashboard</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full py-2 px-3 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSignInOpen(true);
                    }}
                    className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    Sign in
                  </button>
                )}

                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-white bg-[#0284c7] rounded-lg shadow-xs hover:bg-[#0369a1] cursor-pointer"
                >
                  Contact Us
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Interactive User Sign-In Options Modal */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </>
  );
};
