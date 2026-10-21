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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">মেসেজ ইনবক্স</h1>
          <p className="text-xs text-slate-400 mt-1">
            পাবলিক পোর্টফোলিও ওয়েবসাইট থেকে আসা সকল ক্লায়েন্ট বার্তা।
          </p>
        </div>

        <button
          onClick={loadMessages}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {status.type === 'error' && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="নাম, ইমেইল অথবা বিষয়ের মাধ্যমে খুঁজুন..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Messages List */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">ইনবক্স লোড হচ্ছে...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Inbox className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">কোনো মেসেজ নেই</p>
            <p className="text-xs text-slate-500">পোর্টফোলিও সাইটের কন্টাক্ট ফর্ম থেকে মেসেজ পাঠানো হলে এখানে জমা হবে।</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors ${
                  !msg.isRead ? 'bg-blue-600/5 font-semibold' : ''
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 sm:mt-0 ${
                      !msg.isRead ? 'bg-blue-500 shadow-sm shadow-blue-500' : 'bg-transparent'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-white">{msg.name}</span>
                      <span className="text-xs text-slate-400">&lt;{msg.email}&gt;</span>
                      {msg.phone && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400">
                          {msg.phone}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      <span className="font-bold text-blue-400 mr-2">[{msg.subject}]</span>
                      <span className="text-slate-400 line-clamp-1 inline font-normal">
                        {msg.message}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={(e) => handleToggleRead(msg, e)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs"
                    title={msg.isRead ? 'অপঠিত হিসেবে চিহ্নিত করুন' : 'পঠিত হিসেবে চিহ্নিত করুন'}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${msg.isRead ? 'text-slate-600' : 'text-blue-400'}`} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(msg.id, e)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl glass-card rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-4 border-b border-slate-800 mb-6">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-1">
                মেসেজ বিবরণ
              </span>
              <h2 className="text-xl font-bold text-white">{selectedMessage.subject}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span>প্রেরক: <strong className="text-white">{selectedMessage.name}</strong></span>
                <a href={`mailto:${selectedMessage.email}`} className="text-blue-400 hover:underline">
                  {selectedMessage.email}
                </a>
                {selectedMessage.phone && (
                  <span className="text-emerald-400">ফোন: {selectedMessage.phone}</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-normal mb-6 max-h-96 overflow-y-auto">
              {selectedMessage.message}
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || '')}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ইমেইলে উত্তর দিন</span>
              </a>

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
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
