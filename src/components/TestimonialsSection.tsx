import React from 'react';
import type { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const ClientAvatar: React.FC<{ photo?: string; name: string }> = ({ photo, name }) => {
  const [hasError, setHasError] = React.useState(false);

  if (photo && !hasError) {
    return (
      <img
        src={photo}
        alt={name}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setHasError(true)}
        className="w-8 h-8 sm:w-11 sm:h-11 rounded-full object-cover shrink-0 border border-slate-200 shadow-xs"
      />
    );
  }

  const initial = (name || 'C').trim().charAt(0).toUpperCase();

  return (
    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-sky-100 text-[#0284c7] font-black text-xs sm:text-base flex items-center justify-center shrink-0 border border-sky-200 shadow-xs">
      {initial}
    </div>
  );
};

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const displayTestimonials = testimonials.filter((t) => t.isApproved !== false);

  if (displayTestimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 relative bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching exact reference screenshot */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          
          {/* Top star ornament with lines: — ★ — */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 sm:w-16 h-px bg-slate-300" />
            <span className="text-[#0284c7] text-base leading-none">★</span>
            <div className="w-12 sm:w-16 h-px bg-slate-300" />
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0284c7] tracking-tight mb-2">
            Customer Reviews
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            See what our satisfied customers have to say about us
          </p>
        </div>

        {/* 3 Review Cards Grid (2-column on mobile, 3-column on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {displayTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-sky-100 p-3 sm:p-6 lg:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div>
                {/* Large Double Quotes matching primary color */}
                <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0284c7] leading-none mb-1.5 sm:mb-3 font-serif select-none">
                  “
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal mb-3 sm:mb-8 line-clamp-4 sm:line-clamp-none">
                  {item.quote}
                </p>
              </div>

              {/* Client Info: Avatar, Name & 5 Gold Stars */}
              <div className="flex items-center gap-2 sm:gap-3 pt-2.5 sm:pt-4 border-t border-slate-100">
                <ClientAvatar photo={item.clientPhoto} name={item.clientName} />

                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">
                    {item.clientName}
                  </h4>
                  
                  {/* 5 Stars: filled gold and unfilled gray */}
                  <div className="flex items-center gap-0.5 mt-0.5 sm:mt-1 text-xs sm:text-sm select-none">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= (Number(item.rating) || 5)
                            ? 'text-amber-400'
                            : 'text-slate-200'
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
