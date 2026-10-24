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
      className={`fixed bottom-6 right-6 z-40 group flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#0284c7] via-[#0369a1] to-[#0284c7] bg-[length:200%_auto] hover:bg-right text-white shadow-xl shadow-sky-600/35 hover:shadow-2xl hover:shadow-sky-600/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-white/50 backdrop-blur-xs select-none ${
        isOpen
          ? 'opacity-0 pointer-events-none scale-75'
          : 'opacity-100 scale-100 animate-in fade-in zoom-in duration-300'
      }`}
      title="Live chat - সরাসরি চ্যাট করুন"
      aria-label="Open Live Chat"
    >
      {/* Animated Chat Icon with pulsing Online Indicator */}
      <div className="relative flex items-center justify-center">
        <MessageSquare className="w-5 h-5 fill-white/20 text-white transition-transform duration-300 group-hover:scale-110" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-white" />
        </span>
      </div>

      {/* "Live chat" text directly underneath the icon */}
      <span className="text-[10px] font-extrabold tracking-tight text-white mt-1 leading-none drop-shadow-xs">
        Live chat
      </span>

      {/* Unread badge if any */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black border-2 border-white animate-pulse shadow-sm">
          {unreadCount}
        </span>
      )}
    </button>
  );
};
