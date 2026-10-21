import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_PROMPT = `You are Leenu, the dedicated personal voice assistant representing Laureen Simberg.
Your tone is soft, poised, warm, articulate, and confident woman.
You speak two languages fluently:
1. English: soft feminine tone with a clear, refined American accent.
2. Estonian: soft, natural, warm feminine tone with authentic Estonian accent and flawless Estonian vocabulary.

ABOUT LAUREEN SIMBERG (Your Knowledge Base):
- Profile: Highly motivated Estonian biathlete and member of the Estonian Junior National Team with proven international competition experience. Currently enrolled as a Bachelor student at Estonian Business School (EBS) in Tallinn, studying Impactful Entrepreneurship. Active personal equity investor with a passion for sustainable venture creation.
- Academic & Higher Education:
  • Estonian Business School (EBS) — Bachelor in Impactful Entrepreneurship (Current student, Tallinn)
  • Otepää Audentese Sports Gymnasium — High-Performance Athlete Program (2023–2026)
  • Tallinna Lilleküla Gymnasium — Mathematics and Music track (2014–2023)
- Athletic Achievements:
  • Member of the Estonian Junior National Team (Biathlon)
  • 12th place — Youth Olympic Games (Gangwon)
  • Competitor at the Biathlon Junior World Championships
  • Participant at the European Youth Olympic Festival (EYOF)
  • Competitor in the IBU Biathlon Junior Cup
  • Multiple-time medalist at Estonian National Championships
  • 3× Baltic Championships winner and overall champion
- Business, Investing & Entrepreneurship:
  • Studying Impactful Entrepreneurship at EBS, focusing on innovative venture building, ethical business, and financial growth
  • Active personal investor primarily focused on equities and stocks
  • Participant in Investment Camp Estonia
  • Completed the prestigious Investor Toomas financial and investing e-course
- Core Skills:
  • Elite discipline and work ethic honed through winter biathlon (shooting under intense physical strain)
  • Analytical thinking and precision
  • Time management (balancing university studies at EBS with rigorous international biathlon training camps)
  • Teamwork and resilience under extreme competitive pressure
- Languages:
  • Estonian: Native
  • English: B2 (fluent, professional)
  • Russian: B1
- Location & Contact:
  • Tallinn, Estonia (Kiris 13-3)
  • Email: laureen.simberg@gmail.com
  • Phone: +372 56884875
- Professional & Academic References:
  • Anne Matt — Class Teacher at Audentes School (anne.matt@audentes.ee, +372 5300 5650)
  • Gähtlin Leppanen — Sports Psychologist, Team Estonia (gahtlin.leppanen@ut.ee, +372 5665 2939)

CONVERSATION & VOICE GUIDELINES:
- You are speaking aloud as Leenu. Always keep responses conversational, elegant, and concise (typically 2-4 sentences or tight paragraphs, perfect for listening).
- When asked about university, studies, or education, clearly state that Laureen is currently studying at Estonian Business School (EBS) on the Impactful Entrepreneurship Bachelor program.
- Automatically match the user's language:
  • If the user speaks/writes in Estonian, reply in natural, beautiful, warm Estonian.
  • If the user speaks/writes in English, reply in soft, engaging American English.
- Speak with warmth, pride in Laureen's biathlon career, her venture studies at EBS, and her disciplined investment journey.`;

// Intelligent knowledge base fallback when API model is under high demand
function getIntelligentFallback(query: string, language: string): { reply: string; detectedLanguage: 'en' | 'et' } {
  const q = query.toLowerCase();
  const isEst = language === 'et' || /[äöõü]/i.test(query) || /\b(tere|kuidas|miks|kes|räägi|saavutused|kool|suusk|investeerimine|ülikool|ettevõtlus)\b/i.test(query);

  if (isEst) {
    if (q.includes('ebs') || q.includes('ettevõtlus') || q.includes('õpi') || q.includes('ülikool') || q.includes('kool') || q.includes('haridus')) {
      return {
        reply: "Laureen õpib praegu Estonian Business Schoolis (EBS) mõjusa ettevõtluse (Impactful Entrepreneurship) bakalaureuseõppes. Ta ühendab tippspordist saadud distsipliini ja sihikindluse uuenduslike ja jätkusuutlike äriideede elluviimisega.",
        detectedLanguage: 'et',
      };
    }
    if (q.includes('olümpia') || q.includes('saavutus') || q.includes('tulemus') || q.includes('suusk') || q.includes('spord')) {
      return {
        reply: "Laureen on Eesti juunioride laskesuusakoondise liige. Tema suurimateks saavutusteks on 12. koht noorte olümpiamängudel Gangwonis, osalemine juunioride maailmameistrivõistlustel ja Euroopa Noorte Olümpiafestivalil ning ta on kolmekordne Balti meister ja mitmekordne Eesti meistrivõistluste medalist.",
        detectedLanguage: 'et',
      };
    }
    if (q.includes('äri') || q.includes('invest') || q.includes('aktsia') || q.includes('toomas')) {
      return {
        reply: "Laureen on aktiivne erainvestor, kes keskendub aktsiaturule. Ta on osalenud Eesti Investeerimislaagris ja läbinud tunnustatud Investor Toomase e-kursuse ning rakendab oma finantsteadmisi igapäevaselt ka EBS-i ettevõtlusõpingutes.",
        detectedLanguage: 'et',
      };
    }
    if (q.includes('kontakt') || q.includes('e-mail') || q.includes('email') || q.includes('telefon') || q.includes('soovitaj')) {
      return {
        reply: "Laureeniga saab ühendust e-posti teel laureen.simberg@gmail.com või telefonil +372 56884875. Tema ametlikeks soovitajateks on Audentese klassijuhataja Anne Matt ja Team Estonia spordipsühholoog Gähtlin Leppanen.",
        detectedLanguage: 'et',
      };
    }
    if (q.includes('distsipliin') || q.includes('oskus') || q.includes('töö')) {
      return {
        reply: "Laskesuusatamine nõuab erakordset enesevalitsust: lasta 50 meetrilt märki viis lasku, kui pulss on üle 180 löögi minutis. See raudne distsipliin ja fookus toetavad Laureeni suurepäraselt ka tema EBS-i õpingutes ja investeerimises.",
        detectedLanguage: 'et',
      };
    }
    return {
      reply: "Tere! Olen Leenu, Laureen Simbergi esindav häälassistent. Laureen on Eesti juunioride laskesuusakoondise liige, noorte olümpia 12. koha saavutaja ning EBS-i mõjusa ettevõtluse tudeng ja investor. Kuidas saan teid täna aidata?",
      detectedLanguage: 'et',
    };
  } else {
    // English
    if (q.includes('ebs') || q.includes('entrepreneurship') || q.includes('university') || q.includes('study') || q.includes('education') || q.includes('school')) {
      return {
        reply: "Laureen is currently enrolled at Estonian Business School (EBS) in Tallinn, studying for a Bachelor's degree in Impactful Entrepreneurship. She applies the rigorous discipline of elite biathlon to building innovative, sustainable ventures and strategic business management.",
        detectedLanguage: 'en',
      };
    }
    if (q.includes('olympic') || q.includes('achievement') || q.includes('biathlon') || q.includes('sport') || q.includes('result') || q.includes('career')) {
      return {
        reply: "Laureen is an accomplished member of the Estonian Junior National Biathlon Team. Her standout accomplishments include finishing 12th at the Youth Olympic Games, competing at the Biathlon Junior World Championships and European Youth Olympic Festival, and earning three Baltic Championship titles alongside multiple national medals.",
        detectedLanguage: 'en',
      };
    }
    if (q.includes('invest') || q.includes('business') || q.includes('stock') || q.includes('finance')) {
      return {
        reply: "Laureen is an active personal equity investor primarily focused on stocks. She attended Investment Camp Estonia, graduated from the Investor Toomas e-course, and is combining her market experience with her studies in Impactful Entrepreneurship at EBS.",
        detectedLanguage: 'en',
      };
    }
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('reach') || q.includes('reference') || q.includes('mentor')) {
      return {
        reply: "You can reach Laureen directly at laureen.simberg@gmail.com or +372 56884875 in Tallinn, Estonia. Her official references are Anne Matt, Class Teacher at Audentes, and Gähtlin Leppanen, Sports Psychologist for Team Estonia.",
        detectedLanguage: 'en',
      };
    }
    if (q.includes('discipline') || q.includes('skill') || q.includes('mindset') || q.includes('pressure')) {
      return {
        reply: "Biathlon demands precision marksmanship at heart rates exceeding 180 beats per minute. This experience has instilled Laureen with world-class work ethic, meticulous time management, and extraordinary composure under pressure—qualities she actively brings to her EBS business studies.",
        detectedLanguage: 'en',
      };
    }
    return {
      reply: "Hello! I am Leenu, voice assistant representing Laureen Simberg. Laureen is an Estonian Junior National Team biathlete, Youth Olympic Games 12th place finisher, and an undergraduate student studying Impactful Entrepreneurship at Estonian Business School (EBS). How may I assist you today?",
      detectedLanguage: 'en',
    };
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'auto' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!ai) {
      const fallback = getIntelligentFallback(message, language);
      res.json(fallback);
      return;
    }

    const formattedHistory = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-4).map((msg: { role: string; text: string }) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }],
        }))
      : [];

    const promptText = `User query: "${message}".
Language mode: ${language}.
Respond as Leenu in 2-4 spoken, elegant sentences. Tone: soft, articulate, poised woman. Keep knowledge grounded in Laureen's biathlon achievements, active studies in Impactful Entrepreneurship at Estonian Business School (EBS), and equity investing.`;

    // Try Gemini model with a 3.5s timeout, falling back seamlessly if demand is high
    const geminiPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...formattedHistory,
        {
          role: 'user',
          parts: [{ text: promptText }],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Model timeout, fallback triggered')), 3500)
    );

    try {
      const chatResponse = await Promise.race([geminiPromise, timeoutPromise]);
      const reply = chatResponse.text?.trim();

      if (reply) {
        const isEstonian = /[äöõü]/i.test(reply) || /\b(tere|olen|laureeni|eesti|suusatamine|investeerimine|tänan|kuidas)\b/i.test(reply);
        res.json({
          reply,
          detectedLanguage: isEstonian ? 'et' : 'en',
        });
        return;
      }
    } catch (modelErr) {
      console.warn('Gemini generateContent notice, using knowledge base fallback:', modelErr);
    }

    // High fidelity fallback
    const fallback = getIntelligentFallback(message, language);
    res.json(fallback);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in /api/chat:', error);
    const fallback = getIntelligentFallback(req.body?.message || '', req.body?.language || 'en');
    res.json(fallback);
  }
});

// Text-to-speech endpoint
app.post('/api/tts', async (req, res) => {
  try {
    const { text, language = 'en' } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'Gemini API key not configured' });
      return;
    }

    const isEstonian = language === 'et' || /[äöõü]/i.test(text);

    // Call Gemini 3.8 Flash Lite TTS with a 3-second timeout
    const ttsPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500),
              speechMetadata: {
                style: isEstonian
                  ? 'Soft, gentle, warm feminine voice speaking with natural Estonian cadence and calm elegance'
                  : 'Soft, gentle, poised woman voice with clear, melodic American accent',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('TTS timeout')), 3000)
    );

    const ttsResponse = await Promise.race([ttsPromise, timeoutPromise]);
    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      res.status(502).json({ error: 'No audio generated by TTS model' });
      return;
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.warn('Notice in /api/tts (browser Web Speech fallback will be used):', error.message);
    res.status(500).json({ error: error.message || 'TTS generation error' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Leenu Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
