import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, AlertCircle, Upload, User, Globe, Mail, Phone, Link as LinkIcon } from 'lucide-react';
import type { SiteProfile } from '../../types';
import { getSiteProfile, saveSiteProfile } from '../../services/firestoreService';
import { uploadAsset } from '../../services/storageService';
import { starterProfile } from '../../services/starterData';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<SiteProfile>(starterProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteProfile();
        if (data) setProfile(data);
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      const url = await uploadAsset(file, 'profile', (pct) => setUploadProgress(pct));
      setProfile((prev) => ({ ...prev, profileImage: url }));
      setStatus({ type: 'success', message: 'ছবি সফলভাবে আপলোড হয়েছে!' });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'ইমেজ আপলোড ব্যর্থ হয়েছে।' });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
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
    return <div className="text-white text-sm">প্রোফাইল ডেটা লোড হচ্ছে...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">প্রোফাইল ও পরিচিতি</h1>
          <p className="text-xs text-slate-400 mt-1">
            আপনার নাম, বায়োগ্রাফি, ছবি ও যোগাযোগের তথ্য এখান থেকে সরাসরি এডিট করুন।
          </p>
        </div>
      </div>

      {status.type === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      {status.type === 'error' && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Profile Image & Avatar */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            প্রোফাইল ছবি
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 shrink-0">
              <img
                src={profile.profileImage || "/images/murad-rahman.jpg"}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                ইমেজ URL অথবা আপলোড করুন
              </label>
              <input
                type="text"
                value={profile.profileImage}
                onChange={(e) => setProfile({ ...profile, profileImage: e.target.value })}
                placeholder="/images/murad-rahman.jpg"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
              <div className="flex items-center gap-3 pt-1">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  <span>নতুন ফটো আপলোড করুন</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                {isUploading && (
                  <span className="text-xs text-blue-400">
                    আপলোড হচ্ছে... {uploadProgress ? `${uploadProgress}%` : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Identity Information */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            মৌলিক তথ্য
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                আপনার নাম
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                হেডলাইন / পদবী
              </label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                স্বাগতম অভিবাদন (Greeting)
              </label>
              <input
                type="text"
                value={profile.greeting}
                onChange={(e) => setProfile({ ...profile, greeting: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                অবস্থান (Location)
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              হিরো সেকশন হেডলাইন
            </label>
            <input
              type="text"
              value={profile.heroHeadline}
              onChange={(e) => setProfile({ ...profile, heroHeadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              হিরো সাব-হেডলাইন / সংক্ষেপ
            </label>
            <textarea
              rows={2}
              value={profile.heroSubheadline}
              onChange={(e) => setProfile({ ...profile, heroSubheadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              আমার সম্পর্কে বিস্তারিত বায়োগ্রাফি (About Me)
            </label>
            <textarea
              rows={4}
              value={profile.aboutBio}
              onChange={(e) => setProfile({ ...profile, aboutBio: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Availability & Contact Channels */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            উপলব্ধতা ও সরাসরি যোগাযোগ
          </h3>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <input
              type="checkbox"
              id="isAvailable"
              checked={profile.isAvailable}
              onChange={(e) => setProfile({ ...profile, isAvailable: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
            />
            <div className="flex-1">
              <label htmlFor="isAvailable" className="text-xs font-bold text-white block cursor-pointer">
                কাজের জন্য উপলব্ধ (Available for Projects)
              </label>
              <input
                type="text"
                value={profile.availabilityText}
                onChange={(e) => setProfile({ ...profile, availabilityText: e.target.value })}
                className="mt-1 w-full sm:w-80 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                placeholder="প্রজেক্টের জন্য যোগাযোগ করতে পারেন"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                পাবলিক ইমেইল
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                হোয়াটসঅ্যাপ / ফোন নম্বর
              </label>
              <input
                type="text"
                value={profile.whatsapp || ''}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              জীবনবৃত্তান্ত (Resume / CV) লিঙ্ক
            </label>
            <input
              type="url"
              value={profile.resumeUrl || ''}
              onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
              placeholder="https://drive.google.com/file/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/60 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            সোশ্যাল মিডিয়া লিঙ্কস
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            যে লিঙ্কটি ফাঁকা রাখবেন, সেটি পাবলিক ওয়েবসাইটে স্বয়ংক্রিয়ভাবে লুকিয়ে থাকবে।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Facebook</label>
              <input
                type="url"
                value={profile.socialLinks?.facebook || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, facebook: e.target.value },
                  })
                }
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn</label>
              <input
                type="url"
                value={profile.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, linkedin: e.target.value },
                  })
                }
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub</label>
              <input
                type="url"
                value={profile.socialLinks?.github || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, github: e.target.value },
                  })
                }
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Behance / Dribbble</label>
              <input
                type="url"
                value={profile.socialLinks?.behance || ''}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    socialLinks: { ...profile.socialLinks, behance: e.target.value },
                  })
                }
                placeholder="https://behance.net/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'সেভ হচ্ছে...' : 'পরিবর্তন সেভ করুন'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
