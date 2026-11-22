import type { StudySet } from '../types';

export const DEFAULT_YOUTUBE_URL = 'https://youtu.be/5E83KtnJs-I';

export const SAMPLE_DAY1_SET: StudySet = {
  id: 'day1-youtube-5E83KtnJs-I',
  title: '새해엔 무조건 영어 필사 시작하세요 · 통대식 영한 필사 루틴',
  sourceUrl: DEFAULT_YOUTUBE_URL,
  sourceSummary:
    '단순히 눈으로만 읽고 지나가는 영어 공부 대신, 손끝으로 문장을 음미하고 모국어와 영어를 오가며 언어의 결을 체화하는 매일 필사 습관의 핵심 문장 6선입니다.',
  createdAt: '2026-11-21T00:00:00.000Z',
  isSample: true,
  sentences: [
    {
      id: 'd1-s1',
      english:
        'Copying a single page by hand slows the racing mind just enough to let the rhythm of another language sink in.',
      korean:
        '한 페이지를 손으로 직접 옮겨 적는 일은 조급한 마음을 잠시 멈추게 하고, 다른 언어의 호흡이 온전히 스며들게 한다.',
      contextNote:
        'just enough to ~ 구문을 활용해 필사가 주는 심리적 속도와 몰입의 효과를 차분하게 표현한 문장입니다.',
      vocabulary: [
        {
          word: 'by hand',
          meaning: '손으로 직접, 수작업으로',
          example: 'She still writes every thank-you note by hand on thick cream stationery.',
        },
        {
          word: 'racing mind',
          meaning: '조급하고 분주하게 달리는 마음',
          example: 'A quiet morning walk helps calm a racing mind before work begins.',
        },
        {
          word: 'sink in',
          meaning: '(의미나 감정이) 서서히 스며들다, 깊이 와닿다',
          example: 'Give the passage a moment to sink in before moving to the next page.',
        },
      ],
    },
    {
      id: 'd1-s2',
      english:
        'You do not master a foreign tongue by memorizing isolated words; you absorb it by tracing how native thoughts unfold.',
      korean:
        '외국어는 낱말을 따로 떼어 외워서 익히는 것이 아니라, 원어민의 생각이 문장 속에서 펼쳐지는 결을 따라가며 흡수하는 것이다.',
      contextNote:
        '세미콜론(;)으로 대조를 이루며, 단어 암기보다 문맥과 사고의 흐름을 따라가는 통대식 필사의 핵심을 담았습니다.',
      vocabulary: [
        {
          word: 'isolated',
          meaning: '동떨어진, 고립된, 단편적인',
          example: 'Learning isolated vocabulary rarely helps when you speak in real conversations.',
        },
        {
          word: 'absorb',
          meaning: '흡수하다, 자연스럽게 체화하다',
          example: 'Children absorb the natural cadence of language by listening every day.',
        },
        {
          word: 'unfold',
          meaning: '펼쳐지다, (생각·이야기가) 전개되다',
          example: 'Watch closely how the argument unfolds across the opening three paragraphs.',
        },
      ],
    },
    {
      id: 'd1-s3',
      english:
        'Before your pen touches the paper, read the English sentence aloud until you can hear its cadence without looking back.',
      korean:
        '펜을 종이에 대기 전에, 문장을 다시 들여다보지 않고도 그 리듬이 귓가에 맴돌 때까지 영어 문장을 소리 내어 읽어 보라.',
      contextNote:
        '무작정 베껴 쓰기 전에 소리 내어 읽고 의미 단위로 기억해 옮겨 적는 실전 필사 요령입니다.',
      vocabulary: [
        {
          word: 'aloud',
          meaning: '소리 내어, 큰 소리로',
          example: 'Reading your draft aloud immediately reveals awkward phrasing and stiff rhythm.',
        },
        {
          word: 'cadence',
          meaning: '(말·문장의) 리듬, 억양의 흐름',
          example: 'Every great essay carries a calm, unmistakable cadence of its own.',
        },
        {
          word: 'without looking back',
          meaning: '다시 돌아보지 않고, 망설임 없이',
          example: 'Try writing the clause from memory without looking back at the original line.',
        },
      ],
    },
    {
      id: 'd1-s4',
      english:
        'Translating into your own language and re-expressing the idea forces your brain to bridge meaning rather than merely imitate sounds.',
      korean:
        '모국어로 옮겼다가 다시 영어로 표현해 보는 과정은, 소리를 단순 모방하는 대신 의미의 다리를 스스로 건너게 만든다.',
      contextNote:
        '영어 → 한국어 해석과 한국어 → 영어 역번역의 가치를 강조하는 통번역식 학습 원리입니다.',
      vocabulary: [
        {
          word: 're-express',
          meaning: '다른 말로 다시 표현하다',
          example: 'The best way to check comprehension is to re-express the core point simply.',
        },
        {
          word: 'bridge meaning',
          meaning: '두 언어 사이의 의미를 잇다',
          example: 'Thoughtful translation helps bridge meaning across very different cultures.',
        },
        {
          word: 'merely',
          meaning: '단지, 그저 (~에 불과하게)',
          example: 'Do not merely copy the letters; feel why the author chose each verb.',
        },
      ],
    },
    {
      id: 'd1-s5',
      english:
        'Ten quiet minutes spent copying sentences with full attention will outlast three hours of passive scrolling.',
      korean:
        '온전히 집중해 문장을 필사한 고요한 10분은, 멍하니 화면을 넘기며 보낸 세 시간보다 훨씬 오래 남는다.',
      contextNote:
        '분량보다 밀도를 강조할 때 유용한 주어부(Ten quiet minutes spent ~ing) 구조를 익힐 수 있습니다.',
      vocabulary: [
        {
          word: 'with full attention',
          meaning: '온전히 집중하여, 주의를 기울여',
          example: 'Listening with full attention turns an ordinary dialogue into a rich lesson.',
        },
        {
          word: 'outlast',
          meaning: '~보다 더 오래 지속되다, 오래 남다',
          example: 'Steady daily habits always outlast bursts of weekend motivation.',
        },
        {
          word: 'passive',
          meaning: '수동적인, 소극적인',
          example: 'Active writing activates memory far better than passive reading alone.',
        },
      ],
    },
    {
      id: 'd1-s6',
      english:
        'Consistency is never about heroic willpower on day one; it is about leaving your notebook open for tomorrow morning.',
      korean:
        '꾸준함이란 첫날의 거창한 의지력에서 나오는 것이 아니라, 내일 아침을 위해 노트를 펼쳐 둔 채 하루를 마치는 작은 습관에 있다.',
      contextNote:
        'not about A; it is about B 대조 구조로, 매일 루틴을 이어가는 마음을 따뜻하게 정리해 줍니다.',
      vocabulary: [
        {
          word: 'consistency',
          meaning: '꾸준함, 일관성',
          example: 'Fluency rewards quiet consistency much more than rare bursts of intensity.',
        },
        {
          word: 'willpower',
          meaning: '의지력, 정신력',
          example: 'Relying only on willpower makes any evening study routine fragile.',
        },
        {
          word: 'leave ~ open',
          meaning: '~을 열어 둔 상태로 두다',
          example: 'Leave your fountain pen and notebook open on the desk before going to bed.',
        },
      ],
    },
  ],
};
