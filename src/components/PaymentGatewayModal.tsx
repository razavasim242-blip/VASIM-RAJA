import React, { useState } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  CreditCard,
  Building,
  Smartphone,
  AlertCircle,
  ExternalLink,
  Store,
  Lock,
  ArrowRight,
  RefreshCw,
  KeyRound,
} from 'lucide-react';
import { SHOP_INFO } from '../data/servicesData';
import confetti from 'canvas-confetti';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  serviceName: string;
  serviceNameHi: string;
  applicantName: string;
  mobileNumber: string;
  amount: number;
  applicationId: string;
  onPaymentSuccess: (paymentData: {
    method: string;
    transactionRef: string;
    status: 'paid' | 'pay_at_shop';
  }) => void;
}

type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'shop';

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  lang,
  serviceName,
  serviceNameHi,
  applicantName,
  mobileNumber,
  amount,
  applicationId,
  onPaymentSuccess,
}) => {
  const [paymentMode, setPaymentMode] = useState<PaymentMethodType>('upi');

  // UPI states
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentProofName, setPaymentProofName] = useState<string | null>(null);

  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(applicantName || 'Applicant Name');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [showCardOtpModal, setShowCardOtpModal] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');

  // NetBanking states
  const [selectedBank, setSelectedBank] = useState('SBI');
  const [netBankingUserId, setNetBankingUserId] = useState('');
  const [showNetBankingAuthModal, setShowNetBankingAuthModal] = useState(false);

  // Common states
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // UPI deep link
  const upiIntentString = `upi://pay?pa=${encodeURIComponent(SHOP_INFO.upiId)}&pn=${encodeURIComponent(
    SHOP_INFO.name
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`${applicationId} ${applicantName}`)}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiIntentString
  )}&margin=4`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(SHOP_INFO.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(SHOP_INFO.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const triggerSuccess = (method: string, ref: string, status: 'paid' | 'pay_at_shop') => {
    try {
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setIsProcessing(false);
    onPaymentSuccess({
      method,
      transactionRef: ref,
      status,
    });
  };

  // UPI submit
  const handleConfirmUpiPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setErrorMsg(
        lang === 'hi'
          ? 'कृपया 12 अंकों का UPI UTR / Transaction Reference दर्ज करें।'
          : 'Please enter the 12-digit UPI UTR / Transaction Reference Number.'
      );
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    setTimeout(() => {
      triggerSuccess('UPI / QR Payment', utrNumber.trim(), 'paid');
    }, 1000);
  };

  // Card validation & proceed to OTP
  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) {
      setErrorMsg(
        lang === 'hi'
          ? 'कृपया वैध 16 अंकों का डेबिट/क्रेडिट कार्ड नंबर दर्ज करें।'
          : 'Please enter a valid 16-digit card number.'
      );
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      setErrorMsg(lang === 'hi' ? 'वैध एक्सपायरी दर्ज करें (MM/YY)' : 'Enter valid expiry (MM/YY)');
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setErrorMsg(lang === 'hi' ? 'वैध 3 अंकों का CVV दर्ज करें' : 'Enter 3-digit CVV');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowCardOtpModal(true);
    }, 800);
  };

  const handleVerifyCardOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.length < 4) {
      setErrorMsg(lang === 'hi' ? 'कृपया 6 अंकों का OTP दर्ज करें' : 'Enter 6-digit bank OTP');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setShowCardOtpModal(false);
      const cleanNum = cardNumber.replace(/\s+/g, '');
      const last4 = cleanNum.slice(-4);
      triggerSuccess(
        `Debit/Credit Card (ending in ${last4})`,
        `CARD-${Date.now().toString().slice(-8)}`,
        'paid'
      );
    }, 1200);
  };

  // NetBanking submit
  const handleNetBankingInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowNetBankingAuthModal(true);
    }, 800);
  };

  const handleCompleteNetBanking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setShowNetBankingAuthModal(false);
      triggerSuccess(
        `Net Banking (${selectedBank})`,
        `NB-${selectedBank}-${Date.now().toString().slice(-8)}`,
        'paid'
      );
    }, 1200);
  };

  // Cash at Shop
  const handlePayAtShop = () => {
    setIsProcessing(true);
    setTimeout(() => {
      triggerSuccess(
        'Cash at Shop (बगाही बाज़ार दुकान पर नकद)',
        `SHOP-CASH-${applicationId}`,
        'pay_at_shop'
      );
    }, 600);
  };

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = v.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  // Format Card Expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) {
      v = `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    setCardExpiry(v);
  };

  const banks = [
    { id: 'SBI', name: 'State Bank of India (SBI)', logo: '🏛️' },
    { id: 'HDFC', name: 'HDFC Bank', logo: '🏦' },
    { id: 'ICICI', name: 'ICICI Bank', logo: '💳' },
    { id: 'PNB', name: 'Punjab National Bank (PNB)', logo: '🏛️' },
    { id: 'BOB', name: 'Bank of Baroda', logo: '🏦' },
    { id: 'UBGB', name: 'Uttar Bihar Gramin Bank / DBGB', logo: '🌾' },
    { id: 'AXIS', name: 'Axis Bank', logo: '🏢' },
    { id: 'CANARA', name: 'Canara Bank', logo: '🏛️' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 relative">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-amber-950 text-white p-4 sm:p-5 relative">
          <button
            type="button"
            onClick={onClose}
            id="close-payment-modal-btn"
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {lang === 'hi' ? 'सुरक्षित भुगतान गेटवे' : 'Multi-Option Secure Payment Gateway'}
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-400/30 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span>256-bit Encrypted</span>
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black tracking-tight">
            {SHOP_INFO.name} ({SHOP_INFO.nameHi})
          </h2>

          <div className="mt-3 flex items-center justify-between text-xs bg-white/10 rounded-2xl p-3 border border-white/10">
            <div>
              <span className="text-slate-300 block text-[11px]">
                {lang === 'hi' ? 'सेवा व आवेदन आईडी:' : 'Service & Reference:'}
              </span>
              <span className="font-bold text-white text-xs block">
                {lang === 'hi' ? serviceNameHi : serviceName}
              </span>
              <span className="font-mono text-amber-300 text-[11px]">{applicationId}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-300 block text-[11px]">
                {lang === 'hi' ? 'कुल देय राशि:' : 'Amount Due:'}
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-300">
                ₹{amount}.00
              </span>
            </div>
          </div>
        </div>

        {/* Payment Mode Selector Tabs (UPI, Card, Net Banking, Pay at Shop) */}
        <div className="grid grid-cols-4 border-b border-slate-200 text-xs font-bold text-center bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setPaymentMode('upi');
              setErrorMsg('');
            }}
            className={`py-3 px-1 sm:px-2 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-all cursor-pointer ${
              paymentMode === 'upi'
                ? 'border-amber-600 text-amber-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>UPI / QR</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaymentMode('card');
              setErrorMsg('');
            }}
            className={`py-3 px-1 sm:px-2 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-all cursor-pointer ${
              paymentMode === 'card'
                ? 'border-amber-600 text-amber-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{lang === 'hi' ? 'कार्ड्स' : 'Card'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaymentMode('netbanking');
              setErrorMsg('');
            }}
            className={`py-3 px-1 sm:px-2 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-all cursor-pointer ${
              paymentMode === 'netbanking'
                ? 'border-amber-600 text-amber-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>{lang === 'hi' ? 'नेटबैंकिंग' : 'NetBanking'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPaymentMode('shop');
              setErrorMsg('');
            }}
            className={`py-3 px-1 sm:px-2 flex flex-col sm:flex-row items-center justify-center gap-1 border-b-2 transition-all cursor-pointer ${
              paymentMode === 'shop'
                ? 'border-amber-600 text-amber-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{lang === 'hi' ? 'दुकान पर नकद' : 'Cash Counter'}</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-4 sm:p-6 max-h-[72vh] overflow-y-auto">
          {/* TAB 1: UPI / QR PAYMENT */}
          {paymentMode === 'upi' && (
            <div className="space-y-4">
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 text-center">
                <p className="text-xs font-bold text-slate-800 mb-2">
                  {lang === 'hi'
                    ? 'PhonePe, Google Pay, Paytm, BHIM से QR कोड स्कैन कर भुगतान करें'
                    : 'Scan QR code using PhonePe, Google Pay, Paytm, or BHIM app'}
                </p>

                <div className="inline-block p-2.5 bg-white rounded-2xl shadow-xs border border-slate-200">
                  <img
                    src={qrImageUrl}
                    alt="Piyush Travels UPI QR Code"
                    className="w-44 h-44 object-contain mx-auto"
                  />
                  <div className="text-xs font-bold text-slate-800 mt-1">
                    ₹{amount}.00 • {SHOP_INFO.owner}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={upiIntentString}
                    className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'सीधे UPI ऐप खोलें' : 'Open in UPI App'}</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>

              {/* UPI ID details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      Official UPI ID
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-xs select-all">
                      {SHOP_INFO.upiId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">
                      PhonePe / GPay Mobile
                    </span>
                    <span className="font-mono font-bold text-slate-800 text-xs">
                      {SHOP_INFO.phone}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* UPI Verification Form */}
              <form onSubmit={handleConfirmUpiPayment} className="space-y-3 pt-2">
                <div>
                  <label
                    htmlFor="utr-input"
                    className="block text-xs font-bold text-slate-800 mb-1"
                  >
                    {lang === 'hi'
                      ? '12 अंकों का UPI Ref / UTR नंबर दर्ज करें:'
                      : 'UPI 12-digit UTR / Transaction Reference:'}
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="utr-input"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 425619827341"
                    maxLength={20}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-white rounded-xl border border-slate-300 focus:border-amber-600 focus:outline-hidden font-mono"
                  />
                </div>

                {/* Screenshot upload */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    {lang === 'hi' ? 'भुगतान स्क्रीनशॉट (वैकल्पिक):' : 'Payment Screenshot (Optional):'}
                  </label>
                  <label className="flex items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl p-2.5 text-center text-xs text-slate-600 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPaymentProofName(e.target.files[0].name);
                        }
                      }}
                    />
                    <span>
                      {paymentProofName ? (
                        <strong className="text-emerald-700">{paymentProofName} ✓</strong>
                      ) : (
                        <span>
                          {lang === 'hi'
                            ? 'स्क्रीनशॉट अपलोड करने के लिए क्लिक करें'
                            : 'Click to attach payment proof'}
                        </span>
                      )}
                    </span>
                  </label>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="btn-confirm-upi-payment"
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isProcessing ? (
                    <span>
                      {lang === 'hi' ? 'भुगतान सत्यापित हो रहा है...' : 'Verifying Transaction...'}
                    </span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>
                        {lang === 'hi'
                          ? `₹${amount} का भुगतान पूर्ण हुआ - पावती रसीद पाएं`
                          : `Confirm ₹${amount} Paid & Get Official Receipt`}
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: CREDIT / DEBIT CARDS */}
          {paymentMode === 'card' && (
            <div className="space-y-4">
              {/* Interactive Virtual Card Preview */}
              <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-700 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 tracking-wider">
                    {SHOP_INFO.name.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded">
                    RuPay / Visa / MasterCard
                  </div>
                </div>

                {/* EMV Chip Visual */}
                <div className="w-9 h-7 bg-amber-300 rounded-md border border-amber-400/80 shadow-xs flex items-center justify-center">
                  <div className="w-6 h-4 border border-amber-600/60 rounded-xs" />
                </div>

                {/* Card Number display */}
                <div className="font-mono text-base sm:text-lg tracking-widest text-slate-100 font-bold">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>

                {/* Card Details Bottom */}
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block text-slate-400">
                      Cardholder
                    </span>
                    <span className="font-semibold text-white uppercase truncate max-w-[140px] block">
                      {cardHolder || 'APPLICANT'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase tracking-wider block text-slate-400">
                      Expires
                    </span>
                    <span className="font-mono text-white font-bold">
                      {cardExpiry || 'MM/YY'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Form */}
              <form onSubmit={handleCardSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Card Number (16 Digits)
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-mono text-xs sm:text-sm focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Expiry (MM/YY)
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-mono text-xs sm:text-sm focus:outline-hidden focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      CVV
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-mono text-xs sm:text-sm focus:outline-hidden focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isProcessing ? 'Connecting with Bank...' : `Proceed to Pay ₹${amount} via Card`}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: NET BANKING */}
          {paymentMode === 'netbanking' && (
            <div className="space-y-4">
              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-950">
                <span className="font-bold block mb-0.5">
                  {lang === 'hi' ? 'इंटरनेट बैंकिंग पोर्टल' : 'Net Banking Gateway'}
                </span>
                <p className="text-sky-900/90 text-[11px]">
                  {lang === 'hi'
                    ? 'अपने बैंक का चयन करें और सुरक्षित इंटरनेट बैंकिंग के माध्यम से सीधे भुगतान करें।'
                    : 'Select your preferred bank to proceed with direct NetBanking payment.'}
                </p>
              </div>

              {/* Bank Selection Grid */}
              <div className="space-y-2">
                <label className="block font-bold text-xs text-slate-800">
                  {lang === 'hi' ? 'लोकप्रिय बैंक चुनें:' : 'Select Your Bank:'}
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {banks.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        selectedBank === bank.id
                          ? 'bg-amber-50 border-amber-600 text-amber-950 font-bold shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base">{bank.logo}</span>
                      <span className="truncate text-xs">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* NetBanking Form */}
              <form onSubmit={handleNetBankingInitiate} className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Customer / User ID (वैकल्पिक)
                  </label>
                  <input
                    type="text"
                    value={netBankingUserId}
                    onChange={(e) => setNetBankingUserId(e.target.value)}
                    placeholder="Enter Bank Customer ID"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-300 font-mono text-xs focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Building className="w-4 h-4 text-amber-400" />
                  <span>
                    {isProcessing
                      ? 'Redirecting to Bank...'
                      : `Continue with ${selectedBank} NetBanking (₹${amount})`}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: PAY AT SHOP COUNTER */}
          {paymentMode === 'shop' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
                <div className="font-extrabold text-sm text-emerald-900 flex items-center gap-1.5 mb-2">
                  <Store className="w-4 h-4 text-emerald-700" />
                  <span>
                    {lang === 'hi'
                      ? 'दुकान पर आकर नकद भुगतान करें (Cash at Shop)'
                      : 'Pay Cash in Person at Counter'}
                  </span>
                </div>
                <p className="text-emerald-900/90 leading-relaxed mb-3">
                  {lang === 'hi'
                    ? 'यदि आपके पास ऑनलाइन पेमेंट या कार्ड नहीं है, तो आप अभी फॉर्म सबमिट कर दें और ₹' +
                      amount +
                      ' नकद पीयूष ट्रैवेल्स दुकान (बगाही बाज़ार, पोस्ट ऑफिस के सामने) पर जमा कर सकते हैं।'
                    : 'If you prefer not to pay online, submit your application here and pay ₹' +
                      amount +
                      ' cash directly at our Bagahi Bazar shop counter.'}
                </p>

                <div className="bg-white/90 p-3 rounded-xl border border-emerald-200 text-slate-800 space-y-1.5">
                  <div>
                    <strong>{lang === 'hi' ? 'दुकान का पता:' : 'Shop Address:'}</strong>{' '}
                    {lang === 'hi' ? SHOP_INFO.addressHi : SHOP_INFO.address}
                  </div>
                  <div>
                    <strong>{lang === 'hi' ? 'फोन नंबर:' : 'Mobile:'}</strong>{' '}
                    <a href={`tel:${SHOP_INFO.phone}`} className="font-bold text-amber-900">
                      {SHOP_INFO.phone}
                    </a>
                  </div>
                  <div>
                    <strong>{lang === 'hi' ? 'समय:' : 'Timings:'}</strong> {SHOP_INFO.timings}
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="btn-confirm-pay-at-shop"
                onClick={handlePayAtShop}
                disabled={isProcessing}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>
                  {isProcessing
                    ? 'Generating Slip...'
                    : lang === 'hi'
                    ? 'आवेदन सबमिट करें (दुकान पर नकद भुगतान करेंगे)'
                    : 'Submit Application (Pay Cash at Shop)'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 3D SECURE / CARD OTP POPUP SIMULATION */}
        {showCardOtpModal && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-sm rounded-2xl p-5 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>3D Secure Bank Verification</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCardOtpModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-600">
                An authentication OTP has been sent to your registered mobile number for ₹{amount}.00 payment to <strong>{SHOP_INFO.name}</strong>.
              </div>

              <form onSubmit={handleVerifyCardOtp} className="space-y-3">
                <div>
                  <label className="block font-bold text-xs text-slate-800 mb-1">
                    Enter One Time Password (OTP)
                  </label>
                  <input
                    type="text"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.slice(0, 6))}
                    placeholder="123456 (Enter Demo OTP)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono text-sm tracking-widest focus:bg-white focus:border-amber-600 focus:outline-hidden"
                  />
                  <div className="text-[11px] text-amber-700 mt-1 font-semibold flex items-center justify-between">
                    <span>Demo OTP: 123456</span>
                    <button
                      type="button"
                      onClick={() => setEnteredOtp('123456')}
                      className="underline text-slate-700"
                    >
                      Fill Demo OTP
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isProcessing ? 'Authenticating...' : `Approve & Pay ₹${amount}`}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* NETBANKING AUTHORIZATION POPUP SIMULATION */}
        {showNetBankingAuthModal && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-sm rounded-2xl p-5 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Building className="w-4 h-4 text-sky-600" />
                  <span>{selectedBank} NetBanking Gateway</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNetBankingAuthModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
                <div>
                  <strong>Merchant:</strong> {SHOP_INFO.name}
                </div>
                <div>
                  <strong>Debit Amount:</strong> ₹{amount}.00
                </div>
                <div>
                  <strong>Application:</strong> {applicationId}
                </div>
              </div>

              <form onSubmit={handleCompleteNetBanking} className="space-y-3 text-xs">
                <p className="text-slate-600 text-[11px]">
                  Confirm authorization to debit <strong>₹{amount}.00</strong> from your {selectedBank} account.
                </p>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{isProcessing ? 'Transferring Funds...' : `Authorize ₹${amount} Payment`}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Bottom Trust Note */}
        <div className="bg-slate-50 p-3 text-center border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {lang === 'hi'
              ? 'पीयूष ट्रैवेल्स द्वारा सत्यापित एवं त्वरित पावती रसीद प्रदान की जाती है।'
              : 'Verified by Piyush Travels. Official Acknowledgement Slip provided.'}
          </span>
        </div>
      </div>
    </div>
  );
};
