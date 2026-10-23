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
  Eye,
  RefreshCw,
  Search
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
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-800">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-semibold text-[#0284c7] uppercase tracking-wider block mb-1">
                মেসেজ বিবরণ
              </span>
              <h2 className="text-xl font-bold text-slate-900">{selectedMessage.subject}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span>প্রেরক: <strong className="text-slate-900">{selectedMessage.name}</strong></span>
                <a href={`mailto:${selectedMessage.email}`} className="text-[#0284c7] hover:underline">
                  {selectedMessage.email}
                </a>
                {selectedMessage.phone && (
                  <span className="text-[#0284c7] font-medium">ফোন: {selectedMessage.phone}</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-normal mb-6 max-h-96 overflow-y-auto">
              {selectedMessage.message}
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || '')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ইমেইলে উত্তর দিন</span>
              </a>

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
