import React, { useState } from 'react';
import {
  X,
  UserCog,
  Phone,
  MessageCircle,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Search,
  IndianRupee,
  RefreshCw,
} from 'lucide-react';
import { ApplicationRecord, ApplicationStatus } from '../types';
import { getStoredApplications, updateApplicationStatus } from '../utils/storage';
import { SHOP_INFO } from '../data/servicesData';
import { updateApplicationStatusFirestore } from '../firebase';

interface OperatorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  onViewReceipt: (app: ApplicationRecord) => void;
}

export const OperatorDashboardModal: React.FC<OperatorDashboardModalProps> = ({
  isOpen,
  onClose,
  lang,
  onViewReceipt,
}) => {
  const [applications, setApplications] = useState<ApplicationRecord[]>(getStoredApplications());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterQuery, setFilterQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

  if (!isOpen) return null;

  const handleRefresh = () => {
    setApplications(getStoredApplications());
  };

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    updateApplicationStatus(id, newStatus);
    updateApplicationStatusFirestore(id, newStatus).catch((err) => {
      console.warn('Firestore status update notice:', err);
    });
    setApplications(getStoredApplications());
  };

  const handleSaveNotes = (id: string) => {
    const app = applications.find((a) => a.id === id);
    if (app) {
      updateApplicationStatus(id, app.status, notesInput);
      updateApplicationStatusFirestore(id, app.status, notesInput).catch((err) => {
        console.warn('Firestore notes update notice:', err);
      });
      setApplications(getStoredApplications());
      setEditingNotesId(null);
      setNotesInput('');
    }
  };

  const filtered = applications.filter((app) => {
    const statusMatch = filterStatus === 'all' || app.status === filterStatus;
    const q = filterQuery.toLowerCase().trim();
    const queryMatch =
      !q ||
      app.id.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.mobileNumber.includes(q) ||
      app.serviceName.toLowerCase().includes(q);

    return statusMatch && queryMatch;
  });

  const totalRevenue = applications
    .filter((a) => a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.amountPaid, 0);

  const pendingCount = applications.filter(
    (a) => a.status === 'submitted' || a.status === 'processing'
  ).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center">
              <UserCog className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  {lang === 'hi' ? 'दुकानदार / ऑपरेटर नियंत्रण कक्ष' : 'Operator Management Desk'}
                </h2>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  Piyush Travels Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {SHOP_INFO.name} • {SHOP_INFO.address} • Mob: {SHOP_INFO.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-100 border-b border-slate-200 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-[11px] block">कुल आवेदन (Total Forms)</span>
            <span className="text-lg font-black text-slate-900">{applications.length}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-[11px] block">प्रक्रियाधीन (Pending Work)</span>
            <span className="text-lg font-black text-amber-700">{pendingCount}</span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-[11px] block">तैयार / पूर्ण (Completed)</span>
            <span className="text-lg font-black text-emerald-700">
              {applications.filter((a) => a.status === 'completed' || a.status === 'ready_for_pickup').length}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-slate-500 text-[11px] block">ऑनलाइन संग्रह (Revenue)</span>
            <span className="text-lg font-black text-slate-900">₹{totalRevenue}</span>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search by ID, name, mobile, or service..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:border-amber-600"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'submitted', 'processing', 'ready_for_pickup', 'completed'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List Table */}
        <div className="overflow-y-auto flex-1 p-4">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No matching applications found.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 hover:border-amber-400 transition-all text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                        {app.id}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {app.applicantName}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600">{app.serviceName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          app.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        ₹{app.amountPaid} • {app.paymentStatus.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400">{app.submittedAt}</span>
                    </div>
                  </div>

                  {/* Details row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block">Mobile & Aadhaar:</span>
                      <span className="font-bold text-slate-800">{app.mobileNumber}</span> (
                      {app.aadharNumber})
                    </div>
                    <div>
                      <span className="text-slate-400 block">Address:</span>
                      <span>{app.address}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Payment Ref:</span>
                      <span className="font-mono">{app.transactionRef || 'Cash'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Status:</span>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value as ApplicationStatus)
                        }
                        className="bg-slate-50 border border-slate-300 rounded px-2 py-1 font-bold text-slate-800 text-[11px]"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="document_verified">Document Verified</option>
                        <option value="processing">Processing</option>
                        <option value="ready_for_pickup">Ready for Pickup</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes & Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex-1 text-[11px]">
                      {editingNotesId === app.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={notesInput}
                            onChange={(e) => setNotesInput(e.target.value)}
                            placeholder="Add remark or update notes for customer..."
                            className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveNotes(app.id)}
                            className="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-bold"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingNotesId(null)}
                            className="px-2 py-1 text-slate-500 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 italic">
                            Note: {app.operatorNotes || 'No notes yet'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotesId(app.id);
                              setNotesInput(app.operatorNotes || '');
                            }}
                            className="text-[10px] text-amber-700 font-bold hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${app.mobileNumber}`}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={`https://wa.me/91${app.mobileNumber}?text=${encodeURIComponent(
                          `नमस्ते ${app.applicantName} जी, आपके आवेदन ${app.id} (${app.serviceName}) की स्थिति: ${app.status.toUpperCase()}. पीयूष ट्रैवेल्स, बगाही बाज़ार।`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                        title="WhatsApp Update"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => onViewReceipt(app)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3 text-amber-400" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
