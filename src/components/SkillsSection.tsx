import React from 'react';
import type { SkillGroup, SkillItem } from '../types';
import {
  IllustratorIcon,
  PhotoshopIcon,
  WordpressIcon,
  GoogleIcon,
  FacebookIcon,
  YoutubeIcon,
  YahooEmailIcon,
  InstagramIcon
} from './Icons';
import { Sparkles } from 'lucide-react';

interface SkillsSectionProps {
  skillGroups: SkillGroup[];
}

// Default skill items matching user's requested order and reference design
const DEFAULT_SKILLS: SkillItem[] = [
  { id: 'sk-1', name: 'Illustrator', percentage: '95%', icon: 'illustrator' },
  { id: 'sk-2', name: 'Photoshop', percentage: '92%', icon: 'photoshop' },
  { id: 'sk-3', name: 'WordPress', percentage: '88%', icon: 'wordpress' },
  { id: 'sk-4', name: 'Google Ads', percentage: '90%', icon: 'google' },
  { id: 'sk-5', name: 'Facebook Ads', percentage: '80%', icon: 'facebook' },
  { id: 'sk-6', name: 'YouTube Ads', percentage: '85%', icon: 'youtube' },
  { id: 'sk-7', name: 'Email Marketing', percentage: '89%', icon: 'email' },
  { id: 'sk-8', name: 'Instagram Ads', percentage: '75%', icon: 'instagram' },
];

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillGroups }) => {
  // Extract all skills from groups
  const loadedSkills = skillGroups.flatMap((g) => g.skills);

  // If skills in groups match the modern structure or default, use them
  const skillsToDisplay: SkillItem[] = loadedSkills.length > 0
    ? loadedSkills
    : DEFAULT_SKILLS;

  const renderIcon = (skill: SkillItem) => {
    const key = (skill.icon || skill.name || '').toLowerCase();

    if (key.includes('illustrator') || key === 'ai') {
      return <IllustratorIcon className="w-9 h-9 sm:w-10 sm:h-10 text-[#0284c7]" />;
    }
    if (key.includes('photoshop') || key === 'ps') {
      return <PhotoshopIcon className="w-9 h-9 sm:w-10 sm:h-10 text-[#0284c7]" />;
    }
    if (key.includes('word') || key.includes('press') || key.includes('blog') || key === 'wp') {
      return <WordpressIcon className="w-9 h-9 sm:w-10 sm:h-10 text-[#0284c7]" />;
    }
    if (key.includes('google')) {
      return <GoogleIcon className="w-8 h-8 sm:w-9 sm:h-9 text-[#0284c7]" />;
    }
    if (key.includes('facebook') || key.includes('fb')) {
      return <FacebookIcon className="w-8 h-8 sm:w-9 sm:h-9 text-[#0284c7]" />;
    }
    if (key.includes('youtube') || key.includes('yt')) {
      return <YoutubeIcon className="w-9 h-9 sm:w-10 sm:h-10 text-[#0284c7]" />;
    }
    if (key.includes('email') || key.includes('yahoo') || key.includes('mail')) {
      return <YahooEmailIcon className="w-9 h-9 sm:w-10 sm:h-10 text-[#0284c7]" />;
    }
    if (key.includes('instagram') || key.includes('insta')) {
      return <InstagramIcon className="w-8 h-8 sm:w-9 sm:h-9 text-[#0284c7]" />;
    }

    return <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 text-[#0284c7]" />;
  };

  return (
    <section id="skills" className="py-20 relative bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Reference Image */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0284c7] tracking-tight">
            My Skills
          </h2>
        </div>

        {/* Skills Cards Grid matching Reference Image */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-5xl mx-auto">
          {skillsToDisplay.map((skill) => {
            const percentage = skill.percentage || (skill.level === 'Intermediate' ? '75%' : '90%');

            return (
              <div
                key={skill.id}
                className="w-[calc(50%-0.6rem)] sm:w-[calc(33.333%-1rem)] lg:w-[185px] bg-white rounded-2xl border border-slate-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-7 flex flex-col items-center justify-center text-center group cursor-default shrink-0"
              >
                {/* Circular Halo Icon Container */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-sky-50/80 border border-sky-100/90 flex items-center justify-center mb-4 sm:mb-5 shadow-[0_0_25px_rgba(2,132,199,0.12)] group-hover:scale-105 group-hover:border-sky-300 transition-all duration-300">
                  {renderIcon(skill)}
                </div>

                {/* Percentage */}
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 sm:mb-1.5 font-sans">
                  {percentage}
                </span>

                {/* Skill Name */}
                <span className="text-xs sm:text-sm font-bold text-[#0284c7] tracking-wide">
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
