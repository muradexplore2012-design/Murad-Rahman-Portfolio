import React, { useEffect, useRef, useState } from 'react';
import type { SkillGroup, SkillItem } from '../types';
import {
  IllustratorIcon,
  PhotoshopIcon,
  WordpressIcon,
  WebsiteIcon,
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
  { id: 'sk-3', name: 'Website', percentage: '88%', icon: 'website' },
  { id: 'sk-4', name: 'Google Ads', percentage: '90%', icon: 'google' },
  { id: 'sk-5', name: 'Facebook Ads', percentage: '80%', icon: 'facebook' },
  { id: 'sk-6', name: 'YouTube Ads', percentage: '85%', icon: 'youtube' },
  { id: 'sk-7', name: 'Email Marketing', percentage: '89%', icon: 'email' },
  { id: 'sk-8', name: 'Instagram Ads', percentage: '75%', icon: 'instagram' },
];

interface SkillCardProps {
  skill: SkillItem;
  index: number;
  inView: boolean;
  renderIcon: (skill: SkillItem) => React.ReactNode;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, index, inView, renderIcon }) => {
  const percentageStr = skill.percentage || (skill.level === 'Intermediate' ? '75%' : '90%');
  const targetNum = parseInt(percentageStr.replace(/[^0-9]/g, ''), 10) || 85;

  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!inView) {
      setCount(1);
      return;
    }

    // Start count-up when this specific card begins its entrance
    const startDelay = index * 250 + 200;
    const duration = 1200;

    let timeoutId: ReturnType<typeof setTimeout>;
    let animationFrameId: number;

    timeoutId = setTimeout(() => {
      let startTime: number | null = null;
      const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const current = Math.floor(1 + (targetNum - 1) * easeOutCubic(progress));
        setCount(current);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setCount(targetNum);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [inView, targetNum, index]);

  return (
    <div
      style={{
        animation: inView
          ? `serviceCardRise 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.25 + 0.15}s both`
          : 'none',
      }}
      className={`w-[calc(50%-0.6rem)] sm:w-[calc(33.333%-1rem)] lg:w-[185px] bg-white rounded-2xl border border-slate-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-7 flex flex-col items-center justify-center text-center group cursor-default shrink-0 service-card-animated ${
        inView ? '' : 'opacity-0 translate-y-36'
      }`}
    >
      {/* Circular Halo Icon Container */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-sky-50/80 border border-sky-100/90 flex items-center justify-center mb-4 sm:mb-5 shadow-[0_0_25px_rgba(2,132,199,0.12)] group-hover:scale-105 group-hover:border-sky-300 transition-all duration-300">
        {renderIcon(skill)}
      </div>

      {/* Percentage (Live count-up from 1 to target) */}
      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 sm:mb-1.5 font-sans tabular-nums">
        {count}%
      </span>

      {/* Skill Name */}
      <span className="text-xs sm:text-sm font-bold text-[#0284c7] tracking-wide">
        {skill.name}
      </span>
    </div>
  );
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skillGroups }) => {
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
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(cardsRef.current);

    return () => observer.disconnect();
  }, []);

  // Extract all skills from groups and map WordPress to Website
  const loadedSkills = skillGroups.flatMap((g) => g.skills).map((skill) => {
    if (skill.name?.toLowerCase().includes('wordpress') || skill.id === 'sk-3') {
      return {
        ...skill,
        name: 'Website',
        icon: 'website',
      };
    }
    return skill;
  });

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
    if (key.includes('web') || key.includes('site') || key.includes('globe') || key.includes('internet')) {
      return <WebsiteIcon className="w-9 h-9 sm:w-10 sm:h-10 text-[#0284c7]" />;
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
    <section id="skills" className="py-20 relative bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Reference Image */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0284c7] tracking-tight">
            My Skills
          </h2>
        </div>

        {/* Skills Cards Grid: Rising One-by-One */}
        <div
          ref={cardsRef}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 max-w-5xl mx-auto"
        >
          {skillsToDisplay.map((skill, index) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              index={index}
              inView={inView}
              renderIcon={renderIcon}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
