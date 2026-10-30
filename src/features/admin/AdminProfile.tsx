import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, AlertCircle, Upload, Eye } from 'lucide-react';
import type { SiteProfile } from '../../types';
import { getSiteProfile, saveSiteProfile } from '../../services/firestoreService';
import { uploadAsset } from '../../services/storageService';
import { starterProfile } from '../../services/starterData';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<SiteProfile>(starterProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingAbout, setIsUploadingAbout] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteProfile();
        if (data) {
          setProfile({
            ...starterProfile,
            ...data,
            socialLinks: {
              ...starterProfile.socialLinks,
              ...(data.socialLinks || {})
            }
          });
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingProfile(true);
      const url = await uploadAsset(file, 'profile');
      setProfile((prev) => ({ ...prev, profileImage: url }));
      setStatus({ type: 'success', message: 'প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে!' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'ইমেজ আপলোড ব্যর্থ হয়েছে।' });
    } finally {
      setIsUploadingProfile(false);
      e.target.value = '';
    }
  };

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAbout(true);
      const url = await uploadAsset(file, 'about');
      setProfile((prev) => ({ ...prev, aboutImage: url }));
      setStatus({ type: 'success', message: 'ওয়ার্কস্পেস ছবি সফলভাবে আপলোড হয়েছে!' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'ইমেজ আপলোড ব্যর্থ হয়েছে।' });
    } finally {
      setIsUploadingAbout(false);
      e.target.value = '';
    }
  };

  const handleCounterChange = (index: number, field: string, value: any) => {
    const newCounters = [...(profile.counters || [])];
    if (newCounters[index]) {
      newCounters[index] = { ...newCounters[index], [field]: value };
      setProfile({ ...profile, counters: newCounters });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setStatus({ type: 'idle', message: '' });
      await saveSiteProfile(profile);
      setStatus({ type: 'success', message: 'প্রোফাইল তথ্য সফলভাবে সেভ করা হয়েছে!' });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'সেভ করতে সমস্যা হয়েছে।' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-slate-600 text-sm">প্রোফাইল ডেটা লোড হচ্ছে...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">প্রোফাইল ও পরিচিতি</h1>
          <p className="text-xs text-slate-500 mt-1">
            আপনার নাম, বায়োগ্রাফি, ছবি ও যোগাযোগের তথ্য এখান থেকে সরাসরি এডিট করুন।
          </p>
        </div>
      </div>

      {status.type === 'success' && (
        <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      {status.type === 'error' && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Image & Avatar */}
        <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            ১. হিরো সেকশনের প্রোফাইল ছবি
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-50 shrink-0">
              <img
                src={profile.profileImage || "/images/murad-rahman-hero.png"}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                ইমেজ URL অথবা আপলোড করুন
              </label>
              <input
                type="text"
                value={profile.profileImage}
                onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
                placeholder="/images/murad-rahman-hero.png"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
              />
              <div className="pt-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>{isUploadingProfile ? 'আপলোড হচ্ছে...' : 'নতুন ফটো আপলোড করুন'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                    disabled={isUploadingProfile}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* About Section Workspace Photo */}
        <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            ২. 'আমার সম্পর্কে' সেকশনের ওয়ার্কস্পেস ছবি
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-24 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 shrink-0">
              <img
                src={profile.aboutImage || "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80"}
                alt="Workspace"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                ওয়ার্কস্পেস ইমেজ URL অথবা আপলোড করুন
              </label>
              <input
                type="text"
                value={profile.aboutImage || ''}
                onChange={(e) => setProfile({ ...profile, aboutImage: e.target.value })}
                placeholder="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e..."
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
              />
              <div className="pt-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>{isUploadingAbout ? 'আপলোড হচ্ছে...' : 'ওয়ার্কস্পেস ছবি আপলোড'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAboutImageUpload}
                    className="hidden"
                    disabled={isUploadingAbout}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Identity Information */}
        <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            মৌলিক তথ্য
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                আপনার নাম
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                হেডলাইন / পদবী
              </label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                স্বাগতম সম্ভাষণ (Greeting)
              </label>
              <input
                type="text"
                value={profile.greeting}
                onChange={(e) => setProfile({ ...profile, greeting: e.target.value })}
                placeholder="Hi There,"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                অবস্থান (Location)
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              হিরো সেকশনের বিবরণ (Hero Subheadline / Bio)
            </label>
            <textarea
              rows={2}
              value={profile.heroSubheadline || ''}
              onChange={(e) => setProfile({ ...profile, heroSubheadline: e.target.value })}
              placeholder="I'm a passionate Graphic Designer & Web Developer specializing in high-impact YouTube thumbnails..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              আমার সম্পর্কে অনুচ্ছেদ ১ (About Paragraph 1)
            </label>
            <textarea
              rows={3}
              value={profile.aboutBio}
              onChange={(e) => setProfile({ ...profile, aboutBio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              আমার সম্পর্কে অনুচ্ছেদ ২ (About Paragraph 2)
            </label>
            <textarea
              rows={3}
              value={profile.aboutSecondaryBio || ''}
              onChange={(e) => setProfile({ ...profile, aboutSecondaryBio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] leading-relaxed"
            />
          </div>
        </div>

        {/* 3 Counter Statistics Boxes */}
        <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            ৩টি স্ট্যাটিস্টিকস কাউন্টার বক্স
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            'আমার সম্পর্কে' সেকশনের নিচে প্রদর্শিত ৩টি সবুজ বক্সের সংখ্যা ও লেবেল পরিবর্তন করুন।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(profile.counters || []).map((counter, idx) => (
              <div key={counter.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-[#0284c7] block uppercase">
                  বক্স {idx + 1}
                </span>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">কাউন্টার মান (Value)</label>
                  <input
                    type="text"
                    value={counter.value}
                    onChange={(e) => handleCounterChange(idx, 'value', e.target.value)}
                    placeholder="550"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">সাফিক্স (যেমন +)</label>
                  <input
                    type="text"
                    value={counter.suffix || '+'}
                    onChange={(e) => handleCounterChange(idx, 'suffix', e.target.value)}
                    placeholder="+"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">লেবেল (Label)</label>
                  <input
                    type="text"
                    value={counter.label}
                    onChange={(e) => handleCounterChange(idx, 'label', e.target.value)}
                    placeholder="Project Completed"
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Availability & Contact Channels */}
        <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            যোগাযোগ ও জীবনবৃত্তান্ত (CV)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                পাবলিক ইমেইল
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                হোয়াটসঅ্যাপ / ফোন নম্বর
              </label>
              <input
                type="text"
                value={profile.whatsapp || ''}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              জীবনবৃত্তান্ত (Resume / CV) ড্রাইভ লিঙ্ক
            </label>
            <input
              type="url"
              value={profile.resumeUrl || ''}
              onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
              placeholder="https://drive.google.com/file/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] disabled:opacity-50 text-white font-bold rounded-xl shadow-md shadow-sky-700/20 transition-all text-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'সেভ হচ্ছে...' : 'পরিবর্তন সেভ করুন'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
