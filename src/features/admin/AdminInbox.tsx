import React, { useEffect, useState } from 'react';
import {
  Inbox,
  Mail,
  Trash2,
  CheckCircle2,
  X,
  Phone,
  Calendar,
  AlertCircle,
  RefreshCw,
  Search,
  Tag,
  MessageSquare,
  Copy,
  Check,
  Send
} from 'lucide-react';
import type { ContactMessage } from '../../types';
import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage
} from '../../services/firestoreService';

export const AdminInbox: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const formatDateTime = (ts: any) => {
    if (!ts) return 'N/A';
    try {
      const d = ts?.toDate ? ts.toDate() : ts?.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } catch {
      return 'N/A';
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
    const text = `Hello ${name || ''}, Murad Rahman here regarding your portfolio inquiry: ${subject || ''}`;
    return `https://wa.me/${intlDigits}?text=${encodeURIComponent(text)}`;
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const data = await getContactMessages();
      setMessages(data);
    } catch (err: any) {
      console.error(err);
      setStatus({
        type: 'error',
        message: 'মেসেজ লোড করা যায়নি। Firebase Firestore Rules নিশ্চিত করুন।',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        await updateContactMessageStatus(msg.id, { isRead: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleRead = async (msg: ContactMessage, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateContactMessageStatus(msg.id, { isRead: !msg.isRead });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: !msg.isRead } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("আপনি কি নিশ্চিত এই মেসেজটি মুছে ফেলতে চান?")) return;
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

  const filtered = messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">মেসেজ ইনবক্স</h1>
          <p className="text-xs text-slate-500 mt-1">
            পাবলিক পোর্টফোলিও ওয়েবসাইট থেকে আসা সকল ক্লায়েন্ট বার্তা।
          </p>
        </div>

        <button
          onClick={loadMessages}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-[#0284c7] hover:bg-slate-50 rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {status.type === 'error' && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="নাম, ইমেইল অথবা বিষয়ের মাধ্যমে খুঁজুন..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] shadow-xs"
        />
      </div>

      {/* Messages List */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">ইনবক্স লোড হচ্ছে...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">কোনো মেসেজ নেই</p>
            <p className="text-xs text-slate-500">পোর্টফোলিও সাইটের কন্টাক্ট ফর্ম থেকে মেসেজ পাঠানো হলে এখানে জমা হবে।</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-colors ${
                  !msg.isRead ? 'bg-sky-50/40 font-semibold' : ''
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 sm:mt-0 ${
                      !msg.isRead ? 'bg-[#0284c7] shadow-xs' : 'bg-transparent'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-slate-900">{msg.name}</span>
                      <span className="text-xs text-slate-500">&lt;{msg.email}&gt;</span>
                      {msg.phone && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-[#0284c7] font-medium border border-slate-200">
                          {msg.phone}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-700 mt-1">
                      <span className="font-bold text-[#0284c7] mr-2">[{msg.subject}]</span>
                      <span className="text-slate-500 line-clamp-1 inline font-normal">
                        {msg.message}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={(e) => handleToggleRead(msg, e)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 text-xs transition-colors"
                    title={msg.isRead ? 'অপঠিত হিসেবে চিহ্নিত করুন' : 'পঠিত হিসেবে চিহ্নিত করুন'}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${msg.isRead ? 'text-slate-300' : 'text-[#0284c7]'}`} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(msg.id, e)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 text-xs transition-colors"
                    title="মেসেজ মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Premium Message Detail Modal */}
      {selectedMessage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedMessage(null)}
        >
          <div 
            className="relative w-full max-w-2xl rounded-3xl overflow-hidden bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] text-slate-800 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Brand Banner matching the Email Notification header */}
            <div className="bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0284c7] px-6 py-5 text-white relative flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      Murad Rahman Portfolio
                    </h2>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 uppercase tracking-wider">
                      ইনবক্স বার্তা
                    </span>
                  </div>
                  <p className="text-xs text-sky-100 font-medium mt-0.5">
                    নতুন ক্লায়েন্ট যোগাযোগ ও ইনকোয়ারি মেসেজ
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md border border-white/20 shrink-0"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
              
              {/* Structured Key-Value Details Card */}
              <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Client Name */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#0284c7] font-black flex items-center justify-center shrink-0 text-xs">
                      {selectedMessage.name ? selectedMessage.name.slice(0, 2).toUpperCase() : 'CL'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        ক্লায়েন্ট নাম:
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm sm:text-base truncate block mt-0.5">
                        {selectedMessage.name}
                      </span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#0284c7] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        ইমেইল:
                      </span>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="font-bold text-[#0284c7] hover:underline text-xs sm:text-sm truncate block mt-0.5"
                        title={selectedMessage.email}
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        ফোন / WhatsApp:
                      </span>
                      {selectedMessage.phone ? (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {selectedMessage.phone}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(selectedMessage.phone || '', 'phone')}
                            className="text-[10px] text-slate-500 hover:text-slate-800 px-1.5 py-0.5 bg-white border border-slate-200 rounded cursor-pointer"
                            title="ফোন নাম্বার কপি করুন"
                          >
                            {copiedField === 'phone' ? 'কপি হয়েছে' : 'কপি'}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs mt-0.5 block">প্রদান করা হয়নি</span>
                      )}
                    </div>
                  </div>

                  {/* Received Time */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        সময়:
                      </span>
                      <span className="font-semibold text-slate-700 text-xs sm:text-sm block mt-0.5">
                        {formatDateTime(selectedMessage.createdAt)}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Inquiry Subject */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    বিষয়:
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-100 text-[#0284c7] font-bold text-xs sm:text-sm border border-sky-200">
                    <Tag className="w-3.5 h-3.5" />
                    {selectedMessage.subject || 'সাধারণ যোগাযোগ'}
                  </span>
                </div>

              </div>

              {/* Message Box with Accent Border */}
              <div className="rounded-2xl border border-sky-200/80 bg-white p-4 sm:p-5 shadow-xs relative border-l-4 border-l-[#0284c7]">
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#0284c7]" />
                    <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                      মেসেজ বিবরণ:
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedMessage.message, 'message')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600 hover:text-[#0284c7] hover:bg-sky-50 transition-colors cursor-pointer border border-transparent hover:border-sky-200"
                  >
                    {copiedField === 'message' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium select-text">
                  {selectedMessage.message}
                </div>
              </div>

            </div>

            {/* Modal Action Footer */}
            <div className="px-5 sm:px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleToggleRead(selectedMessage, e)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  title={selectedMessage.isRead ? 'অপঠিত হিসেবে চিহ্নিত করুন' : 'পঠিত হিসেবে চিহ্নিত করুন'}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${selectedMessage.isRead ? 'text-slate-400' : 'text-[#0284c7]'}`} />
                  <span>{selectedMessage.isRead ? 'অপঠিত চিহ্নিত করুন' : 'পঠিত চিহ্নিত করুন'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDelete(selectedMessage.id, e)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                  title="মেসেজটি মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>মুছে ফেলুন</span>
                </button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {selectedMessage.phone && (
                  <a
                    href={getWhatsAppUrl(selectedMessage.phone, selectedMessage.name, selectedMessage.subject) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp রিপ্লাই</span>
                  </a>
                )}

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || '')}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>সরাসরি রিপ্লাই দিন</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
