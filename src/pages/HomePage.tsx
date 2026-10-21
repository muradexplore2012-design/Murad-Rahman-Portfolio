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
  starterSettings
} from '../services/starterData';

export const HomePage: React.FC = () => {
  const [profile, setProfile] = useState<SiteProfile>(starterProfile);
  const [projects, setProjects] = useState<Project[]>(starterProjects);
  const [services, setServices] = useState<Service[]>(starterServices);
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(starterSkillGroups);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(starterSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [prefilledSubject, setPrefilledSubject] = useState('');

  useEffect(() => {
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

        if (profileData) setProfile(profileData);
        if (projectsData?.length) setProjects(projectsData);
        if (servicesData?.length) setServices(servicesData);
        if (skillsData?.length) setSkillGroups(skillsData);
        if (testimonialsData) setTestimonials(testimonialsData);
        if (settingsData) setSettings(settingsData);
      } catch (err) {
        console.warn("Using starter data due to Firestore read state:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center text-slate-800">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-[#15803d] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold tracking-wider text-slate-600 uppercase">
          লোড হচ্ছে...
        </p>
      </div>
    );
  }

  const { sectionVisibility } = settings;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 flex flex-col selection:bg-[#15803d] selection:text-white">
      <Navbar profile={profile} />

      <main className="flex-1">
        {sectionVisibility.hero && <HeroSection profile={profile} />}
        {sectionVisibility.about && <AboutSection profile={profile} />}
        {sectionVisibility.services && (
          <ServicesSection services={services} onSelectService={handleSelectService} />
        )}
        {sectionVisibility.projects && <ProjectsSection projects={projects} />}
        {sectionVisibility.skills && <SkillsSection skillGroups={skillGroups} />}
        {sectionVisibility.testimonials && (
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
