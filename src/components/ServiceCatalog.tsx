import React, { useState } from 'react';
import {
  Clock,
  FileCheck,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Layers,
  LayoutGrid,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';
import { SERVICES, CATEGORY_LABELS, SHOP_INFO } from '../data/servicesData';
import { ServiceIcon } from './ServiceIcon';

interface ServiceCatalogProps {
  lang: 'hi' | 'en';
  selectedCategory: string;
  setSelectedCategory: (cat: ServiceCategory) => void;
  searchQuery: string;
  onSelectService: (service: ServiceItem) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  lang,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  onSelectService,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grid');

  const categories = Object.keys(CATEGORY_LABELS) as ServiceCategory[];

  // Filtered services
  const filteredServices = SERVICES.filter((service) => {
    // Category match
    const categoryMatch =
      selectedCategory === 'all' || service.category === selectedCategory;

    // Search query match
    const q = searchQuery.toLowerCase().trim();
    if (!q) return categoryMatch;

    const textMatch =
      service.name.toLowerCase().includes(q) ||
      service.nameHi.toLowerCase().includes(q) ||
      service.description.toLowerCase().includes(q) ||
      service.descriptionHi.toLowerCase().includes(q) ||
      service.requiredDocs.some((d) => d.toLowerCase().includes(q)) ||
      service.requiredDocsHi.some((d) => d.toLowerCase().includes(q));

    return categoryMatch && textMatch;
  });

  // Calculate count per category
  const getCategoryCount = (catKey: ServiceCategory) => {
    if (catKey === 'all') return SERVICES.length;
    return SERVICES.filter((s) => s.category === catKey).length;
  };

  // Grouped by categories (for Grouped View)
  const groupedCategories = categories
    .filter((c) => c !== 'all')
    .map((catKey) => {
      const items = filteredServices.filter((s) => s.category === catKey);
      return {
        catKey,
        label: CATEGORY_LABELS[catKey],
        items,
      };
    })
    .filter((group) => group.items.length > 0);

  const renderServiceCard = (service: ServiceItem) => (
    <div
      key={service.id}
      id={`service-card-${service.id}`}
      className="group bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-4.5 border border-slate-200/80 dark:border-slate-800/80 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-lg transition-all flex flex-col justify-between relative"
    >
      {/* Card Top: Icon & Tags */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 group-hover:bg-amber-600 dark:group-hover:bg-amber-500 group-hover:text-white dark:group-hover:text-slate-950 transition-colors flex items-center justify-center shrink-0">
            <ServiceIcon name={service.icon} className="w-5 h-5" />
          </div>

          <div className="flex flex-wrap items-center gap-1 justify-end">
            {service.tag && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {service.tag}
              </span>
            )}
            {service.popular && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {lang === 'hi' ? 'लोकप्रिय' : 'Popular'}
              </span>
            )}
          </div>
        </div>

        {/* Service Title */}
        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors leading-snug">
          {lang === 'hi' ? service.nameHi : service.name}
        </h3>

        {/* Subtitle / Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {lang === 'hi' ? service.descriptionHi : service.description}
        </p>

        {/* Processing Time & Fee Badge */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>
              {lang === 'hi' ? service.processingTimeHi : service.processingTime}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-normal">
              {lang === 'hi' ? 'सेवा शुल्क' : 'Service Fee'}
            </span>
            <span className="font-black text-slate-900 dark:text-white text-sm">
              ₹{service.fee}
              {service.govtFeeNote && (
                <span className="text-[10px] font-normal text-slate-500 ml-1">
                  *
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Required Docs Mini List */}
        <div className="mt-2.5 bg-slate-50 dark:bg-slate-950/70 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
            <FileCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'hi' ? 'जरूरी दस्तावेज:' : 'Required Documents:'}</span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300 flex flex-wrap gap-1">
            {(lang === 'hi' ? service.requiredDocsHi : service.requiredDocs).slice(0, 3).map((doc, idx) => (
              <span
                key={idx}
                className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-[10px] border border-slate-200 dark:border-slate-700"
              >
                {doc}
              </span>
            ))}
            {service.requiredDocs.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{service.requiredDocs.length - 3} {lang === 'hi' ? 'और' : 'more'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          id={`btn-apply-${service.id}`}
          onClick={() => onSelectService(service)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 dark:bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400 text-white dark:text-slate-950 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs group-hover:shadow-sm cursor-pointer"
        >
          <span>{lang === 'hi' ? 'ऑनलाइन आवेदन करें' : 'Apply Online'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <a
          href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodeURIComponent(
            `नमस्ते Piyush Travels, मुझे "${service.name}" के बारे में आवेदन करना है। क्या कागजात चाहिए?`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          id={`btn-whatsapp-${service.id}`}
          title="Inquire on WhatsApp"
          className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center transition-colors shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
        </a>
      </div>
    </div>
  );

  return (
    <section id="services-section" className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800/80 uppercase tracking-wide mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>{lang === 'hi' ? 'वर्गीकृत सेवा सूची' : 'Categorized Service Catalog'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
            {lang === 'hi'
              ? 'पीयूष ट्रैवेल्स – सभी 31+ सेवाएं एवं ऑनलाइन आवेदन'
              : 'Piyush Travels – Categorized Digital Services Directory'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {lang === 'hi'
              ? 'प्रमाण पत्र, पहचान पत्र, यात्रा, पेंशन, जमीन व ज़ेरॉक्स – किसी भी सेवा पर क्लिक कर तुरंत फॉर्म भरें और ऑनलाइन भुगतान करें।'
              : 'Certificates, IDs, Travel bookings, pensions, land mutation & printing. Select any service to apply online.'}
          </p>
        </div>

        {/* View Switcher & Counter */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {lang === 'hi' ? 'कुल सेवाएं:' : 'Services Found:'}{' '}
            <strong className="text-amber-800 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
              {filteredServices.length}
            </strong>
          </div>

          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grouped')}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'grouped'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Grouped Category View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Grouped</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
        {categories.map((catKey) => {
          const cat = CATEGORY_LABELS[catKey];
          const isSelected = selectedCategory === catKey;
          const count = getCategoryCount(catKey);

          return (
            <button
              key={catKey}
              type="button"
              id={`tab-category-${catKey}`}
              onClick={() => setSelectedCategory(catKey)}
              className={`whitespace-nowrap text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{lang === 'hi' ? cat.hi : cat.en}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Services Display: Empty State */}
      {filteredServices.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-xs max-w-md mx-auto my-6">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            {lang === 'hi' ? 'कोई सेवा नहीं मिली' : 'No matching service found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {lang === 'hi'
              ? 'कृपया दूसरा शब्द खोजें या किसी भी अन्य ऑनलाइन काम के लिए सीधे संपर्क करें।'
              : 'Try searching with different keywords or contact Piyush Travels directly.'}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              {lang === 'hi' ? 'सभी सेवाएं देखें' : 'View All Services'}
            </button>
            <a
              href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodeURIComponent(
                `नमस्ते, मुझे "${searchQuery}" सेवा के बारे में पूछना है।`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* VIEW 1: Standard Flat Grid */}
      {filteredServices.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredServices.map(renderServiceCard)}
        </div>
      )}

      {/* VIEW 2: Categorized Group View */}
      {filteredServices.length > 0 && viewMode === 'grouped' && (
        <div className="space-y-10">
          {groupedCategories.map((group) => (
            <div key={group.catKey} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{lang === 'hi' ? group.label.hi : group.label.en}</span>
                  <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    {group.items.length}
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {group.items.map(renderServiceCard)}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
