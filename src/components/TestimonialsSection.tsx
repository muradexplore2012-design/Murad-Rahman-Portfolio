import React from 'react';
import { MessageSquareQuote, Star, Quote } from 'lucide-react';
import type { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const approvedTestimonials = testimonials.filter((t) => t.isApproved);

  // Per non-negotiable prompt instructions:
  // "Seed none. Never invent customer reviews. Hide the section if there are no approved entries."
  if (approvedTestimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 relative bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>ক্লায়েন্ট মতামত</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ক্লায়েন্টদের সন্তুষ্টি ও প্রতিক্রিয়া
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedTestimonials.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between relative group"
            >
              <Quote className="w-10 h-10 text-blue-500/20 absolute top-4 right-4 -z-0" />

              <div className="relative z-10 mb-6">
                {/* Rating stars if provided */}
                {item.rating && (
                  <div className="flex items-center gap-1 mb-3 text-amber-400">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                )}
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60 relative z-10">
                {item.clientPhoto ? (
                  <img
                    src={item.clientPhoto}
                    alt={item.clientName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-sm border border-blue-500/40">
                    {item.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">{item.clientName}</h4>
                  {(item.clientRole || item.clientCompany) && (
                    <p className="text-xs text-slate-400">
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
