import React from 'react';
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
    <section id="services" className="py-20 relative bg-[#FAF8F5] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <p className="text-sm sm:text-base font-bold text-slate-900 tracking-wide mb-1">
            My Service
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#15803d] tracking-tight">
            আমার সার্ভিস দেখুন
          </h2>
        </div>

        {/* Services Grid matching reference 3-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-6xl mx-auto">
          {publishedServices.map((service) => {
            const waUrl = getWhatsAppUrl(service.title);
            const isExternal = waUrl.startsWith('http');

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Banner Image / Card Header Visual */}
                  <div className="relative w-full aspect-[299/240] rounded-xl overflow-hidden bg-[#072d17] select-none shadow-xs border border-emerald-950/10">
                    {service.coverImage ? (
                      <img
                        src={service.coverImage}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                        loading="lazy"
                      />
                    ) : (
                      /* Fallback styled card banner if no coverImage is provided */
                      <div className="w-full h-full bg-gradient-to-br from-[#06301a] via-[#094324] to-[#041c0f] p-5 flex flex-col justify-between text-white relative">
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
                <div className="border border-[#15803d] rounded-lg p-3 sm:p-3.5 flex items-center justify-between mt-auto bg-white gap-2">
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
                    className="shrink-0 px-4 sm:px-5 py-2 bg-[#15803d] hover:bg-[#166534] active:bg-[#14532d] text-white text-xs sm:text-sm font-semibold rounded-md shadow-xs transition-colors duration-150 inline-flex items-center justify-center cursor-pointer"
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
