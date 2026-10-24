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

  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 sm:pl-4 sm:pr-5 sm:py-3 rounded-full bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0284c7] bg-[length:200%_auto] hover:bg-right text-white shadow-xl shadow-sky-600/30 hover:shadow-2xl hover:shadow-sky-600/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/40 backdrop-blur-xs select-none ${
        isOpen
          ? 'opacity-0 pointer-events-none scale-75'
          : 'opacity-100 scale-100 animate-in fade-in zoom-in duration-300'
      }`}
      title="Inbox (ইনবক্স) - সরাসরি লাইভ চ্যাট করুন"
      aria-label="Open Live Chat Inbox"
    >
      {/* Animated Chat Icon with pulsing Online Indicator */}
      <div className="relative flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <MessageSquare className="w-4 h-4 fill-white/30 text-white" />
        </div>
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
        </span>
      </div>

      {/* Button Text */}
      <div className="flex flex-col text-left leading-tight">
        <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wider">
          Live Chat
        </span>
        <span className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
          <span>Inbox</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse shadow-xs">
              {unreadCount}
            </span>
          )}
        </span>
      </div>
    </button>
  );
};
