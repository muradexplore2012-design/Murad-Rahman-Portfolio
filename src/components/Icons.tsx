import React from 'react';

export const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

// Adobe Illustrator Icon
export const IllustratorIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.04" />
    <path
      d="M7.2 16.5L9.9 8.2h1.5l2.7 8.3h-1.4l-.7-2.3H9.3l-.7 2.3H7.2zm2.5-3.5h2.2L10.8 9.7l-1.1 3.3zM15.4 10.1a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8zm-.8 6.4v-4.9h1.5v4.9h-1.5z"
      fill="currentColor"
    />
  </svg>
);

// Adobe Photoshop Icon
export const PhotoshopIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.04" />
    <path
      d="M6.8 8.2h3.6c1.6 0 2.7.9 2.7 2.3 0 1.5-1.1 2.3-2.7 2.3H8.5v3.7H6.8V8.2zm1.7 3.2h1.8c.7 0 1.1-.4 1.1-1 0-.6-.4-.9-1.1-.9H8.5v1.9zm5.7 2.9c.5.4 1.1.6 1.8.6.9 0 1.3-.4 1.3-.9 0-.5-.5-.8-1.5-1-1.3-.4-2.3-.8-2.3-2.1 0-1.4 1.1-2.3 2.5-2.3 1 0 1.7.3 2.2.7l-.6 1.2c-.4-.3-1-.5-1.6-.5-.8 0-1.2.4-1.2.9 0 .5.4.8 1.4 1 1.4.4 2.4.9 2.4 2.2 0 1.4-1.1 2.3-2.7 2.3-1.1 0-2-.4-2.6-.9l.7-1.2z"
      fill="currentColor"
    />
  </svg>
);

// WordPress Icon
export const WordpressIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2C6.486 2 2 6.486 2 12c0 5.514 4.486 10 10 10s10-4.486 10-10C22 6.486 17.514 2 12 2zm0 18.2a8.2 8.2 0 0 1-5.07-1.76l4.28-11.73a1.14 1.14 0 0 1 1.09-.75 1.16 1.16 0 0 1 1.09.76l4.28 11.72A8.17 8.17 0 0 1 12 20.2zm6.75-8.52a6.3 6.3 0 0 1 .1 1.12 7.76 7.76 0 0 1-1.07 3.86l-2.48-7.22a2.33 2.33 0 0 0 1-.78 1.92 1.92 0 0 0 .34-1.14 1.85 1.85 0 0 0-.27-1 8.13 8.13 0 0 1 2.38 5.16zM8.7 8.64a2.23 2.23 0 0 0 .93.75l-2.52 7.33A8.17 8.17 0 0 1 5.25 12a8.3 8.3 0 0 1 .47-2.75 3 3 0 0 0 .92.17c.8 0 1.42-.4 1.42-1.2 0-.25-.07-.48-.15-.71l.79.13zm3.3 2.33l-2.3 6.64-1.74-5.06a1.35 1.35 0 0 0 .91-.32 1.3 1.3 0 0 0 .42-.94 1.25 1.25 0 0 0-.13-.57l2.84.25zm.5 6.64l2.06-6-1.57-4.57.85-.06a1.07 1.07 0 0 0 .54.14 1.33 1.33 0 0 0 .91-.34 1.18 1.18 0 0 0 .37-.88l.21.01z" />
  </svg>
);

// Google Ads / Google Icon (Matching Reference)
export const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 4.5c2.3 0 4.1.9 5.5 2.2l3.4-3.4C18.8 1.4 15.6 0 12 0 7.3 0 3.3 2.7 1.3 6.6l3.9 3.1C6.2 6.8 8.8 4.5 12 4.5zM23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.8h6.5c-.3 1.6-1.2 2.9-2.5 3.8l3.9 3.1c2.3-2.1 3.6-5.3 3.6-9.4zM5.2 14.3C4.9 13.5 4.8 12.8 4.8 12s.1-1.5.4-2.3L1.3 6.6C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l3.9-3.1zM12 24c3.6 0 6.6-1.2 8.8-3.3l-3.9-3.1c-1.1.8-2.6 1.4-4.9 1.4-3.2 0-5.8-2.3-6.8-5.2L1.3 16.9C3.3 20.8 7.3 24 12 24z"/>
  </svg>
);

// Facebook Icon (Matching Reference)
export const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

// YouTube Icon (Matching Reference)
export const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// Email Marketing / Yahoo y! Icon (Matching Reference)
export const YahooEmailIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M11.9 14.8L6.4 5.2h3.4l3.5 6.4 3.5-6.4h3.4l-5.5 9.6v6H11.9v-6zM19.5 5.2h2.2v10.8h-2.2V5.2zm0 13.2h2.2v2.8h-2.2v-2.8z" />
  </svg>
);

// Instagram Icon (Matching Reference)
export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
