import { Landmark, Coupon, LeaderboardUser, Legend } from './types';

// NOTE: In Vite, files in 'public' are served at root. We reference them by string path.
// Do NOT use 'import' for files in the public directory.
const bagratiImg = '/landmarks/bagrati.png';
const hotelImg = '/landmarks/my-home.avif';
const kingBagratImg = '/legends/king-bagrat-iii.jpg';
const kingDavidImg = '/legends/King_David_IV_the_Builder._Gelati_fresco.jpg';
const akakiImg = '/legends/akaki-wereteli.jpg';
const mayakovskyImg = '/legends/mayakovski.jpg';
const verikoImg = '/legends/veriko.jpg';
const kakabadzeImg = '/legends/davit-kakabadze.jpg';
const rezoImg = '/legends/rezo.webp';
const ekvtimeImg = '/legends/ekvtime.jpg';
const galaktioniImg = '/legends/galaktioni.jpg';
const petreImg = '/legends/petre.jpg';
const zakariaImg = '/legends/zaqari.webp';

export const MAP_CENTER = { lat: 42.2715, lng: 42.706 };
export const DEFAULT_ZOOM = 16;

// Georgian Phrases for Profile
export const GEORGIAN_PHRASES = [
  // Greetings & Basics
  { geo: 'გამარჯობა', phon: 'Gamarjoba', eng: 'Hello', category: 'Basics' },
  { geo: 'მადლობა', phon: 'Madloba', eng: 'Thank you', category: 'Basics' },
  { geo: 'ნახვამდის', phon: 'Nakhvamdis', eng: 'Goodbye', category: 'Basics' },
  { geo: 'კი / არა', phon: 'Ki / Ara', eng: 'Yes / No', category: 'Basics' },
  {
    geo: 'უკაცრავად',
    phon: 'Ukatsravad',
    eng: 'Excuse me',
    category: 'Basics',
  },

  // Dining
  { geo: 'გემრიელია', phon: 'Gemrielia', eng: 'Delicious', category: 'Dining' },
  { geo: 'გაუმარჯოს', phon: 'Gaumarjos', eng: 'Cheers!', category: 'Dining' },
  { geo: 'წყალი', phon: 'Tskali', eng: 'Water', category: 'Dining' },
  { geo: 'ღვინო', phon: 'Ghvino', eng: 'Wine', category: 'Dining' },
  { geo: 'ანგარიში', phon: 'Angarishi', eng: 'The bill', category: 'Dining' },

  // Shopping / Travel
  { geo: 'რა ღირს?', phon: 'Ra ghirs?', eng: 'How much?', category: 'Travel' },
  { geo: 'სად არის?', phon: 'Sad aris?', eng: 'Where is?', category: 'Travel' },
  {
    geo: 'მარჯვნივ / მარცხნივ',
    phon: 'Marjvniv / Martskhniv',
    eng: 'Right / Left',
    category: 'Travel',
  },
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    id: '1',
    name: 'Giorgi T.',
    points: 2450,
    avatar: '🦁',
    flag: '🇬🇪',
    title: 'Local Legend',
    badgeIcon: '🏔️',
  },
  {
    id: '2',
    name: 'Sarah J.',
    points: 1800,
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    flag: '🇬🇧',
    title: 'Photo Hunter',
    badgeIcon: '📸',
  },
  {
    id: '3',
    name: 'Mike Travel',
    points: 1250,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    flag: '🇺🇸',
    title: 'Foodie',
    badgeIcon: '🥟',
  },
  {
    id: '4',
    name: 'Anna K.',
    points: 900,
    avatar: '🍷',
    flag: '🇩🇪',
    title: 'Wine Expert',
    badgeIcon: '🍇',
  },
  {
    id: '5',
    name: 'TravelCouple',
    points: 850,
    avatar: '✈️',
    flag: '🇵🇱',
    title: 'Explorers',
    badgeIcon: '🧭',
  },
  {
    id: '6',
    name: 'KutaisiGuy',
    points: 600,
    avatar: '🎸',
    flag: '🇬🇪',
    title: 'Musician',
    badgeIcon: '🎶',
  },
  {
    id: '7',
    name: 'Elena',
    points: 450,
    avatar: '🧘‍♀️',
    flag: '🇺🇦',
    title: 'Zen Master',
    badgeIcon: '🍵',
  },
];

export const KUTAISI_LEGENDS: Legend[] = [
  {
    id: 'bagrat',
    name: 'King Bagrat III',
    role: 'The Unifier',
    years: '960–1014',
    bio: 'I am the architect of a united Georgia. Before me, there were only warring tribes. I built the great Cathedral on Ukimerioni Hill to show the world our strength. My legacy is stone and unity.',
    gymnasiumConnection: false,
    image: kingBagratImg,
    quote: 'A kingdom divided cannot stand.',
  },
  {
    id: 'david',
    name: 'David the Builder',
    role: 'King of Georgia',
    years: '1073–1125',
    bio: 'I inherited a broken land and built a Golden Age. I founded the Gelati Academy because I believe the sword protects, but knowledge elevates. I asked to be buried in the gateway, so my people would step on my heart.',
    gymnasiumConnection: false,
    image: kingDavidImg,
    quote: 'Knowledge is the light of the soul.',
  },
  {
    id: 'akaki',
    name: 'Akaki Tsereteli',
    role: 'Prince & Poet',
    years: '1840–1915',
    bio: 'I walked these streets of Kutaisi, composing verses that every Georgian knows by heart. My pen was my weapon for freedom. I studied here, loved here, and my spirit lingers on the White Bridge.',
    gymnasiumConnection: true,
    image: akakiImg,
    quote: 'Suliko, where are you hiding?',
  },
  {
    id: 'mayakovsky',
    name: 'Vladimir Mayakovsky',
    role: 'Futurist Poet',
    years: '1893–1930',
    bio: 'I was born in Baghdati, but Kutaisi gave me my voice. I studied at the Gymnasium here. My rhymes are like thunder, my style broken and new. I speak Russian, but my temper is pure Georgian.',
    gymnasiumConnection: true,
    image: mayakovskyImg,
    quote: 'I would have learned Georgian just because Lenin spoke it.',
  },
  {
    id: 'veriko',
    name: 'Veriko Anjaparidze',
    role: 'Mother of Cinema',
    years: '1897–1987',
    bio: 'The camera loved me, but the stage was my home. Born in Kutaisi, I became the face of Georgian tragedy and triumph. The British Encyclopedia called me one of the greatest actresses of the 20th century.',
    gymnasiumConnection: false,
    image: verikoImg,
    quote: 'Art is not a mirror, it is a hammer.',
  },
  {
    id: 'kakabadze',
    name: 'Davit Kakabadze',
    role: 'Avant-Garde Artist',
    years: '1889–1952',
    bio: 'I saw the world in shapes and cubes, yet I never forgot the colors of Imereti. I was a scientist of art. I studied at the Kutaisi Gymnasium before showing Paris what Georgian modernism looked like.',
    gymnasiumConnection: true,
    image: kakabadzeImg,
    quote: 'My art is the geometry of my motherland.',
  },
  {
    id: 'rezo',
    name: 'Revaz Gabriadze',
    role: 'Puppeteer & Director',
    years: '1936–2021',
    bio: 'I built worlds out of clay and wire. I wrote "Mimino" and "Kin-dza-dza!", but my heart was always a puppet theatre. Kutaisi is where I learned that even a small stone has a story.',
    gymnasiumConnection: false,
    image: rezoImg,
    quote: 'Life is a tear and a smile combined.',
  },
  {
    id: 'takaishvili',
    name: 'Ekvtime Takaishvili',
    role: 'Saint & Guardian',
    years: '1863–1953',
    bio: "They call me the Man of God. When the Bolsheviks came, I took Georgia's national treasures to France. I lived in poverty for 24 years, guarding gold I could not touch, just to bring it back home.",
    gymnasiumConnection: true,
    image: ekvtimeImg,
    quote: 'The treasure belongs to the nation, not to me.',
  },
  {
    id: 'galaktion',
    name: 'Galaktion Tabidze',
    role: 'King of Poets',
    years: '1891–1959',
    bio: 'I am the wind, the rain, and the melancholy of Georgia. I studied at the Seminary here. My verses ("Me and the Night") changed Georgian poetry forever. I died alone, but my words live in every toast.',
    gymnasiumConnection: true,
    image: galaktioniImg,
    quote: 'Without you, I am the wind in the field.',
  },
  {
    id: 'otskheli',
    name: 'Petre Otskheli',
    role: 'Visual Genius',
    years: '1907–1937',
    bio: 'I designed stages that looked like the future. My constructivist art was too bold for the Soviet regime. I was executed at 30, but my sketches remain timeless masterpieces of Kutaisi.',
    gymnasiumConnection: false,
    image: petreImg,
    link: 'https://artsandculture.google.com/story/kQURtnvDoiucLg?hl=ru',
    quote: 'Build the stage, and the drama will follow.',
  },
  {
    id: 'paliashvili',
    name: 'Zakaria Paliashvili',
    role: 'Composer',
    years: '1871–1933',
    bio: 'I took the folk songs of the peasants and wove them into grand operas like "Abesalom and Eteri". I composed the melody that became the National Anthem. I am the sound of Georgia.',
    gymnasiumConnection: false,
    image: zakariaImg,
    quote: 'Music is the soul of the nation.',
  },
];

export const REWARDS: Coupon[] = [
  {
    id: 'badge_scout',
    title: 'Badge: Kutaisi Scout',
    businessName: 'Rank Up',
    description:
      'Prove you know the streets. Unlocks the Bronze avatar border.',
    cost: 200,
    icon: '🥉',
    color: 'from-amber-600 to-yellow-800',
  },
  {
    id: 'secret_dragon',
    title: 'Secret: The Rioni Dragon',
    businessName: 'Lost Legend',
    description:
      'Unlock the ancient myth about the beasts of the Rioni River that is not in guidebooks.',
    cost: 400,
    icon: '🐉',
    color: 'from-emerald-600 to-teal-800',
  },
  {
    id: 'souvenir_lion',
    title: 'Souvenir: Golden Lion',
    businessName: 'Digital Artifact',
    description:
      'A digital replica of the Colchis Fountain lion for your collection.',
    cost: 600,
    icon: '🦁',
    color: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'badge_tamada',
    title: 'Title: Grand Tamada',
    businessName: 'Prestige',
    description:
      'The highest honor! You are now the master of toasts and history.',
    cost: 1000,
    icon: '🍷',
    color: 'from-red-600 to-rose-900',
  },
  {
    id: 'secret_tunnel',
    title: "Secret: King's Tunnel",
    businessName: 'Hidden History',
    description:
      'Reveals the map location of a rumored secret tunnel under the city used by Kings.',
    cost: 1200,
    icon: '🗝️',
    color: 'from-slate-700 to-black',
  },
];

export const INITIAL_LANDMARKS: Landmark[] = [
  {
    id: 'host_hotel',
    name: 'City Centre Apartment - Mari',
    category: 'hotel',
    position: { lat: 42.26957831490275, lng: 42.7043414410688 },
    description:
      'A historic 19th-century home (est. 1875) with exquisite carved ceilings. Located at Tsereteli 6, right next to Karvasla.',
    riddle:
      'I am a house built in 1875, standing near the Chain Bridge and Karvasla.',
    hints: [
      'You are at Tsereteli Street N6.',
      'Next to Karvasla Shopping Centre.',
    ],
    facts: [
      'Built in 1875, this building retains its unique atmosphere of the past.',
      'Located just 1 min walk from Colchis Fountain and Karvasla Mall.',
    ],
    isUnlocked: false,
    image: hotelImg,
    reward_icon: '🏡',
    airbnbLink: 'https://ru.airbnb.com/rooms/1136214026220149573',
    secret_info: {
      wifi: 'manana / Pass: 19591959',
      taxi: 'Bolt App or Call Host',
    },
  },

  // --- QUEST LANDMARKS ---
  {
    id: 'colchis_fountain',
    name: 'Colchis Fountain',
    category: 'quest',
    position: { lat: 42.2714469795705, lng: 42.705411642452056 },
    description:
      'The vibrant heart of Kutaisi. It features 30 gilded statues, enlarged copies of ancient Colchian gold jewelry found by archaeologists.',
    riddle:
      'I am a golden army of 30 animals, but I do not bite. I carry the memory of King Aeetes and the Golden Fleece. Find the man raising a wine horn.',
    hints: [
      "Look for the 'Tamada' (Toastmaster) statue at the very top of the structure.",
      'Identify the pair of golden horses on the upper tier.',
    ],
    facts: [
      '⚠️ Safety: To get close, you must cross the roundabout carefully!',
      'The "Tamada" statue proves that Georgians have been toasting with wine since the 7th century BC.',
      'The original gold artifacts are tiny (jewelry sized), but these are magnified 10x.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Kutaisi_Colchis_Fountain.jpg/800px-Kutaisi_Colchis_Fountain.jpg',
    reward_icon: '🦁',
    mapLink: 'https://maps.app.goo.gl/LQ9B1KTDJjdasUrcA',
  },
  {
    id: 'meskhishvili_theatre',
    name: 'L. Meskhishvili Theatre',
    category: 'quest',
    position: { lat: 42.27238980437894, lng: 42.70592267924879 },
    description:
      "A majestic Renaissance-style building (1861) overlooking the main square. The heart of Kutaisi's cultural life.",
    riddle:
      'I wear a mask of tragedy and a mask of comedy. Six stone giants (columns) guard my entrance. I watch the Golden Fountain day and night.',
    hints: [
      'Count the 6 massive columns on the facade.',
      "Look for the stone masks of drama on the building's exterior walls.",
    ],
    facts: [
      'Founded in 1861, making it one of the oldest theatres in the Caucasus.',
      'Famous Georgian actors Veriko Anjaparidze and Sergo Zakariadze performed on this stage.',
      'There is a cozy park on the left side with free city Wi-Fi.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Kutaisi_Theatre.jpg/800px-Kutaisi_Theatre.jpg',
    reward_icon: '🎭',
    mapLink: 'https://maps.app.goo.gl/9Q1Q1Q1Q1Q1Q1Q1Q',
  },
  {
    id: 'white_bridge',
    name: 'White Bridge',
    category: 'quest',
    position: { lat: 42.26885100021315, lng: 42.7003048239845 },
    description:
      'The most romantic bridge in the city. Built in 1872, it offers stunning views of the White Stones of the Rioni River.',
    riddle:
      'I have no walls, but I have windows to the river below. A boy sits on my rail holding two hats, waiting for Picasso. Do you dare to walk on glass?',
    hints: [
      'Find the bronze statue of the boy sitting on the railing (from the movie "Blue Mountains").',
      'Look down! Find the transparent glass sections in the floor to see the river rushing.',
    ],
    facts: [
      'The white stones in the river below give the bridge its name.',
      'The boy with two hats is a character from a famous Georgian film scene.',
      'Originally built of wood in 1852, replaced by iron in 1872.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/White_bridge%2C_Kutaisi.jpg/800px-White_bridge%2C_Kutaisi.jpg',
    reward_icon: '🎩',
    mapLink: 'https://maps.app.goo.gl/APMwmhpLE85GQwcr6',
  },
  {
    id: 'cable_car',
    name: 'Kutaisi Cable Car',
    category: 'quest',
    position: { lat: 42.26973915921473, lng: 42.70077391049079 },
    description:
      'A Soviet-era aerial tramway connecting the White Bridge area to the Gabashvili Park on the hill.',
    riddle:
      'I can fly without wings. Pay me 3 Lari and I will lift you from the river bank to the Ferris Wheel in the sky.',
    hints: [
      'Go to the white station building located in the park near the White Bridge.',
      'Spot the yellow/red gondola moving up the steep hill.',
    ],
    facts: [
      'Price: 3 Lari. Open: 12:00 PM – 8:00 PM.',
      'The top station leads to Besik Gabashvili Park, which has an old-school Ferris Wheel.',
      'From the top, you can walk down Kazbegi Street to reach Bagrati Cathedral.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Kutaisi_Cable_Car.jpg/800px-Kutaisi_Cable_Car.jpg',
    reward_icon: '🚠',
    mapLink: 'https://maps.app.goo.gl/cablecar',
  },
  {
    id: 'art_gallery',
    name: 'Kakabadze Art Gallery',
    category: 'quest',
    position: { lat: 42.2708157611456, lng: 42.70093795337343 },
    description:
      'A compact but rich gallery housing masterpieces of Georgian fine art.',
    riddle:
      'I am a quiet house of colors. Inside me, Pirosmani paints his animals and Kakabadze paints his motherland Imereti.',
    hints: [
      'Located on Rustaveli Avenue, look for the banner with "Art Gallery".',
      'It is a yellow classical building.',
    ],
    facts: [
      'Contains original works by Niko Pirosmani, the most famous Georgian primitive artist.',
      'Named after David Kakabadze, a modernist who studied in Paris.',
      'Ticket price is very affordable (approx 5-10 GEL).',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kutaisi_Art_Gallery.jpg/800px-Kutaisi_Art_Gallery.jpg',
    reward_icon: '🎨',
    mapLink: 'https://maps.app.goo.gl/gallery',
  },
  {
    id: 'bagrati',
    name: 'Bagrati Cathedral',
    category: 'quest',
    position: { lat: 42.2773, lng: 42.7043 },
    description:
      'The symbol of united Georgia, built in 1003 by King Bagrat III. It dominates the city skyline from Ukimerioni Hill.',
    riddle:
      'I was born in 1003 AD and broken by gunpowder in 1692. I wear a green copper dome and watch the city from the highest hill.',
    hints: [
      'Look for the large stone cross standing in the grassy yard.',
      'Find the stone inscription on the wall dating back to 1003 AD.',
    ],
    facts: [
      'Built in 1003 AD. It was the site of the coronation of David the Builder.',
      'Destroyed by Ottoman troops in 1692, it stood as a ruin without a dome for 300 years.',
      'Reconstructed in 2012. The elevator inside (hidden) is a controversial modern addition.',
    ],
    isUnlocked: false,
    image: bagratiImg,
    reward_icon: '👑',
    mapLink: 'https://maps.app.goo.gl/bcU47u4oKz9XvfSM9',
  },
  {
    id: 'botanical_garden',
    name: 'Kutaisi Botanical Garden',
    category: 'quest',
    position: { lat: 42.28526523633019, lng: 42.71354600971563 },
    description:
      'A lush garden established in the 19th century. Famous for its unique chapel inside a tree.',
    riddle:
      'I am a forest in the city. My most famous resident is a 400-year-old oak tree that has a church inside its belly.',
    hints: [
      'Find the massive Oak Tree with a door cut into its trunk.',
      'Look for the small chapel icon inside the living tree.',
    ],
    facts: [
      'The "Chapel in an Oak" is a real functioning prayer site.',
      'Located on the right bank of the Rioni River.',
      'Best place to escape the summer heat of July/August.',
    ],
    isUnlocked: false,
    image: 'bagratiImg', // Placeholder, needs update in real app
    reward_icon: '🌳',
    mapLink: 'https://maps.app.goo.gl/undC2PaSHe471xRb6',
  },
  {
    id: 'history_museum',
    name: 'Kutaisi State History Museum',
    category: 'quest',
    position: { lat: 42.2690870113976, lng: 42.70403729364274 },
    description:
      'A treasury of Georgian culture, holding over 200,000 artifacts from the Bronze Age to the 19th century.',
    riddle:
      'I am a house of time. Inside me, you will find the weapons of kings, the jewelry of queens, and a bible written by hand 900 years ago.',
    hints: [
      'Located on Pushkin Street, near the Opera.',
      'Look for the large wooden carved door or the poster of the Golden Icon.',
    ],
    facts: [
      'Houses a unique collection of manuscripts and Gospels from the 11th century.',
      'Contains weapons belonging to Georgian kings.',
      'Established in 1912.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Kutaisi_State_Historical_Museum.jpg/800px-Kutaisi_State_Historical_Museum.jpg',
    reward_icon: '🏺',
    mapLink: 'https://maps.app.goo.gl/hiQqGk8vDYSuA4B27',
  },
  {
    id: 'gelati',
    name: 'Gelati Monastery',
    category: 'quest',
    position: { lat: 42.2952, lng: 42.7684 },
    description:
      'A medieval academy and monastery complex (UNESCO) founded by King David the Builder in 1106.',
    riddle:
      'I am the "New Jerusalem" of Georgia. A great King lies at my gate so that every visitor steps on his grave. Look up to see the Virgin Mary made of 2.5 million stones.',
    hints: [
      'Find the large tombstone in the southern gateway with the name "David".',
      'Look at the ceiling of the main church to see the famous mosaic.',
    ],
    facts: [
      'King David the Builder is buried in the floor of the south gate as an act of humility.',
      'It was a medieval academy where philosophy and astronomy were taught.',
      'Located 11km from the city (needs a taxi/marshrutka).',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Gelati_monastery_in_Kutaisi.jpg/800px-Gelati_monastery_in_Kutaisi.jpg',
    reward_icon: '📜',
    mapLink: 'https://maps.app.goo.gl/aAJ8JgdjCuxDPyLk9',
  },
  {
    id: 'motsameta',
    name: 'Motsameta Monastery',
    category: 'quest',
    position: { lat: 42.2825, lng: 42.7592 },
    description:
      'Spectacularly perched on a cliff edge over the Tskaltsitela (Red Water) river.',
    riddle:
      'Two brothers lie here who refused to denounce their faith. Crawl under their bones three times, and your secret wish will be granted.',
    hints: [
      'Enter the main church and look for the rectangular wooden ark on lions.',
      'Find the small passage under the ark where people crawl.',
    ],
    facts: [
      'Name means "Place of the Martyrs" (David and Constantine).',
      'The river below is called "Red Water" because of the legend of the battle.',
      'The view from the cliff is one of the most photographed spots in Imereti.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Motsameta_Monastery.jpg/800px-Motsameta_Monastery.jpg',
    reward_icon: '⛪',
    mapLink: 'https://maps.app.goo.gl/QkAFFec4keTyA8r18',
  },
  {
    id: 'prometheus_cave',
    name: 'Prometheus Cave',
    category: 'quest',
    position: { lat: 42.3768, lng: 42.601 },
    description:
      'One of the biggest caves in Europe, full of stalactites and stalagmites, located 20km from Kutaisi.',
    riddle:
      'I was hidden in darkness until 1984. My rivers flow where the sun never shines, and my stone teeth grow from the ceiling. I am named after the titan who stole fire.',
    hints: [
      'Take the boat ride on the underground river if available.',
      'Look for the colorful LED lights illuminating the stalactites.',
    ],
    facts: [
      'Discovered recently in 1984.',
      'Total length is 11km, but the tourist route is 1.4km.',
      'Constant temperature of 14°C all year round.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Prometheus_Cave_1.jpg/800px-Prometheus_Cave_1.jpg',
    reward_icon: '🦇',
    mapLink: 'https://maps.app.goo.gl/quWek63GaJ1mGvWNA',
  },
  {
    id: 'sataplia',
    name: 'Sataplia Nature Reserve',
    category: 'quest',
    position: { lat: 42.3129, lng: 42.6744 },
    description:
      'Famous for preserved dinosaur footprints and a glass observation deck.',
    riddle:
      'I am the "Place of Honey". Walk on glass over the abyss and trace the steps of a beast that walked here 120 million years ago.',
    hints: [
      'Find the rock shelter protecting the dinosaur footprints.',
      'Walk onto the transparent glass platform overlooking the city.',
    ],
    facts: [
      'Sataplia means "Place of Honey" because wild bees used to nest here.',
      'Features footprints of both herbivorous and carnivorous dinosaurs.',
      'Offers a panoramic view of Kutaisi from the glass deck.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Sataplia.jpg/800px-Sataplia.jpg',
    reward_icon: '🦖',
    mapLink: 'https://maps.app.goo.gl/5Jj67b5FK925Xzud8',
  },
  {
    id: 'kutaisi_airport',
    name: 'Kutaisi International Airport',
    category: 'quest',
    position: { lat: 42.18220167652388, lng: 42.46546252398099 },
    description:
      'The modern gateway to Georgia, known for its unique red and white control tower.',
    riddle:
      'I am the red and white bridge to the sky. I never sleep, and I welcome guests from Wizz Air.',
    hints: [
      'Look for the tall Control Tower that glows red at night.',
      'It is located 14km west of the city.',
    ],
    facts: [
      'Designed by UN Studio, focusing on light and open spaces.',
      'The control tower is 55 meters high.',
      'Hub for low-cost flights, bringing Europe closer to Georgia.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Kutaisi_Airport_Terminal.jpg/1280px-Kutaisi_Airport_Terminal.jpg',
    reward_icon: '✈️',
    mapLink: 'https://maps.app.goo.gl/3Jg5jX8s8x8x8x8x',
  },
  {
    id: 'geguti_palace',
    name: 'Geguti Royal Palace',
    category: 'quest',
    position: { lat: 42.1633, lng: 42.6869 },
    description:
      'The ruins of a medieval royal palace, once the winter residence of Queen Tamar.',
    riddle:
      'I am the house of a Queen, but my roof is the sky. I stand in a field 7km south. My brick walls remember the Golden Age.',
    hints: [
      'Look for the large red brick ruins standing in an open field.',
      'Find the large archway that used to be a fireplace.',
    ],
    facts: [
      'Dates back to the 12th century, the era of Queen Tamar.',
      'The only remaining royal palace of that scale in Georgia.',
      'It was used as a winter residence due to the milder climate in the valley.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Geguti_Palace_ruins.jpg/800px-Geguti_Palace_ruins.jpg',
    reward_icon: '🏰',
    mapLink: 'https://maps.app.goo.gl/geguti',
  },

  // --- DINING & SPOTS ---
  {
    id: 'palaty',
    name: 'Palaty',
    category: 'dining',
    position: { lat: 42.269134571136476, lng: 42.70212192583241 },
    description:
      'A family-run restaurant with a soulful atmosphere. Famous for live music and pottery.',
    hints: [],
    facts: [
      'Try the "Chicken in Blackberry Sauce" (Tsitsila).',
      'The walls are decorated with messages from travelers worldwide.',
    ],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1574484284008-81dcec716d9d?auto=format&fit=crop&w=800&q=80',
    reward_icon: '🍽️',
    instagram:
      'https://www.instagram.com/palaty.restaurant?igsh=MTJ2Mmxyd2hsbjIwYg==',
    mapLink: 'https://maps.app.goo.gl/Zsmn7y6xrNHdCV5D7?g_st=ic',
  },
  {
    id: 'sisters',
    name: 'Sisters (Debi)',
    category: 'dining',
    position: { lat: 42.272107310387554, lng: 42.7042941104909 },
    description:
      'A vintage-style restaurant run by sisters. Excellent wine list and piano music.',
    hints: [],
    facts: [
      'Located near the Opera House.',
      "Feels like visiting a Georgian grandmother's living room.",
    ],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    reward_icon: '🍷',
    instagram:
      'https://www.instagram.com/sisters.bar2018?igsh=MTg5b2wxNWg4OTR1bA==',
    mapLink: 'https://maps.app.goo.gl/eaxUm9GwyhHeiH1WA?g_st=ic',
  },
  {
    id: 'papavero',
    name: 'Papavero',
    category: 'dining',
    position: { lat: 42.27008413689432, lng: 42.702086539326224 },
    description:
      'A classic spot with a nice terrace near the White Bridge. Good mix of Georgian and European food.',
    hints: [],
    facts: [
      'Live jazz/piano music in the evenings.',
      'Try the Khachapuri on a skewer.',
    ],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    reward_icon: '🍕',
    instagram:
      'https://www.instagram.com/bar_restaurant_papavero?igsh=eGlxMzcxcnhhenAw',
    mapLink: 'https://maps.app.goo.gl/HMLovUdEiEcXb4Ru7?g_st=ic',
  },
  {
    id: 'hacker_pschorr',
    name: 'Hacker-Pschorr Kutaisi',
    category: 'dining',
    position: { lat: 42.2691214389555, lng: 42.698015254667794 },
    description: 'German beer hall vibes mixed with Georgian hospitality.',
    hints: [],
    facts: [
      'Best place for draft beer.',
      'Their Khinkali is surprisingly good.',
    ],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80',
    reward_icon: '🍻',
    mapLink: 'https://maps.app.goo.gl/NUwHFunqa243N8qp6?g_st=ic',
  },
  {
    id: 'gallery_terrace',
    name: 'Gallery Terrace',
    category: 'dining',
    position: { lat: 42.27089490550877, lng: 42.701525310490965 },
    description: 'Rooftop dining with the best sunset view of the Rioni River.',
    hints: [],
    facts: [
      'Best sunset spot.',
      'Located above the "Best Western" hotel area.',
    ],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    reward_icon: '🌅',
    instagram:
      'https://www.instagram.com/gallery.terrace?igsh=NDF2M2c0MXF2YXh0',
    mapLink: 'https://maps.app.goo.gl/BU26zwWRMwuVU1nN9?g_st=ic',
  },
  {
    id: 'coffee_bean',
    name: 'Coffee Bean',
    category: 'dining',
    position: { lat: 42.269986567781515, lng: 42.70268732430206 },
    description:
      'The best specialty coffee in town. Small, cozy, and aromatic.',
    hints: [],
    facts: ['Great flat white.', 'They have non-dairy milk options.'],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80',
    reward_icon: '☕',
    instagram: 'https://www.instagram.com/coffee_beann?igsh=N2J6NGdmZXJjZG44',
    mapLink: 'https://maps.app.goo.gl/7VqC8xAYdhixqGxd7?g_st=ic',
  },
  {
    id: 'foe_foe',
    name: 'Tea House Foe-Foe',
    category: 'dining',
    position: { lat: 42.270157149266076, lng: 42.705663508214734 },
    description: 'Bohemian art cafe inside the Mon Plaisir Arch.',
    hints: [],
    facts: [
      'Famous for its painted ceilings and cocktails.',
      'Try the waffles.',
    ],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    reward_icon: '🍰',
    mapLink: 'https://maps.app.goo.gl/WuK9yJ7MmTYevixi7?g_st=ic',
  },
  {
    id: 'baraka',
    name: 'Baraka',
    category: 'dining',
    position: { lat: 42.2707551619069, lng: 42.70590196816159 },
    description: 'Hearty Georgian food at great prices.',
    hints: [],
    facts: ['Generous portions.', 'Very popular with locals for lunch.'],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1606213504344-96c21447077e?auto=format&fit=crop&w=800&q=80',
    reward_icon: '🥙',
    mapLink: 'https://maps.app.goo.gl/TbVV5s8PkFqynZbr5?g_st=ic',
  },
];

export const SYSTEM_PROMPT = `
Role: You are "GeoQuest AI", a personal guide and gamemaster for Kutaisi, Georgia.

Capabilities:
1. Vision: Analyze the provided image to identify if it is a famous Georgian landmark (Bagrati, White Bridge, Colchis Fountain, Gelati, Motsameta, Prometheus Cave, Sataplia, Okatse, Vani Museum).
2. Gamification: If the user finds a location, congratulate them.
3. Storytelling: Keep it VERY brief (2 sentences max) as the app now has a dedicated facts section.
4. Concierge: If it's food, recommend a place like Palaty or Sisters.

Tone: Hospitable, cheerful, warm.

IMPORTANT: You must evaluate if the image matches one of the target locations.
Output ONLY valid JSON.
`;
