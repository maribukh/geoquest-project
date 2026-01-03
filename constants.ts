import { Landmark, Coupon, LeaderboardUser, Legend } from './types';

// Kutaisi Center (Centered between Hotel and Fountain)
export const MAP_CENTER = { lat: 42.2715, lng: 42.706 };
export const DEFAULT_ZOOM = 16;

// PRECISE WALKING ROUTE (From Tsereteli 6 -> Fountain -> White Bridge -> Bagrati)
export const WALKING_ROUTE = [
  { lat: 42.27182, lng: 42.70515 }, // START: Hotel (Tsereteli 6)
  { lat: 42.2716, lng: 42.7055 }, // Passing Karvasla
  { lat: 42.27145, lng: 42.70725 }, // Colchis Fountain (Main Square)
  { lat: 42.271, lng: 42.707 }, // Crossing square south
  { lat: 42.2702, lng: 42.7035 }, // Pushkin Street (Museum area)
  { lat: 42.2705, lng: 42.7018 }, // Park near Cable Car
  { lat: 42.2703, lng: 42.701 }, // White Bridge
  { lat: 42.2704, lng: 42.7005 }, // Cross river to left bank
  { lat: 42.2715, lng: 42.701 }, // Walking up Newport St
  { lat: 42.274, lng: 42.7025 }, // Winding cobbled street
  { lat: 42.276, lng: 42.7035 }, // Approaching hill
  { lat: 42.2773, lng: 42.7043 }, // FINISH: Bagrati Cathedral
];

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
    displayPoints: undefined,
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
    displayPoints: undefined,
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
    displayPoints: undefined,
  },
  {
    id: '4',
    name: 'Anna K.',
    points: 900,
    avatar: '🍷',
    flag: '🇩🇪',
    title: 'Wine Expert',
    badgeIcon: '🍇',
    displayPoints: undefined,
  },
  {
    id: '5',
    name: 'TravelCouple',
    points: 850,
    avatar: '✈️',
    flag: '🇵🇱',
    title: 'Explorers',
    badgeIcon: '🧭',
    displayPoints: undefined,
  },
  {
    id: '6',
    name: 'KutaisiGuy',
    points: 600,
    avatar: '🎸',
    flag: '🇬🇪',
    title: 'Musician',
    badgeIcon: '🎶',
    displayPoints: undefined,
  },
  {
    id: '7',
    name: 'Elena',
    points: 450,
    avatar: '🧘‍♀️',
    flag: '🇺🇦',
    title: 'Zen Master',
    badgeIcon: '🍵',
    displayPoints: undefined,
  },
];

export const KUTAISI_LEGENDS: Legend[] = [
  {
    id: 'bagrat',
    name: 'King Bagrat III',
    role: 'The Unifier',
    years: '960–1014',
    bio: 'The first King of the Kingdom of Georgia. He united the fragmented lands and built the magnificent Bagrati Cathedral in Kutaisi as a symbol of the new powerful state.',
    gymnasiumConnection: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/King_Bagrat_III_of_Georgia.jpg/800px-King_Bagrat_III_of_Georgia.jpg',
    quote: 'Unity is strength.',
  },
  {
    id: 'david',
    name: 'David the Builder',
    role: 'King of Georgia',
    years: '1073–1125',
    bio: 'The greatest King who made Kutaisi the capital and founded the Gelati Academy. He is buried in the gateway of Gelati so people step on his grave (an act of humility).',
    gymnasiumConnection: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/David_IV_of_Georgia_fresco.jpg/800px-David_IV_of_Georgia_fresco.jpg',
    quote: 'Remember me when you step on my grave.',
  },
  {
    id: 'akaki',
    name: 'Akaki Tsereteli',
    role: 'Prince & Poet',
    years: '1840–1915',
    bio: 'A monumental figure. He studied at the Kutaisi Gymnasium. His poetry defined the national liberation movement. The "White Bridge" owes its fame partly to him.',
    gymnasiumConnection: true,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/4/4e/Akaki_Tsereteli_2.jpg',
    quote: 'Suliko, where are you hiding?',
  },
  {
    id: 'mayakovsky',
    name: 'Vladimir Mayakovsky',
    role: 'Futurist Poet',
    years: '1893–1930',
    bio: 'Born in Baghdati (near Kutaisi), he studied at the Kutaisi Classical Gymnasium. He spoke fluent Georgian and his rebellious, rhythmic style was born in the streets of this city.',
    gymnasiumConnection: true,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Vladimir_Mayakovsky_%281910s%29.jpg/800px-Vladimir_Mayakovsky_%281910s%29.jpg',
    quote: 'I know the power of words.',
  },
  {
    id: 'veriko',
    name: 'Veriko Anjaparidze',
    role: 'Mother of Cinema',
    years: '1897–1987',
    bio: 'Born in Kutaisi, she is considered one of the greatest Georgian actresses of all time. She was named one of the "10 best actresses of the 20th century" by the British encyclopedia.',
    gymnasiumConnection: false,
    image:
      'https://upload.wikimedia.org/wikipedia/ka/8/86/Veriko_Anjaparidze_1.jpg',
    quote: 'Art requires sacrifice.',
  },
  {
    id: 'kakabadze',
    name: 'Davit Kakabadze',
    role: 'Avant-Garde Artist',
    years: '1889–1952',
    bio: 'A painter, graphic artist, and scientist born near Kutaisi. He studied at the Kutaisi Gymnasium. He combined Georgian folk motifs with Cubism and abstract art.',
    gymnasiumConnection: true,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/e/e9/David_Kakabadze.jpg',
  },
  {
    id: 'rezo',
    name: 'Revaz Gabriadze',
    role: 'Puppeteer & Director',
    years: '1936–2021',
    bio: 'Born in Kutaisi, he was a screenwriter for iconic Soviet films like "Mimino" and "Kin-dza-dza!". He created the famous Puppet Theatre in Tbilisi, but his roots are here.',
    gymnasiumConnection: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/e/e1/Rezo_Gabriadze.jpg',
    quote: 'Life is a tear and a smile.',
  },
  {
    id: 'takaishvili',
    name: 'Ekvtime Takaishvili',
    role: 'Man of God',
    years: '1863–1953',
    bio: 'Historian and archeologist who saved the Georgian National Treasury during the Soviet invasion by taking it to France and guarding it for 24 years. Studied at Kutaisi Gymnasium.',
    gymnasiumConnection: true,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/e/ec/Ekvtime_Takaishvili.jpg',
  },
  {
    id: 'galaktion',
    name: 'Galaktion Tabidze',
    role: 'King of Poets',
    years: '1891–1959',
    bio: "The most famous Georgian poet of the 20th century. He attended the Kutaisi Seminary. His verses captured the soul of Kutaisi's rain, wind, and melancholy.",
    gymnasiumConnection: true,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/e/e4/Galaktion_Tabidze.jpg',
    quote: 'Without you, I am the wind in the field.',
  },
  {
    id: 'otskheli',
    name: 'Petre Otskheli',
    role: 'Visual Genius',
    years: '1907–1937',
    bio: 'Born in Kutaisi, he became a legendary modernist set designer. His constructivist art style is iconic worldwide. He was a victim of the 1937 repressions.',
    gymnasiumConnection: false,
    image: 'https://upload.wikimedia.org/wikipedia/ka/6/6e/Petre_Otskheli.jpg',
  },
  {
    id: 'paliashvili',
    name: 'Zakaria Paliashvili',
    role: 'Composer',
    years: '1871–1933',
    bio: 'Born in Kutaisi to a Catholic family, he created the Georgian National Style of classical music. He composed the National Anthem "Tavisupleba".',
    gymnasiumConnection: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/e/e5/Zakaria_Paliashvili.jpg',
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
    title: 'Secret: The River Dragon',
    businessName: 'Lost Legend',
    description:
      'Unlock the ancient myth about the Rioni River beasts that is not in the guidebooks.',
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
      'Reveals the map location of a rumored secret tunnel under the city.',
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
    image:
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
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
    // PRECISE: Main Square center
    position: { lat: 42.2714469795705, lng: 42.705411642452056 },
    description:
      'The city symbol inaugurated in 2011, adorned with gilded sculptures of animals from the Bronze Age (3rd-2nd century BC).',
    riddle:
      'I am a golden army of 30 animals, but I do not bite. I carry the memory of King Aeetes and the Golden Fleece.',
    hints: [
      "Find the 'Tamada' (Toastmaster) statue at the very top.",
      'Look for the large circular fountain in the main square.',
    ],
    facts: [
      '⚠️ Tip: To get closer, you will need to run across the road. Please be careful!',
      'Designed by David Gogichaishvili, features 30 enlarged replicas of ancient Colchian gold.',
      "The 'Tamada' statue on top proves Georgia's wine culture dates back to the 7th century BC.",
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Kutaisi_Colchis_Fountain.jpg/800px-Kutaisi_Colchis_Fountain.jpg',
    reward_icon: '🦁',
    mapLink: 'https://maps.app.goo.gl/LQ9B1KTDJjdasUrcA',
  },
  {
    id: 'meskhishvili_theatre',
    name: 'City Theatre (L. Meskhishvili)',
    category: 'quest',
    position: { lat: 42.27238980437894, lng: 42.70592267924879 },
    description:
      'One of the oldest dramatic theatres in Georgia (1861), featuring Renaissance architecture with columns and arched windows.',
    riddle:
      'I stand on the main square watching the Golden Fountain. My stage has seen drama since 1861.',
    hints: [
      'It is the large building with columns right next to the Colchis Fountain.',
      'The first performance took place in 1861.',
    ],
    facts: [
      'ℹ️ Tip: There is a small park next to the theatre where you can relax and find free Wi-Fi.',
      'Founded in 1861, named after famous actor Lado Meskhishvili.',
      'Designed in the Renaissance style with bas-reliefs.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Kutaisi_Theatre.jpg/800px-Kutaisi_Theatre.jpg',
    reward_icon: '🎭',
    mapLink: 'https://maps.app.goo.gl/...',
  },
  {
    id: 'white_bridge',
    name: 'White Bridge',
    category: 'quest',
    position: { lat: 42.26885100021315, lng: 42.7003048239845 },
    description:
      'A 19th-century symbol of Kutaisi over the Rioni River, now enhanced with transparent glass panels.',
    riddle:
      'I have no walls, but I have windows to the river. A boy sits on my rail with two hats, waiting for Picasso.',
    hints: [
      'Find the bronze statue of a boy holding two hats.',
      'Look for the transparent glass panels on the floor to see the rushing river.',
    ],
    facts: [
      '📸 Photo Tip: Be sure to take a photo with the statue of the boy on the railings.',
      'Recently renovated with transparent glass sections for a thrilling view of the Rioni.',
      'Built in the 19th century and remains a historic symbol of Kutaisi.',
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
      'A vintage aerial tramway connecting the river bank to the amusement park on the hill.',
    riddle:
      'I can fly without wings. Pay me 3 Lari and I will lift you from the White Bridge to the Ferris Wheel.',
    hints: [
      'The lower station is in the park near the White Bridge.',
      'Look for the yellow gondolas crossing the river.',
    ],
    facts: [
      '⌚ Hours: 12:00 PM – 8:00 PM. Price: 3 Lari one way.',
      'Leads to a recreation park with an old Ferris wheel.',
      'From the top, it is a 30-minute walk down Kazbegi Street to Bagrati Cathedral.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Kutaisi_Cable_Car.jpg/800px-Kutaisi_Cable_Car.jpg',
    reward_icon: '🚠',
    mapLink: 'https://maps.app.goo.gl/...',
  },
  {
    id: 'art_gallery',
    name: 'Kakabadze Art Gallery',
    category: 'quest',
    position: { lat: 42.2708157611456, lng: 42.70093795337343 },
    description:
      'A hidden gem in the heart of Kutaisi housing original works by Pirosmani and Kakabadze.',
    riddle:
      'I hold the colors of Georgia. Inside me, Pirosmani paints his animals and Kakabadze paints his motherland.',
    hints: [
      'Located in the city center, often missed by tourists.',
      'Look for the sign of Davit Kakabadze.',
    ],
    facts: [
      '⌚ Hours: Weekdays from 10:00 AM to 5:30 PM.',
      'Houses original paintings by Niko Pirosmani, Varla, and Kakabadze.',
      'A must-see for art lovers to understand the Georgian spirit.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kutaisi_Art_Gallery.jpg/800px-Kutaisi_Art_Gallery.jpg',
    reward_icon: '🎨',
    mapLink: 'https://maps.app.goo.gl/...',
  },
  {
    id: 'bagrati',
    name: 'Bagrati Cathedral',
    category: 'quest',
    // PRECISE: Cathedral center
    position: { lat: 42.2773, lng: 42.7043 },
    description:
      'The symbol of united Georgia (1003 AD). A perfect spot for sunset views.',
    riddle:
      'I was born in 1003 AD and destroyed by gunpowder in 1692. I wear a green dome and watch the city from above.',
    hints: [
      'The cathedral is visible from almost anywhere in the city.',
      'Look for the large cross overlooking the valley.',
    ],
    facts: [
      '⌚ Hours: 10:00 AM – 5:00 PM (Mon Closed). Sunday service: 9:00 AM – 2:00 PM.',
      '🌅 Insider Tip: The view from here is perfect for watching a stunning sunset.',
      'Built in 1003, represents the unity of Georgia.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Bagrati_Cathedral_2.jpg/800px-Bagrati_Cathedral_2.jpg',
    reward_icon: '👑',
    mapLink: 'https://maps.app.goo.gl/bcU47u4oKz9XvfSM9',
  },
  {
    id: 'botanical_garden',
    name: 'Kutaisi Botanical Garden',
    category: 'quest',
    position: { lat: 42.28526523633019, lng: 42.71354600971563 },
    description:
      'A peaceful retreat on the right bank of Rioni, famous for a chapel inside a living tree.',
    riddle:
      'I am a forest in the city. My most famous resident is a 400-year-old oak tree that prays to God.',
    hints: [
      'Find the 400-year-old oak tree with a tiny chapel inside.',
      'It is located on the right bank of the Rioni River.',
    ],
    facts: [
      '⌚ Hours: Daily from 10:00 AM to 6:00 PM.',
      'Highlight: A tiny chapel tucked inside the trunk of a 400-year-old oak tree.',
      'A favorite local escape from the summer heat.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Kutaisi_Botanical_Garden.jpg/800px-Kutaisi_Botanical_Garden.jpg',
    reward_icon: '🌳',
    mapLink: 'https://maps.app.goo.gl/undC2PaSHe471xRb6',
  },
  {
    id: 'history_museum',
    name: 'History Museum',
    category: 'quest',
    position: { lat: 42.2690870113976, lng: 42.70403729364274 },
    description:
      'A treasure chest established in 1912, holding 200,000 artifacts.',
    riddle:
      'I am a house of time. Inside me, you will find the weapons of kings and the bible of queens.',
    hints: [
      'Look for the large historic building on Pushkin Street.',
      'The museum holds a handwritten bible from the 11th century.',
    ],
    facts: [
      'Founded in 1912, holding over 190,000 items.',
      'Houses personal belongings of Georgian public figures and Bronze Age weaponry.',
      'One of the most significant museums in Georgia.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Kutaisi_State_Historical_Museum.jpg/800px-Kutaisi_State_Historical_Museum.jpg',
    reward_icon: '🏺',
    mapLink: 'https://maps.app.goo.gl/hiQqGk8vDYSuA4B27',
  },
  {
    id: 'geguti_palace',
    name: 'Geguti Royal Palace',
    category: 'quest',
    position: { lat: 42.1633, lng: 42.6869 },
    description:
      'The ruins of the medieval royal residence of Queen Tamar, 12km south of Kutaisi.',
    riddle:
      'I am the house of a Queen, located 12km south. My roof is gone, but my walls remember the 12th century.',
    hints: [
      'Located 12km south of Kutaisi.',
      'Look for the large brick ruins in the field.',
    ],
    facts: [
      'Royal residence dating back to the 12th century (Golden Age).',
      'Features remnants of the palace, domes, and ancient stonework.',
      'Some fragments date back even to the 5th century.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Geguti_Palace_ruins.jpg/800px-Geguti_Palace_ruins.jpg',
    reward_icon: '🏰',
    mapLink: 'https://maps.app.goo.gl/...',
  },
  {
    id: 'motsameta',
    name: 'Motsameta Monastery',
    category: 'quest',
    position: { lat: 42.2825, lng: 42.7592 },
    description:
      'The Place of Martyrs (3km from Kutaisi), perched on a cliff above the Red River.',
    riddle:
      'Two brothers lie here who refused to change their faith. Crawl under their bones three times, and your wish will be granted.',
    hints: [
      'There is a small tunnel under the ark where people crawl.',
      'Located just 3km from Kutaisi.',
    ],
    facts: [
      '👗 Tip: Near the entrance, you will find long skirts and headscarves available for use.',
      'Home to relics of saints David and Constantine.',
      "The river below is called Tskaltsitela ('Red Water') from legend.",
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Motsameta_Monastery.jpg/800px-Motsameta_Monastery.jpg',
    reward_icon: '⛪',
    mapLink: 'https://maps.app.goo.gl/QkAFFec4keTyA8r18',
  },
  {
    id: 'gelati',
    name: 'Gelati Monastery',
    category: 'quest',
    position: { lat: 42.2952, lng: 42.7684 },
    description:
      'A UNESCO site (5km from Kutaisi) founded by David the Builder in 1106.',
    riddle:
      'I am the Golden Age of Georgia frozen in stone. A great king walks over my threshold. Look up at the Virgin Mary made of 2.5 million stones.',
    hints: [
      'Find the tombstone of David the Builder at the south gate entrance.',
      'Look for the famous mosaic of the Virgin Mary.',
    ],
    facts: [
      '⌚ Hours: Sat-Thu 9:00 AM – 8:00 PM, Fri 9:00 AM – 7:00 PM.',
      'Founded in 1106 by King David IV, who is buried in the gateway.',
      'Contains the finest frescoes and mosaics in the South Caucasus.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Gelati_monastery_in_Kutaisi.jpg/800px-Gelati_monastery_in_Kutaisi.jpg',
    reward_icon: '📜',
    mapLink: 'https://maps.app.goo.gl/aAJ8JgdjCuxDPyLk9',
  },
  {
    id: 'prometheus_cave',
    name: 'Prometheus Cave',
    category: 'quest',
    position: { lat: 42.3768, lng: 42.601 },
    description: 'A 1.4km underground wonderland discovered in 1984.',
    riddle:
      'I was hidden in darkness until 1984. My rivers flow where the sun never shines, and my stone teeth grow from the ceiling.',
    hints: [
      'You can take a boat ride on the underground river.',
      'The cave temperature is a constant 14 degrees Celsius year-round.',
    ],
    facts: [
      'Discovered in 1984 by local speleologists.',
      'The tourist route is 1,420 meters long, but the total length is over 11 km.',
      'Legend links this area to Prometheus, who was chained to the nearby Khvamli Mountain.',
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
    description: 'A place where dinosaurs walked 120 million years ago.',
    riddle:
      'I am the place of honey. Walk on glass over the abyss and trace the steps of a beast from the Cretaceous period.',
    hints: [
      'Find the preserved footprint rock shelter.',
      "The name 'Sataplia' comes from 'Tapli' (Honey), as wild bees used to live here.",
    ],
    facts: [
      'Preserves over 200 dinosaur footprints from the Cretaceous period (120 million years ago).',
      'Features a transparent glass observation deck overlooking Kutaisi.',
      'Discovered in 1925 by Petre Chabukiani, a local teacher.',
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
    description: 'A modern gateway designed by UN Studio.',
    riddle: 'I am the red and white bridge to the sky. I never sleep.',
    hints: [
      'Notice the control tower design, inspired by a beacon.',
      'It is located 14km west of Kutaisi.',
    ],
    facts: [
      'Opened in 2012, designed by the famous Dutch architecture firm UN Studio.',
      'It is the first low-cost airline hub in the region.',
      'The control tower is 55 meters high.',
    ],
    isUnlocked: false,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Kutaisi_Airport_Terminal.jpg/1280px-Kutaisi_Airport_Terminal.jpg',
    reward_icon: '✈️',
    mapLink: 'https://maps.app.goo.gl/3Jg5jX8s8x8x8x8x',
  },

  {
    id: 'palaty',
    name: 'Palaty',
    category: 'dining',
    position: { lat: 42.269134571136476, lng: 42.70212192583241 },
    description: 'Everything is tasty 😍. Walk takes 4 minutes.',
    hints: [],
    facts: [
      'Famous for Khachapuri and cozy atmosphere.',
      'Live music in evenings.',
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
    description: 'Cozy vintage atmosphere near the White Bridge.',
    hints: [],
    facts: [
      'Great for wine and local desserts.',
      'Interior feels like an old Georgian home.',
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
    description: 'Good atmosphere, tasty wine 🍷, pizza 🍕. 6 minute walk.',
    hints: [],
    facts: ['Live music in the evenings.'],
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
    description:
      'If you love beer 🍻. National Georgian food well done. 11 min walk.',
    hints: [],
    facts: [
      'Combines German beer culture with Georgian cuisine.',
      'Try the Khinkali here.',
    ],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80',
    reward_icon: '🍻',
    mapLink: 'https://maps.app.goo.gl/NUwHFunqa243N8qp6?g_st=ic',
  },
  {
    id: 'weihenstephan',
    name: 'Weihenstephan / Beer Museum',
    category: 'dining',
    position: { lat: 42.26972981215626, lng: 42.69843111049078 },
    description: 'Beer Museum Kutaisi.',
    hints: [],
    facts: ['A spot for true beer lovers.', 'Authentic German brews.'],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?auto=format&fit=crop&w=800&q=80',
    reward_icon: '🍺',
    mapLink: 'https://maps.app.goo.gl/tD1SqTcUdi1y8JJx6?g_st=ic',
  },
  {
    id: 'gallery_terrace',
    name: 'Gallery Terrace',
    category: 'dining',
    position: { lat: 42.27089490550877, lng: 42.701525310490965 },
    description:
      'Beautiful view on Bagrati Cathedral, romantic 💕. 5 min walk.',
    hints: [],
    facts: ['Best sunset view in the city.', 'Located very close to Bagrati.'],
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
      'Want some coffee or tea while walking in the centre? ☕️ 2 min walk.',
    hints: [],
    facts: ['Great coffee to go.', 'Right in the city center.'],
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
    description: 'Good desserts 💕 and tea. 4 min walk.',
    hints: [],
    facts: ['Famous for its artistic interior.', 'Try the waffles.'],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    reward_icon: '🍰',
    mapLink: 'https://maps.app.goo.gl/WuK9yJ7MmTYevixi7?g_st=ic',
  },
  {
    id: 'cafe_argo',
    name: 'Cafe Argo',
    category: 'dining',
    position: { lat: 42.2703154061211, lng: 42.700049495149244 },
    description: 'On the banks of the Rioni River 🌉, tasty. 7 min walk.',
    hints: [],
    facts: ['Riverside dining.', 'Relaxing sound of the water.'],
    isUnlocked: true,
    image:
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    reward_icon: '🌉',
    mapLink: 'https://maps.app.goo.gl/qVoF1WJ3n1DvFunr6?g_st=ic',
  },
  {
    id: 'baraka',
    name: 'Baraka',
    category: 'dining',
    position: { lat: 42.2707551619069, lng: 42.70590196816159 },
    description: 'Delicious Georgian cuisine. 4 min walk.',
    hints: [],
    facts: ['Large portions.', 'Very popular with locals.'],
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
