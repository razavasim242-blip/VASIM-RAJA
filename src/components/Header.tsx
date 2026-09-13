import React from 'react';
import { Phone, Mail, MapPin, Clock, Search, ShieldCheck, FileSearch, Sparkles, UserCog, MessageCircle } from 'lucide-react';
import { SHOP_INFO } from '../data/servicesData';

interface HeaderProps {
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
  onOpenBiodataModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  onOpenTrack,
  onOpenAdmin,
  onOpenBiodataModal,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200 no-print">
      {/* Top Banner with exact shop address and details */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'hi' ? SHOP_INFO.addressHi : SHOP_INFO.address}</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Clock className="w-3 h-3" />
              <span>{SHOP_INFO.timings}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${SHOP_INFO.phone}`}
              id="top-call-link"
              className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span className="font-semibold tracking-wide">{SHOP_INFO.phone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={`mailto:${SHOP_INFO.email}`}
              id="top-email-link"
              className="hidden sm:flex items-center gap-1 text-slate-200 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3 text-sky-400" />
              <span>{SHOP_INFO.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Shop Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0 font-extrabold text-xl">
              PT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900">
                  {SHOP_INFO.name}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 hidden sm:block">
                {lang === 'hi'
                  ? 'ऑनलाइन सेवा केंद्र, साइबर कैफे एवं सरकारी सुविधा केंद्र • बगाही बाज़ार'
                  : 'Online Digital Seva Kendra, Cyber Cafe & Travel Desk • Bagahi Bazar'}
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Switcher */}
            <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                id="btn-lang-hi"
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${
                  lang === 'hi'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                id="btn-lang-en"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${
                  lang === 'en'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>

            {/* About Us Nav Button */}
            <a
              href="#about-us-section"
              id="btn-nav-about-us"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>{lang === 'hi' ? 'हमारे बारे में' : 'About Us'}</span>
            </a>

            {/* Biodata / CV Button */}
            <button
              type="button"
              id="btn-open-biodata"
              onClick={onOpenBiodataModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'hi' ? 'शादी बायोडाटा / CV' : 'Wedding Bio Data / CV'}</span>
            </button>

            {/* Track Application Button */}
            <button
              type="button"
              id="btn-track-application"
              onClick={onOpenTrack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
            >
              <FileSearch className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">
                {lang === 'hi' ? 'स्थिति जांचें' : 'Track Status'}
              </span>
              <span className="sm:hidden">Track</span>
            </button>

            {/* WhatsApp Quick Direct */}
            <a
              href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodeURIComponent(
                'नमस्ते Piyush Travels, मुझे ऑनलाइन सेवा के संबंध में जानकारी चाहिए।'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              id="btn-whatsapp-header"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Operator Dashboard Button */}
            <button
              type="button"
              id="btn-operator-dashboard"
              onClick={onOpenAdmin}
              title={lang === 'hi' ? 'दुकानदार / ऑपरेटर डैशबोर्ड' : 'Operator Dashboard'}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs"
            >
              <UserCog className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Search Input */}
        <div className="mt-3 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              id="service-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'सेवा खोजें: आय, जाति, निवास, पैन कार्ड, वोटर कार्ड, रेलवे टिकट, वृद्धा पेंशन, बिजली बिल...'
                  : 'Search any service: Income, Caste, Niwas, PAN Card, Voter ID, Railway Ticket, Pension, Dakhil Kharij...'
              }
              className="w-full pl-10 pr-10 py-2.5 bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-500 rounded-xl text-xs sm:text-sm border border-slate-200 focus:border-amber-500 focus:outline-hidden transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
