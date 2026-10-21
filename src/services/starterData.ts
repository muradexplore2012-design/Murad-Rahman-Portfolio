import type { SiteProfile, Project, Service, SkillGroup, Testimonial, SiteSettings } from '../types';

export const starterProfile: SiteProfile = {
  name: "Murad Rahman",
  title: "Graphics Designer & Web Developer",
  greeting: "আসসালামুয়ালাইকুম, আপনাকে স্বাগতম",
  heroHeadline: "হ্যালো, আমি মুরাদ রহমান — Graphics Design ও Web Development নিয়ে কাজ করি।",
  heroSubheadline: "ব্যক্তি ও ব্যবসার জন্য আধুনিক, আকর্ষণীয় গ্রাফিক্স এবং পরিচ্ছন্ন ও রেসপনসিভ ওয়েব ইন্টারফেস তৈরিতে নিবেদিত।",
  aboutBio: "আমি ব্যক্তি, উদ্যোক্তা ও ছোট ব্যবসার জন্য পরিষ্কার, আধুনিক এবং ব্যবহারবান্ধব ডিজাইন ও ওয়েব অভিজ্ঞতা তৈরি করি। Graphics Design, Blogger-ভিত্তিক আধুনিক/custom website এবং responsive web interface নিয়ে কাজ করি। প্রতিটি প্রজেক্টে ব্যবহারকারীর অভিজ্ঞতা, পরিচ্ছন্ন ডিজাইন ও ধারাবাহিক উন্নতিকে গুরুত্ব দিই।",
  aboutSecondaryBio: "আমার কাজের মূল লক্ষ্য হলো ক্লায়েন্টের প্রয়োজনীয়তা বুঝে সময়োপযোগী ও প্রফেশনাল ফলাফল উপহার দেওয়া। নতুন প্রযুক্তি শেখা ও ভিজ্যুয়াল ক্রিয়েটিভিটিকে বাস্তব রূপ দেওয়ার ক্ষেত্রে আমি সবসময় উদ্যমী।",
  profileImage: "/images/murad-rahman.jpg",
  location: "Bangladesh",
  email: "muradrahman2026@gmail.com",
  phone: "",
  whatsapp: "",
  isAvailable: true,
  availabilityText: "প্রজেক্টের জন্য যোগাযোগ করতে পারেন",
  resumeUrl: "",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    github: "",
    behance: "",
    dribbble: "",
    youtube: "",
    twitter: ""
  },
  counters: [
    { id: "1", label: "Completed Works", value: "4", suffix: "+", isVisible: true },
    { id: "2", label: "Client Satisfaction", value: "100", suffix: "%", isVisible: false }
  ]
};

export const starterProjects: Project[] = [
  {
    id: "proj-1",
    title: "Brand Identity Design",
    category: "Graphics Design",
    shortDescription: "লোগো ডিজাইন, কালার প্যালেট ও ব্র্যান্ড গাইডলাইনের পূর্ণাঙ্গ প্যাকেজ।",
    fullDescription: "একটি আধুনিক ব্যবসার অনন্য পরিচিতি গড়ে তুলতে ভেক্টর-ভিত্তিক লোগো, টাইপোগ্রাফি রুলস, কালার প্যালেট এবং সোশ্যাল মিডিয়া ব্রান্ডিং কিট তৈরি করা হয়েছে। এডোবি ইলাস্ট্রেটর ও ফটোশপের সমন্বয়ে তৈরি নিখুঁত ভিজ্যুয়াল ক্রিয়েশন।",
    coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
    tools: ["Adobe Illustrator", "Adobe Photoshop", "Branding Guidelines", "Vector Art"],
    isFeatured: true,
    isPublished: true,
    isStarter: true,
    sortOrder: 1,
    completionDate: "2026",
    liveUrl: "",
    githubUrl: ""
  },
  {
    id: "proj-2",
    title: "Social Media Poster Design",
    category: "Graphics Design",
    shortDescription: "ডিজিটাল মার্কেটিং ও প্রচারণার জন্য দৃষ্টিনন্দন পোস্টার ও সোশ্যাল ব্যানার ডিজাইন।",
    fullDescription: "ফেসবুক, ইনস্টাগ্রাম ও লিঙ্কডইন বিজ্ঞাপনের জন্য উচ্চমানের প্রমোশনাল ব্যানার এবং ইনফোগ্রাফিক পোস্টার ডিজাইন। সঠিক কম্পোজিশন, ভিজ্যুয়াল হায়ারার্কি ও কালার কনট্রাস্টের মাধ্যমে অডিয়েন্স এনগেজমেন্ট বাড়ানোর উপযোগী।",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    tools: ["Photoshop", "Typography", "Visual Hierarchy", "Digital Marketing"],
    isFeatured: true,
    isPublished: true,
    isStarter: true,
    sortOrder: 2,
    completionDate: "2026",
    liveUrl: "",
    githubUrl: ""
  },
  {
    id: "proj-3",
    title: "Responsive Business Website",
    category: "Web Development",
    shortDescription: "স্মার্টফোন, ট্যাবলেট এবং ডেস্কটপের জন্য সম্পূর্ণ রেসপনসিভ ও আধুনিক বিজনেস ওয়েবসাইট।",
    fullDescription: "ক্লিন কোড আর্কিটেকচার, ফাস্ট লোডিং স্পিড এবং ইন্টার‍্যাক্টিভ ইউজার ইন্টারফেস সমৃদ্ধ একটি ওয়েবসাইট। আধুনিক ওয়েব স্ট্যান্ডার্ড ও রেসপনসিভ গ্রিড অনুসরণ করে তৈরি যাতে সব ডিভাইসে নিখুঁত দেখায়।",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    tools: ["HTML5", "CSS3 / Tailwind", "JavaScript", "Responsive Design"],
    isFeatured: true,
    isPublished: true,
    isStarter: true,
    sortOrder: 3,
    completionDate: "2026",
    liveUrl: "",
    githubUrl: ""
  },
  {
    id: "proj-4",
    title: "Blogger Custom Website",
    category: "Blogger Custom",
    shortDescription: "ব্লগার প্ল্যাটফর্মে কাস্টম থিম মডিফিকেশন ও এসইও ফ্রেন্ডলি লেআউট ডিজাইন।",
    fullDescription: "ব্লগার/ব্লগস্পট প্ল্যাটফর্মের জন্য কাস্টমাইজড কোডিং, মেটা-ট্যাগ এসইও অপ্টিমাইজেশন, অ্যাডসেন্স ফ্রেন্ডলি কাঠামো এবং মোবাইল-ফ্রেন্ডলি নেভিগেশন সুবিধা। বাজেট-বান্ধব ও সহজে ম্যানেজ করা যায় এমন সলিউশন।",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
    tools: ["Blogger / XML", "CSS3", "JavaScript", "SEO Optimization"],
    isFeatured: true,
    isPublished: true,
    isStarter: true,
    sortOrder: 4,
    completionDate: "2026",
    liveUrl: "",
    githubUrl: ""
  }
];

export const starterServices: Service[] = [
  {
    id: "srv-1",
    title: "Graphics & Visual Design",
    description: "ব্র্যান্ডের স্বাতন্ত্র্য ফুটিয়ে তুলতে প্রফেশনাল লোগো, সোশ্যাল মিডিয়া ব্যানার, ফ্লায়ার ও ব্র্যান্ড অ্যাসেটস তৈরি।",
    iconName: "Palette",
    startingPrice: "",
    deliveryTime: "",
    features: [
      "উচ্চমানের ভেক্টর লোগো ও ব্র্যান্ডিং",
      "সোশ্যাল মিডিয়া পোস্ট ও ব্যানার ডিজাইন",
      "প্রিন্ট-রেডি ভেক্টর ও রাস্টার ফাইলস (Ai, PSD, PNG, PDF)"
    ],
    isPublished: true,
    sortOrder: 1
  },
  {
    id: "srv-2",
    title: "Custom Web Development",
    description: "আধুনিক ওয়েব স্ট্যান্ডার্ড মেনে দ্রুতগতির, পরিচ্ছন্ন ও শতভাগ রেসপনসিভ ওয়েবসাইট ডেভেলপমেন্ট।",
    iconName: "Globe",
    startingPrice: "",
    deliveryTime: "",
    features: [
      "মোবাইল-ফ্রেন্ডলি রেসপনসিভ লেআউট",
      "ক্লিন কোড ও সুপার ফাস্ট লোডিং স্পিড",
      "ইউজার-ফ্রেন্ডলি নেভিগেশন ও চমৎকার UI"
    ],
    isPublished: true,
    sortOrder: 2
  },
  {
    id: "srv-3",
    title: "Blogger Website Setup & Styling",
    description: "ব্লগার সাইট কাস্টমাইজেশন, অ্যাডভান্সড থিম সেটআপ এবং এসইও-বান্ধব স্ট্রাকচার নির্মাণ।",
    iconName: "Layout",
    startingPrice: "",
    deliveryTime: "",
    features: [
      "কাস্টম ব্লগার থিম ইন্সটলেশন ও সেটআপ",
      "মোবাইল ও ট্যাবলেট ফ্রেন্ডলি ডিজাইন",
      "অন-পেজ এসইও ও সার্চ কনসোল অপ্টিমাইজেশন"
    ],
    isPublished: true,
    sortOrder: 3
  },
  {
    id: "srv-4",
    title: "UI/UX & Creative Assets",
    description: "ব্যবহারকারীর সহজ অভিজ্ঞতার জন্য পরিচ্ছন্ন ওয়েব ইন্টারফেস কনসেপ্ট ও ডিজিটাল ভিজ্যুয়াল ম্যাটেরিয়াল।",
    iconName: "Sparkles",
    startingPrice: "",
    deliveryTime: "",
    features: [
      "ইউজার ইন্টারফেস ওয়্যারফ্রেম ও মকআপ",
      "কনভার্সন-ফোকাসড ল্যান্ডিং পেজ ডিজাইন",
      "মর্ডান ডার্ক/লাইট মোড কালার হারমনি"
    ],
    isPublished: true,
    sortOrder: 4
  }
];

export const starterSkillGroups: SkillGroup[] = [
  {
    id: "sg-1",
    name: "Adobe Creative Suite",
    sortOrder: 1,
    skills: [
      { id: "sk-1", name: "Adobe Photoshop", level: "Advanced", icon: "Ps" },
      { id: "sk-2", name: "Adobe Illustrator", level: "Advanced", icon: "Ai" },
      { id: "sk-3", name: "Adobe Premiere Pro", level: "Intermediate", icon: "Pr" },
      { id: "sk-4", name: "Adobe After Effects", level: "Intermediate", icon: "Ae" }
    ]
  },
  {
    id: "sg-2",
    name: "Web Technologies & Frontend",
    sortOrder: 2,
    skills: [
      { id: "sk-5", name: "HTML5 & Semantic Markup", level: "Advanced" },
      { id: "sk-6", name: "CSS3 & Modern Styling", level: "Advanced" },
      { id: "sk-7", name: "Tailwind CSS", level: "Advanced" },
      { id: "sk-8", name: "JavaScript (ES6+)", level: "Proficient" },
      { id: "sk-9", name: "React & Modern UI", level: "Intermediate" }
    ]
  },
  {
    id: "sg-3",
    name: "Platforms & Workflow",
    sortOrder: 3,
    skills: [
      { id: "sk-10", name: "Blogger Customization", level: "Advanced" },
      { id: "sk-11", name: "Responsive Web Design", level: "Advanced" },
      { id: "sk-12", name: "Git & Version Control", level: "Intermediate" },
      { id: "sk-13", name: "SEO Basics & Optimization", level: "Proficient" }
    ]
  }
];

export const starterTestimonials: Testimonial[] = []; // No fake testimonials!

export const starterSettings: SiteSettings = {
  siteTitle: "Murad Rahman — Graphics Designer & Web Developer",
  metaDescription: "মুরাদ রহমান — Graphics Design, Blogger-ভিত্তিক আধুনিক ওয়েবসাইট ও Web Development এর প্রফেশনাল পোর্টফোলিও।",
  ogImage: "/images/murad-rahman.jpg",
  primaryColor: "#2563eb",
  accentColor: "#f59e0b",
  copyrightText: `© ${new Date().getFullYear()} Murad Rahman. All rights reserved.`,
  footerBio: "পরিচ্ছন্ন ডিজাইন এবং আধুনিক ওয়েব ইন্টারফেস নিয়ে কাজ করা গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার।",
  sectionVisibility: {
    hero: true,
    about: true,
    services: true,
    projects: true,
    skills: true,
    testimonials: true,
    contact: true
  }
};
