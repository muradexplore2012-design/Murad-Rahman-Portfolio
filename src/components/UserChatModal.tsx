import React, { useEffect, useState, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  RefreshCw,
  Tag,
  CheckCheck,
  Shield,
  Sparkles,
  Bot
} from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { ContactMessage, ChatReply, SiteProfile, SiteSettings } from '../types';
import {
  subscribeToUserMessages,
  sendUserReply,
  sendAdminReply,
  submitContactMessage,
  getSiteSettings
} from '../services/firestoreService';
import { starterSettings } from '../services/starterData';
import { generateAiAutoReply, QUICK_PROMPTS } from '../services/aiReplyService';
import { GoogleSignInButton } from './GoogleSignInButton';
import { FormattedMessageText } from './FormattedMessageText';

interface UserChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
  profile?: SiteProfile;
}

/**
 * Creates the initial AI Assistant greeting message for first-time visitors
 */
const createInitialWelcomeReply = (
  settings: SiteSettings,
  profile?: SiteProfile,
  user?: FirebaseUser | null
): ChatReply => {
  const name = user?.displayName ? `, ${user.displayName}` : '';
  const wa = settings.autoReplyWhatsapp || 'https://wa.me/8801566088159';
  const fb = settings.autoReplyFacebook || 'https://www.facebook.com/profile.php?id=100085471628384';

  return {
    id: 'welcome_init',
    sender: 'admin',
    senderName: settings.aiAssistantName || 'মুরাদ রহমান (AI Assistant)',
    senderEmail: profile?.email || 'muradexplore2012@gmail.com',
    senderPhoto: profile?.profileImage || '/images/murad-rahman-hero.png',
    text: `আসসালামু আলাইকুম${name}! মুরাদ রহমানের অফিসিয়াল পোর্টফোলিওতে আপনাকে স্বাগতম। 🎨✨

আমি মুরাদ রহমানের সার্বক্ষণিক এআই সহকারী (24/7 AI Assistant)। আপনি যেকোনো ডিজাইন, থাম্বনেইল বা ওয়েবসাইট তৈরি সংক্রান্ত বিষয়ে আমাকে জিজ্ঞেস করতে পারেন।

📌 **জরুরি অর্ডার বা সরাসরি কথা বলতে:**
• 📱 WhatsApp: ${wa}
• 📘 Facebook: ${fb}

আপনার কী ধরণের কাজ প্রয়োজন? নিচের কুইক বাটনগুলো চাপুন অথবা সরাসরি মেসেজ লিখুন:`,
    createdAt: new Date().toISOString(),
  };
};

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
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(starterSettings);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const localKey = currentUser ? `mr_chat_thread_${currentUser.uid}` : '';

  // Load site settings for AI configuration (Auto-reply toggle, custom whatsapp, etc.)
  useEffect(() => {
    getSiteSettings().then((s) => {
      if (s) setSettings(s);
    });
  }, []);

  // Auto-scroll on new message or typing state change
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [selectedThread?.replies, selectedThread?.message, selectedThread?.id, isAiTyping]);

  // Load local chat history or initialize welcome thread immediately upon open
  useEffect(() => {
    if (!isOpen || !currentUser) {
      setMessages([]);
      setSelectedThread(null);
      setErrorMsg(null);
      return;
    }

    // 1. Check local storage for persistent chat thread
    let localThread: ContactMessage | null = null;
    if (localKey) {
      try {
        const saved = localStorage.getItem(localKey);
        if (saved) {
          localThread = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Could not read local chat thread:', e);
      }
    }

    if (localThread) {
      setSelectedThread(localThread);
    } else {
      // Initialize immediate welcome thread so user is greeted by AI instantly
      const welcomeMsg = createInitialWelcomeReply(settings, profile, currentUser);
      const initialThread: ContactMessage = {
        id: 'local_' + Date.now(),
        name: currentUser.displayName || 'Client',
        email: currentUser.email || '',
        message: '',
        subject: 'সরাসরি চ্যাট বার্তা',
        userId: currentUser.uid,
        userPhoto: currentUser.photoURL || '',
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        replies: [welcomeMsg],
      };
      setSelectedThread(initialThread);
      if (localKey) {
        try {
          localStorage.setItem(localKey, JSON.stringify(initialThread));
        } catch {}
      }
    }

    // 2. Real-time background subscription to user's remote Firestore conversations
    setIsLoading(false);
    const unsubscribe = subscribeToUserMessages(
      currentUser.uid,
      currentUser.email || '',
      (data) => {
        setMessages(data);
        setErrorMsg(null);

        if (data.length > 0) {
          // If remote conversations exist in Firestore, keep selected thread synced
          setSelectedThread((prev) => {
            if (!prev) return data[0];
            const found = data.find((m) => m.id === prev.id);
            if (found) {
              // Merge local replies if any are pending
              const mergedReplies = [...(found.replies || [])];
              if (prev.replies) {
                for (const r of prev.replies) {
                  if (!mergedReplies.some((mr) => mr.id === r.id || mr.text === r.text)) {
                    mergedReplies.push(r);
                  }
                }
              }
              const merged = { ...found, replies: mergedReplies };
              if (localKey) {
                try { localStorage.setItem(localKey, JSON.stringify(merged)); } catch {}
              }
              return merged;
            }
            return prev;
          });
        }
      },
      (err) => {
        console.warn('Firestore subscription notice (using local chat):', err);
        // Do not block client with ugly error; local state continues working seamlessly
      }
    );

    return () => unsubscribe();
  }, [isOpen, currentUser, localKey]);

  if (!isOpen) return null;

  /**
   * Fast, resilient message sender with guaranteed AI Auto-Reply
   */
  const handleSendMessageWithText = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || !currentUser || isSending || isAiTyping) return;

    // 1. Immediately clear input & focus back for lightning-fast UX
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }

    const userPhoto =
      currentUser.photoURL ||
      (currentUser.email
        ? localStorage.getItem('user_avatar_' + currentUser.email.toLowerCase().trim()) || ''
        : '');

    // 2. Build User Reply
    const userMsg: ChatReply = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      sender: 'user',
      senderName: currentUser.displayName || 'Client',
      senderEmail: currentUser.email || '',
      senderPhoto: userPhoto,
      text,
      createdAt: new Date().toISOString(),
    };

    // 3. Immediately display User Message in UI & persist
    let activeThreadSnapshot: ContactMessage | null = null;
    setSelectedThread((prev) => {
      const prevReplies = prev?.replies || [];
      const updatedReplies = [...prevReplies, userMsg];
      const updated: ContactMessage = prev
        ? {
            ...prev,
            replies: updatedReplies,
            lastMessage: text,
          }
        : {
            id: 'local_' + Date.now(),
            name: currentUser.displayName || 'Client',
            email: currentUser.email || '',
            message: text,
            subject: 'সরাসরি চ্যাট বার্তা',
            userId: currentUser.uid,
            userPhoto: userPhoto,
            isRead: false,
            isArchived: false,
            createdAt: new Date().toISOString(),
            replies: updatedReplies,
          };
      activeThreadSnapshot = updated;
      if (localKey) {
        try {
          localStorage.setItem(localKey, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });

    // 4. Trigger AI Auto-Reply if enabled
    if (settings.aiAutoReplyEnabled !== false) {
      setIsAiTyping(true);

      // Realistic typing indicator delay (850ms) for natural responsiveness
      await new Promise((resolve) => setTimeout(resolve, 850));

      const aiReplyText = generateAiAutoReply(
        text,
        profile,
        settings,
        activeThreadSnapshot ? (activeThreadSnapshot as ContactMessage).replies : undefined
      );

      const aiReply: ChatReply = {
        id: 'ai_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        sender: 'admin',
        senderName: settings.aiAssistantName || 'মুরাদ রহমান (AI Assistant)',
        senderEmail: profile?.email || 'muradexplore2012@gmail.com',
        senderPhoto: profile?.profileImage || '/images/murad-rahman-hero.png',
        text: aiReplyText,
        createdAt: new Date().toISOString(),
      };

      // 5. GUARANTEED UI INSERTION: Display AI reply immediately!
      setSelectedThread((prev) => {
        const prevReplies = prev?.replies || [];
        const updatedReplies = [...prevReplies, aiReply];
        const updated: ContactMessage = prev
          ? {
              ...prev,
              replies: updatedReplies,
              lastMessage: aiReplyText,
            }
          : {
              id: 'local_' + Date.now(),
              name: currentUser.displayName || 'Client',
              email: currentUser.email || '',
              message: text,
              subject: 'সরাসরি চ্যাট বার্তা',
              userId: currentUser.uid,
              userPhoto: userPhoto,
              isRead: false,
              isArchived: false,
              createdAt: new Date().toISOString(),
              replies: [userMsg, aiReply],
            };
        if (localKey) {
          try {
            localStorage.setItem(localKey, JSON.stringify(updated));
          } catch {}
        }
        return updated;
      });

      setIsAiTyping(false);

      // 6. Background Firestore Cloud Sync (Non-blocking)
      (async () => {
        try {
          const currentId = selectedThread?.id;
          const isRealFirestoreDoc = currentId && !currentId.startsWith('local_');

          if (isRealFirestoreDoc) {
            await sendUserReply(currentId, text, {
              name: currentUser.displayName || 'Client',
              email: currentUser.email || '',
              photo: userPhoto,
            });
            await sendAdminReply(currentId, aiReplyText, {
              name: settings.aiAssistantName || 'মুরাদ রহমান (AI Assistant)',
              email: profile?.email || 'muradexplore2012@gmail.com',
              photo: profile?.profileImage || '/images/murad-rahman-hero.png',
            });
          } else {
            const newDocId = await submitContactMessage({
              name: currentUser.displayName || 'Client',
              email: currentUser.email || '',
              message: text,
              subject: 'সরাসরি চ্যাট বার্তা',
              userId: currentUser.uid,
              userPhoto: userPhoto,
              replies: [userMsg, aiReply],
            });

            if (newDocId) {
              setSelectedThread((prev) => {
                if (!prev) return null;
                const synced = { ...prev, id: newDocId };
                if (localKey) {
                  try {
                    localStorage.setItem(localKey, JSON.stringify(synced));
                  } catch {}
                }
                return synced;
              });
            }
          }
        } catch (syncErr) {
          console.warn('Background Firestore sync notice (client chat working normally):', syncErr);
        }
      })();
    }
  };

  const handleSendMessage = () => {
    handleSendMessageWithText(inputText);
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

  const muradPhoto = profile?.profileImage || '/images/murad-rahman-hero.png';

  // Check if initial message should be shown separately (only if not already duplicated in replies)
  const showInitialMessageSeparately =
    selectedThread?.message?.trim() &&
    (!selectedThread.replies ||
      selectedThread.replies.length === 0 ||
      !selectedThread.replies.some((r) => r.text === selectedThread.message));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-white shadow-2xl border border-slate-200 flex flex-col h-[650px] max-h-[92vh] text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0284c7] px-4 sm:px-5 py-3.5 text-white flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Murad Rahman Avatar */}
            <div className="relative shrink-0">
              <img
                src={muradPhoto}
                alt="Murad Rahman"
                className="w-10 h-10 rounded-2xl object-cover border-2 border-white/80 shadow-md ring-2 ring-sky-300/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight truncate">
                  মুরাদ রহমান
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-400/30 text-white border border-sky-300/40 text-[10px] font-bold">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                  24/7 AI অ্যাক্টিভ
                </span>
              </div>
              <p className="text-[11px] text-sky-100 truncate flex items-center gap-1">
                <span>গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার</span>
                <span>•</span>
                <span className="text-sky-200 font-semibold">তাৎক্ষণিক অটো-রিপ্লাই</span>
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
                চ্যাট ও তাৎক্ষণিক উত্তর পেতে সাইন-ইন করুন
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                মুরাদ রহমানের সাথে কথা বলতে, অর্ডার দিতে ও সার্বক্ষণিক এআই সহায়তা পেতে গুগল দিয়ে এক ক্লিকে যুক্ত হোন।
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
              {isLoading && !selectedThread ? (
                <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#0284c7]" />
                  <span>মেসেজ লোড হচ্ছে...</span>
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

                  {/* 1. Client's Initial Message (only if separate from replies) */}
                  {showInitialMessageSeparately && (
                    <div className="flex flex-col items-end max-w-[85%] ml-auto space-y-0.5">
                      <div className="bg-[#0284c7] text-white rounded-2xl rounded-tr-xs p-3.5 shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
                        <FormattedMessageText text={selectedThread!.message} isLight={false} />
                        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-sky-200">
                          <span>{formatTime(selectedThread!.createdAt)}</span>
                          <CheckCheck className="w-3.5 h-3.5 text-sky-200" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Replies in Thread */}
                  {selectedThread?.replies?.map((rep, idx) => {
                    const isAdmin = rep.sender === 'admin';
                    const isAiReply =
                      isAdmin &&
                      (rep.senderName?.includes('AI') ||
                        rep.text?.includes('মুরাদ রহমানের') ||
                        rep.text?.includes('WhatsApp') ||
                        rep.text?.includes('হোয়াটসঅ্যাপ'));

                    return (
                      <div
                        key={rep.id || idx}
                        className={`flex flex-col ${isAdmin ? 'items-start mr-auto' : 'items-end ml-auto'} max-w-[88%] space-y-1`}
                      >
                        {isAdmin && (
                          <div className="flex items-center gap-1.5 ml-1 text-[10px] text-slate-500 font-semibold">
                            <span className="text-[#0284c7] font-bold">
                              {rep.senderName || 'মুরাদ রহমান'}
                            </span>
                            {isAiReply && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[9px] font-bold">
                                <Bot className="w-2.5 h-2.5 text-purple-600" />
                                <span>AI Assistant</span>
                              </span>
                            )}
                          </div>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text ${
                            isAdmin
                              ? 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/90 shadow-2xs'
                              : 'bg-[#0284c7] text-white rounded-tr-xs'
                          }`}
                        >
                          <FormattedMessageText text={rep.text} isLight={isAdmin} />
                          <div
                            className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
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

                  {/* 3. AI Typing Indicator */}
                  {isAiTyping && (
                    <div className="flex flex-col items-start mr-auto max-w-[85%] space-y-1 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-sky-50 text-[#0284c7] rounded-full border border-sky-100 text-[10px] font-bold ml-1">
                        <Sparkles className="w-3 h-3 text-[#0284c7] animate-pulse" />
                        <span>{settings.aiAssistantName || 'মুরাদ রহমান (AI Assistant)'} লিখছেন...</span>
                      </div>
                      <div className="p-3.5 rounded-2xl rounded-tl-xs bg-slate-100 border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-bounce" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Quick Prompt Suggestion Chips */}
            <div className="px-3 pt-2 pb-1.5 bg-slate-50 border-t border-slate-200/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#0284c7]" />
                <span>কুইক প্রশ্ন:</span>
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessageWithText(prompt.text)}
                  disabled={isSending || isAiTyping}
                  className="px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] text-[11px] font-medium border border-slate-200 shadow-2xs whitespace-nowrap transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {prompt.label}
                </button>
              ))}
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
                  placeholder="মুরাদ রহমানকে মেসেজ লিখুন (যেমন: থাম্বনেইল বা ওয়েবসাইট বানাতে চাই)..."
                  className="w-full px-3.5 py-2.5 bg-transparent resize-none text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none max-h-28 leading-relaxed"
                />
              </div>

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isSending || isAiTyping}
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
