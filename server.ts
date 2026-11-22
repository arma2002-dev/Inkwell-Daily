import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface DailySentencesRequestBody {
  dateKey?: string;
  excludeSentences?: string[];
  unitTopic?: 'all' | 'kitchen' | 'time_distance' | 'shopping';
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/daily-sentences', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as DailySentencesRequestBody;
      const dateKey = typeof body.dateKey === 'string' ? body.dateKey : new Date().toISOString().slice(0, 10);
      const excludeSentences = Array.isArray(body.excludeSentences)
        ? body.excludeSentences.slice(0, 15)
        : [];
      const unitTopic = body.unitTopic || 'all';

      const topicGuidance =
        unitTopic === 'kitchen'
          ? 'Focus on everyday kitchen, recipe, cafe, and grocery units (e.g., tablespoon, teaspoon, cup, pinch of, ounce, quart, gallon, half-inch, dozen, slice).'
          : unitTopic === 'time_distance'
            ? 'Focus on everyday time, distance, speed, and weather units (e.g., blocks away, miles, feet, degrees Fahrenheit/Celsius, every X minutes, half an hour, once a week).'
            : unitTopic === 'shopping'
              ? 'Focus on everyday shopping, price, quantity, and portion units (e.g., bucks, per pound, per person, percent off, pair of, pack of, handful of, glasses of, twice a month).'
              : 'Cover a varied mix of real-life everyday English units across cooking/cafe (cup, tablespoon, ounce, pinch), distance/time/weather (blocks, miles, feet, degrees, minutes, half an hour), and shopping/quantities (dozen, pound, bucks, per person, percent off, pair, handful).';

      const ai = getGeminiClient();

      const prompt = `
You are an expert bilingual English-Korean language curator creating a practical daily transcription (필사) set focused on **everyday units, measurements, quantities, and portion expressions used in real daily life**.
Create a brand-new set of **exactly 5** natural, conversational or practical everyday English sentences for ${dateKey}.

${topicGuidance}

${excludeSentences.length > 0 ? `Avoid repeating or closely paraphrasing these previous sentences:\n${excludeSentences.map((s) => `- ${s}`).join('\n')}` : ''}

Requirements:
1. Return **exactly 5** standalone, well-punctuated, natural everyday English sentences (12–24 words each). Every single sentence MUST naturally feature at least 1–2 practical daily-life units or quantity expressions (never abstract academic jargon).
2. Pair each sentence with an idiomatic, natural Korean translation (including helpful Korean metric conversion in parentheses where useful, e.g., 약 355ml / 약 1.8km / 섭씨 0도).
3. Provide a brief 1-line Korean contextNote explaining how the unit expression is used in real English-speaking daily life.
4. Provide 2 to 3 key unit/vocabulary expressions directly appearing in that sentence, each with:
   - word: the exact unit or phrase from the sentence
   - meaning: concise Korean meaning (with approximate metric equivalent if applicable)
   - example: a fresh, natural everyday English example sentence (10–15 words).
`.trim();

      const structuredRes = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You curate calm, high-craft daily 5-sentence English-Korean transcription sets. Output strictly valid JSON matching the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'A calm Korean editorial title for today’s 5-sentence set.',
              },
              sourceSummary: {
                type: Type.STRING,
                description: 'A 1-2 sentence Korean overview of today’s 5 sentences.',
              },
              sentences: {
                type: Type.ARRAY,
                description: 'Exactly 5 English-Korean transcription sentences.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    english: { type: Type.STRING },
                    korean: { type: Type.STRING },
                    contextNote: { type: Type.STRING },
                    vocabulary: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          word: { type: Type.STRING },
                          meaning: { type: Type.STRING },
                          example: { type: Type.STRING },
                        },
                        required: ['word', 'meaning', 'example'],
                      },
                    },
                  },
                  required: ['english', 'korean', 'contextNote', 'vocabulary'],
                },
              },
            },
            required: ['title', 'sourceSummary', 'sentences'],
          },
        },
      });

      const rawJson = (structuredRes.text ?? '{}').trim();
      const parsed = JSON.parse(rawJson) as {
        title?: string;
        sourceSummary?: string;
        sentences?: Array<{
          english: string;
          korean: string;
          contextNote: string;
          vocabulary: Array<{ word: string; meaning: string; example: string }>;
        }>;
      };

      const sentences = (parsed.sentences || []).slice(0, 5);
      if (sentences.length < 5) {
        res.status(502).json({
          error: '5개의 문장을 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.',
        });
        return;
      }

      res.json({
        title: parsed.title || '오늘의 새로운 영어 필사 5문장',
        sourceSummary:
          parsed.sourceSummary || '차분히 소리 내어 읽고 손끝으로 옮겨 적기 좋은 오늘의 5문장입니다.',
        sentences: sentences.map((s, idx) => ({
          id: `gen-${Date.now()}-${idx + 1}`,
          english: s.english.trim(),
          korean: s.korean.trim(),
          contextNote: s.contextNote?.trim() || '',
          vocabulary: (s.vocabulary || []).slice(0, 3),
        })),
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message === 'GEMINI_API_KEY_MISSING') {
        res.status(500).json({
          error: 'GEMINI_API_KEY가 설정되어 있지 않습니다. Settings > Secrets 패널에서 API 키를 확인해 주세요.',
        });
        return;
      }
      if (message.includes('PERMISSION_DENIED') || message.includes('API_KEY_INVALID') || message.includes('403')) {
        res.status(403).json({
          error: 'Gemini API 키 권한 오류입니다. Settings > Secrets 패널에서 유효한 API 키가 연결되어 있는지 확인해 주세요.',
        });
        return;
      }
      if (message.includes('RESOURCE_EXHAUSTED') || message.includes('429')) {
        res.status(429).json({
          error: '요청 한도를 초과했습니다. 잠시 후 다시 시도하거나 Settings > Secrets에서 할당량을 확인해 주세요.',
        });
        return;
      }
      console.error('Error in /api/daily-sentences:', err);
      res.status(500).json({
        error: `새 문장 생성 중 오류가 발생했습니다: ${message}`,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build first.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Inkwell server listening on http://localhost:${PORT}`);
  });
}

startServer();
