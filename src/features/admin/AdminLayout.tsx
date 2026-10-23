import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Layers,
  Cpu,
  MessageSquareQuote,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { signOutAdmin } from '../../lib/auth';
import { auth } from '../../lib/firebase';

export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutAdmin();
      navigate('/admin/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Profile & Identity', icon: User, path: '/admin/profile' },
    { label: 'Projects', icon: FolderGit2, path: '/admin/projects' },
    { label: 'Services', icon: Layers, path: '/admin/services' },
    { label: 'Skills', icon: Cpu, path: '/admin/skills' },
    { label: 'Reviews', icon: MessageSquareQuote, path: '/admin/testimonials' },
    { label: 'Contact Inbox', icon: Inbox, path: '/admin/inbox' },
    { label: 'Site Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0284c7]" />
          <span className="font-bold text-sm text-slate-900">Murad Rahman CMS</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-slate-900"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between shadow-xs transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-black text-base tracking-tight text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0284c7]" />
                <span>Admin CMS</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[180px]">
                {auth?.currentUser?.email || 'Murad Rahman'}
              </p>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0284c7] text-white shadow-md shadow-sky-700/20'
                        : 'text-slate-600 hover:text-[#0284c7] hover:bg-sky-50/70'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-sky-50 hover:text-[#0284c7] border border-slate-200/60 rounded-xl transition-colors"
          >
            <span>পাবলিক সাইট দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 bg-rose-50/70 hover:bg-rose-100 hover:text-rose-700 border border-rose-200/50 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#FAF8F5]">
        <Outlet />
      </main>

    </div>
  );
};
