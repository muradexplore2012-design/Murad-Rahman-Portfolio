import React, { useEffect, useState, useRef } from 'react';
import {
  Inbox,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Tag,
  MessageSquare,
  Send,
  ArrowLeft,
  Sparkles,
  CheckCheck
} from 'lucide-react';
import type { ContactMessage } from '../../types';
import {
  subscribeToContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  sendAdminReply
} from '../../services/firestoreService';
import { FormattedMessageText } from '../../components/FormattedMessageText';

interface ClientAvatarProps {
  name: string;
  email?: string;
  photo?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ClientAvatar: React.FC<ClientAvatarProps> = ({
  name,
  email,
  photo,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const [triedUnavatar, setTriedUnavatar] = useState(false);

  // 1. Resolve photo candidate: explicit photo URL
  let initialPhoto = photo?.trim() || null;

  // 2. Local storage check for cached user photo
  if (!initialPhoto && email && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('user_avatar_' + email.toLowerCase().trim());
      if (cached && cached.trim()) initialPhoto = cached.trim();
    } catch {}
  }

  const sizeClasses = {
    sm: 'w-7 h-7 rounded-xl text-xs',
    md: 'w-11 h-11 rounded-2xl text-sm',
    lg: 'w-10 h-10 rounded-2xl text-sm',
  }[size];

  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'CL';

  // Determine current image URL to try
  const currentSrc = !imgError
    ? initialPhoto || (email && !triedUnavatar ? `https://unavatar.io/${encodeURIComponent(email.toLowerCase().trim())}?fallback=false` : null)
    : !triedUnavatar && email && initialPhoto
    ? `https://unavatar.io/${encodeURIComponent(email.toLowerCase().trim())}?fallback=false`
    : null;

  if (currentSrc) {
    return (
      <img
        src={currentSrc}
        alt={name || 'Client'}
        referrerPolicy="no-referrer"
        onError={() => {
          if (!triedUnavatar && email) {
            setTriedUnavatar(true);
          } else {
            setImgError(true);
          }
        }}
        className={`${sizeClasses} object-cover border border-slate-200/90 shadow-2xs shrink-0 bg-slate-100 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-gradient-to-br from-sky-400 to-[#0284c7] text-white font-extrabold flex items-center justify-center shadow-xs shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
};

function getResolvedClientPhoto(msg?: ContactMessage | null): string | undefined {
  if (!msg) return undefined;
  if (msg.userPhoto && msg.userPhoto.trim()) return msg.userPhoto.trim();
  if (msg.replies && msg.replies.length > 0) {
    for (const r of msg.replies) {
      if (r.sender === 'user' && r.senderPhoto && r.senderPhoto.trim()) {
        return r.senderPhoto.trim();
      }
    }
  }
  return undefined;
}

export const AdminInbox: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of chat when messages or replies change
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [selectedMessage?.replies, selectedMessage?.message, selectedMessage?.id]);

  // Real-time Firestore subscription to contact messages
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToContactMessages(
      (data) => {
        setMessages(data);
        setIsLoading(false);

        // Keep selected message updated in real-time when new replies arrive
        setSelectedMessage((prev) => {
          if (!prev) return null;
          const found = data.find((m) => m.id === prev.id);
          return found || null;
        });
      },
      (err) => {
        console.error('Real-time subscription error:', err);
        setStatus({
          type: 'error',
          message: 'মেসেজ লোড করা যায়নি। Firebase Firestore রুলস চেক করুন।',
        });
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSelectChat = async (msg: ContactMessage) => {
    setSelectedMessage(msg);

    // Mark as read if not read yet
    if (!msg.isRead || msg.unreadByAdmin) {
      try {
        await updateContactMessageStatus(msg.id, { isRead: true, unreadByAdmin: false });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true, unreadByAdmin: false } : m))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim() || isSending) return;

    try {
      setIsSending(true);
      const text = replyText.trim();
      setReplyText('');

      await sendAdminReply(selectedMessage.id, text, {
        name: 'Murad Rahman',
        email: 'muradexplore2012@gmail.com',
      });

      // Focus back to input
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    } catch (err: any) {
      console.error('Error sending reply:', err);
      alert(err.message || 'রিপ্লাই পাঠানো যায়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendReply();
    }
  };

  const handleToggleRead = async (msg: ContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const newStatus = !msg.isRead;
      await updateContactMessageStatus(msg.id, { isRead: newStatus, unreadByAdmin: !newStatus });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: newStatus, unreadByAdmin: !newStatus } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage((prev) => (prev ? { ...prev, isRead: newStatus, unreadByAdmin: !newStatus } : null));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('আপনি কি নিশ্চিত এই সম্পূর্ণ চ্যাটটি মুছে ফেলতে চান?')) return;
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err: any) {
      alert(err.message || 'ডিলিট করতে সমস্যা হয়েছে।');
    }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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

  const formatDate = (ts: any): string => {
    if (!ts) return '';
    try {
      const d = ts?.toDate ? ts.toDate() : ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
      if (isNaN(d.getTime())) return '';
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      if (isToday) return formatTime(ts);
      return d.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  const getWhatsAppUrl = (phone?: string, name?: string, subject?: string) => {
    if (!phone) return null;
    const digits = phone.replace(/[^0-9]/g, '');
    if (!digits) return null;
    const intlDigits = digits.startsWith('880')
      ? digits
      : digits.startsWith('0')
      ? '88' + digits
      : digits;
    const text = `Hello ${name || ''}, Murad Rahman from Portfolio here regarding: ${subject || ''}`;
    return `https://wa.me/${intlDigits}?text=${encodeURIComponent(text)}`;
  };

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone?.includes(searchTerm);

    if (filterType === 'unread') {
      return matchesSearch && (!m.isRead || m.unreadByAdmin);
    }
    return matchesSearch;
  });

  const unreadCount = messages.filter((m) => !m.isRead || m.unreadByAdmin).length;

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>মেসেজ ও লাইভ চ্যাট ইনবক্স</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#0284c7] text-white text-xs font-bold shadow-xs">
                {unreadCount}টি নতুন
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            পোর্টফোলিও ক্লায়েন্টদের সাথে সরাসরি ২-ওয়ে লাইভ টেক্সট চ্যাট ও রিপ্লাই।
          </p>
        </div>

        {status.type === 'error' && (
          <div className="p-2.5 px-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{status.message}</span>
          </div>
        )}
      </div>

      {/* Main WhatsApp-Style Card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden flex flex-col md:flex-row h-[720px] max-h-[82vh]">
        
        {/* ============================================================== */}
        {/* LEFT COLUMN: WhatsApp Chat List                                */}
        {/* ============================================================== */}
        <div
          className={`w-full md:w-[360px] lg:w-[400px] border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0 ${
            selectedMessage ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Chat List Search & Filters Header */}
          <div className="p-3.5 border-b border-slate-200/80 bg-white space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="চ্যাট বা ক্লায়েন্ট খুঁজুন..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-sky-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-[#0284c7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                সকল চ্যাট ({messages.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('unread')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterType === 'unread'
                    ? 'bg-[#0284c7] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <span>অপঠিত</span>
                {unreadCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      filterType === 'unread' ? 'bg-white text-[#0284c7]' : 'bg-[#0284c7] text-white'
                    }`}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100/80">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-[#0284c7]" />
                <span>চ্যাট লোড হচ্ছে...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center text-slate-400 space-y-2">
                <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">কোনো চ্যাট পাওয়া যায়নি</p>
                <p className="text-[11px] text-slate-400">
                  {searchTerm ? 'অনুসন্ধানের সাথে কোনো মেসেজ মিলছে না' : 'পাবলিক সাইট থেকে মেসেজ আসলে এখানে দেখাবে।'}
                </p>
              </div>
            ) : (
              filtered.map((msg) => {
                const isSelected = selectedMessage?.id === msg.id;
                const isUnread = !msg.isRead || msg.unreadByAdmin;
                const lastPreview = msg.lastMessage || msg.message;
                const totalReplies = msg.replies?.length || 0;

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectChat(msg)}
                    className={`p-3.5 sm:p-4 flex items-start gap-3 cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? 'bg-sky-50/80 border-l-[#0284c7]'
                        : isUnread
                        ? 'bg-white border-l-sky-400 hover:bg-slate-50'
                        : 'bg-white/60 border-l-transparent hover:bg-slate-50'
                    }`}
                  >
                    {/* User Avatar with Google Photo / Unavatar & active green dot */}
                    <div className="relative shrink-0">
                      <ClientAvatar
                        name={msg.name}
                        email={msg.email}
                        photo={getResolvedClientPhoto(msg)}
                        size="md"
                      />
                      {/* Active indicator dot */}
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>

                    {/* Chat Item Info */}
                    <div className="flex-1 min-w-0">
                      {/* Row 1: Name & Timestamp */}
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`text-xs sm:text-sm truncate ${
                            isUnread ? 'font-black text-slate-900' : 'font-bold text-slate-800'
                          }`}
                        >
                          {msg.name}
                        </h3>
                        <span
                          className={`text-[10px] shrink-0 ${
                            isUnread ? 'text-[#0284c7] font-bold' : 'text-slate-400'
                          }`}
                        >
                          {formatDate(msg.lastMessageAt || msg.createdAt)}
                        </span>
                      </div>

                      {/* Row 2: Subject Badge */}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-md bg-sky-100 text-[#0284c7] truncate border border-sky-200">
                          {msg.subject || 'সাধারণ ইনকোয়ারি'}
                        </span>
                        {totalReplies > 0 && (
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">
                            ({totalReplies + 1} মেসেজ)
                          </span>
                        )}
                      </div>

                      {/* Row 3: Message preview & Unread badge */}
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p
                          className={`text-[11px] truncate flex-1 ${
                            isUnread ? 'text-slate-900 font-bold' : 'text-slate-500'
                          }`}
                        >
                          {msg.lastSender === 'admin' ? (
                            <span className="text-[#0284c7] font-semibold">আপনি: </span>
                          ) : null}
                          {lastPreview}
                        </p>

                        {isUnread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shrink-0 animate-pulse shadow-xs" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: WhatsApp Active Chat Conversation Area          */}
        {/* ============================================================== */}
        <div
          className={`flex-1 flex flex-col bg-slate-50/70 h-full relative ${
            !selectedMessage ? 'hidden md:flex' : 'flex'
          }`}
        >
          {selectedMessage ? (
            <>
              {/* Active Chat Header */}
              <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shadow-xs shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button to Chat List */}
                  <button
                    type="button"
                    onClick={() => setSelectedMessage(null)}
                    className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                    title="সব চ্যাটে ফিরে যান"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Client Avatar with Google Photo / Unavatar */}
                  <div className="relative shrink-0">
                    <ClientAvatar
                      name={selectedMessage.name}
                      email={selectedMessage.email}
                      photo={getResolvedClientPhoto(selectedMessage)}
                      size="lg"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>

                  {/* Client Name & Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-black text-slate-900 truncate">
                        {selectedMessage.name}
                      </h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        সরাসরি ক্লায়েন্ট
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                      <span className="truncate">{selectedMessage.email}</span>
                      {selectedMessage.phone && (
                        <>
                          <span>•</span>
                          <span className="font-bold text-slate-700">{selectedMessage.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Toggle Read */}
                  <button
                    type="button"
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl text-xs transition-colors"
                    title={selectedMessage.isRead ? 'অপঠিত চিহ্নিত করুন' : 'পঠিত চিহ্নিত করুন'}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${selectedMessage.isRead ? 'text-slate-300' : 'text-[#0284c7]'}`}
                    />
                  </button>

                  {/* Delete Conversation */}
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition-colors"
                    title="চ্যাটটি ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Stream (Scrollable WhatsApp Body) */}
              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-slate-100/50 to-slate-50/80"
              >
                {/* Subject & Inquiry Info Box */}
                <div className="max-w-md mx-auto my-2 p-3 bg-white/90 backdrop-blur-xs rounded-2xl border border-sky-100 text-center shadow-xs">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284c7] mb-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>বিষয়: {selectedMessage.subject || 'সাধারণ যোগাযোগ'}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ইনকোয়ারি পাঠানো হয়েছে: {formatDate(selectedMessage.createdAt)} •{' '}
                    {formatTime(selectedMessage.createdAt)}
                  </p>
                </div>

                {/* 1. Client's Initial Message (Left bubble with Avatar) */}
                <div className="flex items-start gap-2 max-w-[85%] sm:max-w-[75%]">
                  <ClientAvatar
                    name={selectedMessage.name}
                    email={selectedMessage.email}
                    photo={getResolvedClientPhoto(selectedMessage)}
                    size="sm"
                    className="mt-4"
                  />
                  <div className="flex flex-col items-start space-y-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-500 ml-2">
                      {selectedMessage.name} (ক্লায়েন্ট)
                    </span>
                    <div className="bg-white text-slate-900 rounded-2xl rounded-tl-xs p-3.5 sm:p-4 shadow-sm border border-slate-200/90 relative group">
                      <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
                        <FormattedMessageText text={selectedMessage.message} isLight={true} />
                      </p>
                      <div className="flex items-center justify-between gap-3 mt-2 pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                        <span>{formatTime(selectedMessage.createdAt)}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedMessage.message, 'initial')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#0284c7] cursor-pointer"
                          title="মেসেজ কপি করুন"
                        >
                          {copiedField === 'initial' ? 'কপি হয়েছে' : 'কপি'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Thread Replies (Client vs Admin conversation) */}
                {selectedMessage.replies?.map((rep, idx) => {
                  const isAdmin = rep.sender === 'admin';

                  return (
                    <div
                      key={rep.id || idx}
                      className={`flex items-start gap-2 max-w-[85%] sm:max-w-[75%] ${
                        isAdmin ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      }`}
                    >
                      {isAdmin ? (
                        <img
                          src="/images/murad-rahman.jpg"
                          alt="Murad Rahman"
                          className="w-7 h-7 rounded-xl object-cover border border-sky-300 mt-4 shrink-0 shadow-2xs"
                        />
                      ) : (
                        <ClientAvatar
                          name={rep.senderName || selectedMessage.name}
                          email={rep.senderEmail || selectedMessage.email}
                          photo={rep.senderPhoto || getResolvedClientPhoto(selectedMessage)}
                          size="sm"
                          className="mt-4"
                        />
                      )}

                      <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} space-y-1 min-w-0`}>
                        <span
                          className={`text-[10px] font-bold ${
                            isAdmin ? 'text-[#0284c7] mr-2' : 'text-slate-500 ml-2'
                          }`}
                        >
                          {isAdmin ? 'মুরাদ রহমান (Admin)' : rep.senderName || 'ক্লায়েন্ট'}
                        </span>

                        <div
                          className={`p-3.5 sm:p-4 rounded-2xl shadow-sm text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text relative group ${
                            isAdmin
                              ? 'bg-[#0284c7] text-white rounded-tr-xs'
                              : 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/90'
                          }`}
                        >
                          <p>
                            <FormattedMessageText text={rep.text} isLight={!isAdmin} />
                          </p>

                          <div
                            className={`flex items-center justify-end gap-1.5 mt-2 pt-1 text-[10px] ${
                              isAdmin ? 'text-sky-200 border-t border-sky-500/40' : 'text-slate-400 border-t border-slate-100'
                            }`}
                          >
                            <span>{formatTime(rep.createdAt)}</span>
                            {isAdmin && (
                              <span title="পাঠানো হয়েছে">
                                <CheckCheck className="w-3.5 h-3.5 text-sky-200" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Template Replies for Admin */}
              <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
                <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#0284c7]" />
                  কুইক রিপ্লাই:
                </span>
                <button
                  type="button"
                  onClick={() => setReplyText('ধন্যবাদ, আমি আপনার কাজটি দ্রুত শুরু করছি।')}
                  className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] rounded-lg border border-slate-200 shrink-0 cursor-pointer transition-colors"
                >
                  কাজ শুরু করছি
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setReplyText('আপনার সাথে কথা বলে ভালো লাগলো। কাজের বিস্তারিত জানাতে পারবেন কি?')
                  }
                  className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] rounded-lg border border-slate-200 shrink-0 cursor-pointer transition-colors"
                >
                  বিস্তারিত জানতে চাই
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setReplyText('আপনার প্রজেক্টের বাজেট ও সময়সীমা কত নির্ধারণ করেছেন?')
                  }
                  className="px-2.5 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] rounded-lg border border-slate-200 shrink-0 cursor-pointer transition-colors"
                >
                  বাজেট ও ডেডলাইন
                </button>
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-end gap-2.5 shrink-0">
                <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 focus-within:border-[#0284c7] focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 transition-all">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="এখানে রিপ্লাই মেসেজ লিখুন..."
                    className="w-full px-4 py-2.5 bg-transparent resize-none text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none max-h-32 leading-relaxed"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isSending}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white flex items-center justify-center shrink-0 shadow-md transition-all disabled:opacity-40 cursor-pointer hover:scale-105 active:scale-95"
                  title="মেসেজ পাঠান"
                >
                  {isSending ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Empty State when no chat is selected (WhatsApp Web style) */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
              <div className="w-20 h-20 rounded-3xl bg-sky-50 border border-sky-100 text-[#0284c7] flex items-center justify-center mb-4 shadow-sm">
                <MessageSquare className="w-10 h-10" />
              </div>
              <h2 className="text-lg font-black text-slate-800">মুরাদ রহমান লাইভ চ্যাট ইনবক্স</h2>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                ক্লায়েন্টের সাথে সরাসরি কথা বলতে এবং তাৎক্ষণিক রিপ্লাই দিতে বাঁপাশের তালিকা থেকে একটি চ্যাট
                নির্বাচন করুন।
              </p>
              <div className="mt-6 flex items-center gap-1.5 text-[11px] text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
                <span>🔒 রিয়েল-টাইম নিরাপদ টেক্সট মেসেজিং</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
