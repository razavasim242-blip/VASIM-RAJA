import React from 'react';
import { ShieldCheck, Zap, Award, CheckCircle2, PhoneCall, QrCode, FileText } from 'lucide-react';
import { SHOP_INFO } from '../data/servicesData';

interface HeroBannerProps {
  lang: 'hi' | 'en';
  onSelectCategory: (cat: string) => void;
  onOpenQuickApply: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  lang,
  onSelectCategory,
  onOpenQuickApply,
}) => {
  const quickBadges = [
    { label: lang === 'hi' ? 'आय, जाति, निवास' : 'Aay, Jaati, Niwas', category: 'certificates' },
    { label: lang === 'hi' ? 'नया पैन कार्ड' : 'New PAN Card', category: 'identity' },
    { label: lang === 'hi' ? 'IRCTC रेलवे टिकट' : 'Railway Ticket', category: 'travel_insurance' },
    { label: lang === 'hi' ? 'दाखिल खारिज' : 'Dakhil Kharij', category: 'land_revenue' },
    { label: lang === 'hi' ? 'वृद्धा पेंशन' : 'Vridha Pension', category: 'schemes' },
    { label: lang === 'hi' ? 'आयुष्मान कार्ड' : 'Ayushman Card', category: 'identity' },
    { label: lang === 'hi' ? 'शादी बायोडाटा / CV' : 'Wedding Biodata / CV', category: 'cyber_print' },
    { label: lang === 'hi' ? 'बिजली बिल' : 'Electricity Bill', category: 'utility_banking' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-50/30 to-transparent dark:from-amber-500/10 dark:via-[#0c1220]/40 dark:to-transparent border-b border-slate-200/80 dark:border-slate-800/80 pt-6 pb-8 px-4 sm:px-6 transition-colors">
      {/* Decorative background grid subtle effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Headline & Pitch */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 dark:border-amber-400/30 text-amber-900 dark:text-amber-300 text-xs font-bold tracking-wide">
              <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>
                {lang === 'hi'
                  ? 'बगाही बाज़ार का विश्वसनीय डिजिटल सेवा केंद्र'
                  : 'Bagahi Bazar’s Most Trusted Digital Seva Kendra'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {lang === 'hi' ? (
                <>
                  <span className="text-amber-600 dark:text-amber-400">पीयूष ट्रैवेल्स</span> - हर तरह के ऑनलाइन काम, फॉर्म व प्रमाण पत्र एक ही जगह!
                </>
              ) : (
                <>
                  <span className="text-amber-600 dark:text-amber-400">Piyush Travels</span> - All Online Government Forms, Certificates & Tickets Under One Roof
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {lang === 'hi'
                ? 'आय, जाति, निवास, NCL, नया पैन कार्ड, वोटर कार्ड, आयुष्मान, ई-श्रम, वृद्धा पेंशन, किसान रजिस्ट्रेशन, रेलवे तत्काल टिकट, ड्राइविंग लाइसेंस, दाखिल-खारिज, बिजली बिल व शादी बायोडाटा की ऑनलाइन फॉर्म सुविधा एवं सुरक्षित पेमेंट गेटवे।'
                : 'Complete digital counter for RTPS certificates, PAN cards, Voter IDs, Ayushman, IRCTC tickets, DL, land mutation, pensions, electricity bills, resume maker with verified online document submission and instant UPI payment.'}
            </p>

            {/* Address callout card */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {lang === 'hi' ? 'दुकान का पता:' : 'Shop Location:'}
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                  {lang === 'hi' ? SHOP_INFO.addressHi : SHOP_INFO.address}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${SHOP_INFO.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{SHOP_INFO.phone}</span>
                </a>
                <button
                  type="button"
                  onClick={onOpenQuickApply}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400 dark:text-slate-950" />
                  <span>{lang === 'hi' ? 'ऑनलाइन फॉर्म भरें' : 'Apply Online'}</span>
                </button>
              </div>
            </div>

            {/* Quick Service Badges */}
            <div className="pt-1">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                {lang === 'hi' ? 'मुख्य एवं लोकप्रिय सेवाएं:' : 'Popular Services:'}
              </div>
              <div className="flex flex-wrap gap-2">
                {quickBadges.map((badge, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectCategory(badge.category)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-amber-500 dark:hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 transition-all shadow-2xs cursor-pointer"
                  >
                    {badge.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Highlights & Payment Confidence Card */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {lang === 'hi' ? 'सुविधाएं व गारंटी' : 'Features & Guarantee'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {lang === 'hi' ? 'घर बैठे फॉर्म व पेमेंट की सुविधा' : 'Apply & Pay From Comfort of Home'}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Bullet Features */}
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {lang === 'hi' ? '100% सही फॉर्म भरने की गारंटी:' : 'Zero-error Online Form Filling:'}
                    </strong>{' '}
                    {lang === 'hi' ? 'विशेषज्ञ ऑपरेटर द्वारा जांच।' : 'Double checked by senior cyber operator.'}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {lang === 'hi' ? 'सुरक्षित ऑनलाइन UPI गेटवे:' : 'Secure Instant UPI Gateway:'}
                    </strong>{' '}
                    {lang === 'hi' ? 'PhonePe, GPay, Paytm या QR कोड से भुगतान।' : 'Direct payment through PhonePe, GPay or QR.'}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900 dark:text-white font-semibold">
                      {lang === 'hi' ? 'तुरंत पावती रसीद व ट्रैकिंग:' : 'Instant Slip & Tracking:'}
                    </strong>{' '}
                    {lang === 'hi' ? 'रेफरेंस नंबर द्वारा कभी भी स्टेटस चेक करें।' : 'Check application status anytime using reference ID.'}
                  </span>
                </div>
              </div>

              {/* Shop Owner UPI & QR Snippet */}
              <div className="bg-slate-50 dark:bg-slate-950/80 rounded-xl p-3 border border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {lang === 'hi' ? 'आधिकारिक UPI आईडी' : 'Official UPI ID'}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-900 dark:text-amber-300 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 select-all">
                  {SHOP_INFO.upiId}
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{SHOP_INFO.owner}</span>
                  <span>{SHOP_INFO.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
