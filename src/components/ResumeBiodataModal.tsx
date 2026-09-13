import React, { useState } from 'react';
import {
  X,
  Heart,
  FileText,
  Printer,
  Sparkles,
  Download,
  MessageCircle,
  User,
  Briefcase,
  GraduationCap,
  Phone,
  Calendar,
  MapPin,
} from 'lucide-react';
import { SHOP_INFO } from '../data/servicesData';

interface ResumeBiodataModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
}

export const ResumeBiodataModal: React.FC<ResumeBiodataModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'biodata' | 'resume'>('biodata');

  // Biodata state
  const [symbol, setSymbol] = useState<'ganesh' | 'om' | '786' | 'none'>('ganesh');
  const [bioName, setBioName] = useState('Rahul Kumar');
  const [bioDob, setBioDob] = useState('1998-04-14');
  const [bioHeight, setBioHeight] = useState("5' 8\"");
  const [bioComplexion, setBioComplexion] = useState('Fair (गोरा)');
  const [bioEducation, setBioEducation] = useState('B.Tech (Computer Science)');
  const [bioOccupation, setBioOccupation] = useState('Software Engineer / Private Job');
  const [bioIncome, setBioIncome] = useState('₹6.5 Lakh / Annual');
  const [bioFather, setBioFather] = useState('Shri Rameshwar Prasad (Businessman)');
  const [bioMother, setBioMother] = useState('Smt. Sunita Devi (Homemaker)');
  const [bioSiblings, setBioSiblings] = useState('1 Elder Brother (Married), 1 Sister');
  const [bioGotra, setBioGotra] = useState('Kashyap (कश्यप)');
  const [bioAddress, setBioAddress] = useState('Bagahi Bazar, Main Market, Dist: Gopalganj, Bihar');
  const [bioContact, setBioContact] = useState('7763890336');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden print:border-none print:shadow-none animate-in fade-in duration-150 flex flex-col max-h-[90vh]">
        {/* Header (no print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('biodata')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'biodata'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'शादी बायोडाटा (Matrimony)' : 'Wedding Bio Data'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('resume')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'resume'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'नौकरी CV / रिज्यूम' : 'Job CV / Resume'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'प्रिंट / PDF' : 'Print / PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content: Form Editor on Left + Live Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-1">
          {/* Left Column: Editor Controls (No Print) */}
          <div className="no-print lg:col-span-5 p-4 bg-slate-50 border-r border-slate-200 overflow-y-auto space-y-3.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 uppercase tracking-wide">
                {lang === 'hi' ? 'विवरण भरें' : 'Fill Details'}
              </span>
              <span className="text-[11px] text-amber-700 font-semibold">
                Live Preview →
              </span>
            </div>

            {/* Religious Header Symbol */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'शीर्ष धार्मिक प्रतीक:' : 'Top Religious Heading:'}
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <button
                  type="button"
                  onClick={() => setSymbol('ganesh')}
                  className={`py-1.5 px-1 rounded-lg border text-xs font-bold ${
                    symbol === 'ganesh'
                      ? 'bg-amber-100 border-amber-600 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  श्री गणेश
                </button>
                <button
                  type="button"
                  onClick={() => setSymbol('om')}
                  className={`py-1.5 px-1 rounded-lg border text-xs font-bold ${
                    symbol === 'om'
                      ? 'bg-amber-100 border-amber-600 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  ॥ ॐ ॥
                </button>
                <button
                  type="button"
                  onClick={() => setSymbol('786')}
                  className={`py-1.5 px-1 rounded-lg border text-xs font-bold ${
                    symbol === '786'
                      ? 'bg-amber-100 border-amber-600 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  786
                </button>
                <button
                  type="button"
                  onClick={() => setSymbol('none')}
                  className={`py-1.5 px-1 rounded-lg border text-xs font-bold ${
                    symbol === 'none'
                      ? 'bg-amber-100 border-amber-600 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Simple
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Full Name (नाम):
              </label>
              <input
                type="text"
                value={bioName}
                onChange={(e) => setBioName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  DOB (जन्मतिथि):
                </label>
                <input
                  type="date"
                  value={bioDob}
                  onChange={(e) => setBioDob(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Height (कद):
                </label>
                <input
                  type="text"
                  value={bioHeight}
                  onChange={(e) => setBioHeight(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Education (शिक्षा):
              </label>
              <input
                type="text"
                value={bioEducation}
                onChange={(e) => setBioEducation(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Occupation / Job (पेशा):
              </label>
              <input
                type="text"
                value={bioOccupation}
                onChange={(e) => setBioOccupation(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Income (वार्षिक आय):
                </label>
                <input
                  type="text"
                  value={bioIncome}
                  onChange={(e) => setBioIncome(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Gotra / Caste:
                </label>
                <input
                  type="text"
                  value={bioGotra}
                  onChange={(e) => setBioGotra(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Father's Name & Occupation:
              </label>
              <input
                type="text"
                value={bioFather}
                onChange={(e) => setBioFather(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mother's Name:
              </label>
              <input
                type="text"
                value={bioMother}
                onChange={(e) => setBioMother(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Brothers & Sisters (भाई-बहन):
              </label>
              <input
                type="text"
                value={bioSiblings}
                onChange={(e) => setBioSiblings(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Contact Mobile (मोबाइल):
              </label>
              <input
                type="text"
                value={bioContact}
                onChange={(e) => setBioContact(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Address (पता):
              </label>
              <textarea
                rows={2}
                value={bioAddress}
                onChange={(e) => setBioAddress(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white rounded-lg border border-slate-300"
              />
            </div>

            {/* Shop assist reminder */}
            <div className="p-2.5 bg-amber-100/60 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              💡 <strong>पीयूष ट्रैवेल्स विशेष सेवा:</strong> अगर आप फोटो सहित डिज़ाइनर ग्लॉसी शादी बायोडाटा अथवा कलरफुल लेमिनेशन चाहते हैं, तो बगाही बाज़ार दुकान पर पधारें।
            </div>
          </div>

          {/* Right Column: Live Sheet Preview (Printable) */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-amber-50/20 flex items-center justify-center overflow-y-auto">
            <div className="w-full max-w-md bg-white border-2 border-amber-600/80 rounded-2xl p-6 sm:p-8 shadow-md print:border-2 print:shadow-none print:max-w-none">
              {/* Header Symbol */}
              <div className="text-center pb-3 border-b-2 border-amber-500/40">
                {symbol === 'ganesh' && (
                  <div className="text-sm font-extrabold text-amber-800 tracking-wider">
                    ॥ श्री गणेशाय नमः ॥
                  </div>
                )}
                {symbol === 'om' && (
                  <div className="text-base font-extrabold text-amber-800 tracking-wider">
                    ॥ ॐ ॥
                  </div>
                )}
                {symbol === '786' && (
                  <div className="text-sm font-extrabold text-emerald-800 tracking-wider">
                    786 / बिस्मिल्लाह हिर्रहमान निर्रहीम
                  </div>
                )}
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide uppercase mt-1">
                  {activeTab === 'biodata' ? 'BIO DATA (बायोडाटा)' : 'CURRICULUM VITAE'}
                </h2>
              </div>

              {/* Personal Details */}
              <div className="mt-4 space-y-3 text-xs">
                <div className="bg-amber-50/50 p-2 rounded font-bold text-amber-950 uppercase tracking-wider text-[11px] border border-amber-200/50">
                  Personal Details (व्यक्तिगत विवरण)
                </div>

                <div className="grid grid-cols-3 gap-y-1.5 text-slate-700">
                  <div className="font-semibold text-slate-900">Full Name:</div>
                  <div className="col-span-2 font-bold text-slate-950">{bioName}</div>

                  <div className="font-semibold text-slate-900">Date of Birth:</div>
                  <div className="col-span-2">{bioDob}</div>

                  <div className="font-semibold text-slate-900">Height:</div>
                  <div className="col-span-2">{bioHeight}</div>

                  <div className="font-semibold text-slate-900">Complexion:</div>
                  <div className="col-span-2">{bioComplexion}</div>

                  <div className="font-semibold text-slate-900">Education:</div>
                  <div className="col-span-2 font-semibold text-slate-900">{bioEducation}</div>

                  <div className="font-semibold text-slate-900">Occupation:</div>
                  <div className="col-span-2 font-semibold text-slate-900">{bioOccupation}</div>

                  <div className="font-semibold text-slate-900">Annual Income:</div>
                  <div className="col-span-2">{bioIncome}</div>

                  <div className="font-semibold text-slate-900">Gotra / Caste:</div>
                  <div className="col-span-2">{bioGotra}</div>
                </div>

                {/* Family Details */}
                <div className="bg-amber-50/50 p-2 rounded font-bold text-amber-950 uppercase tracking-wider text-[11px] border border-amber-200/50 mt-3">
                  Family Details (पारिवारिक विवरण)
                </div>

                <div className="grid grid-cols-3 gap-y-1.5 text-slate-700">
                  <div className="font-semibold text-slate-900">Father's Name:</div>
                  <div className="col-span-2">{bioFather}</div>

                  <div className="font-semibold text-slate-900">Mother's Name:</div>
                  <div className="col-span-2">{bioMother}</div>

                  <div className="font-semibold text-slate-900">Siblings:</div>
                  <div className="col-span-2">{bioSiblings}</div>
                </div>

                {/* Contact & Address */}
                <div className="bg-amber-50/50 p-2 rounded font-bold text-amber-950 uppercase tracking-wider text-[11px] border border-amber-200/50 mt-3">
                  Contact Information (संपर्क सूत्र)
                </div>

                <div className="grid grid-cols-3 gap-y-1.5 text-slate-700">
                  <div className="font-semibold text-slate-900">Phone / Mob:</div>
                  <div className="col-span-2 font-mono font-bold text-slate-950">{bioContact}</div>

                  <div className="font-semibold text-slate-900">Full Address:</div>
                  <div className="col-span-2">{bioAddress}</div>
                </div>
              </div>

              {/* Bottom footer stamp */}
              <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
                Printed & Prepared at Piyush Travels & Cyber Seva, Bagahi Bazar (Opp. Post Office)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
