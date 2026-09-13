import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, HeartHandshake, Sprout, ShoppingBag, ShieldAlert, Coins, GraduationCap, HardHat, Bot } from 'lucide-react';
import { SERVICES } from '../data/servicesData';
import { ServiceItem } from '../types';

interface WelfareSchemesSectionProps {
  lang: 'hi' | 'en';
  onSelectService: (service: ServiceItem) => void;
  onOpenAiHelp: () => void;
}

export const WelfareSchemesSection: React.FC<WelfareSchemesSectionProps> = ({
  lang,
  onSelectService,
  onOpenAiHelp,
}) => {
  // Key government welfare schemes
  const schemeIds = [
    'vridha-pension',
    'farmer-id',
    'ration-card',
    'ayushman-card',
    'mandhan-yojna',
    'scholarship',
    'labour-card',
    'eshram-card',
  ];

  const welfareServices = schemeIds
    .map((id) => SERVICES.find((s) => s.id === id))
    .filter((s): s is ServiceItem => Boolean(s));

  const getSchemeHighlight = (id: string, isHi: boolean) => {
    switch (id) {
      case 'vridha-pension':
        return isHi ? 'उम्र 60 वर्ष+ • मासिक पेंशन' : 'Age 60+ • Monthly Pension';
      case 'farmer-id':
        return isHi ? '₹6,000 वार्षिक DBT • खाद/बीज सब्सिडी' : '₹6,000/yr DBT • Seeds & Fertilizer Subsidy';
      case 'ration-card':
        return isHi ? 'मुफ्त अनाज • नया नाम जोड़ना' : 'Free Food Grains • Member Addition';
      case 'ayushman-card':
        return isHi ? '₹5,00,000 सालाना मुफ्त अस्पताल इलाज' : '₹5,00,000 Free Hospital Treatment';
      case 'mandhan-yojna':
        return isHi ? '₹3,000 प्रति माह गारंटीकृत पेंशन' : '₹3,000/mo Guaranteed Pension';
      case 'scholarship':
        return isHi ? 'मैट्रिक, इंटर, कॉलेज छात्रों हेतु सरकारी छात्रवृत्ति' : 'Post-Matric & Inter Govt Scholarship';
      case 'labour-card':
        return isHi ? 'साइकिल अनुदान, चिकित्सा व आवास सहायता' : 'BOCW Health, Tools & Housing Grant';
      case 'eshram-card':
        return isHi ? 'राष्ट्रीय UAN कार्ड • 2 लाख दुर्घटना बीमा' : 'National UAN • ₹2 Lakh Accident Cover';
      default:
        return isHi ? 'सरकारी कल्याणकारी योजना' : 'Govt Welfare Scheme';
    }
  };

  const getSchemeIcon = (id: string) => {
    switch (id) {
      case 'vridha-pension':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'farmer-id':
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'ration-card':
        return <ShoppingBag className="w-5 h-5 text-amber-600" />;
      case 'ayushman-card':
        return <ShieldAlert className="w-5 h-5 text-sky-600" />;
      case 'mandhan-yojna':
        return <Coins className="w-5 h-5 text-yellow-600" />;
      case 'scholarship':
        return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      case 'labour-card':
        return <HardHat className="w-5 h-5 text-orange-600" />;
      case 'eshram-card':
        return <ShieldCheck className="w-5 h-5 text-teal-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <section id="welfare-schemes-section" className="py-10 sm:py-14 bg-gradient-to-b from-amber-50/20 via-transparent to-white/20 dark:from-[#0d1527]/40 dark:via-transparent dark:to-[#0b0f19]/30 border-y border-amber-200/50 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-800/80 text-amber-900 dark:text-amber-300 text-xs font-bold mb-2.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lang === 'hi' ? 'सीधे त्वरित आवेदन केंद्र' : 'Direct Quick Application Hub'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {lang === 'hi' ? 'प्रमुख सरकारी कल्याणकारी योजनाएं' : 'Key Government Welfare Schemes'}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 font-medium">
              {lang === 'hi'
                ? 'वृद्धा पेंशन, किसान पंजीकरण (PM Kisan), राशन कार्ड एवं अन्य योजनाओं का ऑनलाइन फॉर्म पीयूष ट्रैवेल्स से तुरंत भरवाएं।'
                : 'Apply online for Old Age Pension, PM Kisan Farmer Registration, Ration Card & Health Schemes with zero hassle.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="btn-open-ai-schemes"
              onClick={onOpenAiHelp}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-md shadow-slate-900/10 flex items-center gap-2 border border-transparent dark:border-slate-700 transition-transform active:scale-95 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>{lang === 'hi' ? 'AI से योजना के नियम पूछें' : 'Ask AI Scheme Rules'}</span>
            </button>
          </div>
        </div>

        {/* 8 Prominent Welfare Schemes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {welfareServices.map((svc) => (
            <div
              key={svc.id}
              className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-amber-400/80 dark:hover:border-amber-500 transition-all flex flex-col justify-between p-4 sm:p-5 group"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200/60 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getSchemeIcon(svc.id)}
                  </div>
                  <span className="bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {lang === 'hi' ? 'दुकान से सत्यापित' : 'Verified'}
                  </span>
                </div>

                {/* Scheme Name */}
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base leading-snug group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                  {lang === 'hi' ? svc.nameHi : svc.name}
                </h3>

                {/* Highlight Badge */}
                <div className="mt-2 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-200/70 dark:border-amber-800/80 inline-block">
                  {getSchemeHighlight(svc.id, lang === 'hi')}
                </div>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {lang === 'hi' ? svc.descriptionHi : svc.description}
                </p>

                {/* Key Required Documents Preview */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{lang === 'hi' ? 'ज़रूरी कागजात:' : 'Required Docs:'}</span>
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-1">
                    {lang === 'hi' ? svc.requiredDocsHi.join(', ') : svc.requiredDocs.join(', ')}
                  </p>
                </div>
              </div>

              {/* Bottom Action & Fee */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold">
                    {lang === 'hi' ? 'आवेदन शुल्क' : 'Service Fee'}
                  </span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    ₹{svc.fee}
                  </span>
                </div>

                <button
                  type="button"
                  id={`btn-apply-${svc.id}`}
                  onClick={() => onSelectService(svc)}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 rounded-xl text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                >
                  <span>{lang === 'hi' ? 'त्वरित आवेदन' : 'Apply Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
