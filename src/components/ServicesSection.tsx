import React, { useEffect, useRef, useState } from 'react';
import type { Service } from '../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectService?: (serviceTitle: string) => void;
  whatsapp?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectService,
  whatsapp,
}) => {
  const publishedServices = services.filter((s) => s.isPublished);

  const cardsRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!cardsRef.current) return;

    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(cardsRef.current);

    return () => observer.disconnect();
  }, []);

  if (publishedServices.length === 0) {
    return null;
  }

  // Clean phone number for WhatsApp link
  const cleanPhone = (whatsapp || '').replace(/[^0-9]/g, '');

  const getWhatsAppUrl = (serviceTitle: string) => {
    const message = encodeURIComponent(
      `Hello Murad, I am interested in your service: "${serviceTitle}". Could you please share more details?`
    );
    if (cleanPhone) {
      return `https://wa.me/${cleanPhone}?text=${message}`;
    }
    return `#contact`;
  };

  return (
    <section id="services" className="py-20 relative bg-slate-50/70 border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <p className="text-sm sm:text-base font-bold text-slate-900 tracking-wide mb-1">
            My Service
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0284c7] tracking-tight">
            আমার সার্ভিস দেখুন
          </h2>
        </div>

        {/* Services Grid: Observed directly so animation plays right in front of user */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-6xl mx-auto"
        >
          {publishedServices.map((service, index) => {
            const waUrl = getWhatsAppUrl(service.title);
            const isExternal = waUrl.startsWith('http');

            return (
              <div
                key={service.id}
                style={{
                  animation: inView
                    ? `serviceCardRise 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.35 + 0.15}s both`
                    : 'none',
                }}
                className={`bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-300 service-card-animated ${
                  inView ? '' : 'opacity-0 translate-y-36'
                }`}
              >
                <div>
                  {/* Banner Image / Card Header Visual */}
                  <div className="relative w-full aspect-[299/240] rounded-xl overflow-hidden bg-slate-900 select-none shadow-xs border border-slate-200/50">
                    {service.coverImage ? (
                      <img
                        src={service.coverImage}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        loading="lazy"
                      />
                    ) : (
                      /* Fallback styled card banner if no coverImage is provided */
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 via-sky-950 to-slate-950 p-5 flex flex-col justify-between text-white relative">
                        {/* Orange Price Badge */}
                        {(service.badgeText || service.startingPrice) && (
                          <div className="w-14 h-14 rounded-full bg-[#e04f16] text-white flex flex-col items-center justify-center font-bold shadow-md text-[10px] leading-tight">
                            <span>শুরু</span>
                            <span className="text-xs">{service.startingPrice || '২৯৯৳'}</span>
                            <span>থেকে</span>
                          </div>
                        )}
                        <div className="mt-auto">
                          <p className="text-base sm:text-lg font-bold text-white leading-snug">
                            {service.description || service.title}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug my-3.5 sm:my-4 line-clamp-2 min-h-[44px] flex items-center">
                    {service.title}
                  </h3>
                </div>

                {/* Bottom Frame: Delivery Info & WhatsApp Button */}
                <div className="border border-[#0284c7]/40 rounded-lg p-3 sm:p-3.5 flex items-center justify-between mt-auto bg-white gap-2">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight truncate">
                      {service.deliveryTime || '3-5Days Delivery'}
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 truncate">
                      {service.ratingText || '4.9 (210+ Reviews)'}
                    </p>
                  </div>

                  <a
                    href={waUrl}
                    target={isExternal ? '_blank' : '_self'}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    onClick={() => onSelectService && onSelectService(service.title)}
                    className="shrink-0 px-4 sm:px-5 py-2 bg-[#0284c7] hover:bg-[#0369a1] active:bg-[#075985] text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
