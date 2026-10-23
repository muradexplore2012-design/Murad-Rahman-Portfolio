import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle, AlertCircle, Eye, EyeOff, FileSpreadsheet, Copy, Check, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import type { SiteSettings } from '../../types';
import { getSiteSettings, saveSiteSettings } from '../../services/firestoreService';
import { starterSettings } from '../../services/starterData';

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

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(starterSettings);
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
        const data = await getSiteSettings();
        if (data) {
          setSettings({
            ...data,
            googleSheetWebhookUrl:
              data.googleSheetWebhookUrl ||
              'https://script.google.com/macros/s/AKfycbzi1_nElsw85vuLxhhMJKXEykbbdH68G_SSFshflYZtK_mT6aVv34cnCDDAfwnbJe56/exec',
          });
        }
      } catch (err) {
        console.error(err);
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
      await saveSiteSettings(settings);
      setStatus({ type: 'success', message: 'সাইট সেটিংস সফলভাবে আপডেট হয়েছে!' });
    } catch (err: any) {
      console.error(err);
      setStatus({ type: 'error', message: err.message || 'সেটিংস আপডেট ব্যর্থ হয়েছে।' });
    } finally {
      setIsSaving(false);
    }
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
          <h1 className="text-2xl font-extrabold text-slate-900">এসইও ও সাইট সেটিংস</h1>
          <p className="text-xs text-slate-500 mt-1">
            ওয়েবসাইটের এসইও টাইটেল, মেটা ডেসক্রিপশন এবং সেকশন অন/অফ নিয়ন্ত্রণ করুন।
          </p>
        </div>
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white font-semibold rounded-xl shadow-md shadow-sky-700/20 transition-all text-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'সেভ হচ্ছে...' : 'সেটিংস সেভ করুন'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
