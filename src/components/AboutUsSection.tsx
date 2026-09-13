import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  Building2,
  Sparkles,
  Printer,
  FileCheck,
  CreditCard,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { SHOP_INFO } from '../data/servicesData';

interface AboutUsSectionProps {
  lang: 'hi' | 'en';
  onOpenTrack?: () => void;
  onExploreServices?: () => void;
}

export const AboutUsSection: React.FC<AboutUsSectionProps> = ({
  lang,
  onOpenTrack,
  onExploreServices,
}) => {
  return (
    <section id="about-us-section" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Top Section Eyebrow & Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 uppercase tracking-wide mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>{lang === 'hi' ? 'हमारे बारे में (About Us)' : 'About Piyush Travels'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          {lang === 'hi'
            ? 'पीयूष ट्रैवेल्स – हर तरह के ऑनलाइन व सरकारी काम एक ही छत के नीचे'
            : 'Piyush Travels – Complete Digital & Cyber Seva at One Convenient Location'}
        </h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          {lang === 'hi'
            ? 'बगाही बाज़ार, मेन मार्केट में पोस्ट ऑफिस के सामने स्थित आपका अपना विश्वसनीय केंद्र। जहां आय, जाति, निवास, पैन, वोटर, आयुष्मान, तत्काल ट्रेन टिकट, वृद्धा पेंशन और जमीन रजिस्ट्री संबंधी सभी कार्य बिना किसी परेशानी के किए जाते हैं।'
            : 'Located opposite the Sub Post Office in Bagahi Bazar Main Market, Piyush Travels is your trusted local hub for government certificates, identity cards, tatkal railway reservations, pensions, land records, and instant online bill payments.'}
        </p>
      </div>

      {/* Main Grid: Mission Story + Contact & Address Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-10">
        {/* Left Column: Commitment & Mission Story */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-md">
                PT
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {SHOP_INFO.name} ({SHOP_INFO.nameHi})
                </h3>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  {lang === 'hi' ? 'संचालक: वसीम रज़ा / पीयूष कुमार' : 'Proprietor: Wasim Raza / Piyush Kumar'}
                </span>
              </div>
            </div>

            <div className="prose text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
              <p>
                {lang === 'hi' ? (
                  <>
                    <strong>पीयूष ट्रैवेल्स (Piyush Travels)</strong> की स्थापना बगाही बाज़ार और आस-पास के दर्जनों गांवों के नागरिकों को ब्लॉक (प्रखंड), अंचल कार्यालय अथवा जिला मुख्यालय के बार-बार चक्कर लगाने से मुक्ति दिलाने के उद्देश्य से की गई है। हमारा मुख्य संकल्प है: <span className="bg-amber-100 text-amber-950 font-bold px-1 rounded">"हर तरह के काम एक जगह"</span>।
                  </>
                ) : (
                  <>
                    <strong>Piyush Travels</strong> was established with the commitment to provide rural and town citizens of Bagahi Bazar with reliable, transparent, and error-free digital services under one roof—eliminating repeated visits to distant block or government offices.
                  </>
                )}
              </p>

              <p>
                {lang === 'hi' ? (
                  <>
                    चाहे छात्रवृत्ति या नौकरी हेतु <strong>आय, जाति, निवास व NCL प्रमाण पत्र</strong> बनवाना हो, <strong>नया पैन कार्ड</strong> या वोटर आईडी कार्ड में नाम व जन्मतिथि सुधारना हो, <strong>आयुष्मान भारत 5 लाख स्वास्थ्य कार्ड</strong>, <strong>वृद्धा पेंशन योजना</strong>, <strong>जमीन का दाखिल-खारिज व लगान रसीद</strong> काटना हो, या फिर किसी भी ट्रेन का <strong>कंफर्म तत्काल अथवा सामान्य टिकट</strong> बुक करना हो—पीयूष ट्रैवेल्स पर सब कुछ पूरी पारदर्शिता व सरकारी रसीद के साथ उपलब्ध है।
                  </>
                ) : (
                  <>
                    From critical RTPS certifications (Income, Caste, Residence, Non-Creamy Layer) to PAN issuance, Voter card revisions, Ayushman Golden cards, land mutations (Dakhil Kharij), high-speed color photo xerox, and confirmed IRCTC train reservations, every service is delivered swiftly with genuine receipts.
                  </>
                )}
              </p>
            </div>

            {/* Core Commitments Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-900 block font-bold">
                    {lang === 'hi' ? '100% सही व शुद्ध फॉर्म' : 'Zero Rejection Accuracy'}
                  </strong>
                  <span className="text-slate-600 text-[11px]">
                    {lang === 'hi'
                      ? 'अनुभवी ऑपरेटर द्वारा जांच उपरांत ही सरकारी पोर्टल पर सबमिशन।'
                      : 'Operator-level document audit ensures zero rejection by circle officers.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-900 block font-bold">
                    {lang === 'hi' ? 'आधिकारिक सरकारी पावती' : 'Authentic Acknowledgement'}
                  </strong>
                  <span className="text-slate-600 text-[11px]">
                    {lang === 'hi'
                      ? 'हर फॉर्म के साथ ऑफिशियल एप्लीकेशन रेफरेंस नंबर एवं रसीद।'
                      : 'Every submission receives an official RTPS/Govt application receipt.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-sky-50/60 border border-sky-200/80">
                <CreditCard className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-900 block font-bold">
                    {lang === 'hi' ? 'सुलभ भुगतान विकल्प' : 'Flexible Payment Modes'}
                  </strong>
                  <span className="text-slate-600 text-[11px]">
                    {lang === 'hi'
                      ? 'UPI, डेबिट/क्रेडिट कार्ड, नेटबैंकिंग अथवा दुकान पर नकद।'
                      : 'Pay online via UPI, Cards, Net Banking or cash at the shop.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-purple-50/60 border border-purple-200/80">
                <Printer className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-slate-900 block font-bold">
                    {lang === 'hi' ? 'ग्लॉसी प्रिंटिंग व लेमिनेशन' : 'HD Printing & Lamination'}
                  </strong>
                  <span className="text-slate-600 text-[11px]">
                    {lang === 'hi'
                      ? 'पीवीसी प्लास्टिक कार्ड, शादी बायोडाटा व उच्च गुणवत्ता ज़ेरॉक्स।'
                      : 'PVC smart cards, matrimony bio-data, job CVs, and HD xerox.'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-slate-100">
            {onExploreServices && (
              <button
                type="button"
                onClick={onExploreServices}
                className="px-4 py-2 bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {lang === 'hi' ? 'सेवाओं की सूची देखें' : 'View All 31+ Services'}
              </button>
            )}
            <a
              href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodeURIComponent(
                'नमस्ते Piyush Travels, मुझे आपके केंद्र की सेवाओं के बारे में जानकारी चाहिए।'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'व्हाट्सएप पर पूछें' : 'Chat on WhatsApp'}</span>
            </a>
          </div>
        </div>

        {/* Right Column: Physical Address, Contact Details & Landmark */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  {lang === 'hi' ? 'भौतिक पता एवं संपर्क' : 'Physical Location & Contact'}
                </span>
                <h4 className="text-lg font-black text-white mt-0.5">
                  {lang === 'hi' ? 'बगाही बाज़ार मुख्य केंद्र' : 'Bagahi Bazar Main Center'}
                </h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            {/* Address Details with Highlights */}
            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-xs font-bold">
                    {lang === 'hi' ? 'दुकान का पूरा पता (Address):' : 'Store Address:'}
                  </strong>
                  <p className="text-slate-200 text-xs mt-0.5 leading-snug">
                    {SHOP_INFO.address}
                  </p>
                  <p className="text-amber-300 text-xs mt-0.5 font-bold">
                    ({SHOP_INFO.addressHi})
                  </p>
                  <span className="inline-block mt-1.5 text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    📍 {lang === 'hi' ? 'लैंडमार्क: पोस्ट ऑफिस के ठीक सामने' : 'Landmark: Right Opposite Post Office'}
                  </span>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-center justify-between gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Phone / Mobile / WhatsApp
                    </span>
                    <a
                      href={`tel:${SHOP_INFO.phone}`}
                      className="text-base font-black text-white hover:text-amber-400 transition-colors font-mono"
                    >
                      {SHOP_INFO.phone}
                    </a>
                  </div>
                </div>
                <a
                  href={`tel:${SHOP_INFO.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                >
                  {lang === 'hi' ? 'कॉल करें' : 'Call'}
                </a>
              </div>

              {/* Email Address */}
              <div className="flex items-center justify-between gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Official Email
                    </span>
                    <a
                      href={`mailto:${SHOP_INFO.email}`}
                      className="text-xs font-bold text-white hover:text-amber-400 transition-colors font-mono"
                    >
                      {SHOP_INFO.email}
                    </a>
                  </div>
                </div>
                <a
                  href={`mailto:${SHOP_INFO.email}`}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-xs transition-colors"
                >
                  Mail
                </a>
              </div>

              {/* Timings */}
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 text-xs">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    {lang === 'hi' ? 'दुकान खुलने का समय:' : 'Working Hours:'}
                  </span>
                  <span className="text-white font-bold">{SHOP_INFO.timings}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map & Direction Helper Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300">
                {lang === 'hi' ? 'दुकान कैसे पहुंचें?' : 'How to reach our shop?'}
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.5 rounded font-mono">
                Bagahi Bazar
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              {lang === 'hi'
                ? 'बगाही बाज़ार के मुख्य बाज़ार में प्रवेश करते ही डाकघर (Post Office) के बिल्कुल सामने स्थित पीयूष ट्रैवेल्स का बोर्ड देखें।'
                : 'In Bagahi Bazar Main Market, look directly opposite the Sub Post Office branch.'}
            </p>
          </div>
        </div>
      </div>

      {/* Trust Counters Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-slate-900">31+</div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">
            {lang === 'hi' ? 'डिजिटल व सरकारी सेवाएं' : 'Services Under One Roof'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">आय, जाति, पैन, तत्काल टिकट, बिल</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-amber-700">10,000+</div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">
            {lang === 'hi' ? 'सफलतापूर्वक भरे गए आवेदन' : 'Forms Processed'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">बगाही बाज़ार व आसपास के क्षेत्र</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">99.8%</div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">
            {lang === 'hi' ? 'सत्यापन व स्वीकृति दर' : 'Application Approval Rate'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">सटीक दस्तावेज जांच के साथ</div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 text-center shadow-xs">
          <div className="text-2xl sm:text-3xl font-black text-sky-700">7 Days</div>
          <div className="text-xs font-bold text-slate-700 mt-0.5">
            {lang === 'hi' ? 'सप्ताह के सातों दिन खुला' : 'Open All 7 Days'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">सुबह 8:00 से रात 9:00 बजे तक</div>
        </div>
      </div>
    </section>
  );
};
