import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { signInWithGoogleCredential, GOOGLE_CLIENT_ID, signInWithGoogle } from '../lib/auth';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string; select_by?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: string;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number | string;
              locale?: string;
            }
          ) => void;
          prompt?: (momentListener?: (notification: any) => void) => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess: (user: User) => void;
  onError?: (errorMessage: string) => void;
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  size?: 'large' | 'medium' | 'small';
  shape?: 'rectangular' | 'pill';
  width?: number;
  className?: string;
  buttonText?: string;
}

const GoogleSvgIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  theme = 'outline',
  text = 'continue_with',
  size = 'large',
  shape = 'rectangular',
  width = 320,
  className = '',
  buttonText = 'Google দিয়ে সাইন-ইন'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [gisFailed, setGisFailed] = useState(false);

  const hasClientId = Boolean(
    GOOGLE_CLIENT_ID &&
    !GOOGLE_CLIENT_ID.includes('YOUR_') &&
    !GOOGLE_CLIENT_ID.includes('xxxx') &&
    GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')
  );

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      if (!response.credential) {
        onError?.('গুগল থেকে ক্রেডেনশিয়াল পাওয়া যায়নি। আবার চেষ্টা করুন।');
        return;
      }

      try {
        setIsAuthenticating(true);
        // Bulletproof: convert Google JWT credential to Firebase Auth credential
        const user = await signInWithGoogleCredential(response.credential);
        onSuccess(user);
      } catch (err: any) {
        console.error('GIS authentication error:', err);
        onError?.(err.message || 'গুগল সাইন-ইন সম্পন্ন করা যায়নি।');
      } finally {
        setIsAuthenticating(false);
      }
    },
    [onSuccess, onError]
  );

  useEffect(() => {
    if (!hasClientId) {
      return;
    }

    let isMounted = true;
    let timer: any = null;
    let attempts = 0;

    const setupGis = () => {
      if (!isMounted) return true;

      if (window.google?.accounts?.id && containerRef.current) {
        try {
          // 1. Initialize Google Identity Services
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
          });

          // 2. Clear previous iframe children if any to prevent duplication
          containerRef.current.innerHTML = '';

          // 3. Render official GIS button into the permanent container
          window.google.accounts.id.renderButton(containerRef.current, {
            type: 'standard',
            theme,
            size,
            text,
            shape,
            logo_alignment: 'left',
            width,
          });

          if (isMounted) {
            renderedRef.current = true;
            setIsRendered(true);
            setGisFailed(false);
          }
          return true;
        } catch (err) {
          console.error('Error rendering GIS button:', err);
          if (isMounted) setGisFailed(true);
          return true;
        }
      }

      return false;
    };

    if (!setupGis()) {
      timer = setInterval(() => {
        attempts++;
        if (setupGis() || attempts >= 40) {
          clearInterval(timer);
          if (attempts >= 40 && !renderedRef.current && isMounted) {
            setGisFailed(true);
          }
        }
      }, 150);
    }

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [hasClientId, handleCredentialResponse, theme, size, text, shape, width]);

  // Fallback click handler if GIS is unavailable or Client ID not yet set
  const handleFallbackClick = async () => {
    try {
      setIsAuthenticating(true);
      const user = await signInWithGoogle();
      onSuccess(user);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        onError?.(err.message || 'গুগল সাইন-ইন ব্যর্থ হয়েছে।');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div
      className={`relative w-full max-w-full flex items-center justify-center min-h-[44px] ${className}`}
      style={{ minHeight: '44px' }}
    >
      {/* 
        PERMANENT STABLE CONTAINER:
        Always remains mounted in the DOM to prevent layout shifts or iframe unmounting
      */}
      <div
        ref={containerRef}
        className={`w-full flex items-center justify-center transition-opacity duration-200 ${
          isAuthenticating ? 'opacity-40 pointer-events-none' : 'opacity-100'
        } ${!isRendered && hasClientId && !gisFailed ? 'invisible h-0 overflow-hidden' : ''}`}
        style={{ minHeight: isRendered ? '44px' : undefined }}
      />

      {/* Placeholder / Skeleton while GIS script is loading */}
      {!isRendered && hasClientId && !gisFailed && (
        <div
          className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 text-xs font-medium animate-pulse"
          style={{ maxWidth: width, height: '44px' }}
        >
          <GoogleSvgIcon />
          <span>Google সাইন-ইন লোড হচ্ছে...</span>
        </div>
      )}

      {/* Fallback button if GIS script blocked or Client ID missing */}
      {(!hasClientId || gisFailed) && (
        <button
          type="button"
          onClick={handleFallbackClick}
          disabled={isAuthenticating}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-60"
          style={{ maxWidth: width, height: '44px' }}
        >
          <GoogleSvgIcon />
          <span>{buttonText}</span>
        </button>
      )}

      {/* 
        CLEAN CENTERED LOADING SPINNER OVERLAY:
        Directly centered over the button container during authentication 
      */}
      {isAuthenticating && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center rounded-lg border border-slate-200 shadow-xs z-20 pointer-events-auto">
          <div className="w-5 h-5 border-2 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
          <span className="ml-2.5 text-xs font-bold text-slate-800">লগইন যাচাই হচ্ছে...</span>
        </div>
      )}
    </div>
  );
};
