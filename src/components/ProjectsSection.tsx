import React, { useEffect, useRef, useState } from 'react';
import { Eye, ExternalLink } from 'lucide-react';
import type { Project } from '../types';
import { ProjectDetailModal } from './ProjectDetailModal';
import { GithubIcon } from './Icons';

interface ProjectsSectionProps {
  projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const cardsRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!cardsRef.current) return;

    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(cardsRef.current);

    return () => observer.disconnect();
  }, []);

  const publishedProjects = projects.filter((p) => p.isPublished);

  // Dynamic list of categories
  const categories = ['All', ...Array.from(new Set(publishedProjects.map((p) => p.category)))];

  const filteredProjects =
    selectedCategory === 'All'
      ? publishedProjects
      : publishedProjects.filter((p) => p.category === selectedCategory);

  return (
    <section id="projects" className="py-20 relative bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0284c7] tracking-tight">
            সাম্প্রতিক কাজের পোর্টফোলিও
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            গ্রাফিক্স ডিজাইন, ব্র্যান্ড আইডেন্টিটি এবং আধুনিক ওয়েব ডেভেলপমেন্ট কাজের কিছু নমুনা।
          </p>
          <div className="w-16 h-1 bg-[#0284c7] mx-auto mt-3 rounded-full" />
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-[#0284c7] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat === 'All' ? 'সব প্রজেক্ট' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid with Deep Staggered Rise from Bottom */}
        <div
          ref={cardsRef}
          key={selectedCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              style={{
                animation: inView
                  ? `serviceCardRise 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(index * 0.25 + 0.15, 1.2)}s both`
                  : 'none',
              }}
              className={`card-light card-light-hover rounded-2xl overflow-hidden flex flex-col group bg-white border border-slate-200 service-card-animated ${
                inView ? '' : 'opacity-0 translate-y-36'
              }`}
            >
              {/* Project Image Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0284c7] text-white shadow-sm">
                    {project.category}
                  </span>
                  {project.isStarter && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500 text-slate-950">
                      Sample
                    </span>
                  )}
                </div>

                {/* Hover Quick Action */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => setActiveModalProject(project)}
                    className="p-3 rounded-full bg-[#0284c7] text-white hover:bg-[#0369a1] transition-colors shadow-lg"
                    title="বিস্তারিত দেখুন"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-lg"
                      title="লাইভ সাইট দেখুন"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-[#0284c7] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                    {project.shortDescription}
                  </p>

                  {/* Tools Tags */}
                  {project.tools && project.tools.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tools.map((tool, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-[#0284c7] border border-sky-100"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveModalProject(project)}
                    className="text-xs font-bold text-[#0284c7] hover:text-[#0369a1] flex items-center gap-1.5 transition-colors"
                  >
                    <span>বিস্তারিত পড়ুন</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-slate-900 p-1 transition-colors"
                        title="GitHub Repository"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-[#0284c7] p-1 transition-colors"
                        title="Live Preview"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
