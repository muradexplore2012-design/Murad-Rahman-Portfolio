import React, { useEffect, useState } from 'react';
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Upload,
  X,
  Save
} from 'lucide-react';
import type { Project } from '../../types';
import { getProjects, saveProject, deleteProject } from '../../services/firestoreService';
import { uploadAsset } from '../../services/storageService';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects(false);
      setProjects(data);
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: 'প্রজেক্ট লোড করতে সমস্যা হয়েছে।' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingProject({
      title: '',
      category: 'Graphics Design',
      shortDescription: '',
      fullDescription: '',
      coverImage: '',
      tools: ['Photoshop', 'Illustrator'],
      liveUrl: '',
      githubUrl: '',
      isFeatured: false,
      isPublished: true,
      sortOrder: projects.length + 1,
      completionDate: '2026',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject({ ...project });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`আপনি কি "${title}" প্রজেক্টটি মুছে ফেলতে চান?`)) return;
    try {
      await deleteProject(id);
      setStatus({ type: 'success', message: 'প্রজেক্ট মুছে ফেলা হয়েছে।' });
      await loadProjects();
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'ডিলিট করতে সমস্যা হয়েছে।' });
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      await saveProject({ id: project.id, isPublished: !project.isPublished });
      await loadProjects();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadAsset(file, 'projects');
      setEditingProject((prev) => (prev ? { ...prev, coverImage: url } : null));
    } catch (err: any) {
      alert(err.message || 'ইমেজ আপলোড ব্যর্থ হয়েছে।');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject.coverImage) {
      alert('অনুগ্রহ করে প্রজেক্টের নাম ও কাভার ইমেজ দিন।');
      return;
    }

    try {
      setIsSaving(true);
      await saveProject(editingProject);
      setIsModalOpen(false);
      setEditingProject(null);
      setStatus({ type: 'success', message: 'প্রজেক্ট সফলভাবে সেভ হয়েছে!' });
      await loadProjects();
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
          <h1 className="text-2xl font-extrabold text-white">প্রজেক্ট ও পোর্টফোলিও</h1>
          <p className="text-xs text-slate-400 mt-1">
            আপনার ডিজাইন ও ডেভেলপমেন্ট প্রজেক্টগুলো যোগ, এডিট বা ডিলিট করুন।
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রজেক্ট যোগ করুন</span>
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

      {/* Projects Table / Card List */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/40">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">প্রজেক্ট লোড হচ্ছে...</div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">কোনো প্রজেক্ট পাওয়া যায়নি</p>
            <p className="text-xs">উপরে "নতুন প্রজেক্ট যোগ করুন" বাটনে ক্লিক করে প্রথম প্রজেক্ট যুক্ত করুন।</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    <img
                      src={proj.coverImage}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {proj.category}
                      </span>
                      {proj.isStarter && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Sample
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-xl">
                      {proj.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleTogglePublish(proj)}
                    className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                      proj.isPublished
                        ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                        : 'text-slate-500 bg-slate-800 hover:text-slate-300'
                    }`}
                    title={proj.isPublished ? 'পাবলিশ করা আছে' : 'ড্রাফট (অনুপস্থিত)'}
                  >
                    {proj.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-2 rounded-lg text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
                    title="এডিট করুন"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
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

      {/* Add / Edit Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">
              {editingProject.id ? 'প্রজেক্ট এডিট করুন' : 'নতুন প্রজেক্ট যোগ করুন'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    প্রজেক্টের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Graphics Design">Graphics Design</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Blogger Custom">Blogger Custom</option>
                    <option value="Branding & Logo">Branding & Logo</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                  </select>
                </div>
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  কাভার ইমেজ URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={editingProject.coverImage}
                    onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 shrink-0">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                {isUploading && (
                  <span className="text-[11px] text-blue-400 mt-1 block">ইমেজ আপলোড হচ্ছে...</span>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  সংক্ষিপ্ত বিবরণ (Short Description)
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.shortDescription}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, shortDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  বিস্তারিত বিবরণ (Full Description)
                </label>
                <textarea
                  rows={4}
                  value={editingProject.fullDescription || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, fullDescription: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tools list */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  ব্যবহৃত সফটওয়্যার/টুলস (কমা দিয়ে আলাদা করুন)
                </label>
                <input
                  type="text"
                  value={editingProject.tools?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      tools: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="Photoshop, Illustrator, Tailwind"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    লাইভ ওয়েবসাইট ডেমো URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.liveUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    গিটহাব সোর্স কোড URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.githubUrl || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProject.isPublished}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, isPublished: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800"
                  />
                  <span>পাবলিশ করুন (Published)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProject.isFeatured}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800"
                  />
                  <span>ফিচার্ড প্রজেক্ট (Featured)</span>
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
                  <span>{isSaving ? 'সেভ হচ্ছে...' : 'প্রজেক্ট সেভ করুন'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
