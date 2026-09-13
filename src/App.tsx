/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { WelfareSchemesSection } from './components/WelfareSchemesSection';
import { ServiceCatalog } from './components/ServiceCatalog';
import { OnlineApplicationModal } from './components/OnlineApplicationModal';
import { ApplicationReceipt } from './components/ApplicationReceipt';
import { TrackApplicationModal } from './components/TrackApplicationModal';
import { OperatorDashboardModal } from './components/OperatorDashboardModal';
import { ResumeBiodataModal } from './components/ResumeBiodataModal';
import { AboutUsSection } from './components/AboutUsSection';
import { AiAssistantModal } from './components/AiAssistantModal';
import { MyApplicationsModal } from './components/MyApplicationsModal';
import { Footer } from './components/Footer';
import { LiquidBackground } from './components/LiquidBackground';
import { ServiceItem, ServiceCategory, ApplicationRecord } from './types';
import { SERVICES, SHOP_INFO } from './data/servicesData';
import { auth, signInWithGoogle, logOut, testFirestoreConnection } from './firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { Bot, MessageCircle } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dark Mode state with persistence & system preference detection
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('piyush_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('piyush_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('piyush_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Firebase Auth State
  const [user, setUser] = useState<User | null>(null);

  // Modals
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);
  const [receiptRecord, setReceiptRecord] = useState<ApplicationRecord | null>(null);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showBiodataModal, setShowBiodataModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showMyAppsModal, setShowMyAppsModal] = useState(false);

  // Initialize Auth & test Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection().catch((err) => {
      console.warn('Firestore connection check notice:', err);
    });

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleSelectCategoryFromHero = (cat: string) => {
    setSelectedCategory(cat as ServiceCategory);
    // Smooth scroll down to services
    const el = document.getElementById('services-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenQuickApply = () => {
    // Open default popular service (Income Certificate / Aay Praman Patra)
    const defaultService = SERVICES[0];
    setActiveServiceModal(defaultService);
  };

  const handleApplicationCompleted = (app: ApplicationRecord) => {
    setActiveServiceModal(null);
    setReceiptRecord(app);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-white transition-colors duration-200 relative">
      {/* Animated Liquid UI Background (Morphing Organic Fluid Blobs + Droplet Particle Field) */}
      <LiquidBackground darkMode={darkMode} />

      {/* Top Header */}
      <Header
        lang={lang}
        setLang={setLang}
        onOpenTrack={() => setShowTrackModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenBiodataModal={() => setShowBiodataModal(true)}
        onOpenAiHelp={() => setShowAiModal(true)}
        onOpenMyApps={() => setShowMyAppsModal(true)}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Hero Section & Shop Highlights */}
      <HeroBanner
        lang={lang}
        onSelectCategory={handleSelectCategoryFromHero}
        onOpenQuickApply={handleOpenQuickApply}
      />

      {/* Dedicated Government Welfare Schemes Hub (वृद्धा पेंशन, किसान ID, राशन कार्ड आदि) */}
      <WelfareSchemesSection
        lang={lang}
        onSelectService={(svc) => setActiveServiceModal(svc)}
        onOpenAiHelp={() => setShowAiModal(true)}
      />

      {/* Full 31+ Services Catalog with Filters & Search */}
      <main className="flex-1">
        <ServiceCatalog
          lang={lang}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSelectService={(svc) => setActiveServiceModal(svc)}
        />

        {/* Dedicated About Us Section */}
        <AboutUsSection
          lang={lang}
          onOpenTrack={() => setShowTrackModal(true)}
          onExploreServices={() => {
            const el = document.getElementById('services-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onSelectCategory={handleSelectCategoryFromHero}
        onOpenTrack={() => setShowTrackModal(true)}
        onOpenBiodata={() => setShowBiodataModal(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Floating Action Button for AI Seva Mitra & WhatsApp */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5 no-print">
        {/* WhatsApp Quick Direct Button */}
        <a
          href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodeURIComponent(
            'नमस्ते Piyush Travels, मुझे ऑनलाइन सेवा के बारे में जानकारी चाहिए।'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          id="floating-whatsapp-btn"
          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
          title={lang === 'hi' ? 'व्हाट्सएप पर पूछें' : 'Chat on WhatsApp'}
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </a>

        {/* AI Assistant Floating Button */}
        <button
          type="button"
          id="floating-ai-assistant-btn"
          onClick={() => setShowAiModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold rounded-full flex items-center gap-2 shadow-xl shadow-amber-600/30 transition-transform active:scale-95 cursor-pointer border border-amber-300/40"
        >
          <Bot className="w-5 h-5 text-white animate-bounce" />
          <span className="text-xs sm:text-sm font-bold">
            {lang === 'hi' ? 'पीयूष AI सेवा मित्र' : 'Piyush AI Sahayak'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
        </button>
      </div>

      {/* Online Application Modal (Forms + Payment Gateway) */}
      {activeServiceModal && (
        <OnlineApplicationModal
          isOpen={Boolean(activeServiceModal)}
          onClose={() => setActiveServiceModal(null)}
          service={activeServiceModal}
          lang={lang}
          onApplicationCompleted={handleApplicationCompleted}
        />
      )}

      {/* Printable Application Receipt Slip */}
      {receiptRecord && (
        <ApplicationReceipt
          application={receiptRecord}
          onClose={() => setReceiptRecord(null)}
          lang={lang}
        />
      )}

      {/* Track Status Modal */}
      {showTrackModal && (
        <TrackApplicationModal
          isOpen={showTrackModal}
          onClose={() => setShowTrackModal(false)}
          lang={lang}
          onViewReceipt={(record) => {
            setShowTrackModal(false);
            setReceiptRecord(record);
          }}
        />
      )}

      {/* My Applications Modal */}
      {showMyAppsModal && (
        <MyApplicationsModal
          isOpen={showMyAppsModal}
          onClose={() => setShowMyAppsModal(false)}
          lang={lang}
          onViewReceipt={(record) => {
            setShowMyAppsModal(false);
            setReceiptRecord(record);
          }}
          onOpenApply={() => {
            setShowMyAppsModal(false);
            handleOpenQuickApply();
          }}
        />
      )}

      {/* AI Assistant Chat Modal */}
      {showAiModal && (
        <AiAssistantModal
          isOpen={showAiModal}
          onClose={() => setShowAiModal(false)}
          lang={lang}
          onSelectService={(svc) => {
            setShowAiModal(false);
            setActiveServiceModal(svc);
          }}
        />
      )}

      {/* Wedding Biodata & Resume Maker Modal */}
      {showBiodataModal && (
        <ResumeBiodataModal
          isOpen={showBiodataModal}
          onClose={() => setShowBiodataModal(false)}
          lang={lang}
        />
      )}

      {/* Operator / Cyber Cafe Admin Desk */}
      {showAdminModal && (
        <OperatorDashboardModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          lang={lang}
          onViewReceipt={(record) => {
            setShowAdminModal(false);
            setReceiptRecord(record);
          }}
        />
      )}
    </div>
  );
}
