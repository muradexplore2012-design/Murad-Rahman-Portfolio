import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import type { SkillGroup } from '../types';

interface SkillsSectionProps {
  skillGroups: SkillGroup[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillGroups }) => {
  return (
    <section id="skills" className="py-20 relative bg-[#FAF8F5] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15803d] tracking-tight">
            প্রফেশনাল স্কিলস ও টুলস
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            যেসব সফটওয়্যার ও প্রযুক্তির মাধ্যমে বাস্তবভিত্তিক ও কার্যকরী ডিজাইন তৈরি করা হয়।
          </p>
          <div className="w-16 h-1 bg-[#15803d] mx-auto mt-3 rounded-full" />
        </div>

        {/* Skill Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillGroups.map((group) => (
            <div
              key={group.id}
              className="card-light rounded-2xl p-6 flex flex-col justify-between bg-white border border-slate-200"
            >
              <div>
                {/* Group Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span>{group.name}</span>
                  <Sparkles className="w-4 h-4 text-[#15803d]" />
                </h3>

                {/* Skills list */}
                <div className="space-y-3.5">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-slate-200/80 hover:border-emerald-300 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {skill.icon ? (
                          <span className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-300 text-xs font-black text-[#15803d] flex items-center justify-center shrink-0 shadow-xs">
                            {skill.icon}
                          </span>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
                        )}
                        <span className="text-sm font-bold text-slate-800">
                          {skill.name}
                        </span>
                      </div>

                      {skill.level && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#15803d] font-bold border border-emerald-200">
                          {skill.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 text-center font-medium">
                <span>প্রফেশনাল কাজের দক্ষতা</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
