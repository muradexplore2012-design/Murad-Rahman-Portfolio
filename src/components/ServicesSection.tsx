import React from 'react';
import { Palette, Globe, Layout, Sparkles, Code, CheckCircle, ArrowRight, Layers } from 'lucide-react';
import type { Service } from '../types';

interface ServicesSectionProps {
  services: Service[];
  onSelectService?: (serviceTitle: string) => void;
}

const getServiceIcon = (iconName: string) => {
  switch (iconName?.toLowerCase()) {
    case 'palette':
      return <Palette className="w-6 h-6 text-[#15803d]" />;
    case 'globe':
      return <Globe className="w-6 h-6 text-[#15803d]" />;
    case 'layout':
      return <Layout className="w-6 h-6 text-[#15803d]" />;
    case 'sparkles':
      return <Sparkles className="w-6 h-6 text-[#15803d]" />;
    case 'code':
      return <Code className="w-6 h-6 text-[#15803d]" />;
    default:
      return <Layers className="w-6 h-6 text-[#15803d]" />;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onSelectService }) => {
  const publishedServices = services.filter((s) => s.isPublished);

  if (publishedServices.length === 0) {
    return null;
  }

  return (
    <section id="services" className="py-20 relative bg-[#FAF8F5] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#15803d] tracking-tight">
            আমার সার্ভিসসমূহ
          </h2>
          <p className="mt-3 text-slate-600 text-base">
            আপনার ব্র্যান্ড এবং প্রজেক্টের সফলতার জন্য আধুনিক ও প্রফেশনাল ডিজিটাল সেবা।
          </p>
          <div className="w-16 h-1 bg-[#15803d] mx-auto mt-3 rounded-full" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishedServices.map((service) => (
            <div
              key={service.id}
              className="card-light card-light-hover rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
                  {getServiceIcon(service.iconName)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-5 font-normal">
                  {service.description}
                </p>

                {/* Features list if available */}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-[#15803d] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-slate-100 mt-auto">
                {(service.startingPrice || service.deliveryTime) && (
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-semibold">
                    {service.startingPrice && (
                      <span className="text-slate-800">
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
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-[#15803d] bg-emerald-50 hover:bg-[#15803d] hover:text-white rounded-lg transition-all duration-200 border border-emerald-200"
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
