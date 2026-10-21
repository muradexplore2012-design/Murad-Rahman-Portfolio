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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Image */}
        <div className="relative w-full aspect-video sm:aspect-[21/9] overflow-hidden rounded-t-2xl bg-slate-950">
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
            <span className="px-3 py-1 text-xs font-semibold bg-blue-600/90 text-white rounded-full backdrop-blur-md shadow-md">
              {project.category}
            </span>
            {project.isStarter && (
              <span className="px-3 py-1 text-xs font-semibold bg-amber-500/90 text-slate-950 rounded-full backdrop-blur-md">
                Starter Sample
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {project.title}
            </h3>

            {project.completionDate && (
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{project.completionDate}</span>
              </span>
            )}
          </div>

          {/* Description */}
          <div className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 space-y-3 font-normal">
            <p>{project.fullDescription || project.shortDescription}</p>
          </div>

          {/* Tools & Technologies */}
          {project.tools && project.tools.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                <span>ব্যবহৃত সফটওয়্যার ও টুলস</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 text-slate-200 border border-slate-700"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
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
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>সোর্স কোড</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="ml-auto px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
