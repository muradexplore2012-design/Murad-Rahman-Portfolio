import React, { useEffect, useState } from 'react';
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  Star,
  Eye,
  EyeOff,
  Edit2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import type { Testimonial } from '../../types';
import { getTestimonials, saveTestimonial, deleteTestimonial } from '../../services/firestoreService';
import { uploadAsset } from '../../services/storageService';

export const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Testimonial> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
      clientRole: 'Client',
      clientCompany: '',
      clientPhoto: '',
      quote: '',
      rating: 5,
      isApproved: true,
      sortOrder: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem({
      ...item,
      rating: item.rating || 5,
      clientPhoto: item.clientPhoto || '',
    });
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadAsset(file, 'testimonials');
      setEditingItem((prev) => (prev ? { ...prev, clientPhoto: url } : null));
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      alert('ছবি আপলোড করতে সমস্যা হয়েছে: ' + (err.message || 'Error'));
    } finally {
      setIsUploading(false);
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
            ক্লায়েন্টের রিভিউ এবং ছবি যুক্ত ও পরিচালনা করুন।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন রিভিউ যোগ করুন</span>
        </button>
      </div>

      {status.type !== 'idle' && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            status.type === 'success'
              ? 'bg-sky-50 border border-sky-200 text-sky-800'
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
              (আসল কাজ সম্পন্ন করার পর এখানে ক্লায়েন্টের রিভিউ ও ছবি যুক্ত করুন)
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  {/* Client Photo Thumbnail */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                    {item.clientPhoto ? (
                      <img
                        src={item.clientPhoto}
                        alt={item.clientName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-sky-100 text-[#0284c7] font-bold text-sm flex items-center justify-center">
                        {(item.clientName || 'C')[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{item.clientName}</h3>
                      {(item.clientRole || item.clientCompany) && (
                        <span className="text-xs text-slate-500">
                          ({item.clientRole || 'Client'}{item.clientCompany ? ` @ ${item.clientCompany}` : ''})
                        </span>
                      )}
                      {/* Rating stars */}
                      <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 italic max-w-xl">
                      "{item.quote}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-lg text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors cursor-pointer"
                    title="এডিট করুন (ছবি ও তথ্য)"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleApproval(item)}
                    className={`p-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      item.isApproved
                        ? 'text-[#0284c7] bg-sky-50 hover:bg-sky-100'
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
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl text-slate-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 mb-5">
              {editingItem.id ? 'ক্লায়েন্ট রিভিউ ও ছবি এডিট করুন' : 'নতুন ক্লায়েন্ট রিভিউ ও ছবি যোগ করুন'}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Client Photo Section */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  ক্লায়েন্টের ছবি (Client Photo)
                </label>
                <div className="flex items-center gap-4">
                  {/* Photo Preview Circle */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-slate-300 shrink-0 flex items-center justify-center shadow-xs">
                    {editingItem.clientPhoto ? (
                      <img
                        src={editingItem.clientPhoto}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '';
                        }}
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-200 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'ছবি আপলোড হচ্ছে...' : 'ছবি আপলোড করুন (Upload)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      value={editingItem.clientPhoto || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, clientPhoto: e.target.value })}
                      placeholder="অথবা সরাসরি ছবির লিঙ্ক দিন (Image URL)"
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                </div>
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ক্লায়েন্টের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.clientName}
                  onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                  placeholder="যেমন: মুন্না ইসলাম"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
              </div>

              {/* Role & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">পদবী (Role)</label>
                  <input
                    type="text"
                    value={editingItem.clientRole || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, clientRole: e.target.value })}
                    placeholder="যেমন: Client / Founder"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">কোম্পানি / প্রতিষ্ঠান (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={editingItem.clientCompany || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, clientCompany: e.target.value })}
                    placeholder="যেমন: Tech Firm"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                  />
                </div>
              </div>

              {/* Star Rating Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  রেটিং (Star Rating)
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      type="button"
                      key={starVal}
                      onClick={() => setEditingItem({ ...editingItem, rating: starVal })}
                      className="p-1 text-xl transition-transform hover:scale-110 cursor-pointer"
                    >
                      <span className={starVal <= (editingItem.rating || 5) ? 'text-amber-400' : 'text-slate-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {editingItem.rating || 5} স্টার
                  </span>
                </div>
              </div>

              {/* Review Quote */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মতামত / কোটেশন *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingItem.quote}
                  onChange={(e) => setEditingItem({ ...editingItem, quote: e.target.value })}
                  placeholder="মুরাদ রহমানের ডিজাইন খুবই চমৎকার এবং সময়মতো কাজ পেয়েছি..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-6 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
