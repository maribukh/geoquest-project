export interface QuestResponse {
  location_confirmed: boolean;
  place_name: string;
  story: string;
  points_earned: number;
  next_quest_hint: string;
  reward_icon?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export type LandmarkCategory = 'quest' | 'dining' | 'hotel';

export interface Landmark {
  id: string;
  name: string;
  category: LandmarkCategory;
  position: Coordinates;
  description: string;
  riddle?: string;
  hints: string[]; // List of purchasable hints
  facts: string[];
  isUnlocked: boolean;
  image: string;
  userPhoto?: string; // NEW: Stores the photo taken by the user
  reward_icon: string;
  instagram?: string;
  mapLink?: string;
  airbnbLink?: string;
  secret_info?: {
    // NEW: For Hotel guests only
    wifi?: string;
    breakfast?: string;
    taxi?: string;
  };
}

export interface Coupon {
  id: string;
  title: string;
  businessName: string;
  description: string;
  cost: number;
  icon: string;
  color: string;
}

export interface Legend {
  id: string;
  name: string;
  role: string;
  years: string;
  bio: string;
  image: string;
  gymnasiumConnection: boolean; // Did they study at the First Gymnasium?
  quote?: string;
  link?: string; // External link (e.g. online museum)
}

export enum AppView {
  MAP = 'MAP',
  CAMERA = 'CAMERA',
  PROFILE = 'PROFILE',
  SHOP = 'SHOP',
  LEADERBOARD = 'LEADERBOARD',
}

export interface UserState {
  points: number;
  level: number;
  unlockedIds: string[];
  inventory: string[];
  redeemedCoupons: string[]; // List of Coupon IDs
  unlockedHints: string[]; // List of Landmark IDs where hint was bought
  useOfflineVoice: boolean; // NEW: Preference for unlimited offline voice
}

export interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  avatar: string;
  isCurrentUser?: boolean;
  flag?: string; // Country flag emoji
  title?: string; // e.g. "Wine Lover"
  badgeIcon?: string; // e.g. "🍷"
}

export interface ReviewData {
  rating: number;
  comment: string;
  isPublic: boolean;
  date: string;
  timestamp?: any;
  userName?: string;
  avatar?: string;
  userId?: string;
  emotion?: string; // NEW: Emotion label (e.g., "Amazing")
  photos?: string[]; // NEW: Array of base64 image strings
}
