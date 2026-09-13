/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ServiceCatalog } from './components/ServiceCatalog';
import { OnlineApplicationModal } from './components/OnlineApplicationModal';
import { ApplicationReceipt } from './components/ApplicationReceipt';
import { TrackApplicationModal } from './components/TrackApplicationModal';
import { OperatorDashboardModal } from './components/OperatorDashboardModal';
import { ResumeBiodataModal } from './components/ResumeBiodataModal';
import { AboutUsSection } from './components/AboutUsSection';
import { Footer } from './components/Footer';
import { ServiceItem, ServiceCategory, ApplicationRecord } from './types';
import { SERVICES } from './data/servicesData';

export default function App() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);
  const [receiptRecord, setReceiptRecord] = useState<ApplicationRecord | null>(null);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showBiodataModal, setShowBiodataModal] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500 selection:text-white">
      {/* Top Header */}
      <Header
        lang={lang}
        setLang={setLang}
        onOpenTrack={() => setShowTrackModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenBiodataModal={() => setShowBiodataModal(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Hero Section & Shop Highlights */}
      <HeroBanner
        lang={lang}
        onSelectCategory={handleSelectCategoryFromHero}
        onOpenQuickApply={handleOpenQuickApply}
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
      />

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
