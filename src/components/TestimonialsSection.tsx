import React from 'react';
import { Quote, Star } from 'lucide-react';
import type { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const approvedTestimonials = testimonials.filter((t) => t.isApproved);

  if (approvedTestimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 relative bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15803d] tracking-tight">
            ক্লায়েন্ট প্রতিক্রিয়া ও রিভিউ
          </h2>
          <div className="w-16 h-1 bg-[#15803d] mx-auto mt-3 rounded-full" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedTestimonials.map((item) => (
            <div
              key={item.id}
              className="card-light rounded-2xl p-6 flex flex-col justify-between relative group border border-slate-200 bg-[#FAF8F5]"
            >
              <Quote className="w-10 h-10 text-emerald-200 absolute top-4 right-4 -z-0" />

              <div className="relative z-10 mb-6">
                {item.rating && (
                  <div className="flex items-center gap-1 mb-3 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                )}
                <p className="text-sm text-slate-700 leading-relaxed italic font-medium">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200 relative z-10">
                {item.clientPhoto ? (
                  <img
                    src={item.clientPhoto}
                    alt={item.clientName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#15803d] font-bold flex items-center justify-center text-sm border border-emerald-300">
                    {item.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.clientName}</h4>
                  {(item.clientRole || item.clientCompany) && (
                    <p className="text-xs text-slate-500 font-medium">
                      {item.clientRole}
                      {item.clientCompany ? ` • ${item.clientCompany}` : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
