import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Award,
  CreditCard,
  MessageCircle,
  FileText,
  Heart,
  Sun,
  Moon,
} from 'lucide-react';
import { SHOP_INFO } from '../data/servicesData';

interface FooterProps {
  lang: 'hi' | 'en';
  onSelectCategory: (cat: string) => void;
  onOpenTrack: () => void;
  onOpenBiodata: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onSelectCategory,
  onOpenTrack,
  onOpenBiodata,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <footer className="bg-slate-900 dark:bg-[#060a14] text-slate-300 dark:text-slate-400 border-t border-slate-800 dark:border-slate-800/80 pt-12 pb-8 px-4 sm:px-6 transition-colors no-print">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
        {/* Brand & Address Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md">
              PT
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">
                {SHOP_INFO.name}
              </h3>
              <p className="text-xs text-amber-400 font-bold">{SHOP_INFO.nameHi}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'hi'
              ? 'बगाही बाज़ार का विश्वसनीय डिजिटल सेवा केंद्र जहां आय, जाति, निवास, पैन, वोटर, आयुष्मान, रेलवे टिकट, वृद्धा पेंशन, दाखिल खारिज और सभी ऑनलाइन सरकारी फॉर्म भरे जाते हैं।'
              : 'Bagahi Bazar’s premier one-stop cyber cafe & digital seva center for RTPS certificates, PAN, Voter card, pensions, train tickets, insurance and instant UPI payments.'}
          </p>

          <div className="space-y-2 text-xs pt-1">
            <div className="flex items-start gap-2 text-slate-200">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>{lang === 'hi' ? 'दुकान का पता:' : 'Address:'}</strong>{' '}
                {lang === 'hi' ? SHOP_INFO.addressHi : SHOP_INFO.address}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-200">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Mobile:</strong>{' '}
                <a
                  href={`tel:${SHOP_INFO.phone}`}
                  className="font-bold text-white hover:text-amber-400 transition-colors"
                >
                  {SHOP_INFO.phone}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-200">
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
              <span>
                <strong>Email:</strong>{' '}
                <a
                  href={`mailto:${SHOP_INFO.email}`}
                  className="text-white hover:text-amber-400 transition-colors"
                >
                  {SHOP_INFO.email}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Timings:</strong> {SHOP_INFO.timings}
              </span>
            </div>
          </div>
        </div>

        {/* Certificate & Identity Services Links */}
        <div className="lg:col-span-3 space-y-3 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
            {lang === 'hi' ? 'मुख्य प्रमाण पत्र व पहचान' : 'Certificates & Identity'}
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('certificates')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • आय, जाति, निवास प्रमाण पत्र (RTPS)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('certificates')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • नॉन क्रीमी लेयर प्रमाण पत्र (NCL)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('identity')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • नया पैन कार्ड एवं पैन कार्ड सुधार
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('identity')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • नया वोटर कार्ड व सुधार (Form 6 & 8)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('identity')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • आयुष्मान भारत कार्ड (5 लाख मुफ्त इलाज)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('identity')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • ई-श्रम कार्ड व लेबर / मजदूर कार्ड
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('certificates')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • जन्म एवं मृत्यु प्रमाण पत्र
              </button>
            </li>
          </ul>
        </div>

        {/* Travel, Pensions & Land Revenue */}
        <div className="lg:col-span-3 space-y-3 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
            {lang === 'hi' ? 'यात्रा, पेंशन व जमीन सेवा' : 'Travel, Pensions & Land'}
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('travel_insurance')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • IRCTC रेलवे टिकट (तत्काल व सामान्य)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('travel_insurance')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • ड्राइविंग लाइसेंस (Learner & Permanent DL)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('travel_insurance')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • कार व बाइक इंश्योरेंस (Motor Insurance)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('schemes')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • वृद्धा पेंशन व किसान पंजीकरण (Farmer ID)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('land_revenue')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • जमीन दाखिल-खारिज व ऑनलाइन लगान रसीद
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('utility_banking')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                • बिजली बिल भुगतान व मनी ट्रांसफर / AEPS
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenBiodata}
                className="hover:text-amber-400 transition-colors text-left text-amber-300 font-semibold"
              >
                • शादी बायोडाटा व नौकरी CV / रिज्यूम
              </button>
            </li>
          </ul>
        </div>

        {/* Quick Contact & Online Payment Notice */}
        <div className="lg:col-span-2 space-y-3 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
            {lang === 'hi' ? 'त्वरित सहायता' : 'Direct Support'}
          </h4>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 space-y-2">
            <p className="text-[11px] text-slate-300">
              {lang === 'hi'
                ? 'किसी भी सेवा की पूछताछ या फॉर्म भरने में मदद के लिए सीधे व्हाट्सएप करें:'
                : 'Need help filling forms or paying online? Chat with us directly:'}
            </p>

            <a
              href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodeURIComponent(
                'नमस्ते Piyush Travels, मुझे ऑनलाइन सेवा के बारे में पूछना है।'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition-colors text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>

            <button
              type="button"
              onClick={onOpenTrack}
              className="w-full flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 rounded-lg transition-colors text-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'आवेदन स्थिति ट्रैक करें' : 'Track Application'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Guarantee */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div>
          © {new Date().getFullYear()} {SHOP_INFO.name}. All Rights Reserved. Bagahi Bazar,
          Main Market (Opposite Post Office).
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Official Contact: 7763890336</span>
          <span>•</span>
          <span>razav75@gmail.com</span>
          {onToggleDarkMode && (
            <>
              <span>•</span>
              <button
                type="button"
                id="btn-footer-toggle-theme"
                onClick={onToggleDarkMode}
                className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'hi' ? 'लाइट मोड' : 'Light Mode'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lang === 'hi' ? 'डार्क मोड' : 'Dark Mode'}</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Floating Bottom Quick Contacts for Mobile */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 sm:hidden">
        <a
          href={`tel:${SHOP_INFO.phone}`}
          className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg border border-slate-700 active:scale-95 transition-transform"
          aria-label="Call Piyush Travels"
        >
          <Phone className="w-5 h-5 text-amber-400" />
        </a>
        <a
          href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodeURIComponent(
            'नमस्ते Piyush Travels, मुझे ऑनलाइन सेवा चाहिए।'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="WhatsApp Piyush Travels"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </a>
      </div>
    </footer>
  );
};
