import React from 'react';
import {
  Printer,
  CheckCircle2,
  Share2,
  X,
  MessageCircle,
  FileCheck2,
} from 'lucide-react';
import { ApplicationRecord } from '../types';
import { SHOP_INFO } from '../data/servicesData';

interface ApplicationReceiptProps {
  application: ApplicationRecord | null;
  onClose: () => void;
  lang: 'hi' | 'en';
}

export const ApplicationReceipt: React.FC<ApplicationReceiptProps> = ({
  application,
  onClose,
  lang,
}) => {
  if (!application) return null;

  const handlePrint = () => {
    window.print();
  };

  const whatsappReceiptText = `*PIYUSH TRAVELS & ONLINE SEVA KENDRA*
Bagahi Bazar, Main Market (Opp. Post Office)
Mob: 7763890336 | Email: razav75@gmail.com
--------------------------------
*APPLICATION ACKNOWLEDGEMENT SLIP*
Ref No: *${application.id}*
Service: *${application.serviceName}*
Applicant: *${application.applicantName}*
Mobile: *${application.mobileNumber}*
Amount Paid: *₹${application.amountPaid}* (${application.paymentMethod || 'Online'})
Transaction ID: *${application.transactionRef || 'N/A'}*
Status: *${application.status.toUpperCase()}*
Expected Date: *${application.expectedDate}*
--------------------------------
Track status anytime at Piyush Travels Portal or call 7763890336.`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'hi'
                ? 'आवेदन सफलतापूर्वक दर्ज हुआ!'
                : 'Application Registered Successfully!'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-print-slip"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'प्रिंट पर्ची' : 'Print Slip'}</span>
            </button>

            <a
              href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodeURIComponent(
                whatsappReceiptText
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div
          id="printable-receipt"
          className="p-6 sm:p-8 bg-white text-slate-900 font-sans border-t-4 border-amber-600"
        >
          {/* Shop Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900">
            <div className="inline-block px-3 py-0.5 text-[11px] font-black uppercase tracking-wider bg-slate-900 text-white rounded mb-1">
              Government & Cyber Seva Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
              {SHOP_INFO.name}
            </h1>
            <p className="text-xs font-bold text-amber-800">
              {SHOP_INFO.nameHi} • {SHOP_INFO.subName}
            </p>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              {SHOP_INFO.addressHi} (Bagahi Bazar, Main Market, In Front of Post Office)
            </p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Mobile: <span className="font-bold">{SHOP_INFO.phone}</span> | Email:{' '}
              <span>{SHOP_INFO.email}</span>
            </p>
          </div>

          {/* Slip Title & Ref ID Bar */}
          <div className="my-4 p-2.5 bg-slate-100 rounded-lg flex flex-wrap items-center justify-between gap-2 border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Application Reference No.
              </span>
              <span className="font-mono text-base font-black text-slate-900 tracking-wider">
                {application.id}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Date & Time
              </span>
              <span className="text-xs font-bold text-slate-800">
                {application.submittedAt}
              </span>
            </div>
          </div>

          {/* Applicant & Service Details Table */}
          <div className="space-y-3 text-xs border border-slate-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-slate-50 px-3 py-2 font-bold text-slate-800 border-b border-slate-200 flex items-center justify-between">
              <span>आवेदक एवं सेवा विवरण (Applicant Details)</span>
              <span className="text-emerald-700 font-mono text-[11px]">
                Status: {application.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3.5">
              <div>
                <span className="text-slate-500 block text-[11px]">Service Requested:</span>
                <span className="font-bold text-slate-900">{application.serviceName}</span>
                <span className="text-[11px] text-slate-600 block">
                  {application.serviceNameHi}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Applicant Name:</span>
                <span className="font-bold text-slate-900">{application.applicantName}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Father / Husband Name:</span>
                <span className="font-semibold text-slate-800">
                  {application.fatherHusbandName || 'N/A'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Contact Mobile:</span>
                <span className="font-mono font-bold text-slate-800">
                  {application.mobileNumber}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Aadhaar / ID Ref:</span>
                <span className="font-mono text-slate-800">{application.aadharNumber}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px]">Village / Address:</span>
                <span className="text-slate-800">{application.address}</span>
              </div>

              {/* Service custom fields summary */}
              {Object.entries(application.customData || {}).length > 0 && (
                <div className="col-span-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                  {Object.entries(application.customData).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-500 capitalize block">
                        {k.replace(/([A-Z])/g, ' $1')}:
                      </span>
                      <span className="font-semibold text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Breakdown Box */}
          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs flex items-center justify-between mb-4">
            <div>
              <span className="text-amber-900 font-bold block">
                Payment Status: {application.paymentStatus === 'paid' ? 'PAID ✓' : 'PAY AT SHOP'}
              </span>
              <span className="text-[11px] text-amber-800">
                Mode: {application.paymentMethod || 'UPI'} • Ref:{' '}
                <span className="font-mono">{application.transactionRef || 'N/A'}</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                Amount Paid
              </span>
              <span className="text-lg font-black text-slate-900">
                ₹{application.amountPaid}.00
              </span>
            </div>
          </div>

          {/* Delivery Date & Seal Box */}
          <div className="grid grid-cols-2 gap-4 items-end pt-3 text-xs border-t border-slate-200">
            <div>
              <div className="text-[11px] text-slate-500">
                Estimated Delivery / Readiness:
              </div>
              <div className="text-sm font-black text-slate-900">
                {application.expectedDate}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                *Subject to government RTPS/portal server timelines.
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="w-24 h-12 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 mb-1">
                [ Shop Stamp ]
              </div>
              <div className="font-bold text-slate-900 text-xs">Piyush Travels</div>
              <div className="text-[10px] text-slate-500">Authorized Operator</div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-5 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400">
            यह पावती रसीद पीयूष ट्रैवेल्स, बगाही बाज़ार द्वारा डिजिटल रूप से उत्पन्न की गई है।
            किसी भी सहायता हेतु 7763890336 पर संपर्क करें।
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {lang === 'hi' ? 'रसीद सुरक्षित रखें।' : 'Please retain this receipt for tracking.'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            {lang === 'hi' ? 'बंद करें (Close)' : 'Done / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
