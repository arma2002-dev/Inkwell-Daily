import type { StudySet } from '../types';

export const DAILY_SETS_BANK: StudySet[] = [
  {
    id: 'daily-units-1',
    title: 'Day 01 · 주방, 카페 & 마트에서 쓰는 생활 단위 5문장',
    sourceSummary:
      '요리 계량(tablespoon, pinch, half-inch), 카페 주문(ounce, shot), 마트 쇼핑(dozen, gallon, quarter pound) 등 일상에서 바로 쓰는 영어 단위 문장입니다.',
    createdAt: '2026-11-21T00:00:00.000Z',
    isSample: true,
    sentences: [
      {
        id: 'du1-s1',
        english:
          'Could you grab a dozen eggs and half a gallon of milk on your way back from the grocery store?',
        korean:
          '마트에서 돌아오는 길에 달걀 한 다스(12개)랑 우유 반 갤런만 사다 줄래?',
        contextNote:
          'a dozen(12개 묶음)과 half a gallon(약 1.89L)은 영어권 식료품 쇼핑에서 가장 자주 쓰이는 수량·부피 단위입니다.',
        vocabulary: [
          {
            word: 'a dozen',
            meaning: '한 다스, 12개 묶음',
            example: 'She picked up a dozen fresh bagels for Sunday breakfast.',
          },
          {
            word: 'half a gallon',
            meaning: '반 갤런 (약 1.89리터)',
            example: 'We go through half a gallon of orange juice every week.',
          },
          {
            word: 'on one’s way back',
            meaning: '돌아오는 길에',
            example: 'Let me know if you need coffee on my way back to the office.',
          },
        ],
      },
      {
        id: 'du1-s2',
        english:
          'Add just a pinch of sea salt and two tablespoons of olive oil before simmering the sauce for ten minutes.',
        korean:
          '소스를 10분간 약불로 끓이기 전에 바다 소금 한 꼬집과 올리브유 두 큰술만 넣어 주세요.',
        contextNote:
          'a pinch of(한 꼬집)와 tablespoon(큰술, 약 15ml)은 영어 레시피와 요리 영상에서 빠지지 않는 계량 단위입니다.',
        vocabulary: [
          {
            word: 'a pinch of',
            meaning: '손가락으로 집은 한 꼬집',
            example: 'Finish the soup with a pinch of black pepper and fresh herbs.',
          },
          {
            word: 'tablespoon',
            meaning: '큰술 (약 15ml 계량 단위)',
            example: 'Stir one tablespoon of honey into your warm lemon tea.',
          },
          {
            word: 'simmer',
            meaning: '약한 불에서 뭉근히 끓이다',
            example: 'Let the stew simmer gently until the carrots turn tender.',
          },
        ],
      },
      {
        id: 'du1-s3',
        english:
          'I usually order a twelve-ounce oat latte with a single shot of espresso and two pumps of vanilla syrup.',
        korean:
          '나는 보통 12온스짜리 오트 라떼에 에스프레소 싱글 샷, 바닐라 시럽 두 펌프를 넣어 주문해.',
        contextNote:
          '카페 음료 용량 ounce(12oz ≈ 355ml 톨 사이즈)와 시럽 횟수 단위 pump를 자연스럽게 익힐 수 있습니다.',
        vocabulary: [
          {
            word: 'twelve-ounce',
            meaning: '12온스 용량의 (약 355ml)',
            example: 'A twelve-ounce mug holds just the right amount for morning coffee.',
          },
          {
            word: 'a single shot',
            meaning: '에스프레소 1샷',
            example: 'Could you make that iced americano with a single shot instead of two?',
          },
          {
            word: 'two pumps of',
            meaning: '시럽 두 번 펌프질한 양',
            example: 'Just two pumps of caramel keep the drink lightly sweet.',
          },
        ],
      },
      {
        id: 'du1-s4',
        english:
          'Cut the butter into half-inch cubes so it softens within fifteen minutes at room temperature.',
        korean:
          '버터가 실온에서 15분 안에 부드러워지도록 0.5인치(약 1.3cm) 정육면체 크기로 잘라 두세요.',
        contextNote:
          '길이·크기 단위 inch(1인치 ≈ 2.54cm)와 시간 제한 표현 within fifteen minutes를 함께 익히는 문장입니다.',
        vocabulary: [
          {
            word: 'half-inch',
            meaning: '0.5인치 크기의 (약 1.3cm)',
            example: 'Chop the potatoes into half-inch pieces so they roast evenly.',
          },
          {
            word: 'within fifteen minutes',
            meaning: '15분 이내에',
            example: 'The delivery driver should arrive within fifteen minutes.',
          },
          {
            word: 'room temperature',
            meaning: '실온, 상온',
            example: 'Leave the eggs at room temperature before baking the cake.',
          },
        ],
      },
      {
        id: 'du1-s5',
        english:
          'Slice me a quarter pound of smoked turkey and a couple of thick slices of sourdough bread, please.',
        korean:
          '훈제 칠면조 고기 4분의 1파운드(약 113g)랑 사워도우 빵 두툼하게 두 조각만 썰어 주세요.',
        contextNote:
          '정육·델리 코너에서 쓰이는 무게 단위 quarter pound(1/4파운드 ≈ 113g)와 조각 단위 slice를 배웁니다.',
        vocabulary: [
          {
            word: 'a quarter pound',
            meaning: '4분의 1파운드 (약 113g)',
            example: 'We only need a quarter pound of cheddar cheese for two sandwiches.',
          },
          {
            word: 'a couple of',
            meaning: '두어 개의, 몇 개의',
            example: 'I stayed a couple of extra minutes to finish writing the note.',
          },
          {
            word: 'thick slice',
            meaning: '두툼한 조각',
            example: 'Toast one thick slice of country bread with salted butter.',
          },
        ],
      },
    ],
  },
  {
    id: 'daily-units-2',
    title: 'Day 02 · 거리, 시간 & 날씨 온도 생활 단위 5문장',
    sourceSummary:
      '도심 이동 거리(blocks, miles, feet), 기온(degrees Fahrenheit), 배차·시간 간격(every 20 minutes, half an hour) 표현을 담은 5문장입니다.',
    createdAt: '2026-11-22T00:00:00.000Z',
    isSample: true,
    sentences: [
      {
        id: 'du2-s1',
        english:
          'The subway station is only three blocks away, which takes roughly five minutes on foot.',
        korean:
          '지하철역은 여기서 딱 세 블록 거리라서 걸어서 대략 5분 정도밖에 안 걸려요.',
        contextNote:
          '도심에서 거리를 말할 때 미터(m) 대신 자주 쓰는 blocks away와 도보 시간 표현입니다.',
        vocabulary: [
          {
            word: 'blocks away',
            meaning: '~블록 떨어진 곳에',
            example: 'There is a quiet bakery just two blocks away from our hotel.',
          },
          {
            word: 'roughly',
            meaning: '대략, 얼추',
            example: 'The train ride takes roughly forty minutes during rush hour.',
          },
          {
            word: 'on foot',
            meaning: '걸어서, 도보로',
            example: 'It is much faster to reach the park on foot than by car.',
          },
        ],
      },
      {
        id: 'du2-s2',
        english:
          'It dropped to thirty-two degrees Fahrenheit overnight, so remember to bring a warm scarf this morning.',
        korean:
          '밤새 기온이 화씨 32도(섭씨 0도)까지 내려갔으니 오늘 아침엔 꼭 따뜻한 목도리를 챙기세요.',
        contextNote:
          '미국 일기예보에서 물이 어는점(0°C)을 뜻하는 32 degrees Fahrenheit 온도 단위 표현입니다.',
        vocabulary: [
          {
            word: 'degrees Fahrenheit',
            meaning: '화씨 온도 (°F)',
            example: 'Summer afternoons here often reach ninety degrees Fahrenheit.',
          },
          {
            word: 'drop to',
            meaning: '(수치·기온이) ~까지 떨어지다',
            example: 'Temperatures usually drop to around ten degrees after sunset.',
          },
          {
            word: 'overnight',
            meaning: '밤사이에, 하룻밤 동안',
            example: 'A light snow fell overnight and covered the garden path.',
          },
        ],
      },
      {
        id: 'du2-s3',
        english:
          'The bus runs every twenty minutes on weekdays, but it comes only once an hour on Sunday mornings.',
        korean:
          '버스는 평일에는 20분 간격으로 다니지만, 일요일 아침에는 한 시간에 한 번만 와요.',
        contextNote:
          '배차 간격(every + 숫자 + minutes)과 빈도(once an hour)를 말하는 필수 시간 단위 구문입니다.',
        vocabulary: [
          {
            word: 'every twenty minutes',
            meaning: '20분마다, 20분 간격으로',
            example: 'The shuttle departs from the main gate every twenty minutes.',
          },
          {
            word: 'on weekdays',
            meaning: '평일에',
            example: 'The library opens an hour earlier on weekdays.',
          },
          {
            word: 'once an hour',
            meaning: '한 시간에 한 번',
            example: 'Stand up and stretch at least once an hour while working.',
          },
        ],
      },
      {
        id: 'du2-s4',
        english:
          'We drove nearly forty miles along the coast before stopping at a quiet diner for half an hour.',
        korean:
          '우리는 해안도로를 따라 거의 40마일(약 64km)을 달린 뒤에야 조용한 식당에 들러 30분간 쉬었다.',
        contextNote:
          '주행 거리 단위 mile(1마일 ≈ 1.6km)과 휴식 시간 half an hour(30분)를 자연스럽게 익힙니다.',
        vocabulary: [
          {
            word: 'forty miles',
            meaning: '40마일 (약 64km)',
            example: 'The nearest mountain trail is about forty miles north of town.',
          },
          {
            word: 'along the coast',
            meaning: '해안을 따라',
            example: 'We cycled slowly along the coast as the sun began to set.',
          },
          {
            word: 'half an hour',
            meaning: '30분, 반 시간',
            example: 'Give the bread half an hour to cool before slicing it.',
          },
        ],
      },
      {
        id: 'du2-s5',
        english:
          'Try standing at least six feet apart in line and take a two-minute stretch whenever your shoulders feel stiff.',
        korean:
          '줄을 설 때는 최소 6피트(약 1.8m) 간격을 두고, 어깨가 뻐근할 때마다 2분씩 스트레칭을 해 보세요.',
        contextNote:
          '생활 속 거리 단위 feet(1피트 ≈ 30.5cm)와 복합 형용사 시간 단위 two-minute의 쓰임입니다.',
        vocabulary: [
          {
            word: 'six feet apart',
            meaning: '6피트(약 1.8m) 간격으로 떨어져',
            example: 'Plant the small pine trees at least six feet apart.',
          },
          {
            word: 'at least',
            meaning: '적어도, 최소한',
            example: 'Try to sleep at least seven hours before a long flight.',
          },
          {
            word: 'two-minute',
            meaning: '2분짜리의, 2분간의',
            example: 'A two-minute break helps reset your focus between tasks.',
          },
        ],
      },
    ],
  },
  {
    id: 'daily-units-3',
    title: 'Day 03 · 쇼핑, 가격 & 일상 분량 생활 단위 5문장',
    sourceSummary:
      '가격과 할인(bucks a pound, percent off), 인당 요금(per person), 묶음·잔·줌 단위(pair, three-pack, handful, glasses)를 익히는 5문장입니다.',
    createdAt: '2026-11-23T00:00:00.000Z',
    isSample: true,
    sentences: [
      {
        id: 'du3-s1',
        english:
          'These ripe peaches are three bucks a pound, or you can grab a whole basket for ten dollars.',
        korean:
          '이 잘 익은 복숭아는 파운드당 3달러이고, 한 바구니 통째로는 10달러에 가져가실 수 있어요.',
        contextNote:
          '구어체 화폐 단위 bucks(= dollars)와 무게당 가격을 말하는 a pound(파운드당) 표현입니다.',
        vocabulary: [
          {
            word: 'three bucks',
            meaning: '3달러 (구어체 화폐 단위)',
            example: 'A plain croissant at that corner cafe costs only three bucks.',
          },
          {
            word: 'a pound',
            meaning: '1파운드(약 454g)당',
            example: 'Fresh cherries are usually five dollars a pound in June.',
          },
          {
            word: 'a whole basket',
            meaning: '한 바구니 통째로',
            example: 'They brought back a whole basket of apples from the orchard.',
          },
        ],
      },
      {
        id: 'du3-s2',
        english:
          'Drink at least eight glasses of water a day and keep a handful of almonds on your desk for afternoon snacks.',
        korean:
          '하루에 최소 여덟 잔의 물을 마시고, 오후 간식으로 책상 위에 아몬드 한 줌을 챙겨 두세요.',
        contextNote:
          '물 섭취 단위 glasses of(~잔)와 견과류·곡물 등에 자주 쓰는 어림 단위 a handful of(한 줌)입니다.',
        vocabulary: [
          {
            word: 'eight glasses of',
            meaning: '~여덟 잔',
            example: 'Eight glasses of water a day keep you steady and hydrated.',
          },
          {
            word: 'a handful of',
            meaning: '한 줌의 (손으로 한 번 쥔 양)',
            example: 'Toss a handful of blueberries onto your morning yogurt.',
          },
          {
            word: 'a day',
            meaning: '하루에, 매일',
            example: 'Walking twenty minutes a day makes a noticeable difference.',
          },
        ],
      },
      {
        id: 'du3-s3',
        english:
          'The museum charges fifteen dollars per person, though children under twelve get in for fifty percent off.',
        korean:
          '박물관 입장료는 1인당 15달러이지만, 12세 미만 어린이는 50퍼센트 할인을 받을 수 있어요.',
        contextNote:
          '요금 기준 단위 per person(1인당)과 할인율 단위 percent off(~% 할인)를 함께 익힙니다.',
        vocabulary: [
          {
            word: 'per person',
            meaning: '1인당, 한 사람당',
            example: 'The dinner course comes to thirty-five dollars per person.',
          },
          {
            word: 'under twelve',
            meaning: '12세 미만의',
            example: 'Kids under twelve ride the city ferry free of charge.',
          },
          {
            word: 'fifty percent off',
            meaning: '50퍼센트 할인된 가격으로',
            example: 'Winter coats are thirty percent off until this Sunday.',
          },
        ],
      },
      {
        id: 'du3-s4',
        english:
          'I picked up two pairs of wool socks and a three-pack of pocket notebooks for my winter trip.',
        korean:
          '겨울 여행을 위해 양모 양말 두 켤레와 3개입 묶음 포켓 노트를 하나 사 왔어요.',
        contextNote:
          '짝으로 된 물건 단위 pairs of(켤레/벌)와 묶음 개수 단위 three-pack of(3개입 묶음) 표현입니다.',
        vocabulary: [
          {
            word: 'two pairs of',
            meaning: '두 켤레의 (짝을 이루는 물건 단위)',
            example: 'Always pack two pairs of comfortable walking shoes when traveling.',
          },
          {
            word: 'a three-pack of',
            meaning: '3개입 한 묶음',
            example: 'A three-pack of black gel pens lasts me nearly six months.',
          },
          {
            word: 'pick up',
            meaning: '(가게에서) 사 오다, 챙기다',
            example: 'I need to pick up a fresh roll of film before the weekend.',
          },
        ],
      },
      {
        id: 'du3-s5',
        english:
          'Set aside just fifteen minutes twice a week to review your expenses, and you will save hundreds of dollars a year.',
        korean:
          '일주일에 두 번, 딱 15분만 따로 내어 지출을 돌아보면 일 년에 수백 달러는 거뜬히 아낄 수 있어요.',
        contextNote:
          '반복 빈도 단위 twice a week, a year와 금액 규모 단위 hundreds of dollars를 익히는 문장입니다.',
        vocabulary: [
          {
            word: 'twice a week',
            meaning: '일주일에 두 번',
            example: 'He practices speaking English with a tutor twice a week.',
          },
          {
            word: 'hundreds of dollars',
            meaning: '수백 달러',
            example: 'Cooking lunch at home saves hundreds of dollars each month.',
          },
          {
            word: 'set aside',
            meaning: '(시간·돈을) 따로 떼어 두다',
            example: 'Set aside ten quiet minutes every night for reading.',
          },
        ],
      },
    ],
  },
];

export const SAMPLE_DAY1_SET: StudySet = DAILY_SETS_BANK[0];

/**
 * Deterministically selects a 5-sentence StudySet for a given YYYY-MM-DD key.
 */
export function getCuratedSetForDate(dateKey: string): StudySet {
  const [y, m, d] = dateKey.split('-').map(Number);
  if (!y || !m || !d) return DAILY_SETS_BANK[0];
  const anchor = Date.UTC(2026, 10, 21);
  const target = Date.UTC(y, m - 1, d);
  const diffDays = Math.round((target - anchor) / 86400000);
  const idx = ((diffDays % DAILY_SETS_BANK.length) + DAILY_SETS_BANK.length) % DAILY_SETS_BANK.length;
  return DAILY_SETS_BANK[idx];
}
