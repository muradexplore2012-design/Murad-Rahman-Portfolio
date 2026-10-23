import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { SkillsSection } from '../components/SkillsSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ContactSection } from '../components/ContactSection';
import { Footer } from '../components/Footer';
import type {
  SiteProfile,
  Project,
  Service,
  SkillGroup,
  Testimonial,
  SiteSettings
} from '../types';
import {
  getSiteProfile,
  getProjects,
  getServices,
  getSkillGroups,
  getTestimonials,
  getSiteSettings
} from '../services/firestoreService';
import {
  starterProfile,
  starterProjects,
  starterServices,
  starterSkillGroups,
  starterTestimonials,
  starterSettings
} from '../services/starterData';

const getCachedData = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(`mr_cache_${key}`);
    if (item) {
      const parsed = JSON.parse(item);
      if (parsed) return parsed;
    }
  } catch {
    // Ignore cache error
  }
  return fallback;
};

const setCachedData = (key: string, value: any) => {
  try {
    localStorage.setItem(`mr_cache_${key}`, JSON.stringify(value));
  } catch {
    // Ignore
  }
};

export const HomePage: React.FC = () => {
  // Initialize immediately from LocalStorage cache or bundled starter data (Zero loading delay!)
  const [profile, setProfile] = useState<SiteProfile>(() => getCachedData('profile', starterProfile));
  const [projects, setProjects] = useState<Project[]>(() => getCachedData('projects', starterProjects));
  const [services, setServices] = useState<Service[]>(() => getCachedData('services', starterServices));
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(() => getCachedData('skills', starterSkillGroups));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => getCachedData('testimonials', starterTestimonials));
  const [settings, setSettings] = useState<SiteSettings>(() => getCachedData('settings', starterSettings));
  const [prefilledSubject, setPrefilledSubject] = useState('');

  useEffect(() => {
    let isMounted = true;

    // Silent background revalidation: fetches fresh data without blocking the user
    async function loadData() {
      try {
        const [
          profileData,
          projectsData,
          servicesData,
          skillsData,
          testimonialsData,
          settingsData
        ] = await Promise.all([
          getSiteProfile(),
          getProjects(true),
          getServices(true),
          getSkillGroups(),
          getTestimonials(true),
          getSiteSettings(),
        ]);

        if (!isMounted) return;

        if (profileData) {
          setProfile(profileData);
          setCachedData('profile', profileData);
        }
        if (projectsData?.length) {
          setProjects(projectsData);
          setCachedData('projects', projectsData);
        }
        if (servicesData?.length) {
          setServices(servicesData);
          setCachedData('services', servicesData);
        }
        if (skillsData?.length) {
          setSkillGroups(skillsData);
          setCachedData('skills', skillsData);
        }
        if (testimonialsData) {
          setTestimonials(testimonialsData);
          setCachedData('testimonials', testimonialsData);
        }
        if (settingsData) {
          setSettings(settingsData);
          setCachedData('settings', settingsData);
        }
      } catch (err) {
        console.warn("Using cached/starter data:", err);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update dynamic document title & meta description
  useEffect(() => {
    if (settings.siteTitle) {
      document.title = settings.siteTitle;
    }
  }, [settings.siteTitle]);

  const handleSelectService = (serviceTitle: string) => {
    setPrefilledSubject(`Inquiry for: ${serviceTitle}`);
  };

  const { sectionVisibility } = settings;

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-[#0284c7] selection:text-white">
      <Navbar profile={profile} />

      <main className="flex-1">
        {sectionVisibility.hero && <HeroSection profile={profile} />}
        {sectionVisibility.about && <AboutSection profile={profile} />}
        {sectionVisibility.services && (
          <ServicesSection
            services={services}
            onSelectService={handleSelectService}
            whatsapp={profile.whatsapp || profile.phone}
          />
        )}
        {sectionVisibility.projects && <ProjectsSection projects={projects} />}
        {sectionVisibility.skills && <SkillsSection skillGroups={skillGroups} />}
        {sectionVisibility.testimonials !== false && (
          <TestimonialsSection testimonials={testimonials} />
        )}
        {sectionVisibility.contact && (
          <ContactSection profile={profile} prefilledSubject={prefilledSubject} />
        )}
      </main>

      <Footer profile={profile} settings={settings} />
    </div>
  );
};
