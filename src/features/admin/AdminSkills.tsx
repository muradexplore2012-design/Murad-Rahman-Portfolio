import React, { useEffect, useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import type { SkillGroup, SkillItem } from '../../types';
import { getSkillGroups, saveSkillGroup, deleteSkillGroup } from '../../services/firestoreService';
import {
  IllustratorIcon,
  PhotoshopIcon,
  WordpressIcon,
  GoogleIcon,
  FacebookIcon,
  YoutubeIcon,
  YahooEmailIcon,
  InstagramIcon
} from '../../components/Icons';

export const AdminSkills: React.FC = () => {
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  // Modal for adding a new category
  const [newGroupName, setNewGroupName] = useState('');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Modal for adding a skill to a specific group
  const [activeGroupForSkill, setActiveGroupForSkill] = useState<SkillGroup | null>(null);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillPercentage, setNewSkillPercentage] = useState('90%');
  const [newSkillLevel, setNewSkillLevel] = useState('Advanced');
  const [newSkillIcon, setNewSkillIcon] = useState('illustrator');

  const loadSkills = async () => {
    try {
      setIsLoading(true);
      const data = await getSkillGroups();
      setSkillGroups(data);
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: 'স্কিলস লোড করতে সমস্যা হয়েছে।' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      setIsSaving(true);
      await saveSkillGroup({
        name: newGroupName.trim(),
        sortOrder: skillGroups.length + 1,
        skills: [],
      });
      setNewGroupName('');
      setIsGroupModalOpen(false);
      setStatus({ type: 'success', message: 'নতুন স্কিল গ্রুপ তৈরি করা হয়েছে!' });
      await loadSkills();
    } catch (err: any) {
      alert(err.message || 'গ্রুপ তৈরি করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteGroup = async (group: SkillGroup) => {
    if (!window.confirm(`আপনি কি "${group.name}" গ্রুপটি সম্পূর্ণ মুছে ফেলতে চান?`)) return;

    // Optimistic UI update
    setSkillGroups((prev) => prev.filter((g) => g.id !== group.id));

    try {
      if (!group.id.startsWith('sg-')) {
        await deleteSkillGroup(group.id);
      }
      setStatus({ type: 'success', message: 'গ্রুপ সফলভাবে মুছে ফেলা হয়েছে।' });
    } catch (err: any) {
      console.error("Delete group error:", err);
      await loadSkills();
      setStatus({ type: 'error', message: err.message || 'ডিলিট করতে সমস্যা হয়েছে।' });
    }
  };

  const handleAddSkillToGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroupForSkill || !newSkillName.trim()) return;

    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name: newSkillName.trim(),
      percentage: newSkillPercentage.trim() || '90%',
      level: newSkillLevel,
      icon: newSkillIcon.trim() || undefined,
    };

    const updatedSkills = [...activeGroupForSkill.skills, newSkill];

    // Optimistic UI update
    setSkillGroups((prev) =>
      prev.map((g) => (g.id === activeGroupForSkill.id ? { ...g, skills: updatedSkills } : g))
    );

    try {
      setIsSaving(true);
      const savedId = await saveSkillGroup({
        ...activeGroupForSkill,
        skills: updatedSkills,
      });

      if (activeGroupForSkill.id !== savedId) {
        setSkillGroups((prev) =>
          prev.map((g) => (g.id === activeGroupForSkill.id ? { ...g, id: savedId, skills: updatedSkills } : g))
        );
      }

      setActiveGroupForSkill(null);
      setNewSkillName('');
      setNewSkillPercentage('90%');
      setNewSkillIcon('illustrator');
      setStatus({ type: 'success', message: 'নতুন দক্ষতা যুক্ত হয়েছে!' });
    } catch (err: any) {
      console.error(err);
      await loadSkills();
      setStatus({ type: 'error', message: err.message || 'স্কিল যুক্ত করতে সমস্যা হয়েছে।' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSkill = async (group: SkillGroup, skillId: string) => {
    const updatedSkills = group.skills.filter((s) => s.id !== skillId);

    // 1. Optimistic instant UI update: skill disappears immediately without wait
    setSkillGroups((prev) =>
      prev.map((g) => (g.id === group.id ? { ...g, skills: updatedSkills } : g))
    );

    try {
      setIsSaving(true);
      // 2. Persist full group data to Firestore
      const savedId = await saveSkillGroup({
        ...group,
        skills: updatedSkills,
      });

      // 3. Sync ID if starter group ID was converted to Firestore ID
      if (group.id !== savedId) {
        setSkillGroups((prev) =>
          prev.map((g) => (g.id === group.id ? { ...g, id: savedId, skills: updatedSkills } : g))
        );
      }

      setStatus({ type: 'success', message: 'দক্ষতা সফলভাবে মুছে ফেলা হয়েছে!' });
    } catch (err: any) {
      console.error("Delete skill failed:", err);
      // Revert if error
      await loadSkills();
      setStatus({ type: 'error', message: err.message || 'ডিলিট করতে সমস্যা হয়েছে।' });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to render correct SVG icon without text overlap
  const renderSkillIcon = (skill: SkillItem) => {
    const key = (skill.icon || skill.name || '').toLowerCase();

    if (key.includes('illustrator') || key === 'ai') {
      return <IllustratorIcon className="w-5 h-5 text-[#0284c7]" />;
    }
    if (key.includes('photoshop') || key === 'ps') {
      return <PhotoshopIcon className="w-5 h-5 text-[#0284c7]" />;
    }
    if (key.includes('word') || key.includes('press') || key === 'wp') {
      return <WordpressIcon className="w-5 h-5 text-[#0284c7]" />;
    }
    if (key.includes('google')) {
      return <GoogleIcon className="w-4 h-4 text-[#0284c7]" />;
    }
    if (key.includes('facebook') || key === 'fb') {
      return <FacebookIcon className="w-4 h-4 text-[#0284c7]" />;
    }
    if (key.includes('youtube') || key === 'yt') {
      return <YoutubeIcon className="w-5 h-5 text-[#0284c7]" />;
    }
    if (key.includes('email') || key.includes('mail') || key.includes('yahoo')) {
      return <YahooEmailIcon className="w-5 h-5 text-[#0284c7]" />;
    }
    if (key.includes('instagram') || key.includes('insta')) {
      return <InstagramIcon className="w-4 h-4 text-[#0284c7]" />;
    }

    return <Sparkles className="w-4 h-4 text-[#0284c7]" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">দক্ষতা ও টুলস (Skills CMS)</h1>
          <p className="text-xs text-slate-500 mt-1">
            এডোবি সফটওয়্যার এবং টেকনিক্যাল স্কিলস গ্রুপ অনুযায়ী পরিচালনা করুন।
          </p>
        </div>

        <button
          onClick={() => setIsGroupModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন গ্রুপ তৈরি করুন</span>
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

      {/* Skill Groups Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-500 text-sm">স্কিলস লোড হচ্ছে...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl p-5 border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h3 className="text-sm font-bold text-slate-900">{group.name}</h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteGroup(group);
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="গ্রুপ মুছুন"
                    aria-label={`গ্রুপ মুছুন ${group.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-sky-200 flex items-center justify-between transition-colors"
                    >
                      {/* Left: Clean Icon Container + Single Clear Skill Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                          {renderSkillIcon(skill)}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {skill.name}
                        </span>
                      </div>

                      {/* Right: Percentage, Level & Delete */}
                      <div className="flex items-center gap-2 shrink-0">
                        {skill.percentage && (
                          <span className="text-xs font-bold text-[#0284c7] px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 font-sans">
                            {skill.percentage}
                          </span>
                        )}
                        {skill.level && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                            {skill.level}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteSkill(group, skill.id);
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="মুছুন"
                          aria-label={`মুছুন ${skill.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {group.skills.length === 0 && (
                    <p className="text-xs text-slate-400 italic py-2">কোনো স্কিল যোগ করা হয়নি</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActiveGroupForSkill(group)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-[#0284c7] border border-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>দক্ষতা যুক্ত করুন</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal: New Group */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-800">
            <button
              onClick={() => setIsGroupModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 mb-4">নতুন স্কিল গ্রুপ</h2>
            <form onSubmit={handleAddGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  গ্রুপের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="যেমন: Design & Advertising"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  গ্রুপ তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Skill to Group */}
      {activeGroupForSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-800">
            <button
              onClick={() => setActiveGroupForSkill(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              "{activeGroupForSkill.name}" এ দক্ষতা যুক্ত করুন
            </h2>
            <form onSubmit={handleAddSkillToGroup} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  টুল / সফটওয়্যার নাম *
                </label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="যেমন: Illustrator"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    শতাংশ
                  </label>
                  <input
                    type="text"
                    value={newSkillPercentage}
                    onChange={(e) => setNewSkillPercentage(e.target.value)}
                    placeholder="90%"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    লেভেল
                  </label>
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                  >
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Proficient">Proficient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    আইকন
                  </label>
                  <select
                    value={newSkillIcon}
                    onChange={(e) => setNewSkillIcon(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                  >
                    <option value="illustrator">Illustrator</option>
                    <option value="photoshop">Photoshop</option>
                    <option value="wordpress">WordPress</option>
                    <option value="google">Google Ads</option>
                    <option value="facebook">Facebook Ads</option>
                    <option value="youtube">YouTube Ads</option>
                    <option value="email">Email Marketing</option>
                    <option value="instagram">Instagram Ads</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveGroupForSkill(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
