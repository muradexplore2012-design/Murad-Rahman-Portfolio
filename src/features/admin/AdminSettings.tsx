import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { SiteSettings } from '../../types';
import { getSiteSettings, saveSiteSettings } from '../../services/firestoreService';
import { starterSettings } from '../../services/starterData';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(starterSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await saveSiteSettings(settings);
      setStatus({ type: 'success', message: 'সাইট সেটিংস সফলভাবে আপডেট হয়েছে!' });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'সেটিংস আপডেট ব্যর্থ হয়েছে।' });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (key: keyof SiteSettings['sectionVisibility']) => {
    setSettings((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [key]: !prev.sectionVisibility[key],
      },
    }));
  };

  if (isLoading) {
    return <div className="text-white text-sm">সেটিংস লোড হচ্ছে...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">এসইও ও সাইট সেটিংস</h1>
          <p className="text-xs text-slate-400 mt-1">
            ওয়েবসাইটের এসইও টাইটেল, মেটা ডেসক্রিপশন এবং সেকশন অন/অফ নিয়ন্ত্রণ করুন।
          </p>
        </div>
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

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SEO Settings */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            এসইও ও মেটাডাটা
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ওয়েবসাইট টাইটেল (Title Tag)
            </label>
            <input
              type="text"
              required
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              সার্চ ইঞ্জিন মেটা বিবরণ (Meta Description)
            </label>
            <textarea
              rows={3}
              value={settings.metaDescription}
              onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              সোশ্যাল প্রিভিউ ইমেজ URL (Open Graph Image)
            </label>
            <input
              type="text"
              value={settings.ogImage || ''}
              onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
              placeholder="/images/murad-rahman.jpg"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
            />
          </div>
        </div>

        {/* Section Visibility Controls */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            হোমপেজ সেকশন নিয়ন্ত্রণ
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            পাবলিক ওয়েবসাইটে কোন কোন সেকশন প্রদর্শন করা হবে তা এখান থেকে অন/অফ করতে পারেন।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'hero', label: 'হিরো ইন্ট্রো সেকশন' },
              { key: 'about', label: 'আমার সম্পর্কে (About Section)' },
              { key: 'services', label: 'সার্ভিসসমূহ (Services Section)' },
              { key: 'projects', label: 'পোর্টফোলিও / প্রজেক্ট গ্রিড' },
              { key: 'skills', label: 'স্কিলস ও টুলস (Skills Section)' },
              { key: 'testimonials', label: 'রিভিউ (Testimonials Section)' },
              { key: 'contact', label: 'যোগাযোগ ফর্ম (Contact Section)' },
            ].map(({ key, label }) => {
              const isVisible = settings.sectionVisibility[key as keyof SiteSettings['sectionVisibility']];
              return (
                <div
                  key={key}
                  onClick={() => toggleSection(key as keyof SiteSettings['sectionVisibility'])}
                  className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                    isVisible
                      ? 'bg-slate-950 border-blue-500/30'
                      : 'bg-slate-950/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="text-xs font-semibold text-white">{label}</span>
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    {isVisible ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> অন
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <EyeOff className="w-3.5 h-3.5" /> অফ
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Settings */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            ফুটার কনটেন্ট
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ফুটার সংক্ষিপ্ত পরিচয়
            </label>
            <input
              type="text"
              value={settings.footerBio || ''}
              onChange={(e) => setSettings({ ...settings, footerBio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              কপিরাইট টেক্সট
            </label>
            <input
              type="text"
              value={settings.copyrightText}
              onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'সেভ হচ্ছে...' : 'সেটিংস সেভ করুন'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
