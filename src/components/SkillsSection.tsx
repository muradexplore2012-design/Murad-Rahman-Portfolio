import React from 'react';
import { Cpu, CheckCircle2, Sparkles } from 'lucide-react';
import type { SkillGroup } from '../types';

interface SkillsSectionProps {
  skillGroups: SkillGroup[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillGroups }) => {
  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>দক্ষতা ও সফটওয়্যার</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            প্রফেশনাল স্কিলস ও টুলকিট
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            যেসব সফটওয়্যার ও প্রযুক্তির মাধ্যমে বাস্তবভিত্তিক ও কার্যকরী ডিজাইন তৈরি করা হয়।
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Skill Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillGroups.map((group) => (
            <div
              key={group.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                {/* Group Title */}
                <h3 className="text-lg font-bold text-white mb-6 pb-3 border-b border-slate-800/80 flex items-center justify-between">
                  <span>{group.name}</span>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>

                {/* Skills list */}
                <div className="space-y-3.5">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {skill.icon ? (
                          <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
                            {skill.icon}
                          </span>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        <span className="text-sm font-semibold text-slate-200">
                          {skill.name}
                        </span>
                      </div>

                      {skill.level && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900/80 text-blue-400 font-medium border border-blue-500/20">
                          {skill.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 text-xs text-slate-400 text-center">
                <span>প্রফেশনাল কাজের দক্ষতা</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
