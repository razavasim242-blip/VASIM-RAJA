import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Search,
  ShieldCheck,
  FileSearch,
  Sparkles,
  UserCog,
  MessageCircle,
  Bot,
  User as UserIcon,
  LogOut,
  FileText,
  Sun,
  Moon,
} from 'lucide-react';
import { SHOP_INFO } from '../data/servicesData';
import type { User } from 'firebase/auth';

interface HeaderProps {
  lang: 'hi' | 'en';
  setLang: (lang: 'hi' | 'en') => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
  onOpenBiodataModal: () => void;
  onOpenAiHelp: () => void;
  onOpenMyApps: () => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  onOpenTrack,
  onOpenAdmin,
  onOpenBiodataModal,
  onOpenAiHelp,
  onOpenMyApps,
  user,
  onSignIn,
  onSignOut,
  searchQuery,
  setSearchQuery,
  darkMode,
  onToggleDarkMode,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c1222]/95 backdrop-blur-md shadow-xs border-b border-slate-200 dark:border-slate-800 transition-colors no-print">
      {/* Top Banner with exact shop address and details */}
      <div className="bg-slate-900 dark:bg-[#050811] text-slate-200 dark:text-slate-300 text-xs py-2 px-3 sm:px-6 border-b border-slate-800 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{lang === 'hi' ? SHOP_INFO.addressHi : SHOP_INFO.address}</span>
            </span>
            <span className="hidden md:inline-block text-slate-500">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300 dark:text-slate-400">
              <Clock className="w-3 h-3 text-amber-400" />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Shop Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0 font-extrabold text-lg sm:text-xl">
              PT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  {SHOP_INFO.name}
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  Verified
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                {lang === 'hi'
                  ? 'ऑनलाइन सेवा केंद्र, साइबर कैफे एवं सरकारी सुविधा केंद्र • बगाही बाज़ार'
                  : 'Online Digital Seva Kendra, Cyber Cafe & Travel Desk • Bagahi Bazar'}
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Dark Mode High-Contrast Toggle */}
            <button
              type="button"
              id="btn-toggle-dark-mode"
              onClick={onToggleDarkMode}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title={
                darkMode
                  ? (lang === 'hi' ? 'लाइट मोड चालू करें' : 'Switch to Light Mode')
                  : (lang === 'hi' ? 'डार्क मोड (नाइट व्यू) चालू करें' : 'Switch to Dark Mode (Night View)')
              }
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="hidden xl:inline text-amber-300">
                    {lang === 'hi' ? 'लाइट' : 'Light'}
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                  <span className="hidden xl:inline text-slate-700">
                    {lang === 'hi' ? 'डार्क' : 'Dark'}
                  </span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-lg flex items-center border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                type="button"
                id="btn-lang-hi"
                onClick={() => setLang('hi')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                id="btn-lang-en"
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            {/* AI Assistant Launcher Button */}
            <button
              type="button"
              id="btn-open-ai-header"
              onClick={onOpenAiHelp}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 fill-current" />
              <span className="hidden md:inline">{lang === 'hi' ? 'AI सेवा मित्र' : 'AI Assistant'}</span>
              <span className="md:hidden">AI</span>
            </button>

            {/* Welfare Schemes Scroll Anchor */}
            <a
              href="#welfare-schemes-section"
              id="btn-nav-schemes"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lang === 'hi' ? 'सरकारी योजनाएं' : 'Govt Schemes'}</span>
            </a>

            {/* Track Application Button */}
            <button
              type="button"
              id="btn-track-application"
              onClick={onOpenTrack}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <FileSearch className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">
                {lang === 'hi' ? 'स्थिति जांचें' : 'Track Status'}
              </span>
              <span className="sm:hidden">Track</span>
            </button>

            {/* My Applications Button */}
            <button
              type="button"
              id="btn-my-applications-header"
              onClick={onOpenMyApps}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">
                {lang === 'hi' ? 'मेरे आवेदन' : 'My Apps'}
              </span>
            </button>

            {/* Google Authentication Chip / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  id="btn-user-profile"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-5 h-5 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  )}
                  <span className="hidden md:inline max-w-[90px] truncate">
                    {user.displayName?.split(' ')[0] || 'User'}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-2 z-50 animate-in fade-in">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.displayName || 'Customer'}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenMyApps();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{lang === 'hi' ? 'मेरे सभी आवेदन' : 'My Applications'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSignOut();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'लॉगआउट करें' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                id="btn-google-sign-in"
                onClick={onSignIn}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Sign in with Google to sync applications across devices"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">लॉगिन</span>
              </button>
            )}

            {/* Operator Dashboard Button */}
            <button
              type="button"
              id="btn-operator-dashboard"
              onClick={onOpenAdmin}
              title={lang === 'hi' ? 'दुकानदार / ऑपरेटर डैशबोर्ड' : 'Operator Dashboard'}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs cursor-pointer"
            >
              <UserCog className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Search Input */}
        <div className="mt-2.5 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              id="service-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'सेवा खोजें: आय, जाति, निवास, वृद्धा पेंशन, किसान ID, पैन कार्ड, वोटर कार्ड, रेलवे टिकट, बिजली बिल...'
                  : 'Search any service: Income, Caste, Niwas, Old Age Pension, Farmer ID, PAN, Voter, Railway Ticket...'
              }
              className="w-full pl-10 pr-10 py-2 bg-slate-100/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700/80 focus:border-amber-500 dark:focus:border-amber-400 focus:outline-hidden transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 font-semibold cursor-pointer"
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

