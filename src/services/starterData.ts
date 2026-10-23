import type { SiteProfile, Project, Service, SkillGroup, Testimonial, SiteSettings } from '../types';

export const starterProfile: SiteProfile = {
  name: "Murad Rahman",
  title: "Graphics Designer & Web Developer",
  greeting: "আসসালামুয়ালাইকুম, আপনাকে স্বাগতম",
  heroHeadline: "Hi, I am Murad Rahman",
  heroSubheadline: "I'm a passionate Graphic Designer & Web Developer specializing in high-impact YouTube thumbnails that boost CTR and modern, responsive websites designed to engage visitors and drive conversions.",
  aboutBio: "মুরাদ রহমান একজন দক্ষ ও সৃজনশীল গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার, যিনি আধুনিক ডিজাইন ও ওয়েব প্রযুক্তির মাধ্যমে ব্যক্তি ও ব্যবসার জন্য উচ্চমানের ভিজ্যুয়াল কনটেন্ট ও রেসপনসিভ ওয়েবসাইট তৈরিতে কাজ করছেন। এই সময়ে তিনি আধুনিক ডিজাইন কৌশল ও ওয়েব ডেভেলপমেন্ট সম্পর্কে গভীর দক্ষতা অর্জন করেছেন, যা ব্যবসাকে দ্রুত স্কেল করতে এবং অসাধারণ ফলাফল পেতে সাহায্য করে।",
  aboutSecondaryBio: "তিনি পরিষ্কার, আধুনিক এবং ইউজার-ফ্রেন্ডলি ডিজাইন তৈরি করতে বিশেষ পারদর্শী, যা সঠিক অডিয়েন্সকে টার্গেট করে সর্বোচ্চ রিচ, এনগেজমেন্ট এবং ব্র্যান্ড ভ্যালু নিশ্চিত করে।",
  profileImage: "/images/murad-rahman.jpg",
  aboutImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
  location: "Bangladesh",
  email: "muradrahman2026@gmail.com",
  phone: "",
  whatsapp: "",
  isAvailable: true,
  availabilityText: "প্রজেক্টের জন্য যোগাযোগ করতে পারেন",
  resumeUrl: "",
  socialLinks: {
    facebook: "https://www.facebook.com/profile.php?id=100085471628384",
    instagram: "",
    linkedin: "",
    github: "",
    behance: "",
    dribbble: "",
    youtube: "",
    twitter: ""
  },
  counters: [
    { id: "1", label: "Project Completed", value: "550", suffix: "+", isVisible: true },
    { id: "2", label: "Satisfied Client", value: "450", suffix: "+", isVisible: true },
    { id: "3", label: "Years of Experience", value: "04", suffix: "+", isVisible: true }
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
    title: "I will create Facebook Ads that grow your brand",
    description: "ফেসবুক অ্যাডস দিয়ে আপনার ব্র্যান্ড বাড়ান। সঠিক অডিয়েন্স টার্গেটিং ও উচ্চ কনভার্শনের প্রফেশনাল ক্যাম্পেইন।",
    coverImage: "/images/service-facebook-ads.png",
    badgeText: "শুরু ২৯৯৳ থেকে",
    startingPrice: "২৯৯৳",
    deliveryTime: "3-5Days Delivery",
    ratingText: "4.9 (210+ Reviews)",
    iconName: "Facebook",
    features: [
      "Targeted Audience Research",
      "High-Converting Ad Creatives & Copy",
      "Campaign Setup & Pixel Tracking"
    ],
    isPublished: true,
    sortOrder: 1
  },
  {
    id: "srv-2",
    title: "I will create engaging YouTube Ads that boost your business growth",
    description: "গুগল ও ইউটিউব অ্যাডস দিয়ে আপনার ব্র্যান্ড বাড়ান। সার্চ ও ভিডিও বিজ্ঞাপনের মাধ্যমে দ্রুত সেলস ও রিচ।",
    coverImage: "/images/service-google-ads.png",
    badgeText: "শুরু ২৯৯৳ থেকে",
    startingPrice: "২৯৯৳",
    deliveryTime: "3-6 Days Delivery",
    ratingText: "4.9 (290+ Reviews)",
    iconName: "Globe",
    features: [
      "Search & Video Ads Campaign Setup",
      "Keyword & Demographic Optimization",
      "Conversion Tracking & ROI Boost"
    ],
    isPublished: true,
    sortOrder: 2
  },
  {
    id: "srv-3",
    title: "I will create Instagram Ads that boost your business growth",
    description: "ইনস্টাগ্রাম অ্যাডস দিয়ে আপনার ব্র্যান্ড বাড়ান। আকর্ষণীয় রিলস ও স্টোরি বিজ্ঞাপনে নতুন গ্রাহক অর্জন।",
    coverImage: "/images/service-instagram-ads.png",
    badgeText: "শুরু ২৯৯৳ থেকে",
    startingPrice: "২৯৯৳",
    deliveryTime: "3-7 Days Delivery",
    ratingText: "4.9 (280+ Reviews)",
    iconName: "Sparkles",
    features: [
      "Engaging Reel & Carousel Ads",
      "Audience Retargeting & Growth",
      "Performance Analytics & Reporting"
    ],
    isPublished: true,
    sortOrder: 3
  }
];

export const starterSkillGroups: SkillGroup[] = [
  {
    id: "sg-1",
    name: "My Skills",
    sortOrder: 1,
    skills: [
      { id: "sk-1", name: "Illustrator", percentage: "95%", icon: "illustrator", level: "Advanced" },
      { id: "sk-2", name: "Photoshop", percentage: "92%", icon: "photoshop", level: "Advanced" },
      { id: "sk-3", name: "WordPress", percentage: "88%", icon: "wordpress", level: "Advanced" },
      { id: "sk-4", name: "Google Ads", percentage: "90%", icon: "google", level: "Advanced" },
      { id: "sk-5", name: "Facebook Ads", percentage: "80%", icon: "facebook", level: "Advanced" },
      { id: "sk-6", name: "YouTube Ads", percentage: "85%", icon: "youtube", level: "Advanced" },
      { id: "sk-7", name: "Email Marketing", percentage: "89%", icon: "email", level: "Advanced" },
      { id: "sk-8", name: "Instagram Ads", percentage: "75%", icon: "instagram", level: "Advanced" }
    ]
  }
];

export const starterTestimonials: Testimonial[] = [];

export const starterSettings: SiteSettings = {
  siteTitle: "Murad Rahman — Graphics Designer & Web Developer",
  metaDescription: "মুরাদ রহমান — Graphics Design, Blogger-ভিত্তিক আধুনিক ওয়েবসাইট ও Web Development এর প্রফেশনাল পোর্টফোলিও।",
  ogImage: "/images/murad-rahman.jpg",
  primaryColor: "#0284c7",
  accentColor: "#38bdf8",
  copyrightText: `© ${new Date().getFullYear()} Murad Rahman. All rights reserved.`,
  footerBio: "পরিচ্ছন্ন ডিজাইন এবং আধুনিক ওয়েব ইন্টারফেস নিয়ে কাজ করা গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার।",
  sectionVisibility: {
    hero: true,
    about: true,
    services: true,
    projects: true,
    skills: true,
    testimonials: true,
    contact: false // Contact form disabled/replaced by reviews as requested
  }
};
