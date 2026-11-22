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

function extractYouTubeId(rawUrl: string): string | null {
  try {
    const trimmed = rawUrl.trim();
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (url.hostname === 'youtu.be' || url.hostname.endsWith('.youtu.be')) {
      const id = url.pathname.replace(/^\//, '').split('/')[0];
      return id || null;
    }
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      const markerIdx = parts.findIndex((p) => p === 'shorts' || p === 'embed' || p === 'live');
      if (markerIdx !== -1 && parts[markerIdx + 1]) {
        return parts[markerIdx + 1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

function decodeXmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchYouTubeContext(videoId: string): Promise<{
  title: string;
  author: string;
  transcript: string;
}> {
  let title = '';
  let author = '';
  let transcript = '';

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
    const oembedRes = await fetch(oembedUrl, { signal: AbortSignal.timeout(5000) });
    if (oembedRes.ok) {
      const data = (await oembedRes.json()) as { title?: string; author_name?: string };
      title = data.title || '';
      author = data.author_name || '';
    }
  } catch {
    // Continue gracefully without oEmbed metadata
  }

  try {
    const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&hl=en`;
    const pageRes = await fetch(watchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; InkwellStudyBot/1.0)',
        'Accept-Language': 'en-US,en;q=0.9,ko;q=0.8',
      },
      signal: AbortSignal.timeout(6000),
    });

    if (pageRes.ok) {
      const html = await pageRes.text();
      if (!title) {
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        if (titleMatch?.[1]) {
          title = titleMatch[1].replace(/\s*-\s*YouTube\s*$/i, '').trim();
        }
      }

      const captionsMatch = html.match(/"captionTracks":(\[.*?\])/);
      if (captionsMatch?.[1]) {
        const tracks = JSON.parse(captionsMatch[1]) as Array<{
          baseUrl?: string;
          languageCode?: string;
        }>;
        const preferred =
          tracks.find((t) => t.languageCode?.startsWith('en')) ||
          tracks.find((t) => t.languageCode?.startsWith('ko')) ||
          tracks[0];

        if (preferred?.baseUrl) {
          const capRes = await fetch(preferred.baseUrl, { signal: AbortSignal.timeout(5000) });
          if (capRes.ok) {
            const xml = await capRes.text();
            const textMatches = Array.from(xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g));
            const joined = textMatches.map((m) => decodeXmlEntities(m[1])).join(' ');
            transcript = joined.slice(0, 12000);
          }
        }
      }
    }
  } catch {
    // Fall back to Gemini search/URL context
  }

  return { title, author, transcript };
}

interface ExtractRequestBody {
  youtubeUrl?: string;
  scriptText?: string;
  focusStyle?: 'balanced' | 'conversational' | 'literary';
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/extract-sentences', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as ExtractRequestBody;
      const youtubeUrl = typeof body.youtubeUrl === 'string' ? body.youtubeUrl.trim() : '';
      const scriptText = typeof body.scriptText === 'string' ? body.scriptText.trim() : '';
      const focusStyle = body.focusStyle || 'balanced';

      if (!youtubeUrl && !scriptText) {
        res.status(400).json({
          error: '유튜브 URL 또는 스크립트 텍스트를 입력해 주세요.',
        });
        return;
      }

      const ai = getGeminiClient();

      let videoId: string | null = null;
      let ytTitle = '';
      let ytAuthor = '';
      let ytTranscript = '';

      if (youtubeUrl) {
        videoId = extractYouTubeId(youtubeUrl);
        if (videoId) {
          const ctx = await fetchYouTubeContext(videoId);
          ytTitle = ctx.title;
          ytAuthor = ctx.author;
          ytTranscript = ctx.transcript;
        }
      }

      let gatheredContext = scriptText;

      if (!gatheredContext && youtubeUrl) {
        if (ytTranscript.length > 120) {
          gatheredContext = ytTranscript;
        } else {
          // Use Gemini Search + URL Context to research the exact video topic, themes, and spoken insights
          const researchPrompt = [
            `Research the YouTube video at ${youtubeUrl}${ytTitle ? ` (Title: "${ytTitle}"${ytAuthor ? `, Channel: "${ytAuthor}"` : ''})` : ''}.`,
            'Summarize the video topic, key spoken points, core advice, and memorable phrases/lessons in detail so that an English-Korean daily transcription curriculum can be created from its authentic message.',
            'Include the video title if known.',
          ].join('\n');

          const researchRes = await ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: researchPrompt,
            config: {
              tools: [{ googleSearch: {} }, { urlContext: {} }],
            },
          });

          gatheredContext = researchRes.text?.trim() || '';
        }
      }

      if (!gatheredContext && !ytTitle) {
        res.status(400).json({
          error: '영상 정보를 불러오지 못했습니다. 유효한 유튜브 URL이거나 스크립트 텍스트를 함께 입력해 주세요.',
        });
        return;
      }

      const styleInstruction =
        focusStyle === 'conversational'
          ? 'Favor crisp, practical spoken English expressions and natural everyday cadence.'
          : focusStyle === 'literary'
            ? 'Favor evocative, reflective prose and nuanced advanced idioms suitable for deep contemplation.'
            : 'Balance clarity, natural English rhythm, and meaningful insight ideal for mindful daily handwriting/typing practice.';

      const extractionPrompt = `
You are an expert bilingual English-Korean language educator and transcription (필사) curator.
Based on the source material below, create a curated daily transcription set of exactly 6 core English sentences (between 5 and 7 sentences) with natural, expressive Korean translations and 2-3 key vocabulary/expression notes per sentence.

${styleInstruction}

Source Metadata:
- YouTube URL: ${youtubeUrl || 'N/A (User script)'}
- Detected Video Title: ${ytTitle || 'Unknown'}
- Channel: ${ytAuthor || 'Unknown'}

Source Content / Transcript / Notes:
${gatheredContext || `Video Title: ${ytTitle}`}

Guidelines:
1. Each English sentence must be 12–28 words long, grammatically complete, cleanly punctuated, and deeply rewarding to type or write by hand.
2. If the source material is in Korean (such as a Korean-language video about English learning or life lessons), craft authentic, natural English sentences that faithfully express the core messages and insights of the video, paired with idiomatic Korean translations.
3. If the source material is in English, refine or select the most impactful 6 sentences verbatim or cleanly edited for standalone clarity, and provide natural literary Korean translations.
4. For each sentence, include a brief 1-line Korean contextNote explaining its nuance or why it is worth transcribing.
5. For each sentence, include 2 to 3 key vocabulary items or collocations directly appearing in that sentence, each with:
   - word: the exact word or phrase from the sentence
   - meaning: concise Korean meaning
   - example: a fresh, natural English example sentence (10-16 words).
`.trim();

      const structuredRes = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: extractionPrompt,
        config: {
          systemInstruction:
            'You design calm, high-craft bilingual English-Korean daily transcription sets. Output strictly valid JSON matching the requested schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              videoTitle: {
                type: Type.STRING,
                description: 'Concise title of the video or script topic in Korean or original title.',
              },
              sourceSummary: {
                type: Type.STRING,
                description: 'A 1-2 sentence calm Korean summary of the theme of this transcription set.',
              },
              sentences: {
                type: Type.ARRAY,
                description: '5 to 7 curated English-Korean transcription sentences.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    english: {
                      type: Type.STRING,
                      description: 'Standalone, well-punctuated English sentence for transcription.',
                    },
                    korean: {
                      type: Type.STRING,
                      description: 'Natural, expressive Korean translation.',
                    },
                    contextNote: {
                      type: Type.STRING,
                      description: 'Short 1-line Korean note on nuance, grammar, or reflection context.',
                    },
                    vocabulary: {
                      type: Type.ARRAY,
                      description: '2 to 3 key vocabulary words or phrases from the sentence.',
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
            required: ['videoTitle', 'sourceSummary', 'sentences'],
          },
        },
      });

      const rawJson = (structuredRes.text ?? '{}').trim();
      const parsed = JSON.parse(rawJson) as {
        videoTitle?: string;
        sourceSummary?: string;
        sentences?: Array<{
          english: string;
          korean: string;
          contextNote: string;
          vocabulary: Array<{ word: string; meaning: string; example: string }>;
        }>;
      };

      if (!parsed.sentences || parsed.sentences.length === 0) {
        res.status(502).json({
          error: '문장 추출 결과가 비어 있습니다. 스크립트 내용을 조금 더 구체적으로 입력해 다시 시도해 주세요.',
        });
        return;
      }

      const normalized = {
        videoTitle: parsed.videoTitle || ytTitle || '사용자 맞춤 필사 세트',
        sourceUrl: youtubeUrl || undefined,
        sourceSummary: parsed.sourceSummary || '영상의 핵심 메시지를 담은 오늘의 영한 필사 문장입니다.',
        sentences: parsed.sentences.slice(0, 7).map((s, idx) => ({
          id: `s-${Date.now()}-${idx + 1}`,
          english: s.english.trim(),
          korean: s.korean.trim(),
          contextNote: s.contextNote?.trim() || '',
          vocabulary: (s.vocabulary || []).slice(0, 3),
        })),
      };

      res.json(normalized);
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
      console.error('Error in /api/extract-sentences:', err);
      res.status(500).json({
        error: `문장 분석 중 오류가 발생했습니다: ${message}`,
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
