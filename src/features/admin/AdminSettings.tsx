import React, { useEffect, useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sliders,
  Share2
} from 'lucide-react';
import type { SiteSettings } from '../../types';
import {
  getSiteSettings,
  saveSiteSettings,
  getSiteProfile,
  saveSiteProfile
} from '../../services/firestoreService';
import { starterSettings, starterProfile } from '../../services/starterData';

const APPS_SCRIPT_TEMPLATE = `/**
 * ==============================================================================
 * Murad Rahman Portfolio - Google Sheets & Gmail Webhook Script
 * ==============================================================================
 */
var NOTIFICATION_EMAIL = "muradexplore2012@gmail.com";

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Murad Rahman Contact Webhook is ACTIVE and running!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (sheet.getLastRow() === 0) {
      var headers = ["তারিখ ও সময়", "নাম", "ইমেইল", "ফোন / হোয়াটসঅ্যাপ", "বিষয়", "মেসেজ", "ইউজার আইডি"];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#0284c7");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      headerRange.setFontFamily("Arial");
      sheet.setFrozenRows(1);
    }
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Dhaka", "yyyy-MM-dd HH:mm:ss");
    var name = data.name || "Unknown";
    var email = data.email || "No Email";
    var phone = data.phone || "-";
    var subject = data.subject || "Portfolio Inquiry";
    var message = data.message || "";
    var userId = data.userId || "-";
    
    sheet.appendRow([timestamp, name, email, phone, subject, message, userId]);
    
    // মেসেজ যাতে ২ বা ৩ লাইনে অটো ভেঙে সুন্দরভাবে বসে (Text Wrapping & Column Width)
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 6).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
    sheet.getRange(lastRow, 1, 1, 7).setVerticalAlignment("top");
    sheet.setColumnWidth(1, 160); // তারিখ
    sheet.setColumnWidth(2, 130); // নাম
    sheet.setColumnWidth(3, 190); // ইমেইল
    sheet.setColumnWidth(4, 140); // ফোন
    sheet.setColumnWidth(5, 180); // বিষয়
    sheet.setColumnWidth(6, 350); // মেসেজ কলাম (যাতে ২-৩ লাইনে সহজে পড়া যায়)
    sheet.setColumnWidth(7, 130); // ইউজার আইডি
    
    if (NOTIFICATION_EMAIL) {
      var emailSubject = "📬 নতুন পোর্টফোলিও মেসেজ: " + subject + " (" + name + ")";
      var emailBody = 
        "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;'>" +
        "<div style='background-color: #0284c7; color: #ffffff; padding: 16px 20px; border-radius: 8px 8px 0 0;'>" +
        "<h2 style='margin: 0; font-size: 20px;'>Murad Rahman Portfolio</h2>" +
        "<p style='margin: 4px 0 0; font-size: 13px; opacity: 0.9;'>নতুন ক্লায়েন্ট যোগাযোগ মেসেজ এসেছে</p>" +
        "</div>" +
        "<div style='padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: none;'>" +
        "<table style='width: 100%; border-collapse: collapse; font-size: 14px;'>" +
        "<tr><td style='padding: 8px 0; font-weight: bold; color: #475569; width: 130px;'>ক্লাইন্ট নাম:</td><td style='color: #0f172a; font-weight: bold;'>" + name + "</td></tr>" +
        "<tr><td style='padding: 8px 0; font-weight: bold; color: #475569;'>ইমেইল:</td><td><a href='mailto:" + email + "' style='color: #0284c7; text-decoration: none; font-weight: bold;'>" + email + "</a></td></tr>" +
        "<tr><td style='padding: 8px 0; font-weight: bold; color: #475569;'>ফোন / WhatsApp:</td><td style='color: #0f172a;'>" + (phone !== '-' ? phone : 'প্রদান করা হয়নি') + "</td></tr>" +
        "<tr><td style='padding: 8px 0; font-weight: bold; color: #475569;'>বিষয়:</td><td style='color: #0f172a; font-weight: bold;'>" + subject + "</td></tr>" +
        "<tr><td style='padding: 8px 0; font-weight: bold; color: #475569;'>সময়:</td><td style='color: #64748b; font-size: 12px;'>" + timestamp + "</td></tr>" +
        "</table>" +
        "<div style='margin-top: 16px; padding: 14px; background: #ffffff; border-left: 4px solid #0284c7; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);'>" +
        "<p style='margin: 0 0 6px; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase;'>মেসেজ বিবরণ:</p>" +
        "<p style='margin: 0; font-size: 14px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;'>" + message + "</p>" +
        "</div>" +
        "<div style='margin-top: 20px; text-align: center;'>" +
        "<a href='mailto:" + email + "?subject=Re: " + encodeURIComponent(subject) + "' style='display: inline-block; padding: 10px 24px; background-color: #0284c7; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; border-radius: 6px;'>সরাসরি রিপ্লাই দিন</a>" +
        "</div>" +
        "</div>" +
        "</div>";
      
      MailApp.sendEmail({
        to: NOTIFICATION_EMAIL,
        subject: emailSubject,
        htmlBody: emailBody,
        replyTo: email
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Message recorded and email sent successfully"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

/* Official Brand Vector SVGs */
const FacebookLogo: React.FC = () => (
  <div className="w-6 h-6 rounded-md bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-2xs">
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  </div>
);

const TwitterXLogo: React.FC = () => (
  <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center shrink-0 shadow-2xs">
    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  </div>
);

const InstagramLogo: React.FC = () => (
  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center shrink-0 shadow-2xs">
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  </div>
);

const YoutubeLogo: React.FC = () => (
  <div className="w-6 h-6 rounded-md bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-2xs">
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  </div>
);

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'social'>('general');
  const [settings, setSettings] = useState<SiteSettings>(starterSettings);
  const [socialLinks, setSocialLinks] = useState({
    facebook: starterProfile.socialLinks.facebook || '',
    twitter: starterProfile.socialLinks.twitter || '',
    instagram: starterProfile.socialLinks.instagram || '',
    youtube: starterProfile.socialLinks.youtube || '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showScriptCode, setShowScriptCode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  useEffect(() => {
    async function load() {
      try {
        const [settingsData, profileData] = await Promise.all([
          getSiteSettings(),
          getSiteProfile(),
        ]);
        if (settingsData) {
          setSettings({
            ...settingsData,
            googleSheetWebhookUrl:
              settingsData.googleSheetWebhookUrl ||
              'https://script.google.com/macros/s/AKfycbzi1_nElsw85vuLxhhMJKXEykbbdH68G_SSFshflYZtK_mT6aVv34cnCDDAfwnbJe56/exec',
          });
        }
        if (profileData?.socialLinks) {
          setSocialLinks({
            facebook: profileData.socialLinks.facebook || '',
            twitter: profileData.socialLinks.twitter || '',
            instagram: profileData.socialLinks.instagram || '',
            youtube: profileData.socialLinks.youtube || '',
          });
        }
      } catch (err) {
        console.error("Settings load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await Promise.all([
        saveSiteSettings(settings),
        saveSiteProfile({
          socialLinks: {
            facebook: socialLinks.facebook.trim(),
            twitter: socialLinks.twitter.trim(),
            instagram: socialLinks.instagram.trim(),
            youtube: socialLinks.youtube.trim(),
          },
        }),
      ]);

      // Instant local cache update for seamless real-time reflection
      try {
        const cachedProfile = localStorage.getItem('mr_cache_profile');
        if (cachedProfile) {
          const parsed = JSON.parse(cachedProfile);
          parsed.socialLinks = {
            ...(parsed.socialLinks || {}),
            facebook: socialLinks.facebook.trim(),
            twitter: socialLinks.twitter.trim(),
            instagram: socialLinks.instagram.trim(),
            youtube: socialLinks.youtube.trim(),
          };
          localStorage.setItem('mr_cache_profile', JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }

      setStatus({
        type: 'success',
        message: activeTab === 'general' ? 'জেনারেল সেটিংস সফলভাবে আপডেট হয়েছে!' : 'সোশ্যাল মিডিয়া লিংক সফলভাবে সেভ হয়েছে!',
      });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'সেটিংস সেভ করতে ব্যর্থ হয়েছে।' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSocialChange = (field: 'facebook' | 'twitter' | 'instagram' | 'youtube', value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleSection = (key: keyof SiteSettings['sectionVisibility']) => {
    setSettings((prev) => ({
      ...prev,
      sectionVisibility: {
        ...prev.sectionVisibility,
        [key]: !prev.sectionVisibility[key],
      },
    }));
  };

  if (isLoading) {
    return <div className="text-slate-600 text-sm">সেটিংস লোড হচ্ছে...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">সাইট সেটিংস ও সোশ্যাল লিংক</h1>
          <p className="text-xs text-slate-500 mt-1">
            ওয়েবসাইটের এসইও, সেকশন নিয়ন্ত্রণ, গুগল শিট ইন্টিগ্রেশন ও সোশ্যাল মিডিয়া প্রোফাইল লিংক ম্যানেজ করুন।
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setActiveTab('general');
            setStatus({ type: 'idle', message: '' });
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'general'
              ? 'border-[#0284c7] text-[#0284c7] bg-sky-50/70 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>জেনারেল (General)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('social');
            setStatus({ type: 'idle', message: '' });
          }}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'social'
              ? 'border-[#0284c7] text-[#0284c7] bg-sky-50/70 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>সোশ্যাল লিংক (Social Links)</span>
        </button>
      </div>

      {status.type !== 'idle' && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            status.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Tab 1: General Settings */}
        {activeTab === 'general' && (
          <>
            {/* SEO Settings */}
            <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                এসইও ও মেটাডাটা
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ওয়েবসাইট টাইটেল (Title Tag)
                </label>
                <input
                  type="text"
                  required
                  value={settings.siteTitle}
                  onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  সার্চ ইঞ্জিন মেটা বিবরণ (Meta Description)
                </label>
                <textarea
                  rows={3}
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  সোশ্যাল প্রিভিউ ইমেজ URL (Open Graph Image)
                </label>
                <input
                  type="text"
                  value={settings.ogImage || ''}
                  onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                  placeholder="/images/murad-rahman.jpg"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
              </div>
            </div>

            {/* Google Sheets & Gmail Webhook Integration */}
            <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-[#0284c7]">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    গুগল শিট ও জিমেইল নোটিফিকেশন (Google Sheets & Gmail)
                  </h3>
                  <p className="text-xs text-slate-500">
                    পোর্টফোলিওতে মেসেজ আসার সাথে সাথে তা স্বয়ংক্রিয়ভাবে গুগল শিটে জমা হবে এবং আপনার জিমেইলে নোটিফিকেশন যাবে।
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Google Apps Script Web App URL
                </label>
                <input
                  type="url"
                  value={settings.googleSheetWebhookUrl || ''}
                  onChange={(e) => setSettings({ ...settings, googleSheetWebhookUrl: e.target.value })}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] font-mono text-xs"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Google Sheets &gt; Extensions &gt; Apps Script থেকে ডিপ্লয় করা Web App URL টি এখানে পেস্ট করুন।
                </p>
              </div>

              {/* Expandable Apps Script Code and Instructions */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowScriptCode(!showScriptCode)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#0284c7] transition-colors cursor-pointer"
                >
                  <span>গুগল শিট স্ক্রিপ্ট কোড ও সেটআপ গাইড দেখুন</span>
                  {showScriptCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showScriptCode && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900 text-slate-200 text-xs space-y-3 font-sans">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-semibold text-sky-400">Google Apps Script (Code.gs)</span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'কপি হয়েছে!' : 'কোড কপি করুন'}</span>
                      </button>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-300">
                      <pre>{APPS_SCRIPT_TEMPLATE}</pre>
                    </div>

                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 pt-1 leading-relaxed">
                      <li>একটি নতুন Google Sheet খুলুন।</li>
                      <li>মেনু থেকে <strong>Extensions &gt; Apps Script</strong>-এ যান।</li>
                      <li>আগের কোড মুছে দিয়ে উপরের <strong>"কোড কপি করুন"</strong> বাটনে ক্লিক করে পেস্ট করুন।</li>
                      <li>উপরে <strong>Deploy &gt; New deployment</strong> বাটনে ক্লিক করুন।</li>
                      <li>Type হিসেবে <strong>Web app</strong> সিলেক্ট করুন, এবং <strong>Who has access: Anyone</strong> দিন।</li>
                      <li>ডিপ্লয় করার পর প্রাপ্ত Web App URL টি উপরের ইনপুট বক্সে পেস্ট করে <strong>সেটিংস সেভ করুন</strong>।</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>

            {/* Section Visibility Controls */}
            <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                হোমপেজ সেকশন নিয়ন্ত্রণ
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                পাবলিক ওয়েবসাইটে কোন কোন সেকশন প্রদর্শন করা হবে তা এখান থেকে অন/অফ করতে পারেন।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'hero', label: 'হিরো ইন্ট্রো সেকশন' },
                  { key: 'about', label: 'আমার সম্পর্কে (About Section)' },
                  { key: 'services', label: 'সার্ভিসসমূহ (Services Section)' },
                  { key: 'projects', label: 'পোর্টফোলিও / প্রজেক্ট গ্রিড' },
                  { key: 'skills', label: 'স্কিলস ও টুলস (Skills Section)' },
                  { key: 'testimonials', label: 'ক্লায়েন্ট রিভিউ (Reviews Section)' },
                  { key: 'contact', label: 'যোগাযোগ ফর্ম (Contact Section)' },
                ].map(({ key, label }) => {
                  const isVisible = settings.sectionVisibility[key as keyof SiteSettings['sectionVisibility']];
                  return (
                    <div
                      key={key}
                      onClick={() => toggleSection(key as keyof SiteSettings['sectionVisibility'])}
                      className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                        isVisible
                          ? 'bg-sky-50/60 border-sky-300 text-slate-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="text-xs font-semibold">{label}</span>
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        {isVisible ? (
                          <span className="text-[#0284c7] flex items-center gap-1 font-semibold">
                            <Eye className="w-3.5 h-3.5" /> অন
                          </span>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1">
                            <EyeOff className="w-3.5 h-3.5" /> অফ
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Settings */}
            <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                ফুটার কনটেন্ট
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  ফুটার সংক্ষিপ্ত পরিচয়
                </label>
                <input
                  type="text"
                  value={settings.footerBio || ''}
                  onChange={(e) => setSettings({ ...settings, footerBio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  কপিরাইট টেক্সট
                </label>
                <input
                  type="text"
                  value={settings.copyrightText}
                  onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Social Media Links (Only 4 Options: Facebook, Twitter/X, Instagram, YouTube) */}
        {activeTab === 'social' && (
          <div className="rounded-2xl p-6 border border-slate-200 bg-white shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  সোশ্যাল মিডিয়া প্রোফাইল লিংক (Social Media Links)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  হেডার (Navbar), ফুটার এবং 'Design by Murad Rahman' এর ৪টি সোশ্যাল মিডিয়া আইকনের লিংকগুলো এখান থেকে পরিবর্তন ও সেভ করুন।
                </p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-[#0284c7] border border-sky-100 self-start sm:self-auto">
                Navbar & Footer Auto-Sync
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Facebook */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <FacebookLogo />
                    <span>ফেসবুক (Facebook Profile / Page)</span>
                  </label>
                  <span className="text-[10px] text-sky-700 font-bold bg-sky-100/80 px-2 py-0.5 rounded-md">
                    Navbar + Footer
                  </span>
                </div>
                <input
                  type="url"
                  value={socialLinks.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  placeholder="https://www.facebook.com/profile.php?id=..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
                <p className="text-[11px] text-slate-500">
                  হেডারের ফেসবুক আইকন এবং ফুটারের <strong>"Design by Murad Rahman"</strong> ও ফুটার ফেসবুক আইকনে এই লিংক ব্যবহার হবে।
                </p>
              </div>

              {/* X / Twitter */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <TwitterXLogo />
                    <span>এক্স / টুইটার (X / Twitter)</span>
                  </label>
                  <span className="text-[10px] text-slate-700 font-bold bg-slate-200/80 px-2 py-0.5 rounded-md">
                    Navbar + Footer
                  </span>
                </div>
                <input
                  type="url"
                  value={socialLinks.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  placeholder="https://x.com/your_handle"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
                <p className="text-[11px] text-slate-500">
                  হেডার ও ফুটারের X আইকনে ক্লিক করলে ভিজিটর এই ঠিকানায় যাবে।
                </p>
              </div>

              {/* Instagram */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <InstagramLogo />
                    <span>ইনস্টাগ্রাম (Instagram)</span>
                  </label>
                  <span className="text-[10px] text-pink-700 font-bold bg-pink-100/80 px-2 py-0.5 rounded-md">
                    Navbar + Footer
                  </span>
                </div>
                <input
                  type="url"
                  value={socialLinks.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/your_handle"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
                <p className="text-[11px] text-slate-500">
                  হেডার ও ফুটারের ইনস্টাগ্রাম আইকনে ক্লিক করলে এই প্রোফাইলটি ওপেন হবে।
                </p>
              </div>

              {/* YouTube */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <YoutubeLogo />
                    <span>ইউটিউব চ্যানেল (YouTube)</span>
                  </label>
                  <span className="text-[10px] text-red-700 font-bold bg-red-100/80 px-2 py-0.5 rounded-md">
                    Navbar + Footer
                  </span>
                </div>
                <input
                  type="url"
                  value={socialLinks.youtube}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/@channel_name"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7]"
                />
                <p className="text-[11px] text-slate-500">
                  হেডার ও ফুটারের ইউটিউব আইকন ক্লিক করলে সরাসরি চ্যানেলে নিয়ে যাবে।
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white font-bold rounded-xl shadow-md shadow-sky-700/20 transition-all text-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>
              {isSaving
                ? 'সেভ হচ্ছে...'
                : activeTab === 'general'
                ? 'জেনারেল সেটিংস সেভ করুন'
                : 'সোশ্যাল লিংক সেভ করুন'}
            </span>
          </button>
        </div>

      </form>
    </div>
  );
};
