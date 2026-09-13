import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, MessageCircle, Phone, ArrowRight, RefreshCw, User } from 'lucide-react';
import { SHOP_INFO, SERVICES } from '../data/servicesData';
import { ServiceItem } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'hi' | 'en';
  onSelectService: (service: ServiceItem) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  matchedService?: ServiceItem;
  timestamp: string;
}

const QUICK_QUESTIONS_HI = [
  'वृद्धा पेंशन के लिए क्या कागजात चाहिए?',
  'किसान पंजीकरण और PM Kisan कैसे कराएं?',
  'नया राशन कार्ड कैसे बनेगा?',
  'पैन कार्ड कितने दिन में बन जाता है?',
  'रेलवे तत्काल टिकट का क्या समय और नियम है?',
  'आय, जाति, निवास प्रमाण पत्र का समय और शुल्क?',
];

const QUICK_QUESTIONS_EN = [
  'What documents are needed for Old Age Pension?',
  'How to apply for PM Kisan and Farmer ID?',
  'How to apply for a fresh Ration Card?',
  'How many days to get PAN card?',
  'What are the timings for Tatkal Railway booking?',
  'Cost and processing time for Income/Caste certificates?',
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectService,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text:
        lang === 'hi'
          ? `नमस्ते! 🙏 मैं **पीयूष सेवा मित्र** हूँ — पीयूष ट्रैवेल्स एवं ऑनलाइन सेवा केंद्र (बगाही बाज़ार) का डिजिटल सहायक।\n\nआप मुझसे किसी भी **सरकारी योजना** (वृद्धा पेंशन, किसान पंजीकरण, राशन कार्ड, आयुष्मान कार्ड), **प्रमाण पत्र** (आय, जाति, निवास, NCL), **पैन कार्ड**, अथवा **रेलवे टिकट** के बारे में पूछ सकते हैं। मैं आपको आवश्यक कागजात, सरकारी शुल्क और आवेदन प्रक्रिया तुरंत बताऊँगा!`
          : `Hello! 🙏 I am **Piyush Seva Mitra** — the official AI assistant for Piyush Travels & Online Seva Kendra (Bagahi Bazar).\n\nAsk me anything about **government schemes** (Old Age Pension, PM Kisan, Ration Card, Ayushman Card), **certificates** (Income, Caste, Residence, NCL), **PAN cards**, or **railway bookings**. How can I help you today?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Helper to find related service from AI reply or query
  const findMatchingService = (text: string): ServiceItem | undefined => {
    const lower = text.toLowerCase();
    if (lower.includes('वृद्धा') || lower.includes('pension') || lower.includes('पेंशन')) {
      return SERVICES.find((s) => s.id === 'vridha-pension');
    }
    if (lower.includes('किसान') || lower.includes('farmer') || lower.includes('kisan')) {
      return SERVICES.find((s) => s.id === 'farmer-id');
    }
    if (lower.includes('राशन') || lower.includes('ration')) {
      return SERVICES.find((s) => s.id === 'ration-card');
    }
    if (lower.includes('आय') || lower.includes('income')) {
      return SERVICES.find((s) => s.id === 'aay-praman-patra');
    }
    if (lower.includes('जाति') || lower.includes('caste')) {
      return SERVICES.find((s) => s.id === 'jaati-praman-patra');
    }
    if (lower.includes('निवास') || lower.includes('niwas') || lower.includes('residence')) {
      return SERVICES.find((s) => s.id === 'niwas-praman-patra');
    }
    if (lower.includes('पैन') || lower.includes('pan')) {
      return SERVICES.find((s) => s.id === 'new-pan-card');
    }
    if (lower.includes('रेलवे') || lower.includes('railway') || lower.includes('ट्रेन') || lower.includes('तत्काल')) {
      return SERVICES.find((s) => s.id === 'railway-ticket');
    }
    if (lower.includes('आयुष्मान') || lower.includes('ayushman')) {
      return SERVICES.find((s) => s.id === 'ayushman-card');
    }
    if (lower.includes('मानधन') || lower.includes('maandhan')) {
      return SERVICES.find((s) => s.id === 'mandhan-yojna');
    }
    if (lower.includes('छात्रवृत्ति') || lower.includes('scholarship')) {
      return SERVICES.find((s) => s.id === 'scholarship');
    }
    return undefined;
  };

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const query = userText.trim();
    setInputValue('');

    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, newUserMessage];
    setMessages(updatedHistory);
    setLoading(true);

    try {
      const matchedService = findMatchingService(query);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: updatedHistory.slice(-6).map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('API response failed');
      }

      const data = await res.json();
      const reply = data.reply || 'जानकारी प्राप्त करने में असमर्थ। कृपया हमारे फोन 7763890336 पर संपर्क करें।';

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: reply,
        matchedService: matchedService || findMatchingService(reply),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI assistant error:', err);
      // Friendly offline fallback
      const matched = findMatchingService(query);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text:
            lang === 'hi'
              ? `पीयूष ट्रैवेल्स (बगाही बाज़ार, पोस्ट ऑफिस के सामने) में इस सेवा का काम बहुत ही कम शुल्क में और तुरंत किया जाता है। आप नीचे दिए गए बटन से सीधे ऑनलाइन आवेदन भर सकते हैं या हमारे नंबर 7763890336 पर कॉल कर सकते हैं।`
              : `Piyush Travels (Bagahi Bazar, Opp. Post Office) provides this service quickly and reliably. You can apply directly using the form below or call 7763890336.`,
          matchedService: matched,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const quickQuestions = lang === 'hi' ? QUICK_QUESTIONS_HI : QUICK_QUESTIONS_EN;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl h-[90vh] max-h-[720px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-amber-300 shadow-xs">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>{lang === 'hi' ? 'पीयूष सेवा मित्र' : 'Piyush Seva Mitra'}</span>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm">
                    AI
                  </span>
                </h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-amber-100/90 font-medium">
                {lang === 'hi'
                  ? 'सरकारी योजना एवं दस्तावेज डिजिटल सहायक • बगाही बाज़ार'
                  : 'Govt Schemes & Documents Digital AI Assistant'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${SHOP_INFO.phone}`}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-300" />
              <span>{SHOP_INFO.phone}</span>
            </a>
            <button
              type="button"
              id="btn-close-ai-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-slate-50/70">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-500 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-600 text-white rounded-br-xs shadow-xs font-medium'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-line break-words space-y-2">
                  {msg.text.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>

                {/* If a related service was detected, provide a 1-click apply action */}
                {msg.matchedService && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60">
                    <div>
                      <p className="font-bold text-amber-950 text-xs flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>{lang === 'hi' ? msg.matchedService.nameHi : msg.matchedService.name}</span>
                      </p>
                      <p className="text-[11px] text-amber-800">
                        {lang === 'hi' ? `शुल्क: ₹${msg.matchedService.fee} • समय: ${msg.matchedService.processingTimeHi}` : `Fee: ₹${msg.matchedService.fee} • Time: ${msg.matchedService.processingTime}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (msg.matchedService) {
                          onSelectService(msg.matchedService);
                          onClose();
                        }
                      }}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1 transition-transform active:scale-95 shrink-0 cursor-pointer"
                    >
                      <span>{lang === 'hi' ? 'सीधे आवेदन करें' : 'Apply Now'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div
                  className={`text-[10px] mt-1.5 ${
                    msg.role === 'user' ? 'text-amber-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-slate-500 text-xs bg-white p-3 rounded-2xl w-fit border border-slate-200 shadow-xs">
              <Bot className="w-4 h-4 text-amber-600 animate-spin" />
              <span>{lang === 'hi' ? 'पीयूष सेवा मित्र सोच रहा है...' : 'Piyush Seva Mitra is typing...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Question Chips */}
        <div className="px-3 sm:px-4 py-2 bg-slate-100/90 border-t border-slate-200 overflow-x-auto flex items-center gap-2 no-scrollbar shrink-0">
          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            {lang === 'hi' ? 'सुझाव:' : 'Suggested:'}
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 text-[11px] font-medium rounded-full border border-slate-200 shadow-2xs whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              id="ai-assistant-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'सरकारी योजना, आवश्यक कागजात, या शुल्क के बारे में कुछ भी पूछें...'
                  : 'Ask about any government scheme, required documents, or fees...'
              }
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-amber-600 focus:bg-white transition-all shadow-inner"
              disabled={loading}
            />
            <button
              type="submit"
              id="btn-send-ai-message"
              disabled={loading || !inputValue.trim()}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <span>{lang === 'hi' ? 'पूछें' : 'Send'}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {lang === 'hi' ? 'पीयूष ट्रैवेल्स • बगाही बाज़ार' : 'Piyush Travels • Bagahi Bazar'}
            </span>
            <a
              href={`https://wa.me/${SHOP_INFO.whatsappNumber}?text=${encodeURIComponent(
                'नमस्ते, मुझे सरकारी योजना के बारे में व्यक्तिगत जानकारी चाहिए।'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              <span>{lang === 'hi' ? 'सीधे व्हाट्सएप पर पूछें' : 'Chat on WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
