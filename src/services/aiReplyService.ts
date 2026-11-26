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
 * Formats WhatsApp URL correctly from either a phone number or an existing wa.me link.
 */
export function formatWhatsappUrl(rawPhone?: string): string {
  if (!rawPhone) return 'https://wa.me/8801566088159';
  if (rawPhone.startsWith('http://') || rawPhone.startsWith('https://')) return rawPhone;
  let cleanNumber = rawPhone.replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '88' + cleanNumber;
  } else if (!cleanNumber.startsWith('880') && cleanNumber.length === 10) {
    cleanNumber = '880' + cleanNumber;
  }
  return `https://wa.me/${cleanNumber || '8801566088159'}`;
}

/**
 * Detects whether the user is primarily speaking English.
 */
function isEnglishText(text: string): boolean {
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
export function getContactDetails(profile?: SiteProfile, settings?: SiteSettings) {
  // 1. WhatsApp
  const rawPhone = settings?.autoReplyWhatsapp || profile?.whatsapp || profile?.phone || '01566088159';
  const whatsappUrl = formatWhatsappUrl(rawPhone);

  // 2. Facebook Profile
  const facebookUrl =
    settings?.autoReplyFacebook ||
    profile?.socialLinks?.facebook ||
    'https://www.facebook.com/profile.php?id=100085471628384';

  // 3. Email
  const email = profile?.email || 'muradrahman2026@gmail.com';

  // 4. Portfolio URL
  const portfolioUrl = 'https://muradrahman1.netlify.app/#projects';

  return { whatsappUrl, facebookUrl, email, portfolioUrl };
}

/**
 * Calls Google Gemini API if an API key is configured.
 * Uses gemini-1.5-flash with timeout and graceful fallback.
 */
async function callGeminiApi(
  apiKey: string,
  userMessage: string,
  profile?: SiteProfile,
  settings?: SiteSettings,
  history?: ChatReply[]
): Promise<string | null> {
  try {
    const contacts = getContactDetails(profile, settings);
    const muradName = profile?.name || 'মুরাদ রহমান (Murad Rahman)';

    const systemPrompt = settings?.aiSystemPrompt?.trim() || `You are the friendly, polite, and intelligent 24/7 personal AI Assistant representing ${muradName} on his official portfolio website.
Murad Rahman is a professional Graphic Designer and Web Developer based in Bangladesh.

Key Facts about Murad Rahman:
- Expertise:
  1. YouTube Thumbnails: High-CTR, eye-catching, custom aesthetic designs (Gaming, Tech, Vlog, News, Tutorials). Ultra HD (1080p, 4K). Turnaround: 6-12 hours (express 2-4 hrs available).
  2. Graphic Design: Professional Logos, Facebook covers, YouTube channel art, banners, posters, social media graphics, branding.
  3. Web Development: Modern, responsive portfolio websites, landing pages, business websites, React, HTML/CSS, WordPress & Blogger customization. Fast, SEO-friendly.
- Communication & Tone Guidelines:
  - Match the user's language and tone! If they ask in Bengali (বাংলা), reply in polite, natural Bengali. If they ask in English, reply in natural English. If they write in Banglish (Bengali written in English alphabet, e.g. 'kemon আছেন', 'ki obostha', 'khoroch koto'), reply in friendly Bengali or Banglish.
  - DO NOT sound like a robotic spammer! DO NOT dump long bulleted lists on simple casual greetings.
  - For simple greetings (Hi, Hello, Salam, Kemon acho, Hey, Bhai), reply conversationally in 1-2 friendly sentences!
  - ONLY share WhatsApp (${contacts.whatsappUrl}) or Facebook (${contacts.facebookUrl}) when the user explicitly asks for contact, wants to place an order, asks for direct phone number, or has an urgent project.
  - Answer their questions directly, accurately, concisely, and helpfully.`;

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Append recent history (up to last 6 messages) for multi-turn context
    if (history && history.length > 0) {
      const recent = history.slice(-6);
      for (const h of recent) {
        if (!h.text) continue;
        const role = h.sender === 'user' ? 'user' : 'model';
        contents.push({
          role,
          parts: [{ text: h.text }],
        });
      }
    }

    // Append current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn('Gemini API responded with status:', res.status);
      return null;
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidate && typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
    return null;
  } catch (err) {
    console.warn('Gemini API call skipped or timed out, using intelligent local engine:', err);
    return null;
  }
}

/**
 * Advanced, human-like conversational fallback engine.
 * Understands user intent and returns natural, context-specific answers.
 * NEVER dumps generic walls of text on simple greetings.
 */
function generateLocalConversationalReply(
  userMessage: string,
  profile?: SiteProfile,
  settings?: SiteSettings,
  history?: ChatReply[]
): string {
  const norm = normalizeText(userMessage);
  const isEng = isEnglishText(userMessage);
  const contacts = getContactDetails(profile, settings);

  // Check if we already greeted the user in recent history
  const recentReplies = history?.slice(-4) || [];
  const alreadyGreeted = recentReplies.some(
    (r) => r.sender === 'admin' && (r.text.includes('কেমন আছেন') || r.text.includes('স্বাগতম') || r.text.includes('Welcome'))
  );

  // 1. ISLAMIC GREETING (Salam)
  const salamPatterns = ['assalamu alaikum', 'assalamualaikum', 'salam', 'সালাম', 'আসসালামু আলাইকুম'];
  if (matchesPattern(norm, salamPatterns)) {
    return `ওয়ালাইকুম আসসালাম! কেমন আছেন? মুরাদ রহমানের পোর্টফোলিওতে আপনাকে স্বাগতম। আজ আপনাকে কী বিষয়ে সহযোগিতা করতে পারি?`;
  }

  // 2. HOW ARE YOU / WELLBEING
  const wellbeingPatterns = [
    'kemon acho', 'kemon achen', 'how are you', 'কেমন আছেন', 'কেমন আছো',
    'ki obostha', 'ki khobor', 'how do you do', 'valo achen', 'bhalo achen'
  ];
  if (matchesPattern(norm, wellbeingPatterns)) {
    if (isEng) {
      return `I'm doing great, thank you! How are you doing today? How can I assist you with your design or website project? 😊`;
    }
    return `আলহামদুলিল্লাহ, ভালো আছি! আপনি কেমন আছেন? আপনার কি কোনো ডিজাইন, থাম্বনেইল বা ওয়েবসাইট তৈরির প্রজেক্ট আছে?`;
  }

  // 3. CASUAL HELLO / HI
  const helloPatterns = ['hello', 'hi', 'hey', 'hola', 'helo', 'hy', 'hii', 'হ্যালো', 'হে'];
  // Check if text is just a short greeting
  const isPureGreeting = norm.split(' ').length <= 2 && matchesPattern(norm, helloPatterns);
  if (isPureGreeting) {
    if (isEng) {
      if (alreadyGreeted) {
        return `Hello again! How can I assist you today? Are you looking for YouTube thumbnail design, graphics, or web development?`;
      }
      return `Hello! Welcome to Murad Rahman's portfolio. How can I assist you with your design or development project today?`;
    }
    if (alreadyGreeted) {
      return `হ্যালো! বলুন, আপনার জন্য কী করতে পারি? আপনি কি কোনো থাম্বনেইল, ব্যানার বা ওয়েবসাইট তৈরি নিয়ে আলোচনা করতে চান?`;
    }
    return `হ্যালো! কেমন আছেন? মুরাদ রহমানের পোর্টফোলিওতে আপনাকে স্বাগতম। আপনি কি কোনো নির্দিষ্ট কাজ বা প্রজেক্ট নিয়ে কথা বলতে চান?`;
  }

  // 4. ADDRESSING BROTHER / CASUAL
  const brotherPatterns = ['vai', 'bhai', 'ভাই', 'bro', 'boss', 'bhaiya', 'ভাইয়া', 'apni ki manush', 'manush na bot'];
  if (matchesPattern(norm, brotherPatterns)) {
    return `জি ভাই! বলুন কীভাবে সহযোগিতা করতে পারি? আপনি কি কোনো থাম্বনেইল, ব্যানার বা ওয়েবসাইটের কাজ করাতে চান?`;
  }

  // 5. WHO ARE YOU / WHAT IS YOUR NAME / ABOUT AI
  const aiIdentityPatterns = [
    'apnar nam ki', 'আপনার নাম কি', 'নাম কি', 'who are you', 'apni ke',
    'tumi ke', 'পরিচয়', 'naam ki', 'tumi k', 'apni k'
  ];
  if (matchesPattern(norm, aiIdentityPatterns)) {
    if (isEng) {
      return `I am Murad Rahman's 24/7 AI Assistant! I am here to help answer questions about Murad's services, portfolio, pricing, and project turnaround. How can I help you today?`;
    }
    return `আমি মুরাদ রহমানের সার্বক্ষণিক এআই অ্যাসিস্ট্যান্ট (AI Assistant)। মুরাদ ভাইয়ের হয়ে ক্লায়েন্টদের বিভিন্ন প্রশ্নের উত্তর দেওয়া ও কাজের তথ্য দেওয়াই আমার কাজ। মুরাদ ভাই একজন প্রফেশনাল গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার। আপনি কী জানতে চান?`;
  }

  // 6. WHO IS MURAD RAHMAN
  const muradIdentityPatterns = [
    'who is murad', 'মুরাদ কে', 'মুরাদ রহমান কে', 'murad ke', 'about murad', 'murad rahman k'
  ];
  if (matchesPattern(norm, muradIdentityPatterns)) {
    if (isEng) {
      return `Murad Rahman is a passionate Graphic Designer & Web Developer based in Bangladesh. He specializes in High-CTR YouTube Thumbnails, Professional Branding, and Modern Web Development.`;
    }
    return `মুরাদ রহমান একজন দক্ষ ও অভিজ্ঞ গ্রাফিক্স ডিজাইনার এবং ওয়েব ডেভেলপার। তিনি প্রধানত ইউটিউব থাম্বনেইল (High-CTR কনসেপ্ট), সোশ্যাল মিডিয়া ব্যানার ও পোস্টার, এবং আধুনিক ওয়েবসাইট ও ল্যান্ডিং পেজ তৈরি করে থাকেন।`;
  }

  // 7. LOCATION / WHERE DO YOU LIVE / ADDRESS
  const locationPatterns = [
    'bari koi', 'bari kothay', 'thaken koi', 'location', 'address',
    'কোথায় থাকেন', 'বাড়ি কোথায়', 'কোথায় বাড়ি', 'where do you live', 'kothay thaken'
  ];
  if (matchesPattern(norm, locationPatterns)) {
    if (isEng) {
      return `Murad Rahman is based in Bangladesh and works remotely with clients worldwide. You can place orders online from anywhere!`;
    }
    return `মুরাদ রহমানের বাড়ি বাংলাদেশে। তিনি অনলাইনে দেশ ও বিদেশের যেকোনো ক্লায়েন্টের সাথে দূরবর্তীভাবে (remotely) কাজ করে থাকেন। তাই আপনি যেকোনো স্থান থেকেই অনলাইনে কাজের অর্ডার দিতে পারেন।`;
  }

  // 8. LIST OF SERVICES / WHAT DO YOU DO
  const servicesPatterns = [
    'ki ki kaj koren', 'services', 'service', 'what do you do', 'কাজের তালিকা',
    'কাজ কি কি', 'ki kaj koren', 'what services', 'ki service den'
  ];
  if (matchesPattern(norm, servicesPatterns)) {
    if (isEng) {
      return `Murad Rahman specializes in 3 primary creative areas:
1. 🎨 High-CTR YouTube Thumbnails (Gaming, Tech, Vlogs, Podcasts, News)
2. 🖼️ Professional Graphic Design (Logos, Facebook/YouTube covers, posters, branding)
3. 💻 Modern Web Development (Custom portfolio sites, landing pages, WordPress & Blogger)

Which service are you interested in?`;
    }
    return `মুরাদ রহমান প্রধানত ৩টি ক্যাটাগরিতে কাজ করেন:
১. 🎨 হাই-সিটিআর ইউটিউব থাম্বনেইল ডিজাইন (গেমিং, টেক, ভ্লগ, পডকাস্ট, টিউটোরিয়াল)
২. 🖼️ প্রফেশনাল গ্রাফিক্স ডিজাইন (লোগো, ফেসবুক/ইউটিউব ব্যানার, সোশ্যাল পোস্টার)
৩. 💻 আধুনিক ও রেসপনসিভ ওয়েবসাইট এবং ল্যান্ডিং পেজ ডেভেলপমেন্ট

আপনার ঠিক কোন ধরনের কাজ প্রয়োজন?`;
  }

  // 9. PRICING / COST / HOW MUCH
  const pricePatterns = [
    'dam koto', 'khoroch koto', 'price', 'rate', 'cost', 'টাকা', 'কত টাকা',
    'how much', 'budget', 'fe', 'fee', 'charge', 'khoroc koto', 'রেট কত'
  ];
  if (matchesPattern(norm, pricePatterns)) {
    if (isEng) {
      return `Pricing depends on the scope and complexity of your project:
• YouTube Thumbnails: Affordable, creator-friendly rates
• Banners & Social Posters: Based on design requirements
• Websites & Landing Pages: Depends on features and page count

Please share what type of project you have in mind so we can give you a specific estimate!`;
    }
    return `কাজের ধরন ও রিকোয়ারমেন্ট অনুযায়ী রেট আলোচনা করা হয়:
• ইউটিউব থাম্বনেইল: অত্যন্ত সাশ্রয়ী ও বাজেট-ফ্রেন্ডলি রেটে
• সোশ্যাল ব্যানার বা পোস্টার: ডিজাইনের জটিলতা ও সাইজ অনুযায়ী
• ওয়েবসাইট ও ল্যান্ডিং পেজ: ফিচার ও পেজ সংখ্যার ওপর নির্ভর করে

আপনি ঠিক কী ধরনের কাজ করাতে চান জানালে আমি সঠিক আইডিয়া দিতে পারব!`;
  }

  // 10. DELIVERY TIME / TURNAROUND
  const deliveryPatterns = [
    'koto din lagbe', 'delivery time', 'somoy', 'সময়', 'kobe pabo',
    'how long', 'koto somoy lagbe', 'turnaround', 'কত দিন লাগবে', 'কবে পাবো'
  ];
  if (matchesPattern(norm, deliveryPatterns)) {
    if (isEng) {
      return `Delivery Timeline:
• YouTube Thumbnails: 6 to 12 hours (express 2-4 hr delivery available for urgent projects)
• Social Banners & Posters: 12 to 24 hours
• Full Websites: 2 to 5 days depending on features

Do you have an urgent deadline?`;
    }
    return `কাজের ডেলিভারি সময়সীমা:
• ইউটিউব থাম্বনেইল: ৬ থেকে ১২ ঘণ্টা (জরুরি ক্ষেত্রে ২-৪ ঘণ্টার মধ্যে এক্সপ্রেস ডেলিভারি)
• সোশ্যাল ব্যানার/পোস্টার: ১২ থেকে ২৪ ঘণ্টা
• সম্পূর্ণ ওয়েবসাইট: ২ থেকে ৫ দিন (প্রজেক্ট সাইজ অনুযায়ী)

আপনার কি কোনো জরুরি ডেডলাইন আছে?`;
  }

  // 11. URGENT WORK / ORDER / DIRECT CONTACT / WHATSAPP / PHONE
  const orderPatterns = [
    'order', 'অর্ডার', 'জরুরি', 'urgent', 'whatsapp', 'phone', 'number',
    'কথা বলতে চাই', 'jogajog', 'যোগাযোগ', 'কল', 'call', 'kotha bolte chai',
    'hire', 'হায়ার', 'নাম্বার', 'mobile', 'ইনবক্স', 'direct'
  ];
  if (matchesPattern(norm, orderPatterns)) {
    if (isEng) {
      return `To place an order or discuss your project directly with Murad Rahman, please reach out via:

📱 WhatsApp Direct:
${contacts.whatsappUrl}

🌐 Facebook Profile:
${contacts.facebookUrl}

📧 Email:
${contacts.email}

Send a quick message with your project reference or topic, and Murad will reply promptly!`;
    }
    return `সরাসরি মুরাদ ভাইয়ের সাথে কথা বলে প্রজেক্ট শুরু করতে নিচের মাধ্যমে যোগাযোগ করুন:

📱 সরাসরি হোয়াটসঅ্যাপ (WhatsApp):
${contacts.whatsappUrl}

🌐 অফিশিয়াল ফেসবুক প্রোফাইল:
${contacts.facebookUrl}

📧 ইমেইল:
${contacts.email}

হোয়াটসঅ্যাপে আপনার কাজের বিবরণ বা শিরোনাম লিখে পাঠিয়ে দিন। মুরাদ ভাই দ্রুত আপনার মেসেজ দেখে কাজ শুরু করে দেবেন!`;
  }

  // 12. YOUTUBE THUMBNAIL DETAILS
  const thumbnailPatterns = ['thumbnail', 'থাম্বনেইল', 'থাম্বনেল', 'thambnail', 'thumnail', 'yt thumb'];
  if (matchesPattern(norm, thumbnailPatterns)) {
    if (isEng) {
      return `Looking for YouTube Thumbnails? 🚀
Murad Rahman crafts High-CTR, custom thumbnails tailored for Gaming, Tech, Vlogs, Tutorials, and News channels.
• Ultra HD (1080p, 4K) resolution
• Fast 6 to 12 hour delivery
• Editable PSD files available

What topic is your upcoming video about?`;
    }
    return `ইউটিউব থাম্বনেইল ডিজাইনের জন্য সঠিক জায়গায় এসেছেন! 🚀
মুরাদ রহমান ইউটিউব কনটেন্ট ক্রিয়েটরদের জন্য হাই-সিটিআর (High-CTR) থাম্বনেইল তৈরিতে বিশেষ অভিজ্ঞ। গেমিং, টেক, ভ্লগ, পডকাস্ট, টিউটোরিয়াল বা নিউজ—সব ধরনের চ্যানেলের থাম্বনেইল ফুল এইচডি কোয়ালিটিতে ৬ থেকে ১২ ঘণ্টার মধ্যে তৈরি করা হয়।

আপনার ভিডিওর শিরোনাম বা বিষয়বস্তু কী?`;
  }

  // 13. WEBSITE & WORDPRESS DETAILS
  const webPatterns = ['website', 'ওয়েবসাইট', 'ওয়েব', 'wordpress', 'landing page', 'web design', 'web development'];
  if (matchesPattern(norm, webPatterns)) {
    if (isEng) {
      return `Interested in Web Development? 💻
Murad Rahman creates fast, modern, and mobile-responsive websites:
• Personal Portfolio & Resume Websites
• High-Converting Landing Pages
• Business Sites & WordPress Customization
• 100% responsive across mobile, tablet, and desktop

Let us know what kind of website you are planning!`;
    }
    return `আধুনিক ওয়েবসাইট তৈরির জন্য যোগাযোগ করেছেন? 💻
মুরাদ রহমান দৃষ্টিনন্দন, দ্রুতগতির এবং মোবাইল-রেসপনসিভ ওয়েবসাইট তৈরিতে অভিজ্ঞ:
• পার্সোনাল পোর্টফোলিও ওয়েবসাইট
• হাই-কনভার্টিং ল্যান্ডিং পেজ
• বিজনেস ওয়েবসাইট ও ওয়ার্ডপ্রেস কাস্টমাইজেশন
• মোবাইল ও কম্পিউটার—সব ডিভাইসে ১০০% রেসপনসিভ

আপনি কী ধরনের ওয়েবসাইট তৈরি করতে চান?`;
  }

  // 14. LOGO & GRAPHICS DETAILS
  const graphicPatterns = ['logo', 'লোগো', 'banner', 'ব্যানার', 'poster', 'পোস্টার', 'graphic', 'গ্রাফিক্স'];
  if (matchesPattern(norm, graphicPatterns)) {
    if (isEng) {
      return `Need Graphic Design or Branding? 🎨
Murad Rahman provides custom logos, YouTube banners, Facebook covers, and social media posters tailored to your brand identity.
What kind of design do you need?`;
    }
    return `গ্রাফিক্স ডিজাইনের কাজের জন্য নক দিয়েছেন? 🎨
লোগো, ফেসবুক কভার, ইউটিউব ব্যানার, সোশ্যাল মিডিয়া পোস্টার এবং সম্পূর্ণ ব্র্যান্ডিং ডিজাইনের কাজ নিখুঁতভাবে করা হয়। আপনার কি কোনো নির্দিষ্ট ব্যানার বা লোগো প্রয়োজন?`;
  }

  // 15. THANKS & APPRECIATION
  const thanksPatterns = ['dhonnobad', 'ধন্যবাদ', 'thanks', 'thank you', 'thx', 'shukriya', 'onek dhonnobad'];
  if (matchesPattern(norm, thanksPatterns)) {
    if (isEng) {
      return `You're very welcome! 😊 Feel free to ask anytime if you need anything else.`;
    }
    return `আপনাকেও অনেক অনেক ধন্যবাদ! 😊 আপনার আর কোনো প্রশ্ন বা কাজের প্রয়োজন থাকলে নির্দ্বিধায় জানাতে পারেন।`;
  }

  // 16. GOODBYE
  const byePatterns = ['bye', 'বিদায়', 'allah hafez', 'tata', 'good night', 'pore kotha hobe', 'pore bolbo'];
  if (matchesPattern(norm, byePatterns)) {
    if (isEng) {
      return `Goodbye and have a wonderful day! Feel free to reach out whenever you have a project in mind. 👋`;
    }
    return `আল্লাহ হাফেজ! ভালো থাকবেন। যেকোনো প্রয়োজনে আবার নক দিতে পারেন। শুভ কামনা! 👋`;
  }

  // 17. NATURAL FALLBACK (Conversational & Friendly, NOT a copy-paste link dump)
  if (isEng) {
    return `Thank you for your message! Murad Rahman personally reviews all project inquiries. You can describe what you need here, or message Murad directly on WhatsApp for an instant response:
📱 WhatsApp: ${contacts.whatsappUrl} 😊`;
  }

  return `আপনার মেসেজটির জন্য ধন্যবাদ! মুরাদ রহমান কাজের ফাঁকে মেসেজগুলো নিজে চেক করে রিপ্লাই দিয়ে থাকেন। আপনি চাইলে কাজের বিস্তারিত এখানে লিখে রাখতে পারেন, অথবা তাৎক্ষণিক কথা বলতে সরাসরি মুরাদ ভাইয়ের হোয়াটসঅ্যাপেও মেসেজ দিতে পারেন:
📱 WhatsApp: ${contacts.whatsappUrl} 😊`;
}

/**
 * Main AI Auto-Reply generator.
 * Tries Google Gemini API first if configured, then seamlessly falls back to the rich local engine.
 */
export async function generateAiAutoReply(
  userMessage: string,
  profile?: SiteProfile,
  settings?: SiteSettings,
  history?: ChatReply[]
): Promise<string> {
  const geminiKey = settings?.geminiApiKey?.trim() || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();

  if (geminiKey) {
    const geminiReply = await callGeminiApi(geminiKey, userMessage, profile, settings, history);
    if (geminiReply) {
      return geminiReply;
    }
  }

  // Intelligent local conversational engine
  return generateLocalConversationalReply(userMessage, profile, settings, history);
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
