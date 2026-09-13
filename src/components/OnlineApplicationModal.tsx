import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  CreditCard,
  Trash2,
} from 'lucide-react';
import { ServiceItem, ApplicationRecord } from '../types';
import { SHOP_INFO } from '../data/servicesData';
import { generateApplicationId, saveApplication } from '../utils/storage';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { auth, saveApplicationToFirestore } from '../firebase';

interface OnlineApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceItem | null;
  lang: 'hi' | 'en';
  onApplicationCompleted: (app: ApplicationRecord) => void;
}

export const OnlineApplicationModal: React.FC<OnlineApplicationModalProps> = ({
  isOpen,
  onClose,
  service,
  lang,
  onApplicationCompleted,
}) => {
  // Wizard steps: 1 = Basic Info, 2 = Service Details & Documents, 3 = Review & Payment Trigger
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form State
  const [applicantName, setApplicantName] = useState('');
  const [fatherHusbandName, setFatherHusbandName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [address, setAddress] = useState('');
  const [villageTown, setVillageTown] = useState('Bagahi Bazar');
  const [postOffice, setPostOffice] = useState('Bagahi');
  const [district, setDistrict] = useState('Gopalganj');
  const [state, setState] = useState('Bihar');
  const [pinCode, setPinCode] = useState('841428');

  // Prefill user details if logged in via Google
  useEffect(() => {
    if (auth.currentUser) {
      if (!applicantName && auth.currentUser.displayName) {
        setApplicantName(auth.currentUser.displayName);
      }
      if (!email && auth.currentUser.email) {
        setEmail(auth.currentUser.email);
      }
      if (!mobileNumber && auth.currentUser.phoneNumber) {
        setMobileNumber(auth.currentUser.phoneNumber.replace('+91', ''));
      }
    }
  }, [isOpen]);

  // Dynamic custom fields
  const [customData, setCustomData] = useState<Record<string, string>>({});

  // Documents uploaded
  const [documents, setDocuments] = useState<
    { name: string; type: string; size: string; uploadedAt: string }[]
  >([]);

  // Payment Modal Trigger
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdAppId, setCreatedAppId] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen || !service) return null;

  const handleCustomFieldChange = (fieldId: string, value: string) => {
    setCustomData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files) as File[];
      const newDocs = fileList.map((file: File) => ({
        name: file.name,
        type: file.type || 'document',
        size: `${Math.round(file.size / 1024)} KB`,
        uploadedAt: new Date().toLocaleDateString('en-GB'),
      }));
      setDocuments((prev) => [...prev, ...newDocs]);
    }
  };

  const removeDoc = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const validateStep1 = () => {
    if (!applicantName.trim()) {
      setFormError(
        lang === 'hi' ? 'कृपया आवेदक का पूरा नाम दर्ज करें।' : 'Please enter Applicant Full Name.'
      );
      return false;
    }
    if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 10) {
      setFormError(
        lang === 'hi'
          ? 'कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।'
          : 'Please enter a valid 10-digit Mobile Number.'
      );
      return false;
    }
    if (!aadharNumber.trim()) {
      setFormError(
        lang === 'hi'
          ? 'कृपया आधार नंबर या पहचान पत्र संख्या दर्ज करें।'
          : 'Please provide Aadhaar / Identity Number.'
      );
      return false;
    }
    setFormError('');
    return true;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();

    // Check required custom fields
    if (service.customFields) {
      for (const field of service.customFields) {
        if (field.required && !customData[field.id]) {
          setFormError(
            lang === 'hi'
              ? `कृपया "${field.labelHi}" दर्ज करें।`
              : `Please fill out required field: "${field.label}".`
          );
          return;
        }
      }
    }

    setFormError('');
    const newId = generateApplicationId();
    setCreatedAppId(newId);
    setShowPaymentModal(true);
  };

  const handleFinalPaymentSuccess = (paymentResult: {
    method: string;
    transactionRef: string;
    status: 'paid' | 'pay_at_shop';
  }) => {
    setShowPaymentModal(false);

    // Calculate expected delivery date (default 7 days)
    const expected = new Date();
    expected.setDate(expected.getDate() + 7);

    const fullRecord: ApplicationRecord = {
      id: createdAppId,
      serviceId: service.id,
      serviceName: service.name,
      serviceNameHi: service.nameHi,
      applicantName,
      fatherHusbandName,
      gender,
      dob,
      mobileNumber,
      email: email || `${mobileNumber}@piyushtravels.local`,
      aadharNumber,
      address,
      villageTown,
      postOffice,
      district,
      state,
      pinCode,
      customData,
      documentsUploaded:
        documents.length > 0
          ? documents
          : [
              {
                name: 'Aadhaar_Attachment.pdf',
                type: 'application/pdf',
                size: '340 KB',
                uploadedAt: new Date().toLocaleDateString('en-GB'),
              },
            ],
      paymentStatus: paymentResult.status,
      paymentMethod: paymentResult.method,
      transactionRef: paymentResult.transactionRef,
      amountPaid: service.fee,
      submittedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      expectedDate: expected.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'submitted',
      operatorNotes:
        paymentResult.status === 'paid'
          ? 'Application received with confirmed online payment. Under verification.'
          : 'Application received. Payment pending at Bagahi Bazar shop counter.',
    };

    saveApplication(fullRecord);
    saveApplicationToFirestore(fullRecord).catch((err) => {
      console.warn('Firestore cloud sync notice:', err);
    });
    onApplicationCompleted(fullRecord);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in duration-150">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-start justify-between relative">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                <span>{lang === 'hi' ? 'ऑनलाइन आवेदन फॉर्म' : 'Online Application Form'}</span>
                <span>•</span>
                <span>₹{service.fee}</span>
              </div>
              <h2 className="text-base sm:text-xl font-black tracking-tight">
                {lang === 'hi' ? service.nameHi : service.name}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {lang === 'hi'
                  ? 'पीयूष ट्रैवेल्स, बगाही बाज़ार (मेन मार्केट, पोस्ट ऑफिस के सामने)'
                  : 'Piyush Travels, Bagahi Bazar (Main Market, Opposite Post Office)'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              id="btn-close-application-modal"
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 1
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                1
              </span>
              <span className={currentStep === 1 ? 'text-slate-900 font-bold' : 'text-slate-600'}>
                {lang === 'hi' ? 'आवेदक की जानकारी' : 'Applicant Information'}
              </span>
            </div>

            <div className="h-0.5 w-10 bg-slate-300 mx-2 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === 2
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-300 text-slate-600'
                }`}
              >
                2
              </span>
              <span className={currentStep === 2 ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                {lang === 'hi' ? 'सेवा विवरण व दस्तावेज' : 'Service Details & Docs'}
              </span>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto">
            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* STEP 1: Basic Applicant Details */}
            {currentStep === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'आवेदक का पूरा नाम:' : 'Applicant Full Name:'}
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-600 focus:outline-hidden text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Father / Husband Name */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'पिता / पति का नाम:' : "Father's / Husband's Name:"}
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fatherHusbandName}
                      onChange={(e) => setFatherHusbandName(e.target.value)}
                      placeholder="e.g. Dinesh Kumar"
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-600 focus:outline-hidden text-slate-900"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'लिंग (Gender):' : 'Gender:'}
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-600 focus:outline-hidden text-slate-900"
                    >
                      <option value="Male">Male (पुरुष)</option>
                      <option value="Female">Female (महिला)</option>
                      <option value="Other">Other (अन्य)</option>
                    </select>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'जन्मतिथि (DOB):' : 'Date of Birth:'}
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-600 focus:outline-hidden text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'मोबाइल नंबर:' : 'Mobile Number:'}
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="10 digit number (e.g. 7763890336)"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-600 focus:outline-hidden text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* Aadhaar Number */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'आधार कार्ड नंबर:' : 'Aadhaar Card Number:'}
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        maxLength={14}
                        value={aadharNumber}
                        onChange={(e) => setAadharNumber(e.target.value)}
                        placeholder="XXXX-XXXX-XXXX"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-600 focus:outline-hidden text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'ईमेल आईडी (वैकल्पिक):' : 'Email ID (Optional):'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. razav75@gmail.com"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-600 focus:outline-hidden text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Full Address */}
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'पूरा पता (गाँव / टोला / वार्ड):' : 'Full Residential Address:'}
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Ward No 03, Near Post Office, Bagahi Bazar"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-amber-600 focus:outline-hidden text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Village / Post / District */}
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'गाँव / शहर:' : 'Village / Town:'}
                    </label>
                    <input
                      type="text"
                      value={villageTown}
                      onChange={(e) => setVillageTown(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'डाकघर (Post Office):' : 'Post Office:'}
                    </label>
                    <input
                      type="text"
                      value={postOffice}
                      onChange={(e) => setPostOffice(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'जिला (District):' : 'District:'}
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {lang === 'hi' ? 'पिन कोड (PIN Code):' : 'PIN Code:'}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Continue button */}
                <div className="pt-3 border-t border-slate-200 flex justify-end">
                  <button
                    type="submit"
                    id="btn-step1-next"
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'अगला: सेवा विवरण व दस्तावेज' : 'Next: Service Details & Docs'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Custom Service Fields & Documents */}
            {currentStep === 2 && (
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                {/* Service Specific Fields */}
                {service.customFields && service.customFields.length > 0 && (
                  <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80 space-y-3">
                    <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                      {lang === 'hi' ? 'सेवा विशिष्ट जानकारी' : 'Specific Details for this Service'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {service.customFields.map((field) => (
                        <div key={field.id} className="sm:col-span-1">
                          <label className="block font-bold text-slate-800 mb-1">
                            {lang === 'hi' ? field.labelHi : field.label}
                            {field.required && <span className="text-rose-500 ml-1">*</span>}
                          </label>

                          {field.type === 'select' ? (
                            <select
                              required={field.required}
                              value={customData[field.id] || ''}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:border-amber-600"
                            >
                              <option value="">-- Choose Option --</option>
                              {field.options?.map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              rows={2}
                              required={field.required}
                              value={customData[field.id] || ''}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:border-amber-600"
                            />
                          ) : (
                            <input
                              type={field.type}
                              required={field.required}
                              value={customData[field.id] || ''}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:border-amber-600"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required Documents Checklist Reminder */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>
                      {lang === 'hi'
                        ? 'इस सेवा के लिए आवश्यक कागजात:'
                        : 'Checklist of Required Documents:'}
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                    {(lang === 'hi' ? service.requiredDocsHi : service.requiredDocs).map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>

                {/* Upload Documents Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {lang === 'hi'
                      ? 'कागजात व फोटो अपलोड करें (आधार, फोटो, आदि):'
                      : 'Upload Documents & Photo (Aadhaar, Photo, Sign, etc.):'}
                  </label>

                  <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-amber-50/30 transition-all cursor-pointer text-center">
                    <Upload className="w-6 h-6 text-amber-600 mb-1.5" />
                    <span className="text-xs font-bold text-slate-800">
                      {lang === 'hi'
                        ? 'फाइल चुनें या यहाँ ड्रैग करें'
                        : 'Click to select or drag & drop files'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      PDF, JPG, PNG up to 10 MB per file
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* List of uploaded documents */}
                  {documents.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-700">
                        {lang === 'hi' ? 'अपलोड की गई फाइलें:' : 'Uploaded Files:'}
                      </div>
                      {documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate font-medium text-slate-800">
                              {doc.name}
                            </span>
                            <span className="text-[10px] text-slate-400">({doc.size})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDoc(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Breakdown Preview */}
                <div className="bg-slate-900 text-white rounded-xl p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">
                      {lang === 'hi' ? 'सेवा शुल्क (Piyush Travels):' : 'Service Charge:'}
                    </span>
                    <span className="font-bold text-white text-sm">
                      {lang === 'hi' ? service.nameHi : service.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Total:</span>
                    <span className="text-base font-black text-amber-400">₹{service.fee}</span>
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{lang === 'hi' ? 'पीछे' : 'Back'}</span>
                  </button>

                  <button
                    type="submit"
                    id="btn-proceed-to-payment"
                    className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                  >
                    <span>{lang === 'hi' ? 'भुगतान करें (UPI गेटवे)' : 'Proceed to Payment (UPI Gateway)'}</span>
                    <CreditCard className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentGatewayModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          lang={lang}
          serviceName={service.name}
          serviceNameHi={service.nameHi}
          applicantName={applicantName}
          mobileNumber={mobileNumber}
          amount={service.fee}
          applicationId={createdAppId}
          onPaymentSuccess={handleFinalPaymentSuccess}
        />
      )}
    </>
  );
};
