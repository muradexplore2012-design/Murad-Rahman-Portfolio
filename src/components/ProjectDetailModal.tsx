import React from 'react';
import { X, ExternalLink, Calendar, Tag } from 'lucide-react';
import type { Project } from '../types';
import { GithubIcon } from './Icons';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-500 hover:text-slate-800 bg-white/90 hover:bg-white rounded-full transition-colors shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Image */}
        <div className="relative w-full aspect-video sm:aspect-[21/9] overflow-hidden rounded-t-2xl bg-slate-900">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 text-xs font-bold bg-[#15803d] text-white rounded-full shadow-md">
              {project.category}
            </span>
            {project.isStarter && (
              <span className="px-3 py-1 text-xs font-bold bg-amber-500 text-slate-950 rounded-full">
                Starter Sample
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {project.title}
            </h3>

            {project.completionDate && (
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <Calendar className="w-4 h-4" />
                <span>{project.completionDate}</span>
              </span>
            )}
          </div>

          {/* Description */}
          <div className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 space-y-3 font-normal">
            <p>{project.fullDescription || project.shortDescription}</p>
          </div>

          {/* Tools & Technologies */}
          {project.tools && project.tools.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#15803d]" />
                <span>ব্যবহৃত সফটওয়্যার ও টুলস</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-bold rounded-md bg-emerald-50 text-[#15803d] border border-emerald-200"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white text-sm font-bold rounded-lg shadow-sm transition-colors"
              >
                <span>লাইভ ডেমো দেখুন</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold rounded-lg border border-slate-300 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>সোর্স কোড</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="ml-auto px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
