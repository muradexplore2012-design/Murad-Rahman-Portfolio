import React, { useEffect, useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
  X,
  Eye,
  EyeOff,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import type { Service } from '../../types';
import { getServices, saveService, deleteService } from '../../services/firestoreService';
import { uploadAsset } from '../../services/storageService';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [featuresInput, setFeaturesInput] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await getServices(false);
      setServices(data);
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: 'সার্ভিস লোড করতে সমস্যা হয়েছে।' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService({
      title: '',
      description: '',
      coverImage: '',
      badgeText: 'শুরু ২৯৯৳ থেকে',
      startingPrice: '২৯৯৳',
      deliveryTime: '3-5Days Delivery',
      ratingText: '4.9 (210+ Reviews)',
      iconName: 'Palette',
      features: [],
      isPublished: true,
      sortOrder: services.length + 1,
    });
    setFeaturesInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingService({ ...service });
    setFeaturesInput(service.features?.join('\n') || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`আপনি কি "${title}" সার্ভিসটি মুছে ফেলতে চান?`)) return;
    try {
      await deleteService(id);
      setStatus({ type: 'success', message: 'সার্ভিস মুছে ফেলা হয়েছে।' });
      await loadServices();
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'ডিলিট করতে সমস্যা হয়েছে।' });
    }
  };

  const handleTogglePublish = async (service: Service) => {
    try {
      await saveService({ id: service.id, isPublished: !service.isPublished });
      await loadServices();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadAsset(file, 'services');
      setEditingService((prev) => (prev ? { ...prev, coverImage: url } : null));
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      alert('ছবি আপলোড করতে সমস্যা হয়েছে: ' + (err.message || 'Error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) {
      alert('অনুগ্রহ করে সার্ভিসের শিরোনাম লিখুন।');
      return;
    }

    try {
      setIsSaving(true);
      const parsedFeatures = featuresInput
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      await saveService({
        ...editingService,
        description: editingService.description || '',
        features: parsedFeatures,
      });

      setIsModalOpen(false);
      setEditingService(null);
      setStatus({ type: 'success', message: 'সার্ভিস সফলভাবে সেভ হয়েছে!' });
      await loadServices();
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'সেভ করতে সমস্যা হয়েছে।' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">সার্ভিস ম্যানেজমেন্ট</h1>
          <p className="text-xs text-slate-500 mt-1">
            আপনার ডিজাইন, মার্কেটিং ও ডেভেলপমেন্ট সেবাসমূহ নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সার্ভিস যোগ করুন</span>
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

      {/* Services List */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">সার্ভিস লোড হচ্ছে...</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Layers className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">কোনো সার্ভিস যোগ করা হয়নি</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {services.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-[#072d17] shrink-0 border border-slate-200 flex items-center justify-center">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-sky-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      {item.startingPrice && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-50 text-[#0284c7] border border-sky-200 font-semibold">
                          {item.startingPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 max-w-xl line-clamp-1">
                      {item.description || item.title}
                    </p>
                    <div className="flex flex-wrap gap-3 text-[11px] text-slate-600 mt-1">
                      {item.deliveryTime && (
                        <span className="font-semibold text-slate-800">
                          ⏱ {item.deliveryTime}
                        </span>
                      )}
                      {item.ratingText && (
                        <span className="text-slate-500">
                          ⭐ {item.ratingText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                      item.isPublished
                        ? 'text-[#0284c7] bg-sky-50 hover:bg-sky-100'
                        : 'text-slate-400 bg-slate-100 hover:text-slate-600'
                    }`}
                    title={item.isPublished ? 'পাবলিশড' : 'ড্রাফট'}
                  >
                    {item.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-lg text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors"
                    title="এডিট করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
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
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {editingService.id ? 'সার্ভিস এডিট করুন' : 'নতুন সার্ভিস যোগ করুন'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সার্ভিস ব্যানার ছবি (Cover Image)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingService.coverImage || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, coverImage: e.target.value })
                    }
                    placeholder="/images/service-facebook-ads.png অথবা ইমেজ লিঙ্ক"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isUploading ? 'আপলোড হচ্ছে...' : 'ছবি আপলোড'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
                {editingService.coverImage && (
                  <div className="mt-2 w-40 aspect-[299/240] rounded-lg overflow-hidden border border-slate-200 bg-[#072d17]">
                    <img
                      src={editingService.coverImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সার্ভিসের শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="যেমন: I will create Facebook Ads that grow your brand"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
              </div>

              {/* Delivery Time & Ratings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ডেলিভারি সময় (Delivery Time)
                  </label>
                  <input
                    type="text"
                    value={editingService.deliveryTime || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, deliveryTime: e.target.value })
                    }
                    placeholder="যেমন: 3-5Days Delivery"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    রেটিং ও রিভিউ (Rating & Reviews)
                  </label>
                  <input
                    type="text"
                    value={editingService.ratingText || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, ratingText: e.target.value })
                    }
                    placeholder="যেমন: 4.9 (210+ Reviews)"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>
              </div>

              {/* Price & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    শুরুর মূল্য
                  </label>
                  <input
                    type="text"
                    value={editingService.startingPrice || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, startingPrice: e.target.value })
                    }
                    placeholder="যেমন: ২৯৯৳"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ব্যাজ টেক্সট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={editingService.badgeText || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, badgeText: e.target.value })
                    }
                    placeholder="যেমন: শুরু ২৯৯৳ থেকে"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সংক্ষিপ্ত বিবরণ (বা ব্যানারের সাবটাইটেল)
                </label>
                <textarea
                  rows={2}
                  value={editingService.description || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  placeholder="যেমন: ফেসবুক অ্যাডস দিয়ে আপনার ব্র্যান্ড বাড়ান।"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মূল ফিচারসমূহ (ঐচ্ছিক, প্রতি লাইনে একটি)
                </label>
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Targeted Audience Research&#10;High-Converting Creatives&#10;Pixel Setup"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] font-mono"
                />
              </div>

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="srvPublish"
                  checked={editingService.isPublished}
                  onChange={(e) =>
                    setEditingService({ ...editingService, isPublished: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#0284c7] accent-[#0284c7] border-slate-300"
                />
                <label htmlFor="srvPublish" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  পাবলিক সাইটে প্রদর্শন করুন
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
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
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'সেভ হচ্ছে...' : 'সার্ভিস সেভ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
