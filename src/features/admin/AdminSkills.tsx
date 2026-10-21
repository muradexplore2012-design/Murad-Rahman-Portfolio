import React, { useEffect, useState } from 'react';
import { Cpu, Plus, Trash2, CheckCircle, AlertCircle, Save, X } from 'lucide-react';
import type { SkillGroup, SkillItem } from '../../types';
import { getSkillGroups, saveSkillGroup, deleteSkillGroup } from '../../services/firestoreService';

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
  const [newSkillLevel, setNewSkillLevel] = useState('Advanced');
  const [newSkillIcon, setNewSkillIcon] = useState('');

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
    try {
      await deleteSkillGroup(group.id);
      setStatus({ type: 'success', message: 'গ্রুপ মুছে ফেলা হয়েছে।' });
      await loadSkills();
    } catch (err: any) {
      alert(err.message || 'ডিলিট করতে সমস্যা হয়েছে।');
    }
  };

  const handleAddSkillToGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroupForSkill || !newSkillName.trim()) return;

    try {
      setIsSaving(true);
      const newSkill: SkillItem = {
        id: `sk-${Date.now()}`,
        name: newSkillName.trim(),
        level: newSkillLevel,
        icon: newSkillIcon.trim() || undefined,
      };

      const updatedSkills = [...activeGroupForSkill.skills, newSkill];
      await saveSkillGroup({
        id: activeGroupForSkill.id,
        skills: updatedSkills,
      });

      setActiveGroupForSkill(null);
      setNewSkillName('');
      setNewSkillIcon('');
      setStatus({ type: 'success', message: 'নতুন দক্ষতা যুক্ত হয়েছে!' });
      await loadSkills();
    } catch (err: any) {
      alert(err.message || 'স্কিল যুক্ত করতে সমস্যা হয়েছে।');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSkill = async (group: SkillGroup, skillId: string) => {
    try {
      const updatedSkills = group.skills.filter((s) => s.id !== skillId);
      await saveSkillGroup({
        id: group.id,
        skills: updatedSkills,
      });
      await loadSkills();
    } catch (err: any) {
      alert(err.message || 'ডিলিট করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">দক্ষতা ও টুলস (Skills CMS)</h1>
          <p className="text-xs text-slate-400 mt-1">
            এডোবি সফটওয়্যার এবং টেকনিক্যাল স্কিলস গ্রুপ অনুযায়ী পরিচালনা করুন।
          </p>
        </div>

        <button
          onClick={() => setIsGroupModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন গ্রুপ তৈরি করুন</span>
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

      {/* Skill Groups Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-slate-400 text-sm">স্কিলস লোড হচ্ছে...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 bg-slate-900/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <h3 className="text-sm font-bold text-white">{group.name}</h3>
                  <button
                    onClick={() => handleDeleteGroup(group)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="গ্রুপ মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {skill.icon && (
                          <span className="w-6 h-6 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-blue-400 flex items-center justify-center">
                            {skill.icon}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-white">{skill.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {skill.level && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400">
                            {skill.level}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteSkill(group, skill.id)}
                          className="text-slate-600 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {group.skills.length === 0 && (
                    <p className="text-xs text-slate-500 italic py-2">কোনো স্কিল যোগ করা হয়নি</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActiveGroupForSkill(group)}
                className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md glass-card rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setIsGroupModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white mb-4">নতুন স্কিল গ্রুপ</h2>
            <form onSubmit={handleAddGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  গ্রুপের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="যেমন: Motion Graphics & Video"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGroupModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md glass-card rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setActiveGroupForSkill(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white mb-2">
              "{activeGroupForSkill.name}" এ দক্ষতা যুক্ত করুন
            </h2>
            <form onSubmit={handleAddSkillToGroup} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  টুল / সফটওয়্যার নাম *
                </label>
                <input
                  type="text"
                  required
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="যেমন: Adobe InDesign"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    লেভেল
                  </label>
                  <select
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Proficient">Proficient</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    সংক্ষিপ্ত আইকন কোড
                  </label>
                  <input
                    type="text"
                    value={newSkillIcon}
                    onChange={(e) => setNewSkillIcon(e.target.value)}
                    placeholder="যেমন: Id"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveGroupForSkill(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
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
