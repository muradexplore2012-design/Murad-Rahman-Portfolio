import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  RefreshCw,
  Tag,
  CheckCheck,
  Shield
} from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { ContactMessage, SiteProfile } from '../types';
import {
  subscribeToUserMessages,
  sendUserReply,
  submitContactMessage
} from '../services/firestoreService';
import { GoogleSignInButton } from './GoogleSignInButton';

interface UserChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  profile?: SiteProfile;
}

export const UserChatModal: React.FC<UserChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  profile,
}) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedThread, setSelectedThread] = useState<ContactMessage | null>(null);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [selectedThread?.replies, selectedThread?.message, selectedThread?.id]);

  // Real-time subscription to user's conversations
  useEffect(() => {
    if (!isOpen || !currentUser) {
      setMessages([]);
      setSelectedThread(null);
      setErrorMsg(null);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToUserMessages(
      currentUser.uid,
      currentUser.email || '',
      (data) => {
        setMessages(data);
        setErrorMsg(null);
        setIsLoading(false);

        // Keep selected thread in sync with incoming replies
        setSelectedThread((prev) => {
          if (!prev && data.length > 0) return data[0];
          if (!prev) return null;
          const found = data.find((m) => m.id === prev.id);
          return found || (data.length > 0 ? data[0] : null);
        });
      },
      (err) => {
        console.error('Error subscribing to user messages:', err);
        if (err.code === 'permission-denied') {
          setErrorMsg('Firebase Rules অনুযায়ী পারমিশন মেলেনি। Firebase Console-এ নতুন Rules পাবলিশ করুন।');
        } else {
          setErrorMsg(err.message || 'মেসেজ লোড করা যায়নি।');
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending || !currentUser) return;

    try {
      setIsSending(true);
      const text = inputText.trim();
      setInputText('');

      const userPhoto =
        currentUser.photoURL ||
        (currentUser.email
          ? localStorage.getItem('user_avatar_' + currentUser.email.toLowerCase().trim()) || ''
          : '');

      if (selectedThread) {
        // Reply to existing conversation
        await sendUserReply(selectedThread.id, text, {
          name: currentUser.displayName || 'Client',
          email: currentUser.email || '',
          photo: userPhoto,
        });
      } else {
        // Create initial conversation
        await submitContactMessage({
          name: currentUser.displayName || 'Client',
          email: currentUser.email || '',
          message: text,
          subject: 'সরাসরি চ্যাট বার্তা',
          userId: currentUser.uid,
          userPhoto: userPhoto,
        });
      }

      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    } catch (err: any) {
      console.error('Error sending message:', err);
      alert(err.message || 'মেসেজ পাঠানো যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (ts: any): string => {
    if (!ts) return '';
    try {
      const d = ts?.toDate ? ts.toDate() : ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-white shadow-2xl border border-slate-200 flex flex-col h-[640px] max-h-[90vh] text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0284c7] px-5 py-4 text-white flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Murad Rahman Avatar */}
            <div className="relative shrink-0">
              <img
                src={profile?.profileImage || '/images/murad-rahman.jpg'}
                alt="Murad Rahman"
                className="w-10 h-10 rounded-2xl object-cover border-2 border-white/40 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/murad-rahman.jpg';
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight truncate">
                  {profile?.name || 'মুরাদ রহমান'}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
                  অনলাইন
                </span>
              </div>
              <p className="text-[11px] text-sky-100 truncate">
                গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার • অফিশিয়াল ইনবক্স
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Gate: If user is not logged in */}
        {!currentUser ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-200 text-[#0284c7] flex items-center justify-center shadow-xs">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                চ্যাট ও মেসেজ দেখতে সাইন-ইন করুন
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                মুরাদ রহমানের সাথে কথা বলতে ও আপনার ইনবক্স মেসেজ চেক করতে গুগল দিয়ে সাইন-ইন করুন।
              </p>
            </div>
            <div className="w-full max-w-xs pt-2">
              <GoogleSignInButton
                onSuccess={() => {}}
                text="continue_with"
                theme="outline"
                size="large"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Error notice if security rules block */}
            {errorMsg && (
              <div className="p-3 mx-4 my-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 shrink-0">
                <span className="font-bold">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Conversation Threads Selector (if user has multiple topics) */}
            {messages.length > 1 && (
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-xs">
                <span className="text-[11px] font-bold text-slate-400 shrink-0">বিষয়:</span>
                {messages.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedThread(m)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedThread?.id === m.id
                        ? 'bg-[#0284c7] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m.subject || 'সাধারণ যোগাযোগ'}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Messages Stream */}
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-slate-100/50 via-white to-slate-50/50"
            >
              {isLoading ? (
                <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#0284c7]" />
                  <span>মেসেজ লোড হচ্ছে...</span>
                </div>
              ) : !selectedThread && messages.length === 0 ? (
                /* No conversations yet */
                <div className="py-12 text-center space-y-3 text-slate-500">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0284c7] flex items-center justify-center mx-auto border border-sky-100">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">কোনো পূর্ববর্তী চ্যাট নেই</h5>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                      মুরাদ রহমানকে নিচে মেসেজ লিখে পাঠান। তিনি দ্রুত উত্তর প্রদান করবেন।
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Topic badge */}
                  {selectedThread && (
                    <div className="text-center my-1">
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-[#0284c7] text-[11px] font-bold">
                        <Tag className="w-3 h-3" />
                        {selectedThread.subject || 'সরাসরি চ্যাট'}
                      </span>
                    </div>
                  )}

                  {/* 1. Client's Initial Message (Right side, Blue bubble) */}
                  {selectedThread && (
                    <div className="flex flex-col items-end max-w-[85%] ml-auto space-y-0.5">
                      <div className="bg-[#0284c7] text-white rounded-2xl rounded-tr-xs p-3.5 shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedThread.message}
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-sky-200">
                          <span>{formatTime(selectedThread.createdAt)}</span>
                          <CheckCheck className="w-3.5 h-3.5 text-sky-200" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Replies in Thread */}
                  {selectedThread?.replies?.map((rep, idx) => {
                    const isAdmin = rep.sender === 'admin';

                    return (
                      <div
                        key={rep.id || idx}
                        className={`flex flex-col ${isAdmin ? 'items-start mr-auto' : 'items-end ml-auto'} max-w-[85%] space-y-0.5`}
                      >
                        <span className="text-[10px] font-bold text-slate-400 px-1">
                          {isAdmin ? 'মুরাদ রহমান' : 'আপনি'}
                        </span>

                        <div
                          className={`p-3.5 rounded-2xl shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                            isAdmin
                              ? 'bg-slate-100 text-slate-900 rounded-tl-xs border border-slate-200/80'
                              : 'bg-[#0284c7] text-white rounded-tr-xs'
                          }`}
                        >
                          {rep.text}
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                              isAdmin ? 'text-slate-400' : 'text-sky-200'
                            }`}
                          >
                            <span>{formatTime(rep.createdAt)}</span>
                            {!isAdmin && <CheckCheck className="w-3.5 h-3.5 text-sky-200" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-end gap-2 shrink-0">
              <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 focus-within:border-[#0284c7] focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="মুরাদ রহমানকে মেসেজ লিখুন... (Enter চাপলে সেন্ড হবে)"
                  className="w-full px-3.5 py-2.5 bg-transparent resize-none text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none max-h-28 leading-relaxed"
                />
              </div>

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isSending}
                className="w-10 h-10 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white flex items-center justify-center shrink-0 shadow-sm transition-all disabled:opacity-40 cursor-pointer hover:scale-105 active:scale-95"
                title="মেসেজ পাঠান"
              >
                {isSending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
