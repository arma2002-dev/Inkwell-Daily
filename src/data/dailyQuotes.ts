import type { DailyQuote, QuoteMood, UnitTopic } from '../types';

export const DAILY_QUOTES: DailyQuote[] = [
  // Kitchen / cooking / warmth & everyday craft
  {
    id: 'q-k1',
    english: 'A recipe has no soul. You, as the cook, must bring soul to the recipe.',
    chunkedEnglish: 'A recipe has no soul. / You, as the cook, / must bring soul / to the recipe.',
    korean: '레시피 자체에는 영혼이 없다. 요리사인 당신이 그 레시피에 영혼을 불어넣어야 한다.',
    author: 'Thomas Keller',
    mood: 'kitchen',
    moodLabel: '요리와 일상의 온기',
  },
  {
    id: 'q-k2',
    english: 'Cooking is at once child’s play and adult joy. And cooking done with care is an act of love.',
    chunkedEnglish:
      'Cooking is at once / child’s play and adult joy. / And cooking done with care / is an act of love.',
    korean: '요리는 아이의 놀이이자 어른의 기쁨이다. 그리고 정성을 담아 한 요리는 하나의 사랑이다.',
    author: 'Craig Claiborne',
    mood: 'kitchen',
    moodLabel: '정성과 식탁의 분위기',
  },
  {
    id: 'q-k3',
    english: 'Good bread is the most fundamentally satisfying of all foods; and good bread with fresh butter, the greatest of feasts.',
    chunkedEnglish:
      'Good bread is the most fundamentally satisfying / of all foods; / and good bread with fresh butter, / the greatest of feasts.',
    korean: '잘 구운 빵은 모든 음식 중 가장 본질적인 만족을 주며, 신선한 버터를 곁들인 좋은 빵은 최고의 만찬이다.',
    author: 'James Beard',
    mood: 'kitchen',
    moodLabel: '소박한 식탁의 기쁨',
  },
  {
    id: 'q-k4',
    english: 'Just as a well-filled day brings blessed sleep, a well-brewed cup brings quiet clarity to the morning.',
    chunkedEnglish:
      'Just as a well-filled day / brings blessed sleep, / a well-brewed cup / brings quiet clarity / to the morning.',
    korean: '충실히 보낸 하루가 편안한 잠을 부르듯, 정성껏 내린 한 잔은 아침에 고요한 명료함을 가져다준다.',
    author: 'Inkwell Daily Note',
    mood: 'kitchen',
    moodLabel: '아침 커피의 여운',
  },
  {
    id: 'q-k5',
    english: 'Great results come from small ingredients measured with patience and attention.',
    chunkedEnglish:
      'Great results come / from small ingredients / measured with patience and attention.',
    korean: '훌륭한 결과는 인내와 세심함으로 계량한 작은 재료들에서 비롯된다.',
    author: 'Everyday Craft Proverb',
    mood: 'kitchen',
    moodLabel: '작은 계량의 힘',
  },

  // Time / distance / weather / journey
  {
    id: 'q-t1',
    english: 'How we spend our days is, of course, how we spend our lives.',
    chunkedEnglish: 'How we spend our days / is, of course, / how we spend our lives.',
    korean: '우리가 하루를 보내는 방식이 곧 우리의 인생을 보내는 방식이다.',
    author: 'Annie Dillard',
    mood: 'time_distance',
    moodLabel: '시간과 하루의 밀도',
  },
  {
    id: 'q-t2',
    english: 'A journey of a thousand miles begins with a single step.',
    chunkedEnglish: 'A journey of a thousand miles / begins with a single step.',
    korean: '천 리 길도 한 걸음부터 시작된다.',
    author: 'Lao Tzu',
    mood: 'time_distance',
    moodLabel: '걸음과 여정의 시작',
  },
  {
    id: 'q-t3',
    english: 'Walk slowly enough to notice the distance between one quiet moment and the next.',
    chunkedEnglish:
      'Walk slowly enough / to notice the distance / between one quiet moment / and the next.',
    korean: '고요한 한 순간과 다음 순간 사이의 거리를 알아차릴 수 있을 만큼 천천히 걸어라.',
    author: 'Inkwell Travel Journal',
    mood: 'time_distance',
    moodLabel: '여유로운 보폭과 시선',
  },
  {
    id: 'q-t4',
    english: 'Sunshine is delicious, rain is refreshing, wind braces us up, snow is exhilarating; there is really no such thing as bad weather.',
    chunkedEnglish:
      'Sunshine is delicious, / rain is refreshing, / wind braces us up, / snow is exhilarating; / there is really no such thing / as bad weather.',
    korean: '햇살은 달콤하고 비는 상쾌하며 바람은 우리를 단단하게 하고 눈은 들뜨게 한다. 정말로 나쁜 날씨란 없다.',
    author: 'John Ruskin',
    mood: 'time_distance',
    moodLabel: '날씨와 계절의 감각',
  },
  {
    id: 'q-t5',
    english: 'Lost time is never found again, yet fifteen focused minutes a day can reshape an entire year.',
    chunkedEnglish:
      'Lost time is never found again, / yet fifteen focused minutes a day / can reshape an entire year.',
    korean: '잃어버린 시간은 다시 찾을 수 없지만, 하루 15분의 집중은 한 해 전체를 바꿀 수 있다.',
    author: 'Benjamin Franklin (Adapted)',
    mood: 'time_distance',
    moodLabel: '매일 15분의 가치',
  },

  // Shopping / value / simplicity / everyday choices
  {
    id: 'q-s1',
    english: 'Beware of little expenses; a small leak will sink a great ship.',
    chunkedEnglish: 'Beware of little expenses; / a small leak / will sink a great ship.',
    korean: '작은 지출을 경계하라. 작은 틈 하나가 큰 배를 가라앉힌다.',
    author: 'Benjamin Franklin',
    mood: 'shopping',
    moodLabel: '일상의 선택과 가치',
  },
  {
    id: 'q-s2',
    english: 'It is not the man who has too little, but the man who craves more, that is poor.',
    chunkedEnglish:
      'It is not the man / who has too little, / but the man who craves more, / that is poor.',
    korean: '가진 것이 적은 사람이 가난한 것이 아니라, 더 많이 탐하는 사람이 가난한 것이다.',
    author: 'Seneca',
    mood: 'shopping',
    moodLabel: '적정 분량과 만족',
  },
  {
    id: 'q-s3',
    english: 'Buy less, choose well, and make it last through the seasons.',
    chunkedEnglish: 'Buy less, / choose well, / and make it last / through the seasons.',
    korean: '덜 사고, 잘 고르며, 계절을 지나 오래 쓰도록 하라.',
    author: 'Vivienne Westwood',
    mood: 'shopping',
    moodLabel: '현명한 소비와 취향',
  },
  {
    id: 'q-s4',
    english: 'Simplicity is about subtracting the obvious and adding the meaningful.',
    chunkedEnglish:
      'Simplicity is about subtracting the obvious / and adding the meaningful.',
    korean: '단순함이란 뻔한 것을 덜어내고 의미 있는 것을 더하는 일이다.',
    author: 'John Maeda',
    mood: 'shopping',
    moodLabel: '단정하고 명료한 생활',
  },

  // General writing / handwriting / daily routine
  {
    id: 'q-g1',
    english: 'Little by little, one travels far.',
    chunkedEnglish: 'Little by little, / one travels far.',
    korean: '조금씩, 꾸준히 나아가면 멀리까지 갈 수 있다.',
    author: 'J.R.R. Tolkien',
    mood: 'general',
    moodLabel: '꾸준한 필사 루틴',
  },
  {
    id: 'q-g2',
    english: 'Writing by hand slows the mind just enough to let every word settle into memory.',
    chunkedEnglish:
      'Writing by hand / slows the mind just enough / to let every word settle / into memory.',
    korean: '손으로 직접 쓰는 일은 모든 단어가 기억 속에 가라앉을 수 있을 만큼만 마음의 속도를 늦춰 준다.',
    author: 'Inkwell Desk Note',
    mood: 'general',
    moodLabel: '필사와 사유의 속도',
  },
  {
    id: 'q-g3',
    english: 'Small daily improvements over time lead to stunning results.',
    chunkedEnglish: 'Small daily improvements / over time / lead to stunning results.',
    korean: '시간이 지나며 쌓이는 매일의 작은 발전이 놀라운 결과를 만든다.',
    author: 'Robin Sharma',
    mood: 'general',
    moodLabel: '매일의 작은 누적',
  },
  {
    id: 'q-g4',
    english: 'One language sets you in a corridor for life. Two languages open every door along the way.',
    chunkedEnglish:
      'One language sets you / in a corridor for life. / Two languages open every door / along the way.',
    korean: '하나의 언어는 당신을 인생의 복도에 세워 두지만, 두 개의 언어는 그 길 위의 모든 문을 열어 준다.',
    author: 'Frank Smith',
    mood: 'general',
    moodLabel: '언어를 배우는 즐거움',
  },
  {
    id: 'q-g5',
    english: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
    chunkedEnglish:
      'We are what we repeatedly do. / Excellence, then, is not an act, / but a habit.',
    korean: '우리는 반복해서 행하는 것의 결과다. 그러므로 탁월함은 한 번의 행동이 아니라 습관이다.',
    author: 'Will Durant',
    mood: 'general',
    moodLabel: '습관이 만드는 단단함',
  },
];

export function inferMoodFromStudySet(
  title: string,
  summary: string,
  preferredTopic?: UnitTopic,
): QuoteMood {
  if (preferredTopic && preferredTopic !== 'all') {
    return preferredTopic;
  }
  const text = `${title} ${summary}`.toLowerCase();
  if (
    text.includes('주방') ||
    text.includes('요리') ||
    text.includes('베이킹') ||
    text.includes('카페') ||
    text.includes('레시피') ||
    text.includes('tablespoon') ||
    text.includes('ounce')
  ) {
    return 'kitchen';
  }
  if (
    text.includes('거리') ||
    text.includes('시간') ||
    text.includes('날씨') ||
    text.includes('온도') ||
    text.includes('여행') ||
    text.includes('속도') ||
    text.includes('mile') ||
    text.includes('blocks')
  ) {
    return 'time_distance';
  }
  if (
    text.includes('쇼핑') ||
    text.includes('가격') ||
    text.includes('마트') ||
    text.includes('장보기') ||
    text.includes('영수증') ||
    text.includes('수량') ||
    text.includes('pound') ||
    text.includes('percent')
  ) {
    return 'shopping';
  }
  return 'general';
}

export function pickRandomQuoteForMood(
  mood: QuoteMood,
  excludeQuoteId?: string,
): DailyQuote {
  const moodPool = DAILY_QUOTES.filter(
    (q) => q.mood === mood || q.mood === 'general',
  );
  const candidates = moodPool.filter((q) => q.id !== excludeQuoteId);
  const finalPool = candidates.length > 0 ? candidates : DAILY_QUOTES;
  const randomIdx = Math.floor(Math.random() * finalPool.length);
  return finalPool[randomIdx];
}
