import React, { useEffect, useState } from 'react';
import { Layers, Plus, Edit2, Trash2, CheckCircle, AlertCircle, Save, X, Eye, EyeOff } from 'lucide-react';
import type { Service } from '../../types';
import { getServices, saveService, deleteService } from '../../services/firestoreService';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      iconName: 'Palette',
      startingPrice: '',
      deliveryTime: '',
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title || !editingService.description) {
      alert('অনুগ্রহ করে সার্ভিসের শিরোনাম ও বিবরণ লিখুন।');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">সার্ভিস ম্যানেজমেন্ট</h1>
          <p className="text-xs text-slate-400 mt-1">
            আপনার ডিজাইন ও ওয়েব ডেভেলপমেন্টের সেবাসমূহ নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সার্ভিস যোগ করুন</span>
        </button>
      </div>

      {status.type !== 'idle' && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
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
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">সার্ভিস লোড হচ্ছে...</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Layers className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">কোনো সার্ভিস যোগ করা হয়নি</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {services.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
                      {item.iconName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-1">
                    {item.description}
                  </p>
                  {(item.startingPrice || item.deliveryTime) && (
                    <div className="flex gap-4 text-[11px] text-slate-500 mt-1">
                      {item.startingPrice && <span>শুরু: {item.startingPrice}</span>}
                      {item.deliveryTime && <span>সময়: {item.deliveryTime}</span>}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleTogglePublish(item)}
                    className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                      item.isPublished
                        ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                        : 'text-slate-500 bg-slate-800 hover:text-slate-300'
                    }`}
                    title={item.isPublished ? 'পাবলিশড' : 'ড্রাফট'}
                  >
                    {item.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 rounded-lg text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                    title="এডিট করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="p-2 rounded-lg text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">
              {editingService.id ? 'সার্ভিস এডিট করুন' : 'নতুন সার্ভিস যোগ করুন'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  সার্ভিসের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="যেমন: Graphics & Visual Design"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  আইকন টাইপ
                </label>
                <select
                  value={editingService.iconName}
                  onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Palette">Palette (Graphics/Design)</option>
                  <option value="Globe">Globe (Web Development)</option>
                  <option value="Layout">Layout (Blogger / Templates)</option>
                  <option value="Sparkles">Sparkles (UI/UX / Creative)</option>
                  <option value="Code">Code (Development)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  সার্ভিস বিবরণ *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
                  placeholder="এই সার্ভিসে ক্লায়েন্ট কি কি সুবিধা পাবেন..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  মূল ফিচারসমূহ (প্রতি লাইনে একটি করে লিখুন)
                </label>
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="লোগো ও সোশ্যাল ব্যানার ডিজাইন&#10;ভেক্টর ফরম্যাট ফাইল&#10;দ্রুত ডেলিভারি"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    শুরুর মূল্য (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={editingService.startingPrice || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, startingPrice: e.target.value })
                    }
                    placeholder="আলোচনা সাপেক্ষে"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ডেলিভারি সময় (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={editingService.deliveryTime || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, deliveryTime: e.target.value })
                    }
                    placeholder="২-৩ কার্যদিবস"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="srvPublish"
                  checked={editingService.isPublished}
                  onChange={(e) =>
                    setEditingService({ ...editingService, isPublished: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800"
                />
                <label htmlFor="srvPublish" className="text-xs font-semibold text-slate-300 cursor-pointer">
                  পাবলিক সাইটে প্রদর্শন করুন
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
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
