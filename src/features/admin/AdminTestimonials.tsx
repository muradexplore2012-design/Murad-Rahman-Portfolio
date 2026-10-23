import React, { useEffect, useState } from 'react';
import { MessageSquareQuote, Plus, Trash2, CheckCircle, AlertCircle, Save, X, Star, Eye, EyeOff, Edit2 } from 'lucide-react';
import type { Testimonial } from '../../types';
import { getTestimonials, saveTestimonial, deleteTestimonial } from '../../services/firestoreService';

export const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await getTestimonials(false);
      setTestimonials(data);
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: 'রিভিউ লোড করতে সমস্যা হয়েছে।' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem({
      clientName: '',
      clientRole: '',
      clientCompany: '',
      quote: '',
      rating: 5,
      isApproved: true,
      sortOrder: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`আপনি কি "${name}" এর রিভিউ মুছে ফেলতে চান?`)) return;
    try {
      await deleteTestimonial(id);
      setStatus({ type: 'success', message: 'রিভিউ মুছে ফেলা হয়েছে।' });
      await loadTestimonials();
    } catch (err: any) {
      alert(err.message || 'ডিলিট করতে সমস্যা হয়েছে।');
    }
  };

  const handleToggleApproval = async (item: Testimonial) => {
    try {
      await saveTestimonial({ id: item.id, isApproved: !item.isApproved });
      await loadTestimonials();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.clientName || !editingItem.quote) {
      alert('অনুগ্রহ করে ক্লায়েন্টের নাম ও রিভিউ লিখুন।');
      return;
    }

    try {
      setIsSaving(true);
      await saveTestimonial(editingItem);
      setIsModalOpen(false);
      setEditingItem(null);
      setStatus({ type: 'success', message: 'রিভিউ সফলভাবে সেভ হয়েছে!' });
      await loadTestimonials();
    } catch (err: any) {
      alert(err.message || 'সেভ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">ক্লায়েন্ট রিভিউ (Reviews CMS)</h1>
          <p className="text-xs text-slate-500 mt-1">
            শুধুমাত্র আসল ক্লায়েন্টের রিভিউ যুক্ত করুন। কোনো রিভিউ না থাকলে পাবলিক সাইটে এই সেকশন স্বয়ংক্রিয়ভাবে লুকিয়ে থাকে।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন রিভিউ যোগ করুন</span>
        </button>
      </div>

      {status.type !== 'idle' && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            status.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Testimonials List */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">রিভিউ লোড হচ্ছে...</div>
        ) : testimonials.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <MessageSquareQuote className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">কোনো রিভিউ এখনো যোগ করা হয়নি</p>
            <p className="text-xs text-slate-500">
              (পরিকল্পনা অনুসারে কোনো কৃত্রিম বা ফেক রিভিউ দেখানো হয় না। আসল কাজ সম্পন্ন করার পর এখানে ক্লায়েন্টের রিভিউ যুক্ত করুন)
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{item.clientName}</h3>
                    {(item.clientRole || item.clientCompany) && (
                      <span className="text-xs text-slate-500">
                        ({item.clientRole} {item.clientCompany ? `@ ${item.clientCompany}` : ''})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 italic max-w-xl">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
                    title="এডিট করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleApproval(item)}
                    className={`p-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      item.isApproved
                        ? 'text-[#15803d] bg-emerald-50 hover:bg-emerald-100'
                        : 'text-slate-400 bg-slate-100 hover:text-slate-600'
                    }`}
                    title={item.isApproved ? 'অনুমোদিত' : 'অননুমোদিত'}
                  >
                    {item.isApproved ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.clientName)}
                    className="p-2 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="ডিলিট করুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editingItem.id ? 'রিভিউ এডিট করুন' : 'নতুন ক্লায়েন্ট রিভিউ'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ক্লায়েন্টের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.clientName}
                  onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] focus:border-[#15803d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">পদবী</label>
                  <input
                    type="text"
                    value={editingItem.clientRole || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, clientRole: e.target.value })}
                    placeholder="Founder / CEO"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] focus:border-[#15803d]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">কোম্পানি</label>
                  <input
                    type="text"
                    value={editingItem.clientCompany || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, clientCompany: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] focus:border-[#15803d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মতামত / কোটেশন *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.quote}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  placeholder="মুরাদ রহমানের ডিজাইন খুবই চমৎকার..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#15803d] focus:border-[#15803d]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
