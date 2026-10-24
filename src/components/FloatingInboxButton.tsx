import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import { subscribeToUserMessages } from '../services/firestoreService';

interface FloatingInboxButtonProps {
  onClick: () => void;
  isOpen: boolean;
  currentUser: FirebaseUser | null;
}

/**
 * Floating WhatsApp-style Inbox Action Button at the bottom-right corner.
 * Displays "Inbox" with live online dot and real-time unread replies counter.
 */
export const FloatingInboxButton: React.FC<FloatingInboxButtonProps> = ({
  onClick,
  isOpen,
  currentUser,
}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // Real-time unread messages listener
  useEffect(() => {
    if (!currentUser) {
      setUnreadCount(0);
      return;
    }
    const unsub = subscribeToUserMessages(
      currentUser.uid,
      currentUser.email || '',
      (msgs) => {
        let count = 0;
        msgs.forEach((m) => {
          if (m.unreadByUser) count++;
        });
        setUnreadCount(count);
      }
    );
    return () => unsub();
  }, [currentUser]);

  // Hide button with animation when scrolled into footer area
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let removeScrollListener: (() => void) | null = null;

    const setupFooterDetection = () => {
      const footer = document.querySelector('footer') || document.getElementById('site-footer');
      if (!footer) return false;

      // 1. IntersectionObserver for high-performance viewport detection
      try {
        observer = new IntersectionObserver(
          ([entry]) => {
            setIsFooterVisible(entry.isIntersecting);
          },
          {
            root: null,
            threshold: 0,
            rootMargin: '0px 0px -15px 0px',
          }
        );
        observer.observe(footer);
      } catch {}

      // 2. High-precision scroll listener fallback
      const handleScroll = () => {
        const rect = footer.getBoundingClientRect();
        const isTouchingFooter = rect.top < window.innerHeight - 15;
        setIsFooterVisible(isTouchingFooter);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      removeScrollListener = () => {
        window.removeEventListener('scroll', handleScroll);
      };

      return true;
    };

    if (!setupFooterDetection()) {
      const timer = setTimeout(setupFooterDetection, 250);
      return () => clearTimeout(timer);
    }

    return () => {
      if (observer) observer.disconnect();
      if (removeScrollListener) removeScrollListener();
    };
  }, []);

  const shouldHide = isOpen || isFooterVisible;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-40 group flex flex-col items-center justify-center w-[50px] h-[50px] sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#0284c7] via-[#0369a1] to-[#0284c7] bg-[length:200%_auto] hover:bg-right text-white shadow-lg shadow-sky-600/30 sm:shadow-xl sm:shadow-sky-600/35 hover:shadow-2xl hover:shadow-sky-600/50 hover:scale-105 active:scale-95 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer border-2 border-white/50 backdrop-blur-xs select-none ${
        shouldHide
          ? 'opacity-0 translate-y-12 scale-50 pointer-events-none'
          : 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
      }`}
      title="Live chat - সরাসরি চ্যাট করুন"
      aria-label="Open Live Chat"
    >
      {/* Animated Chat Icon with pulsing Online Indicator */}
      <div className="relative flex items-center justify-center">
        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 fill-white/20 text-white transition-transform duration-300 group-hover:scale-110" />
        <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-2 w-2 sm:h-2.5 sm:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-400 border border-white" />
        </span>
      </div>

      {/* "Live chat" text directly underneath the icon */}
      <span className="text-[8.5px] sm:text-[10px] font-extrabold tracking-tight text-white mt-0.5 sm:mt-1 leading-none drop-shadow-xs">
        Live chat
      </span>

      {/* Unread badge if any */}
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 px-1 sm:px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[8.5px] sm:text-[10px] font-black border border-white sm:border-2 animate-pulse shadow-sm">
          {unreadCount}
        </span>
      )}
    </button>
  );
};
