import type { SiteProfile, SiteSettings, ChatReply } from '../types';

/**
 * Normalizes input text for multi-lingual and phonetical keyword matching.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if the text matches any of the given patterns (substrings or regexes).
 */
function matchesPattern(text: string, patterns: Array<string | RegExp>): boolean {
  return patterns.some((p) => {
    if (typeof p === 'string') {
      return text.includes(p.toLowerCase());
    }
    return p.test(text);
  });
}

/**
 * Detects whether the user is primarily speaking English.
 */
function isEnglishText(text: string): boolean {
  // If text contains mostly ASCII letters and common English words without Bengali/Banglish markers
  const hasBengali = /[\u0980-\u09FF]/.test(text);
  if (hasBengali) return false;

  const englishMarkers = [
    'hello', 'hi ', 'hey', 'need', 'want', 'please', 'order', 'urgent',
    'price', 'cost', 'how much', 'can you', 'design', 'website', 'thumbnail',
    'portfolio', 'contact', 'whatsapp', 'call', 'service', 'thanks', 'thank you'
  ];

  const banglishMarkers = [
    'ami', 'apni', 'tumi', 'kemon', 'koto', 'kobe', 'lagbe', 'chai', 'ache',
    'korte', 'banate', 'korbo', 'bhalo', 'hobe', 'den', 'din', 'kotha', 'jogajog'
  ];

  const lower = text.toLowerCase();
  const hasBanglish = banglishMarkers.some((m) => lower.includes(m));
  if (hasBanglish) return false;

  const hasEnglish = englishMarkers.some((m) => lower.includes(m));
  return hasEnglish;
}

/**
 * Formats contact links dynamically based on Murad Rahman's active profile and settings.
 */
function getContactDetails(profile?: SiteProfile, settings?: SiteSettings) {
  // 1. WhatsApp
  let rawPhone = settings?.autoReplyWhatsapp || profile?.whatsapp || profile?.phone || '01566088159';
  let cleanNumber = rawPhone.replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '88' + cleanNumber;
  } else if (!cleanNumber.startsWith('880') && cleanNumber.length === 10) {
    cleanNumber = '880' + cleanNumber;
  }
  const whatsappUrl = `https://wa.me/${cleanNumber || '8801566088159'}`;

  // 2. Facebook Profile
  const facebookUrl =
    settings?.autoReplyFacebook ||
    profile?.socialLinks?.facebook ||
    'https://www.facebook.com/profile.php?id=100085471628384';

  // 3. Email
  const email = profile?.email || 'muradrahman2026@gmail.com';

  // 4. Portfolio URL
  const portfolioUrl = 'https://muradrahman.netlify.app/#projects';

  return { whatsappUrl, facebookUrl, email, portfolioUrl };
}

/**
 * Intelligent AI Auto-Reply generator specifically customized for Murad Rahman's portfolio.
 * Accurately analyzes query intent and context, answering queries 24/7 with direct links.
 */
export function generateAiAutoReply(
  userMessage: string,
  profile?: SiteProfile,
  settings?: SiteSettings,
  _history?: ChatReply[]
): string {
  const norm = normalizeText(userMessage);
  const isEng = isEnglishText(userMessage);
  const contacts = getContactDetails(profile, settings);
  const muradName = profile?.name || 'মুরাদ রহমান (Murad Rahman)';

  // =========================================================================
  // 1. ORDER, URGENT WORK, CUSTOM PROJECTS, OR DIRECT PROFILE/CONTACT INQUIRY
  // "r jodi kono joruri bisoy ba kono kisu bante hobe ba oder r ki to oi somoy amar profile er link ta diye dibe"
  // =========================================================================
  const orderOrUrgentPatterns = [
    // Order / Want to make something
    'order', 'অর্ডার', 'বানাতে চাই', 'বানাতে হবে', 'বানিয়ে দেন', 'বানিয়ে দেন',
    'banate chai', 'banate hobe', 'bania den', 'banai den', 'banano', 'make a',
    'kaj korte chai', 'kaj korate chai', 'kaj ache', 'kaj lagbe', 'কাজ আছে', 'কাজ করাতে চাই', 'কাজ লাগবে',
    'hire', 'হায়ার', 'হায়ার', 'hire you', 'hire murad', 'project', 'প্রজেক্ট',
    // Urgent / Immediate
    'urgent', 'জরুরি', 'জরুরী', 'জরুরি কাজ', 'জরুরী কাজ', 'joruri', 'emergency',
    'druto', 'দ্রুত', 'asap', 'ekhoni', 'এখনই', 'ajker moddhe', 'আজকের মধ্যে', 'fast delivery',
    // Direct Contact / Number / Links
    'number', 'নাম্বার', 'ফোন', 'phone', 'call', 'কল দিতে চাই', 'kotha bolte chai', 'কথা বলতে চাই',
    'whatsapp', 'হোয়াটসঅ্যাপ', 'হোয়াটসঅ্যাপ', 'fb', 'facebook', 'ফেসবুক',
    'profile', 'profile link', 'প্রোফাইল', 'লিংক', 'link den', 'jogajog', 'যোগাযোগ', 'inbox', 'ডাইরেক্ট'
  ];

  if (matchesPattern(norm, orderOrUrgentPatterns)) {
    if (isEng) {
      return `Hello! Thank you for reaching out regarding an order or urgent project! 🎯

Murad Rahman prioritizes client projects with express delivery and pixel-perfect quality. To discuss your project details and get started right away, please connect through Murad's direct profiles:

📱 Direct WhatsApp (Instant Chat):
${contacts.whatsappUrl}

🌐 Official Facebook Profile:
${contacts.facebookUrl}

📧 Direct Email:
${contacts.email}

💼 Live Portfolio & Work Samples:
${contacts.portfolioUrl}

Feel free to send a message on WhatsApp or Facebook with your requirements (video title, project reference, or design draft). Murad will reply directly and get your project underway immediately!`;
    }

    return `আসসালামু আলাইকুম! নতুন কাজের অর্ডার বা জরুরি প্রয়োজনে মেসেজ দেওয়ার জন্য ধন্যবাদ! 🎯

মুরাদ রহমান সবসময় ক্লায়েন্টদের প্রজেক্ট সর্বোচ্চ গুরুত্ব ও দ্রুততার সাথে ডেলিভারি করে থাকেন। তাঁর সাথে সরাসরি ও তাৎক্ষণিকভাবে কথা বলে কাজ শুরু করার জন্য নিচের যেকোনো মাধ্যমে নক দিন:

📱 সরাসরি হোয়াটসঅ্যাপ (WhatsApp):
${contacts.whatsappUrl}

🌐 অফিশিয়াল ফেসবুক প্রোফাইল (Facebook):
${contacts.facebookUrl}

📧 সরাসরি ইমেইল (Direct Email):
${contacts.email}

💼 লাইভ পোর্টফোলিও প্রজেক্ট ও কাজের স্যাম্পল:
${contacts.portfolioUrl}

👉 হোয়াটসঅ্যাপে অথবা ফেসবুকে মেসেজ দিয়ে আপনার কাজের শিরোনাম বা বিবরণ (যেমন: থাম্বনেইল আইডিয়া, ব্যানার বা ওয়েবসাইট রিকোয়ারমেন্ট) লিখে দিন। মুরাদ ভাই সরাসরি আপনার মেসেজ দেখে দ্রুত কাজ শুরু করে দেবেন!`;
  }

  // =========================================================================
  // 2. YOUTUBE THUMBNAILS
  // =========================================================================
  const thumbnailPatterns = [
    'thumbnail', 'থাম্বনেইল', 'থাম্বনেল', 'thumnail', 'thambnail', 'thumb',
    'ইউটিউব থাম্বনেল', 'ইউটিউব থাম্বনেইল', 'clickbait', 'ক্লিকবেট', 'yt'
  ];

  if (matchesPattern(norm, thumbnailPatterns)) {
    if (isEng) {
      return `Looking for High-CTR YouTube Thumbnails? 🚀

Murad Rahman specializes in high-impact, custom YouTube thumbnails designed to boost click-through rates (CTR) and views across Gaming, Tech, Vlogs, Tutorials, Podcasts, News, and Business channels!

✨ What You Get:
• 100% Custom & Click-worthy Aesthetic Designs
• Ultra High Resolution (Full HD / 4K JPG & PNG)
• Fast 6 to 24 Hour Delivery (Express 2-4 hr delivery available)
• Layered PSD / Source File Options
• Unlimited Revisions until you are 100% satisfied

To order or send your video reference, connect directly:
📱 WhatsApp: ${contacts.whatsappUrl}
🌐 Facebook: ${contacts.facebookUrl}`;
    }

    return `ইউটিউব থাম্বনেইল ডিজাইনের জন্য সঠিক জায়গায় এসেছেন! 🚀

মুরাদ রহমান ইউটিউব কনটেন্ট ক্রিয়েটরদের জন্য হাই-সিটিআর (High CTR) এবং ক্লিকবেট/অ্যাথলেটিক থাম্বনেইল তৈরিতে বিশেষ অভিজ্ঞ। গেমিং, টেক, ভ্লগ, পডকাস্ট, টিউটোরিয়াল, নিউজ বা বিজনেস—সব ধরনের চ্যানেলের থাম্বনেইল নিখুঁতভাবে তৈরি করা হয়।

✨ থাম্বনেইল সার্ভিসের সুবিধাসমূহ:
• ফুল এইচডি (1080p) ও ৪K ক্রিস্টাল ক্লিয়ার কোয়ালিটি
• দ্রুত ৬ থেকে ১২ ঘণ্টার মধ্যে ডেলিভারি (জরুরি ক্ষেত্রে ২-৪ ঘণ্টায় এক্সপ্রেস ডেলিভারি)
• এডিটেবল PSD সোর্স ফাইল
• সম্পূর্ণ সন্তুষ্ট না হওয়া পর্যন্ত রিভিশন

আপনার ভিডিওর শিরোনাম বা রেফারেন্স পাঠিয়ে এখনই অর্ডার করতে পারেন:
📱 হোয়াটসঅ্যাপ: ${contacts.whatsappUrl}
🌐 ফেসবুক প্রোফাইল: ${contacts.facebookUrl}`;
  }

  // =========================================================================
  // 3. WEB DEVELOPMENT & WORDPRESS
  // =========================================================================
  const webPatterns = [
    'website', 'ওয়েবসাইট', 'web design', 'web development', 'ওয়েব ডিজাইন',
    'ওয়েব ডেভেলপার', 'wordpress', 'ওয়ার্ডপ্রেস', 'landing page', 'ল্যান্ডিং পেজ',
    'ecommerce', 'ই-কমার্স', 'frontend', 'developer', 'react'
  ];

  if (matchesPattern(norm, webPatterns)) {
    if (isEng) {
      return `Interested in Modern Web Development? 💻

Murad Rahman designs and develops lightning-fast, mobile-responsive, and modern websites:
• Personal Portfolio & Resume Websites
• High-Converting Landing Pages
• E-Commerce & Business Platforms
• Custom WordPress & Blogger Solutions
• Clean code, SEO-ready, and 100% responsive across all mobile & desktop screens

Let's discuss your website scope:
📱 WhatsApp: ${contacts.whatsappUrl}
🌐 Facebook: ${contacts.facebookUrl}
💼 View live projects: ${contacts.portfolioUrl}`;
    }

    return `আধুনিক ওয়েবসাইট বা ওয়েব ডেভেলপমেন্ট প্রজেক্টের জন্য যোগাযোগ করেছেন? 💻

মুরাদ রহমান দৃষ্টিনন্দন, দ্রুতগতির এবং রেসপনসিভ ওয়েবসাইট তৈরিতে দক্ষ:
• পার্সোনাল পোর্টফোলিও ওয়েবসাইট
• হাই-কনভার্টিং ল্যান্ডিং পেজ
• বিজনেস ও ই-কমার্স ওয়েবসাইট
• ওয়ার্ডপ্রেস (WordPress) কাস্টমাইজেশন ও ব্লগার সল্যুশন
• মোবাইল ও কম্পিউটার—সব ডিভাইসে ১০০% রেসপনসিভ ও এসইও ফ্রেন্ডলি

আপনার ওয়েবসাইটের রিকোয়ারমেন্ট নিয়ে আলোচনা করতে নক দিন:
📱 হোয়াটসঅ্যাপ: ${contacts.whatsappUrl}
🌐 ফেসবুক প্রোফাইল: ${contacts.facebookUrl}`;
  }

  // =========================================================================
  // 4. GRAPHIC DESIGN & SOCIAL MEDIA
  // =========================================================================
  const graphicPatterns = [
    'graphic', 'graphics', 'গ্রাফিক্স', 'ডিজাইন', 'banner', 'ব্যানার',
    'poster', 'পোস্টার', 'logo', 'লোগো', 'flyer', 'ফ্লায়ার', 'cover',
    'social media', 'সোশ্যাল মিডিয়া'
  ];

  if (matchesPattern(norm, graphicPatterns)) {
    if (isEng) {
      return `Need Creative Graphic Design or Social Media Branding? 🎨

Murad Rahman provides professional graphic design services including:
• Social Media Banners (YouTube, Facebook, Twitter/X, LinkedIn)
• Promotional Posters, Flyers, and Ad Creatives
• Minimal & Modern Brand Logos
• Photo Retouching & Vector Artwork

Contact directly to kickstart your creative project:
📱 WhatsApp: ${contacts.whatsappUrl}
🌐 Facebook: ${contacts.facebookUrl}`;
    }

    return `ক্রিয়েটিভ গ্রাফিক্স ডিজাইনের জন্য যোগাযোগ করার জন্য ধন্যবাদ! 🎨

মুরাদ রহমান বিভিন্ন ধরনের প্রফেশনাল গ্রাফিক্স ডিজাইন তৈরি করেন:
• সোশ্যাল মিডিয়া ব্যানার ও কভার ফটো (YouTube, Facebook, LinkedIn)
• প্রমোশনাল পোস্টার, ফ্লায়ার ও বিজ্ঞাপন ডিজাইন (Facebook & Instagram Ads)
• আধুনিক ব্র্যান্ড লোগো ডিজাইন
• ফটো রিটাচিং ও ক্রিয়েটিভ ম্যানিপুলেশন

আপনার ডিজাইন প্রয়োজন সম্পর্কে বিস্তারিত জানাতে সরাসরি মেসেজ দিন:
📱 হোয়াটসঅ্যাপ: ${contacts.whatsappUrl}
🌐 ফেসবুক প্রোফাইল: ${contacts.facebookUrl}`;
  }

  // =========================================================================
  // 5. PRICING, BUDGET & QUOTATION
  // =========================================================================
  const pricingPatterns = [
    'price', 'দাম', 'খরচ', 'টাকা', 'রেট', 'বাজেট', 'cost', 'how much',
    'koto taka', 'dam koto', 'rate', 'budget', 'charge', 'package', 'discount',
    'কত টাকা', 'কত নিবেন'
  ];

  if (matchesPattern(norm, pricingPatterns)) {
    if (isEng) {
      return `Affordable & Transparent Pricing 💰

Murad Rahman offers budget-friendly rates for creators, businesses, and startups:
• YouTube Thumbnails: Highly competitive & creator-friendly rates with bulk packages.
• Graphic Design & Banners: Affordable based on project requirements.
• Websites & Development: Flexible packages based on features and pages.

For an instant, customized quotation for your exact project, send a quick message:
📱 WhatsApp: ${contacts.whatsappUrl}
🌐 Facebook: ${contacts.facebookUrl}`;
    }

    return `কাজের খরচ ও বাজেট সম্পর্কে জানতে চাচ্ছেন? 💰

মুরাদ রহমানের কাজের রেট অত্যন্ত রিজনেবল ও ফ্রেন্ডলি:
• ইউটিউব থাম্বনেইল: ক্রিয়েটরদের জন্য একদম সাধ্যের মধ্যে বাজেট ও প্যাকেজ অফার।
• গ্রাফিক্স ব্যানার ও পোস্টার: কাজের সাইজ ও ডিটেইলিং অনুযায়ী সাশ্রয়ী মূল্য।
• ওয়েবসাইট ডেভেলপমেন্ট: পেজ সংখ্যা ও ফিচারের উপর ভিত্তি করে কাস্টম বাজেট।

আপনার প্রজেক্টের সঠিক বাজেট ও ডিসকাউন্ট জানতে সরাসরি মেসেজ দিয়ে কোটেশন নিন:
📱 হোয়াটসঅ্যাপ: ${contacts.whatsappUrl}
🌐 ফেসবুক প্রোফাইল: ${contacts.facebookUrl}`;
  }

  // =========================================================================
  // 6. DELIVERY TIME & TURNAROUND
  // =========================================================================
  const timePatterns = [
    'delivery', 'ডেলিভারি', 'সময়', 'সময়', 'কতদিন লাগবে', 'কবে পাব', 'কবে দিবেন',
    'somoy', 'koto somoy lagbe', 'kobe pabo', 'turnaround', 'how long'
  ];

  if (matchesPattern(norm, timePatterns)) {
    if (isEng) {
      return `Fast & Reliable Delivery Timelines ⏱️

• YouTube Thumbnails: 6 to 12 Hours (Express 2-4 Hours available)
• Banners & Posters: 12 to 24 Hours
• Full Websites: 2 to 5 Days (depending on scope)

For express deadline delivery, contact directly:
📱 WhatsApp: ${contacts.whatsappUrl}`;
    }

    return `ডেলিভারি টাইমলাইন সম্পর্কে তথ্য ⏱️

মুরাদ রহমান সবসময় সময়ের মধ্যে কাজ ডেলিভারি দিতে প্রতিশ্রুতিবদ্ধ:
• ইউটিউব থাম্বনেইল: ৬ থেকে ১২ ঘণ্টার মধ্যে (জরুরি ক্ষেত্রে ২-৪ ঘণ্টায় এক্সপ্রেস ডেলিভারি!)
• ব্যানার ও সোশ্যাল পোস্টার: ১২ থেকে ২৪ ঘণ্টা
• সম্পূর্ণ ওয়েবসাইট: ২ থেকে ৫ দিন (প্রজেক্ট সাইজ অনুযায়ী)

জরুরি ডেলিভারির জন্য সরাসরি হোয়াটসঅ্যাপে মেসেজ দিন:
📱 হোয়াটসঅ্যাপ: ${contacts.whatsappUrl}`;
  }

  // =========================================================================
  // 7. GREETINGS & CASUAL HELLO
  // =========================================================================
  const greetingPatterns = [
    'salam', 'assalamu alaikum', 'সালাম', 'আসসালামু আলাইকুম', 'hello', 'hi', 'hey',
    'kemon acho', 'kemon achen', 'কেমন আছেন', 'কেমন আছো', 'ki obostha', 'শুভ দিন',
    'good morning', 'good evening', 'hola'
  ];

  if (matchesPattern(norm, greetingPatterns)) {
    if (isEng) {
      return `Hello! Welcome to Murad Rahman's Official Portfolio! 👋

I'm Murad's AI Assistant. How can we help you today?
• 🎨 YouTube Thumbnail & Graphic Design
• 💻 Modern Website Development & WordPress
• ⚡ Urgent Project Orders

Feel free to type your question, or message Murad directly on WhatsApp:
📱 ${contacts.whatsappUrl}`;
    }

    return `আসসালামু আলাইকুম! মুরাদ রহমানের অফিশিয়াল পোর্টফোলিওতে আপনাকে স্বাগতম! 👋

আমি মুরাদ রহমানের এআই অ্যাসিস্ট্যান্ট। আজ আপনাকে কীভাবে সহযোগিতা করতে পারি?
• 🎨 ইউটিউব থাম্বনেইল বা গ্রাফিক্স ব্যানার তৈরি
• 💻 আধুনিক ওয়েবসাইট বা ল্যান্ডিং পেজ ডেভেলপমেন্ট
• ⚡ যেকোনো জরুরি প্রজেক্টের অর্ডার

আপনার প্রশ্নটি লিখে পাঠান, অথবা সরাসরি মুরাদ ভাইয়ের হোয়াটসঅ্যাপে কথা বলুন:
📱 ${contacts.whatsappUrl}
🌐 ফেসবুক: ${contacts.facebookUrl}`;
  }

  // =========================================================================
  // 8. WHO IS MURAD RAHMAN / INTRO
  // =========================================================================
  const aboutPatterns = [
    'who is murad', 'who are you', 'মুরাদ কে', 'আপনি কে', 'মুরাদ রহমান কে',
    'tumi ke', 'apni ke', 'পরিচয়', 'about'
  ];

  if (matchesPattern(norm, aboutPatterns)) {
    if (isEng) {
      return `About Murad Rahman 👨‍💻

Murad Rahman is a passionate Graphic Designer & Web Developer based in Bangladesh.
He specializes in:
1. High CTR, eye-catching YouTube Thumbnails & Social Media Visuals.
2. Fast, responsive, clean websites & WordPress solutions.

Connect directly:
📱 WhatsApp: ${contacts.whatsappUrl}
🌐 Facebook: ${contacts.facebookUrl}
💼 Portfolio: ${contacts.portfolioUrl}`;
    }

    return `মুরাদ রহমান সম্পর্কে পরিচিতি 👨‍💻

মুরাদ রহমান একজন দক্ষ ও সৃজনশীল গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার।
তিনি প্রধানত কাজ করেন:
১. ইউটিউব থাম্বনেইল ডিজাইন (হাই সিটিআর ও ক্লিকবেট কনসেপ্ট)
২. প্রফেশনাল গ্রাফিক্স ব্যানার, পোস্টার ও ব্র্যান্ডিং
৩. আধুনিক, রেসপনসিভ ওয়েবসাইট ও ল্যান্ডিং পেজ ডেভেলপমেন্ট

সরাসরি যোগাযোগের ঠিকানা:
📱 হোয়াটসঅ্যাপ: ${contacts.whatsappUrl}
🌐 ফেসবুক প্রোফাইল: ${contacts.facebookUrl}
💼 প্রজেক্ট পোর্টফোলিও: ${contacts.portfolioUrl}`;
  }

  // =========================================================================
  // 9. DEFAULT / FALLBACK RESPONSE WITH DIRECT LINKS
  // =========================================================================
  if (isEng) {
    return `Thank you for your message! 😊

Murad Rahman specializes in High-CTR YouTube Thumbnails, Creative Graphic Design, and Modern Web Development.

Since Murad might currently be working on client projects, you can reach him directly for immediate assistance:

📱 WhatsApp Direct:
${contacts.whatsappUrl}

🌐 Facebook Profile:
${contacts.facebookUrl}

📧 Email:
${contacts.email}

Please leave your message details here or on WhatsApp, and Murad will respond promptly!`;
  }

  return `আপনার মেসেজের জন্য আন্তরিক ধন্যবাদ! 😊

মুরাদ রহমান হাই-সিটিআর ইউটিউব থাম্বনেইল, ক্রিয়েটিভ গ্রাফিক্স ডিজাইন এবং আধুনিক ওয়েবসাইট তৈরিতে বিশেষজ্ঞ।

মুরাদ ভাই কাজের প্রয়োজনে অনলাইনে না থাকলেও যাতে আপনার যোগাযোগে কোনো দেরি না হয়, সেজন্য সরাসরি নিচের মাধ্যমে নক দিতে পারেন:

📱 সরাসরি হোয়াটসঅ্যাপ (WhatsApp):
${contacts.whatsappUrl}

🌐 অফিশিয়াল ফেসবুক প্রোফাইল:
${contacts.facebookUrl}

📧 ইমেইল:
${contacts.email}

আপনার কাজের প্রয়োজনীয় তথ্য এখানে লিখে রাখতে পারেন অথবা হোয়াটসঅ্যাপে মেসেজ পাঠিয়ে দিন। মুরাদ ভাই দ্রুত আপনার সাথে যোগাযোগ করবেন!`;
}

/**
 * Quick prompt suggestion chips for visitors to tap on mobile and desktop.
 */
export const QUICK_PROMPTS = [
  { label: '🎨 YouTube থাম্বনেইল', text: 'আমি একটি হাই-সিটিআর ইউটিউব থাম্বনেইল ডিজাইন করাতে চাই।' },
  { label: '💻 ওয়েবসাইট তৈরি', text: 'আমি একটি আধুনিক ওয়েবসাইট বানাতে চাই, বিস্তারিত বলুন।' },
  { label: '⚡ জরুরি অর্ডার / WhatsApp', text: 'আমার একটি জরুরি কাজ আছে, সরাসরি হোয়াটসঅ্যাপে কথা বলতে চাই।' },
  { label: '💰 কাজের খরচ ও রেট', text: 'আপনার ডিজাইন ও ওয়েবসাইট তৈরির খরচ বা রেট কত?' },
];
