import React, { useEffect, useState } from 'react';
import {
  FolderGit2,
  Layers,
  Inbox,
  Sparkles,
  CheckCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getProjects,
  getServices,
  getContactMessages,
  seedStarterContentToFirestore
} from '../../services/firestoreService';
import { isFirebaseConfigured } from '../../lib/firebase';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    publishedProjects: 0,
    totalProjects: 0,
    servicesCount: 0,
    inboxCount: 0,
    unreadMessages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [projectsList, servicesList, messagesList] = await Promise.all([
        getProjects(false),
        getServices(false),
        getContactMessages().catch(() => []),
      ]);

      setStats({
        publishedProjects: projectsList.filter((p) => p.isPublished).length,
        totalProjects: projectsList.length,
        servicesCount: servicesList.length,
        inboxCount: messagesList.length,
        unreadMessages: messagesList.filter((m) => !m.isRead).length,
      });
    } catch (err) {
      console.error("Dashboard stats error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSeedDatabase = async () => {
    if (!window.confirm("আপনি কি ফায়ারবেস ডেটাবেসে স্টার্টার কন্টেন্ট (প্রোফাইল, প্রজেক্ট, সার্ভিস) যুক্ত করতে চান?")) {
      return;
    }
    try {
      setIsSeeding(true);
      setSeedResult(null);
      const res = await seedStarterContentToFirestore();
      setSeedResult(res.message);
      await fetchStats();
    } catch (err: any) {
      alert("Seeding failed: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            এডমিন ড্যাশবোর্ড
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            মুরাদ রহমান পোর্টফোলিও ম্যানেজমেন্ট ও রিয়েল-টাইম ডেটা
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Firebase Status Badge & Seed Button */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Firebase কানেকশন স্ট্যাটাস</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isFirebaseConfigured
                ? 'Firebase SDK কনফিগার করা আছে।'
                : 'Firebase কনফিগারেশন চেক করুন।'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSeedDatabase}
          disabled={isSeeding}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{isSeeding ? 'ডেটাবেসে যুক্ত হচ্ছে...' : 'ফায়ারবেস স্টার্টার ডেটা লোড করুন'}</span>
        </button>
      </div>

      {seedResult && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{seedResult}</span>
        </div>
      )}

      {/* Real Statistics Grid (No fabricated data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Projects Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              মোট প্রজেক্ট
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">
              {isLoading ? '...' : stats.totalProjects}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              প্রকাশিত: <span className="text-blue-400 font-semibold">{stats.publishedProjects} টি</span>
            </p>
          </div>
          <Link
            to="/admin/projects"
            className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center justify-between"
          >
            <span>প্রজেক্ট ম্যানেজ করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Services Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              সার্ভিসসমূহ
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">
              {isLoading ? '...' : stats.servicesCount}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              একটিভ সার্ভিস আইটেম
            </p>
          </div>
          <Link
            to="/admin/services"
            className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center justify-between"
          >
            <span>সার্ভিস এডিট করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Contact Messages Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              মেসেজ ইনবক্স
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white">
              {isLoading ? '...' : stats.inboxCount}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              অপঠিত মেসেজ: <span className="text-amber-400 font-semibold">{stats.unreadMessages} টি</span>
            </p>
          </div>
          <Link
            to="/admin/inbox"
            className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center justify-between"
          >
            <span>ইনবক্স চেক করুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Quick Launch Cards */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">
          দ্রুত অ্যাকশন
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/profile"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors block group"
          >
            <h4 className="text-sm font-semibold text-white group-hover:text-blue-400">
              প্রোফাইল তথ্য ও ছবি
            </h4>
            <p className="text-xs text-slate-400 mt-1">বায়ো, নাম ও যোগাযোগের তথ্য বদলান</p>
          </Link>

          <Link
            to="/admin/projects"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors block group"
          >
            <h4 className="text-sm font-semibold text-white group-hover:text-blue-400">
              নতুন প্রজেক্ট যোগ করুন
            </h4>
            <p className="text-xs text-slate-400 mt-1">পোর্টফোলিওতে কাজ যুক্ত করুন</p>
          </Link>

          <Link
            to="/admin/skills"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors block group"
          >
            <h4 className="text-sm font-semibold text-white group-hover:text-blue-400">
              দক্ষতা ও সফটওয়্যার
            </h4>
            <p className="text-xs text-slate-400 mt-1">এডোবি ও ওয়েব স্কিলস আপডেট</p>
          </Link>

          <Link
            to="/admin/settings"
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors block group"
          >
            <h4 className="text-sm font-semibold text-white group-hover:text-blue-400">
              এসইও ও সাইট সেটিংস
            </h4>
            <p className="text-xs text-slate-400 mt-1">টাইটেল, মেটা ডেসক্রিপশন ও কপিরাইট</p>
          </Link>
        </div>
      </div>

    </div>
  );
};
