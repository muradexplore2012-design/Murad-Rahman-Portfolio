import React from 'react';
import { Palette, Globe, Layout, Sparkles, Code, CheckCircle, ArrowRight, Layers } from 'lucide-react';
import type { Service } from '../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectService?: (serviceTitle: string) => void;
}

// Icon mapper helper
const getServiceIcon = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case 'palette':
      return <Palette className="w-6 h-6 text-pink-400" />;
    case 'globe':
      return <Globe className="w-6 h-6 text-blue-400" />;
    case 'layout':
      return <Layout className="w-6 h-6 text-amber-400" />;
    case 'sparkles':
      return <Sparkles className="w-6 h-6 text-purple-400" />;
    case 'code':
      return <Code className="w-6 h-6 text-emerald-400" />;
    default:
      return <Layers className="w-6 h-6 text-blue-400" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onSelectService }) => {
  const publishedServices = services.filter((s) => s.isPublished);

  if (publishedServices.length === 0) {
    return null;
  }

  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>সার্ভিসসমূহ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            আমি যে সেবাগুলো প্রদান করি
          </h2>
          <p className="mt-4 text-slate-400 text-base">
            আপনার ব্র্যান্ড এবং প্রজেক্টের সফলতার জন্য আধুনিক ও প্রফেশনাল ডিজিটাল সেবা।
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mt-4 rounded-full" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishedServices.map((service) => (
            <div
              key={service.id}
              className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-slate-800"
            >
              <div>
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-5 shadow-inner">
                  {getServiceIcon(service.iconName)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed mb-5 font-normal">
                  {service.description}
                </p>

                {/* Features list if available */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-6 border-t border-slate-800/80 pt-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Card Footer: Pricing/Delivery info if configured, and CTA */}
              <div className="pt-4 border-t border-slate-800/60 mt-auto">
                {(service.startingPrice || service.deliveryTime) && (
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    {service.startingPrice && (
                      <span className="font-semibold text-white">
                        শুরু: {service.startingPrice}
                      </span>
                    )}
                    {service.deliveryTime && (
                      <span>সময়: {service.deliveryTime}</span>
                    )}
                  </div>
                )}

                <a
                  href="#contact"
                  onClick={() => onSelectService && onSelectService(service.title)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-600 hover:text-white rounded-lg transition-all duration-200"
                >
                  <span>সেবাটি নিতে মেসেজ দিন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
