import type { StudySet, UnitTopic } from '../types';

export interface CuratedStudySet extends StudySet {
  topic: Exclude<UnitTopic, 'all'>;
}

export const DAILY_SETS_BANK: CuratedStudySet[] = [
  {
    id: 'daily-units-1',
    topic: 'kitchen',
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
    topic: 'time_distance',
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
    topic: 'shopping',
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
  {
    id: 'daily-units-4',
    topic: 'kitchen',
    title: 'Day 04 · 홈베이킹 & 음료 레시피 계량 단위 5문장',
    sourceSummary:
      '컵, 티스푼, 쿼트, 온스, 오븐 온도 등 영어 레시피와 부엌 대화에서 바로 쓰이는 계량 표현 5문장입니다.',
    createdAt: '2026-11-24T00:00:00.000Z',
    isSample: true,
    sentences: [
      {
        id: 'du4-s1',
        english:
          'Preheat the oven to three hundred fifty degrees and whisk two cups of flour with one teaspoon of baking soda.',
        korean:
          '오븐을 화씨 350도(약 섭씨 177도)로 예열하고 밀가루 두 컵(약 240g)에 베이킹소다 한 작은술을 섞어 주세요.',
        contextNote:
          '미국 베이킹 기본 온도 350°F와 컵(cup)·티스푼(teaspoon) 계량 단위를 함께 익힙니다.',
        vocabulary: [
          {
            word: 'two cups of',
            meaning: '두 컵 분량의 (1컵 ≈ 240ml)',
            example: 'Pour two cups of warm broth slowly into the risotto pan.',
          },
          {
            word: 'one teaspoon of',
            meaning: '한 작은술 (약 5ml)',
            example: 'Mix one teaspoon of cinnamon with brown sugar.',
          },
        ],
      },
      {
        id: 'du4-s2',
        english:
          'Add a splash of cold milk and half a teaspoon of honey to balance the bitter roast of your morning coffee.',
        korean:
          '모닝커피의 쌉싸름한 맛을 잡아주려면 차가운 우유를 살짝(한 방울) 넣고 꿀 반 작은술을 더해 보세요.',
        contextNote:
          '정확한 눈금 대신 감각적으로 소량을 표현하는 a splash of(살짝/조금 붓는 양)입니다.',
        vocabulary: [
          {
            word: 'a splash of',
            meaning: '(액체를) 살짝, 한 모금 정도',
            example: 'Finish the pasta with a splash of starchy cooking water.',
          },
          {
            word: 'half a teaspoon',
            meaning: '반 작은술 (약 2.5ml)',
            example: 'Stir in half a teaspoon of vanilla extract off the heat.',
          },
        ],
      },
      {
        id: 'du4-s3',
        english:
          'Simmer two quarts of vegetable broth in a deep pot until the liquid reduces by roughly one third.',
        korean:
          '깊은 냄비에 채소 육수 2쿼트(약 1.9리터)를 넣고 국물이 약 3분의 1 정도 줄어들 때까지 뭉근히 끓여 주세요.',
        contextNote:
          '큰 냄비 요리에서 자주 쓰는 부피 단위 quart(1쿼트 ≈ 946ml)와 비율 감소 표현 reduce by one third입니다.',
        vocabulary: [
          {
            word: 'two quarts of',
            meaning: '2쿼트 분량의 (1쿼트 ≈ 946ml)',
            example: 'This pot holds up to four quarts of soup.',
          },
          {
            word: 'by one third',
            meaning: '3분의 1만큼',
            example: 'We cut our weekly sugar intake by one third.',
          },
        ],
      },
      {
        id: 'du4-s4',
        english:
          'Measure out eight ounces of dark chocolate and melt it slowly over a pot of barely simmering water.',
        korean:
          '다크 초콜릿 8온스(약 227g)를 계량한 뒤, 약하게 끓는 물 냄비 위에서 천천히 중탕해 녹여 주세요.',
        contextNote:
          '고체 무게 단위로서의 ounce(1온스 ≈ 28.35g, 8oz = 약 227g) 활용 예시입니다.',
        vocabulary: [
          {
            word: 'eight ounces',
            meaning: '8온스 (무게 약 227g)',
            example: 'The recipe calls for eight ounces of softened cream cheese.',
          },
          {
            word: 'measure out',
            meaning: '정량을 달아 덜어내다',
            example: 'Measure out the dry ingredients before turning on the mixer.',
          },
        ],
      },
      {
        id: 'du4-s5',
        english:
          'Serve each bowl with three thin slices of avocado and a generous squeeze of fresh lime juice on top.',
        korean:
          '각 그릇마다 얇게 썬 아보카도 세 조각을 올리고 신선한 라임 즙을 듬뿍 짜서 내어 보세요.',
        contextNote:
          '조각 수와 즙을 짜 넣는 양을 자연스럽게 표현하는 thin slices와 a generous squeeze of입니다.',
        vocabulary: [
          {
            word: 'a squeeze of',
            meaning: '(레몬·라임 등을) 한 번 꾹 짠 양',
            example: 'Grilled fish tastes brighter with a squeeze of lemon.',
          },
          {
            word: 'generous',
            meaning: '넉넉한, 푸짐한',
            example: 'Spread a generous layer of jam over warm toast.',
          },
        ],
      },
    ],
  },
  {
    id: 'daily-units-5',
    topic: 'time_distance',
    title: 'Day 05 · 여행, 일정 & 속도 생활 단위 5문장',
    sourceSummary:
      '비행·이동 시간(hour-long, fifteen-minute), 속도(miles per hour), 거리(yards, meters) 등 이동 중 자주 듣는 단위 표현입니다.',
    createdAt: '2026-11-25T00:00:00.000Z',
    isSample: true,
    sentences: [
      {
        id: 'du5-s1',
        english:
          'The speed limit drops to twenty-five miles per hour as soon as you enter the quiet school zone.',
        korean:
          '조용한 어린이 보호구역에 들어서자마자 제한 속도가 시속 25마일(약 40km/h)로 낮아집니다.',
        contextNote:
          '차량 속도 단위 miles per hour(mph)를 실생활 운전 상황에서 익히는 문장입니다.',
        vocabulary: [
          {
            word: 'miles per hour',
            meaning: '시속 ~마일 (1mph ≈ 1.6km/h)',
            example: 'Highway traffic was moving steadily at sixty miles per hour.',
          },
          {
            word: 'speed limit',
            meaning: '제한 속도',
            example: 'Watch for signs showing the local speed limit.',
          },
        ],
      },
      {
        id: 'du5-s2',
        english:
          'Our morning ferry leaves on the hour, so catching the nine o’clock boat gives us plenty of margin.',
        korean:
          '아침 페리는 매시 정각에 출발하므로 9시 배를 타면 시간 여유가 넉넉할 거예요.',
        contextNote:
          '정각 출발을 뜻하는 on the hour와 시각 표현 o’clock을 자연스럽게 연결합니다.',
        vocabulary: [
          {
            word: 'on the hour',
            meaning: '매시 정각에',
            example: 'The old town clock chimes gently on the hour.',
          },
          {
            word: 'plenty of margin',
            meaning: '넉넉한 여유분',
            example: 'Leave ten minutes early to keep plenty of margin.',
          },
        ],
      },
      {
        id: 'du5-s3',
        english:
          'The trail climbs four hundred feet over the final half mile, offering a clear view of the entire valley.',
        korean:
          '등산로는 마지막 0.5마일(약 800m) 구간에서 고도가 400피트(약 122m) 높아지며 계곡 전체가 한눈에 펼쳐집니다.',
        contextNote:
          '고도 단위 feet와 짧은 거리 단위 half mile을 등산 안내 문맥으로 배웁니다.',
        vocabulary: [
          {
            word: 'four hundred feet',
            meaning: '400피트 (고도·길이 약 122m)',
            example: 'The observation deck sits five hundred feet above the river.',
          },
          {
            word: 'half mile',
            meaning: '0.5마일 (약 800m)',
            example: 'There is a rest stop roughly a half mile ahead.',
          },
        ],
      },
      {
        id: 'du5-s4',
        english:
          'After an eleven-hour flight across the Pacific, even a twenty-minute walk outside helps reset your body clock.',
        korean:
          '태평양을 건너는 11시간의 비행 뒤에는 밖에서 단 20분만 걸어도 생체 시계를 되돌리는 데 큰 도움이 됩니다.',
        contextNote:
          '하이픈으로 연결된 시간 단위 형용사 eleven-hour와 twenty-minute의 문장 활용입니다.',
        vocabulary: [
          {
            word: 'eleven-hour',
            meaning: '11시간짜리의',
            example: 'Bring a neck pillow for an eleven-hour overnight journey.',
          },
          {
            word: 'body clock',
            meaning: '생체 시계, 수면 리듬',
            example: 'Morning sunlight is the fastest way to adjust your body clock.',
          },
        ],
      },
      {
        id: 'du5-s5',
        english:
          'Turn left about a hundred yards past the stone bridge and look for the small wooden signboard.',
        korean:
          '돌다리를 지나 약 100야드(약 91m)쯤 가서 왼쪽으로 돈 다음 작은 나무 간판을 찾으세요.',
        contextNote:
          '도보 길 안내에서 약 90cm 단위인 yard(야드)가 어떻게 쓰이는지 익힙니다.',
        vocabulary: [
          {
            word: 'a hundred yards',
            meaning: '100야드 (약 91미터)',
            example: 'The bookstore is fifty yards past the main intersection.',
          },
          {
            word: 'past',
            meaning: '~을 지나서',
            example: 'Walk straight past the post office until you see the park.',
          },
        ],
      },
    ],
  },
  {
    id: 'daily-units-6',
    topic: 'shopping',
    title: 'Day 06 · 마트 장보기, 영수증 & 수량 생활 단위 5문장',
    sourceSummary:
      '묶음, 무게, 할인, 보증금, 팁 비율 등 실제 계산대와 쇼핑 대화에서 쓰이는 단위 표현 5문장입니다.',
    createdAt: '2026-11-26T00:00:00.000Z',
    isSample: true,
    sentences: [
      {
        id: 'du6-s1',
        english:
          'Could I get half a dozen sourdough rolls and two jars of blueberry jam wrapped separately, please?',
        korean:
          '사워도우 롤빵 반 다스(6개)랑 블루베리 잼 두 병을 각각 따로 포장해 주실 수 있을까요?',
        contextNote:
          '빵집에서 6개를 뜻하는 half a dozen과 병 단위 jars of를 쓰는 자연스러운 요청입니다.',
        vocabulary: [
          {
            word: 'half a dozen',
            meaning: '반 다스, 6개',
            example: 'We bought half a dozen warm pastries for the team.',
          },
          {
            word: 'two jars of',
            meaning: '병에 담긴 ~ 두 병',
            example: 'Pick up two jars of tomato sauce for pasta night.',
          },
        ],
      },
      {
        id: 'du6-s2',
        english:
          'In most sit-down restaurants here, leaving an eighteen percent tip on the subtotal is considered standard.',
        korean:
          '이곳의 대부분 테이블 서비스 식당에서는 세전 합계 금액의 18퍼센트를 팁으로 남기는 것이 일반적이에요.',
        contextNote:
          '퍼센트 단위(eighteen percent)와 세전 금액 subtotal 개념을 함께 익힙니다.',
        vocabulary: [
          {
            word: 'eighteen percent',
            meaning: '18퍼센트',
            example: 'Service charges are often calculated at fifteen to twenty percent.',
          },
          {
            word: 'subtotal',
            meaning: '세금·팁 제외 소계 금액',
            example: 'Check the subtotal before applying your discount coupon.',
          },
        ],
      },
      {
        id: 'du6-s3',
        english:
          'This refill pouch holds thirty-four fluid ounces, which saves nearly twenty percent compared to buying small bottles.',
        korean:
          '이 리필 파우치는 34액량온스(약 1리터) 용량이라서 작은 병을 여러 개 사는 것보다 거의 20퍼센트 저렴해요.',
        contextNote:
          '세제·음료 라벨에 적힌 fluid ounces(fl oz, 액량 온스)와 절약 비율을 읽는 표현입니다.',
        vocabulary: [
          {
            word: 'fluid ounces',
            meaning: '액량 온스 (1 fl oz ≈ 29.6ml)',
            example: 'Carry-on liquids must stay under 3.4 fluid ounces per bottle.',
          },
          {
            word: 'compared to',
            meaning: '~와 비교하여',
            example: 'Buying in bulk costs less per ounce compared to single packs.',
          },
        ],
      },
      {
        id: 'du6-s4',
        english:
          'The farmer’s market sells fresh bunches of basil for two dollars each, or three bunches for five bucks.',
        korean:
          '파머스 마켓에서는 신선한 바질 한 다발을 개당 2달러에, 세 다발 묶음은 5달러에 팔고 있어요.',
        contextNote:
          '채소·꽃을 세는 단위 bunch(한 다발/한 단)와 단가 each / 묶음 가격 표현입니다.',
        vocabulary: [
          {
            word: 'bunch of',
            meaning: '(채소·꽃 등의) 한 다발, 한 단',
            example: 'Grab a fresh bunch of spinach and a bundle of green onions.',
          },
          {
            word: 'each',
            meaning: '개당, 각각',
            example: 'These handmade ceramic coasters are six dollars each.',
          },
        ],
      },
      {
        id: 'du6-s5',
        english:
          'If your checked suitcase weighs over fifty pounds, the airline charges a flat fee of seventy-five dollars.',
        korean:
          '위탁 수하물 무게가 50파운드(약 22.7kg)를 넘으면 항공사에서 75달러의 정액 수수료를 부과합니다.',
        contextNote:
          '공항 수하물 무게 기준 50 pounds(≈ 22.7kg)와 정액 요금 flat fee 표현입니다.',
        vocabulary: [
          {
            word: 'fifty pounds',
            meaning: '50파운드 (무게 약 22.7kg)',
            example: 'Keep your suitcase under fifty pounds to avoid extra fees.',
          },
          {
            word: 'flat fee',
            meaning: '고정 요금, 정액 수수료',
            example: 'The courier charges a flat fee regardless of distance.',
          },
        ],
      },
    ],
  },
];

export const SAMPLE_DAY1_SET: CuratedStudySet = DAILY_SETS_BANK[0];

/**
 * Deterministically selects a 5-sentence StudySet for a given YYYY-MM-DD key.
 */
export function getCuratedSetForDate(dateKey: string): CuratedStudySet {
  const [y, m, d] = dateKey.split('-').map(Number);
  if (!y || !m || !d) return DAILY_SETS_BANK[0];
  const anchor = Date.UTC(2026, 10, 21);
  const target = Date.UTC(y, m - 1, d);
  const diffDays = Math.round((target - anchor) / 86400000);
  const idx = ((diffDays % DAILY_SETS_BANK.length) + DAILY_SETS_BANK.length) % DAILY_SETS_BANK.length;
  return DAILY_SETS_BANK[idx];
}

export function pickNextCuratedSet(topic: UnitTopic, currentSetId: string): CuratedStudySet {
  const pool =
    topic === 'all'
      ? DAILY_SETS_BANK
      : DAILY_SETS_BANK.filter((s) => s.topic === topic);
  const candidates = pool.length > 0 ? pool : DAILY_SETS_BANK;
  const currentIdx = candidates.findIndex((s) => s.id === currentSetId);
  const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % candidates.length;
  return candidates[nextIdx];
}
