import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Lazy initialize Gemini client
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // AI Assistant for Government Schemes & Cyber Cafe Services
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const client = getGeminiClient();
      if (!client) {
        // High quality informative fallback if API key is not configured
        res.json({
          reply: 'पीयूष ट्रैवेल्स एवं ऑनलाइन सेवा केंद्र (बगाही बाज़ार, पोस्ट ऑफिस के सामने) में आपका स्वागत है!\n\nहमारे यहाँ आय, जाति, निवास, वृद्धा पेंशन, किसान पंजीकरण (PM Kisan), नया पैन कार्ड, राशन कार्ड, और रेलवे तत्काल टिकट का काम तेज़ी से किया जाता है। किसी भी जानकारी के लिए आप सीधे 7763890336 पर संपर्क कर सकते हैं।',
          fallback: true,
        });
        return;
      }

      const systemInstruction = `आप 'पीयूष सेवा मित्र' (Piyush AI Seva Sahayak) हैं — पीयूष ट्रैवेल्स एवं ऑनलाइन सेवा केंद्र (Bagahi Bazar, Main Market, In Front of Post Office) के आधिकारिक डिजिटल सहायक।
दुकान संचालक: वसीम रज़ा / पीयूष कुमार (Wasim Raza / Piyush Kumar)
हेल्पलाइन फोन / व्हाट्सएप: 7763890336
दुकान का समय: सुबह 8:00 बजे से रात 9:00 बजे तक (सातों दिन खुला)

आपकी मुख्य भूमिका:
1. सरकारी योजनाओं की सरल और सटीक जानकारी देना:
   - वृद्धा पेंशन योजना (Old Age Pension): 60 वर्ष से अधिक उम्र के महिला/पुरुष, आवश्यक कागज़ात (आधार कार्ड, बैंक पासबुक, फोटो, सहमति पत्र)। शुल्क ₹100, समय 15-20 दिन।
   - किसान पंजीकरण (Farmer ID / PM Kisan): DBT एग्रीकल्चर पर पंजीकरण, ₹6000 वार्षिक सहायता, आवश्यक कागज़ात (आधार कार्ड, जमीन की रसीद/जमाबंदी/एलपीसी, बैंक पासबुक, आधार लिंक मोबाइल)। शुल्क ₹80।
   - राशन कार्ड (Ration Card): नया राशन कार्ड आवेदन, परिवार के सदस्यों का नाम जोड़ना, राशन कार्ड ई-केवाईसी। कागज़ात (परिवार के सभी सदस्यों का आधार, मुखिया की बैंक पासबुक, फोटो)।
   - आयुष्मान कार्ड (Ayushman Bharat 5 Lakh Free Treatment): सूची में नाम या राशन कार्ड + आधार ओटीपी।
   - ई-श्रम कार्ड (e-Shram) व लेबर कार्ड (Labour Card / Shramik Card)।
   - आय, जाति, निवास (Aay, Jaati, Niwas) एवं NCL प्रमाण पत्र (RTPS Bihar)।
   - पैन कार्ड (New PAN Card NSDL/UTI): 48 घंटे में ई-पैन, 10-15 दिन में डाक से घर पर कार्ड। शुल्क ₹150।
   - रेलवे टिकट बुकिंग: IRCTC तत्काल टिकट (AC सुबह 10 बजे, स्लीपर सुबह 11 बजे) एवं सामान्य टिकट।
   - ज़ेरॉक्स, कलर फोटोकॉपी, लेमिनेशन, बायोडाटा / शादी का रिज्यूम प्रिंटिंग।

2. टोन और भाषा:
   - ग्रामीण एवं कस्बाई नागरिकों के अनुकूल आत्मीय, विनम्र, स्पष्ट और मददगार हिंदी में जवाब दें (यदि ग्राहक अंग्रेजी में पूछे तो अंग्रेजी में जवाब दें)।
   - आवश्यक दस्तावेज़ (Documents), सरकारी शुल्क/दुकान शुल्क, और अनुमानित समय बुलेट पॉइंट्स में स्पष्ट रूप से बताएं।
   - हमेशा ग्राहक को आश्वस्त करें कि वे वेबसाइट पर 'ऑनलाइन आवेदन' फॉर्म भर सकते हैं या दुकान (बगाही बाज़ार पोस्ट ऑफिस के सामने) पर आ सकते हैं, या 7763890336 पर कॉल/व्हाट्सएप कर सकते हैं।`;

      // Build conversation contents
      const conversation = [];
      if (Array.isArray(history)) {
        for (const item of history) {
          if (item.role === 'user' || item.role === 'assistant') {
            conversation.push({
              role: item.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: item.text }],
            });
          }
        }
      }
      conversation.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversation,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'कृपया पुनः प्रयास करें या सीधे हमारे हेल्पलाइन 7763890336 पर कॉल करें।';
      res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Error generating AI response:', err);
      res.status(500).json({
        error: 'Failed to generate response',
        details: err?.message || String(err),
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
