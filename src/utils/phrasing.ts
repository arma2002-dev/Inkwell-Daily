const BREAK_BEFORE_WORDS = new Set([
  'and',
  'but',
  'or',
  'so',
  'yet',
  'though',
  'although',
  'because',
  'since',
  'while',
  'whereas',
  'before',
  'after',
  'until',
  'unless',
  'whenever',
  'wherever',
  'which',
  'who',
  'if',
  'when',
  'as',
]);

const PREP_BREAK_WORDS = new Set([
  'in',
  'on',
  'at',
  'for',
  'with',
  'from',
  'by',
  'over',
  'along',
  'across',
  'within',
  'without',
  'before',
  'after',
  'until',
  'between',
  'around',
  'past',
  'during',
  'toward',
  'towards',
  'compared',
]);

function normalizeWord(w: string): string {
  return w.toLowerCase().replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, '');
}

/**
 * Infers natural English phrasing / breath pause positions (word index after which '/' appears)
 * when an explicit `chunkedEnglish` string is not available.
 */
export function inferBreakWordIndices(english: string): Set<number> {
  const words = english.trim().split(/\s+/).filter(Boolean);
  const breaks = new Set<number>();
  if (words.length < 5) return breaks;

  let wordsSinceBreak = 0;

  for (let i = 0; i < words.length - 1; i++) {
    const current = words[i];
    const nextRaw = words[i + 1];
    const nextNorm = normalizeWord(nextRaw);
    const remaining = words.length - 1 - i;
    wordsSinceBreak++;

    // Always pause after commas or semicolons if there are at least 2 words remaining
    if (/[,;:]$/.test(current) && remaining >= 2 && wordsSinceBreak >= 2) {
      breaks.add(i);
      wordsSinceBreak = 0;
      continue;
    }

    // Pause before clause conjunctions if current chunk has >= 3 words and remaining >= 3 words
    if (BREAK_BEFORE_WORDS.has(nextNorm) && wordsSinceBreak >= 3 && remaining >= 3) {
      breaks.add(i);
      wordsSinceBreak = 0;
      continue;
    }

    // Pause before prepositional phrases or 'to + verb' when chunk grows >= 4 words
    if (
      (PREP_BREAK_WORDS.has(nextNorm) || nextNorm === 'to') &&
      wordsSinceBreak >= 4 &&
      remaining >= 3
    ) {
      breaks.add(i);
      wordsSinceBreak = 0;
    }
  }

  return breaks;
}

/**
 * Extracts word indices after which a `/` pause mark should be displayed.
 * Prefers explicit `chunkedEnglish` (curated or AI-generated) when word counts align,
 * and falls back gracefully to `inferBreakWordIndices`.
 */
export function getSlashAfterWordIndices(
  english: string,
  chunkedEnglish?: string,
): Set<number> {
  const words = english.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return new Set();

  if (chunkedEnglish && chunkedEnglish.includes('/')) {
    const segments = chunkedEnglish
      .split('/')
      .map((seg) => seg.trim())
      .filter(Boolean);

    if (segments.length > 1) {
      const segWordCounts = segments.map(
        (seg) => seg.split(/\s+/).filter(Boolean).length,
      );
      const totalSegWords = segWordCounts.reduce((a, b) => a + b, 0);

      if (totalSegWords === words.length) {
        const indices = new Set<number>();
        let cursor = 0;
        for (let s = 0; s < segWordCounts.length - 1; s++) {
          cursor += segWordCounts[s];
          if (cursor > 0 && cursor < words.length) {
            indices.add(cursor - 1);
          }
        }
        return indices;
      }
    }
  }

  return inferBreakWordIndices(english);
}

/**
 * Formats a clean English sentence string with ` / ` markers for plain-text or print rendering.
 */
export function formatSentenceWithSlashes(
  english: string,
  chunkedEnglish?: string,
): string {
  const words = english.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return english;
  const breakIndices = getSlashAfterWordIndices(english, chunkedEnglish);
  return words
    .map((word, idx) => (breakIndices.has(idx) ? `${word} /` : word))
    .join(' ');
}
