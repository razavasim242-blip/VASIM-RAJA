import React, { useState, useEffect } from 'react';
import { X, FileText, CheckCircle2, Clock, AlertCircle, RefreshCw, Printer, Search, ShieldCheck } from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { ApplicationRecord } from '../types';
import { getStoredApplications } from '../utils/storage';

interface MyApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  onViewReceipt: (record: ApplicationRecord) => void;
  onOpenApply: () => void;
}

export const MyApplicationsModal: React.FC<MyApplicationsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onViewReceipt,
  onOpenApply,
}) => {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const user = auth.currentUser;
    if (!user) {
      // If not logged in, show local storage records
      setApplications(getStoredApplications());
      setLoading(false);
      return;
    }

    setLoading(true);
    const appCollection = collection(db, 'applications');
    const q = query(appCollection, where('userId', '==', user.uid));

    // Mandatory onSnapshot with error handler as per firebase-skill
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cloudRecords: ApplicationRecord[] = [];
        snapshot.forEach((doc) => {
          cloudRecords.push(doc.data() as ApplicationRecord);
        });

        // Also merge any local applications that match the user's email/mobile
        const local = getStoredApplications();
        const combinedMap = new Map<string, ApplicationRecord>();

        cloudRecords.forEach((r) => combinedMap.set(r.id, r));
        local.forEach((r) => {
          if (!combinedMap.has(r.id)) {
            if (r.email === user.email || r.mobileNumber === user.phoneNumber) {
              combinedMap.set(r.id, r);
            }
          }
        });

        // If user is brand new and has 0 records, we can display recent demo applications so they see the format
        if (combinedMap.size === 0 && local.length > 0) {
          local.slice(0, 3).forEach((r) => combinedMap.set(r.id, r));
        }

        setApplications(Array.from(combinedMap.values()));
        setLoading(false);
      },
      (error) => {
        console.warn('Firestore subscription fallback:', error);
        // Fallback to local storage if rules/offline
        setApplications(getStoredApplications());
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = applications.filter(
    (app) =>
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceNameHi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: ApplicationRecord['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'hi' ? 'पूर्ण (Completed)' : 'Completed'}</span>
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="inline-flex items-center gap-1 bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>{lang === 'hi' ? 'दुकान से प्राप्त करें' : 'Ready at Shop'}</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>{lang === 'hi' ? 'प्रक्रियाधीन (Processing)' : 'In Process'}</span>
          </span>
        );
      case 'document_verified':
        return (
          <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-300">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === 'hi' ? 'कागजात सत्यापित' : 'Docs Verified'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>{lang === 'hi' ? 'आवेदन प्राप्त' : 'Submitted'}</span>
          </span>
        );
    }
  };

  const user = auth.currentUser;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {lang === 'hi' ? 'मेरे आवेदन एवं रसीदें' : 'My Applications & Receipts'}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {user?.email ? (
                  <span>
                    {user.displayName || user.email} •{' '}
                    <span className="text-emerald-400 font-semibold">Firebase Cloud Synced</span>
                  </span>
                ) : (
                  <span>{lang === 'hi' ? 'स्थानीय व सुरक्षित रिकॉर्ड्स' : 'Secure Local & Cloud Records'}</span>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-my-apps"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'hi' ? 'ट्रैकिंग आईडी, आवेदक का नाम या सेवा से खोजें...' : 'Search by ID, name, or service...'}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
            />
          </div>
          <button
            type="button"
            onClick={onOpenApply}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap cursor-pointer"
          >
            {lang === 'hi' ? '+ नया आवेदन' : '+ New Apply'}
          </button>
        </div>

        {/* Applications List */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-600" />
              <span>{lang === 'hi' ? 'डेटाबेस से आवेदन लोड हो रहे हैं...' : 'Loading applications from cloud...'}</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">
                {lang === 'hi' ? 'कोई आवेदन नहीं मिला' : 'No applications found'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'hi'
                  ? 'सरकारी योजनाओं व प्रमाण पत्र के लिए ऑनलाइन आवेदन करें।'
                  : 'Submit a new application for certificates or government schemes.'}
              </p>
              <button
                type="button"
                onClick={onOpenApply}
                className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                {lang === 'hi' ? 'अभी आवेदन करें' : 'Apply Now'}
              </button>
            </div>
          ) : (
            filtered.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:border-amber-400/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-extrabold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      {app.id}
                    </span>
                    {getStatusBadge(app.status)}
                    <span className="text-[11px] text-slate-500 font-medium">
                      {app.submittedAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {lang === 'hi' ? app.serviceNameHi : app.serviceName}
                  </h3>

                  <div className="text-xs text-slate-600 flex items-center gap-3 flex-wrap">
                    <span>
                      <strong className="text-slate-700">{lang === 'hi' ? 'आवेदक:' : 'Applicant:'}</strong>{' '}
                      {app.applicantName}
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-700">{lang === 'hi' ? 'मोबाइल:' : 'Mobile:'}</strong>{' '}
                      {app.mobileNumber}
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-700">{lang === 'hi' ? 'शुल्क:' : 'Fee:'}</strong> ₹
                      {app.amountPaid} ({app.paymentStatus === 'paid' ? (lang === 'hi' ? 'ऑनलाइन भुगतान' : 'Paid') : (lang === 'hi' ? 'दुकान पर देय' : 'Pay at Shop')})
                    </span>
                  </div>

                  {app.operatorNotes && (
                    <p className="text-xs text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200/60 mt-1">
                      <strong>{lang === 'hi' ? 'दुकानदार नोट:' : 'Operator Note:'}</strong>{' '}
                      {app.operatorNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onViewReceipt(app);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'रसीद प्रिंट करें' : 'View Receipt'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
