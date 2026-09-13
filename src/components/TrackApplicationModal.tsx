import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  Printer,
  MessageCircle,
  AlertCircle,
  Download,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { ApplicationRecord, ApplicationStatus } from '../types';
import { getStoredApplications } from '../utils/storage';
import { SHOP_INFO } from '../data/servicesData';
import { fetchApplicationFromFirestore } from '../firebase';

interface TrackApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  onViewReceipt: (app: ApplicationRecord) => void;
}

export const TrackApplicationModal: React.FC<TrackApplicationModalProps> = ({
  isOpen,
  onClose,
  lang,
  onViewReceipt,
}) => {
  const [searchKey, setSearchKey] = useState('');
  const [searchedRecord, setSearchedRecord] = useState<ApplicationRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchKey.trim().toUpperCase();
    if (!query) return;

    setIsSearching(true);
    setHasSearched(true);

    // 1. Check local storage first for instant response
    const all = getStoredApplications();
    let found = all.find(
      (app) =>
        app.id.toUpperCase() === query ||
        app.mobileNumber.replace(/\D/g, '') === query.replace(/\D/g, '') ||
        app.applicantName.toLowerCase().includes(query.toLowerCase())
    );

    // 2. If not found locally, query Firestore
    if (!found) {
      try {
        const cloudDoc = await fetchApplicationFromFirestore(query);
        if (cloudDoc) {
          found = cloudDoc;
        }
      } catch (err) {
        console.warn('Firestore track query error:', err);
      }
    }

    setSearchedRecord(found || null);
    setIsSearching(false);
  };

  const steps: { id: ApplicationStatus; titleEn: string; titleHi: string; descEn: string; descHi: string }[] = [
    {
      id: 'submitted',
      titleEn: 'Application Submitted',
      titleHi: 'आवेदन दर्ज हुआ',
      descEn: 'Application & documents received',
      descHi: 'आवेदन व कागजात प्राप्त हुए',
    },
    {
      id: 'document_verified',
      titleEn: 'Document Verified',
      titleHi: 'दस्तावेज जांच पूर्ण',
      descEn: 'Verified by Piyush Travels operator',
      descHi: 'ऑपरेटर द्वारा कागजातों की जांच की गई',
    },
    {
      id: 'processing',
      titleEn: 'Department Processing',
      titleHi: 'पोर्टल / विभाग में प्रक्रियाधीन',
      descEn: 'Submitted to official Govt / RTPS server',
      descHi: 'सरकारी पोर्टल पर फॉर्म सबमिट हुआ',
    },
    {
      id: 'ready_for_pickup',
      titleEn: 'Ready for Download / Pickup',
      titleHi: 'प्रमाणपत्र / टिकट तैयार',
      descEn: 'Available for instant digital download or shop pickup',
      descHi: 'दुकान से प्राप्त करें अथवा डिजिटल डाउनलोड करें',
    },
  ];

  const getStepIndex = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted': return 0;
      case 'document_verified': return 1;
      case 'processing': return 2;
      case 'ready_for_pickup':
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentIndex = searchedRecord ? getStepIndex(searchedRecord.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              {lang === 'hi' ? 'आवेदन स्थिति जांच' : 'Application Tracking'}
            </span>
            <h2 className="text-base sm:text-xl font-black tracking-tight">
              {lang === 'hi' ? 'ट्रैकिंग स्टेटस (Piyush Travels)' : 'Check Application Progress'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            id="close-tracking-modal-btn"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Search Input Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? 'रेफरेंस नंबर (e.g. PT-2026-7821) या 10 अंकों का मोबाइल दर्ज करें'
                    : 'Enter Reference ID (e.g. PT-2026-7821) or Mobile Number'
                }
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-600 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden font-medium"
              />
            </div>
            <button
              type="submit"
              id="btn-search-tracking"
              className="bg-slate-900 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0"
            >
              {lang === 'hi' ? 'खोजें' : 'Track'}
            </button>
          </form>

          {/* Sample quick search helpers */}
          {!hasSearched && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs text-slate-600">
              <span className="font-bold text-slate-800 block mb-1">
                {lang === 'hi' ? 'उदाहरण के लिए क्लिक करें:' : 'Try sample application:'}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchKey('PT-2026-7821');
                  }}
                  className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-mono hover:border-amber-500 text-amber-900 font-bold"
                >
                  PT-2026-7821 (Income Cert)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchKey('PT-2026-6410');
                  }}
                  className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-mono hover:border-amber-500 text-amber-900 font-bold"
                >
                  PT-2026-6410 (PAN Card)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchKey('PT-2026-3195');
                  }}
                  className="bg-white px-2.5 py-1 rounded-md border border-slate-200 text-[11px] font-mono hover:border-amber-500 text-amber-900 font-bold"
                >
                  PT-2026-3195 (Railway Ticket)
                </button>
              </div>
            </div>
          )}

          {/* Searched Record Result */}
          {hasSearched && searchedRecord && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Application Snapshot Card */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-900 block">
                    {searchedRecord.id}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">
                    {lang === 'hi' ? searchedRecord.serviceNameHi : searchedRecord.serviceName}
                  </h3>
                  <p className="text-slate-600 mt-0.5">
                    {lang === 'hi' ? 'आवेदक:' : 'Applicant:'}{' '}
                    <strong>{searchedRecord.applicantName}</strong> • {searchedRecord.mobileNumber}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Expected Delivery
                  </span>
                  <span className="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 inline-block mt-0.5">
                    {searchedRecord.expectedDate}
                  </span>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3">
                  {lang === 'hi' ? 'प्रगति स्थिति:' : 'Application Journey:'}
                </div>

                <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {steps.map((step, idx) => {
                    const isDone = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;

                    return (
                      <div key={step.id} className="relative">
                        <span
                          className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                            isDone
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white text-slate-400 border-slate-300'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </span>

                        <div className="text-xs">
                          <div
                            className={`font-bold ${
                              isCurrent
                                ? 'text-amber-700'
                                : isDone
                                ? 'text-slate-900'
                                : 'text-slate-400'
                            }`}
                          >
                            {lang === 'hi' ? step.titleHi : step.titleEn}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {lang === 'hi' ? step.descHi : step.descEn}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Operator Remarks / Status Note */}
              {searchedRecord.operatorNotes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block mb-0.5">
                    {lang === 'hi' ? 'ऑपरेटर टिप्पणी (Piyush Travels):' : 'Operator Note:'}
                  </span>
                  <p className="text-slate-700 text-xs italic">
                    "{searchedRecord.operatorNotes}"
                  </p>
                </div>
              )}

              {/* Action Buttons for this Record */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onViewReceipt(searchedRecord)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2 px-3 rounded-xl text-xs font-bold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'hi' ? 'पावती पर्ची देखें' : 'View / Print Slip'}</span>
                </button>

                <a
                  href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodeURIComponent(
                    `नमस्ते Piyush Travels, मेरे आवेदन संख्या ${searchedRecord.id} (${searchedRecord.serviceName}) का स्टेटस क्या है?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl text-xs font-bold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>
          )}

          {/* Not Found Screen */}
          {hasSearched && !searchedRecord && (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                {lang === 'hi' ? 'आवेदन नहीं मिला' : 'No Application Found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'hi'
                  ? 'दर्ज किए गए रेफरेंस नंबर या मोबाइल नंबर से कोई आवेदन मेल नहीं खा रहा है। कृपया नंबर जांचें या सीधे संपर्क करें।'
                  : 'We could not locate an application with that reference ID or mobile. Please double-check or call Piyush Travels.'}
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <a
                  href={`tel:${SHOP_INFO.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
                >
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>Call {SHOP_INFO.phone}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
