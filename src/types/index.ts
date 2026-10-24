export interface SiteProfile {
  name: string;
  title: string;
  greeting: string;
  heroHeadline: string;
  heroSubheadline: string;
  aboutBio: string;
  aboutSecondaryBio?: string;
  profileImage: string;
  aboutImage?: string;
  location: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  isAvailable: boolean;
  availabilityText: string;
  resumeUrl?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    behance?: string;
    dribbble?: string;
    youtube?: string;
    twitter?: string;
  };
  counters?: Array<{
    id: string;
    label: string;
    value: string;
    suffix?: string;
    isVisible: boolean;
  }>;
  updatedAt?: any;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription?: string;
  coverImage: string;
  galleryImages?: string[];
  tools: string[];
  liveUrl?: string;
  githubUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  isStarter?: boolean;
  sortOrder: number;
  completionDate?: string;
  createdAt?: any;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  coverImage?: string;
  badgeText?: string;
  startingPrice?: string;
  deliveryTime?: string;
  ratingText?: string;
  features?: string[];
  isPublished: boolean;
  sortOrder: number;
  createdAt?: any;
}

export interface SkillItem {
  id: string;
  name: string;
  percentage?: string;
  level?: string;
  icon?: string;
}

export interface SkillGroup {
  id: string;
  name: string;
  sortOrder: number;
  skills: SkillItem[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole?: string;
  clientCompany?: string;
  clientPhoto?: string;
  quote: string;
  rating?: number;
  isApproved: boolean;
  sortOrder: number;
  createdAt?: any;
}

export interface ChatReply {
  id: string;
  sender: 'admin' | 'user';
  senderName: string;
  senderEmail?: string;
  senderPhoto?: string;
  text: string;
  createdAt: any;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  userId?: string;
  userPhoto?: string;
  isRead: boolean;
  isArchived: boolean;
  replies?: ChatReply[];
  lastMessage?: string;
  lastMessageAt?: any;
  lastSender?: 'admin' | 'user';
  unreadByAdmin?: boolean;
  unreadByUser?: boolean;
  createdAt: any;
}

export interface SiteSettings {
  siteTitle: string;
  metaDescription: string;
  ogImage?: string;
  primaryColor?: string;
  accentColor?: string;
  copyrightText: string;
  footerBio?: string;
  googleSheetWebhookUrl?: string; // Webhook for Google Sheets & Gmail notifications
  sectionVisibility: {
    hero: boolean;
    about: boolean;
    services: boolean;
    projects: boolean;
    skills: boolean;
    testimonials: boolean;
    contact: boolean;
  };
}
