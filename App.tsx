import React, { useState, useEffect, useRef, Suspense } from 'react';
import {
  AppView,
  UserState,
  Landmark,
  QuestResponse,
  Coordinates,
  Coupon,
  ReviewData,
} from './types';
import { INITIAL_LANDMARKS, MAP_CENTER, MOCK_LEADERBOARD } from './constants';
import { generatePhraseAudio } from './services/geminiService';
import QuestMap from './components/QuestMap';
import ResultModal from './components/ResultModal';
import FeedbackModal from './components/FeedbackModal';
import LoginScreen from './components/LoginScreen';
import ConciergeFab from './components/ConciergeFab';
import ShareModal from './components/ShareModal';
import WelcomeModal from './components/WelcomeModal';
import DriverCard from './components/DriverCard';
import HintModal from './components/HintModal';
import Shop from './components/Shop';
import AdminDashboard from './components/AdminDashboard';
import ItineraryPlanner from './components/ItineraryPlanner';
import SupportModal from './components/SupportModal';
import { calculateDistance } from './utils';
import { db } from './firebaseConfig';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

const Scanner = React.lazy(() => import('./components/Scanner'));
const Leaderboard = React.lazy(() => import('./components/Leaderboard'));
const DigitalPassport = React.lazy(
  () => import('./components/DigitalPassport')
);
const RecipeBook = React.lazy(() => import('./components/RecipeBook'));
const HallOfFame = React.lazy(() => import('./components/HallOfFame'));
const SouvenirBoard = React.lazy(() => import('./components/SouvenirBoard'));
const Phrasebook = React.lazy(() => import('./components/Phrasebook'));

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [view, setView] = useState<AppView>(AppView.MAP);
  const [profileTab, setProfileTab] = useState<
    'journal' | 'passport' | 'photos' | 'kitchen' | 'legends'
  >('journal');

  const [userState, setUserState] = useState<UserState>({
    points: 0,
    level: 1,
    unlockedIds: [],
    inventory: [],
    redeemedCoupons: [],
    unlockedHints: [],
    useOfflineVoice: false,
    isAdmin: false,
  });

  const [landmarks, setLandmarks] = useState<Landmark[]>(INITIAL_LANDMARKS);
  const [lastResult, setLastResult] = useState<QuestResponse | null>(null);
  const [latestPhoto, setLatestPhoto] = useState<string | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<Coordinates>(MAP_CENTER);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(0);
  const [heading, setHeading] = useState<number | null>(null);
  const [feedbackMode, setFeedbackMode] = useState<'bug' | 'review' | null>(
    null
  );
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [smartTip, setSmartTip] = useState<{
    icon: string;
    text: string;
  } | null>(null);
  const [lootBoxMessage, setLootBoxMessage] = useState<string | null>(null);
  const [isOpeningBox, setIsOpeningBox] = useState(false);
  const [activeDriverCardLandmark, setActiveDriverCardLandmark] =
    useState<Landmark | null>(null);
  const [activeHintLandmark, setActiveHintLandmark] = useState<Landmark | null>(
    null
  );
  const [showPlanner, setShowPlanner] = useState(false);
  const [mapActiveId, setMapActiveId] = useState<string | null>(null);

  const lastLocationUpdate = useRef<number>(0);
  const isDataLoaded = useRef(false);

  const MAX_POINTS = landmarks.length * 100 + 300;
  const progressPercent = Math.min(100, (userState.points / MAX_POINTS) * 100);

  // --- FIREBASE SYNC ---
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data() as UserState;
          setUserState({
            points: data.points || 0,
            level: data.level || 1,
            unlockedIds: data.unlockedIds || [],
            inventory: data.inventory || [],
            redeemedCoupons: data.redeemedCoupons || [],
            unlockedHints: data.unlockedHints || [],
            useOfflineVoice: data.useOfflineVoice || false,
            isAdmin: data.isAdmin || false,
          });
          if (data.unlockedIds && data.unlockedIds.length > 0) {
            setLandmarks((prev) =>
              prev.map((l) => ({
                ...l,
                isUnlocked: data.unlockedIds.includes(l.id) || l.isUnlocked,
              }))
            );
          }
        } else {
          const initialData = {
            points: 100,
            level: 1,
            unlockedIds: [],
            inventory: [],
            redeemedCoupons: [],
            unlockedHints: [],
            displayName: user.displayName || 'Anonymous',
            photoURL: user.photoURL || '',
            createdAt: serverTimestamp(),
            isAdmin: false,
          };
          await setDoc(userRef, initialData);
          setUserState(initialData as any);
          setShowWelcome(true);
        }
        isDataLoaded.current = true;
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, [user]);

  useEffect(() => {
    if (!user || !isDataLoaded.current) return;
    const saveData = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          points: userState.points,
          level: userState.level,
          unlockedIds: userState.unlockedIds,
          inventory: userState.inventory,
          redeemedCoupons: userState.redeemedCoupons,
          unlockedHints: userState.unlockedHints,
          isAdmin: userState.isAdmin,
          lastActive: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    };
    const timer = setTimeout(saveData, 2000);
    return () => clearTimeout(timer);
  }, [userState, user]);

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
  };

  // --- LOCATION & SENSORS ---
  useEffect(() => {
    if (!user) return;
    // Smart tip logic omitted
  }, [user]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const compass =
        (event as any).webkitCompassHeading ||
        Math.abs((event.alpha || 0) - 360);
      if (compass) setHeading(compass);
    };
    if (window.DeviceOrientationEvent)
      window.addEventListener('deviceorientation', handleOrientation);
    return () =>
      window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  useEffect(() => {
    if (isDevMode) return;
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (!isDevMode) {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setGpsAccuracy(position.coords.accuracy);
            if (position.coords.heading) setHeading(position.coords.heading);
          }
        },
        (error) => console.warn('Geolocation error:', error.message),
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isDevMode]);

  // --- GAME LOGIC ---
  const handleAnalysisComplete = (
    result: QuestResponse,
    imageBase64?: string
  ) => {
    let finalResult = { ...result };
    if (result.location_confirmed) {
      const matchedLandmark = landmarks.find(
        (l) =>
          result.place_name.toLowerCase().includes(l.name.toLowerCase()) ||
          l.name.toLowerCase().includes(result.place_name.toLowerCase())
      );
      if (matchedLandmark) {
        finalResult.reward_icon = matchedLandmark.reward_icon;
        finalResult.image = matchedLandmark.image; // Attach image for modal

        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          matchedLandmark.position.lat,
          matchedLandmark.position.lng
        );
        const MAX_DISTANCE_METERS = 800;
        if (distance > MAX_DISTANCE_METERS) {
          finalResult = {
            ...finalResult,
            location_confirmed: false,
            place_name: 'Too Far Away!',
            story: `You found ${matchedLandmark.name}, but you are ${distance}m away. Get closer!`,
            points_earned: 0,
            next_quest_hint: 'Move towards the location on the map.',
          };
        } else {
          if (imageBase64) setLatestPhoto(imageBase64);
          if (!matchedLandmark.isUnlocked) {
            setLandmarks((prev) =>
              prev.map((l) =>
                l.id === matchedLandmark.id
                  ? { ...l, isUnlocked: true, userPhoto: imageBase64 }
                  : l
              )
            );
            setUserState((prev) => {
              const newPoints = prev.points + result.points_earned;
              return {
                ...prev,
                points: newPoints,
                level: Math.floor(newPoints / 100) + 1,
                inventory: prev.inventory.includes(matchedLandmark.reward_icon)
                  ? prev.inventory
                  : [...prev.inventory, matchedLandmark.reward_icon],
                unlockedIds: prev.unlockedIds.includes(matchedLandmark.id)
                  ? prev.unlockedIds
                  : [...prev.unlockedIds, matchedLandmark.id],
              };
            });
          } else {
            if (imageBase64)
              setLandmarks((prev) =>
                prev.map((l) =>
                  l.id === matchedLandmark.id
                    ? { ...l, userPhoto: imageBase64 }
                    : l
                )
              );
          }
        }
      }
    }
    setLastResult(finalResult);
  };

  const closeResult = () => {
    setLastResult(null);
    setView(AppView.MAP);
  };

  const teleportTo = (lat: number, lng: number) => {
    setIsDevMode(true);
    setUserLocation({ lat, lng });
  };

  const handleManualCheckIn = (landmarkId: string) => {
    const landmark = landmarks.find((l) => l.id === landmarkId);
    if (!landmark) return;

    // For manual checks, we trigger the analysis logic with a synthetic result
    handleAnalysisComplete({
      location_confirmed: true,
      place_name: landmark.name,
      story: `${landmark.description} ${landmark.facts[0] || ''}`,
      points_earned: 50,
      next_quest_hint: 'Check your map for the next location!',
      reward_icon: landmark.reward_icon,
    });
  };

  const purchaseCoupon = (coupon: Coupon) => {
    if (
      userState.points >= coupon.cost &&
      !userState.redeemedCoupons.includes(coupon.id)
    ) {
      setUserState((prev) => ({
        ...prev,
        points: prev.points - coupon.cost,
        redeemedCoupons: [...prev.redeemedCoupons, coupon.id],
      }));
    }
  };

  const openMysteryBox = () => {
    const COST = 100;
    if (userState.points < COST) return;
    setIsOpeningBox(true);
    setUserState((prev) => ({ ...prev, points: prev.points - COST }));
    setTimeout(() => {
      const roll = Math.random();
      let prizePoints =
        roll > 0.9 ? 500 : roll > 0.6 ? 150 : roll > 0.3 ? 50 : 0;
      if (prizePoints > 0)
        setUserState((prev) => ({
          ...prev,
          points: prev.points + prizePoints,
        }));
      setLootBoxMessage(
        prizePoints > 0 ? `Won +${prizePoints} pts!` : 'Empty box 🕸️'
      );
      setIsOpeningBox(false);
      setTimeout(() => setLootBoxMessage(null), 3000);
    }, 1500);
  };

  const handleUnlockHint = (landmarkId: string, cost: number) => {
    if (
      userState.points >= cost &&
      !userState.unlockedHints.includes(landmarkId)
    ) {
      setUserState((prev) => ({
        ...prev,
        points: prev.points - cost,
        unlockedHints: [...prev.unlockedHints, landmarkId],
      }));
      const landmark = landmarks.find((l) => l.id === landmarkId);
      if (landmark) setActiveHintLandmark(landmark);
    } else if (userState.points < cost) {
      alert(`You need ${cost} points! Keep exploring.`);
    }
  };

  const handleRedeemCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'KUTAISI') {
      const hotel = landmarks.find((l) => l.id === 'host_hotel');
      if (hotel && !hotel.isUnlocked) {
        setLandmarks((prev) =>
          prev.map((l) =>
            l.id === 'host_hotel' ? { ...l, isUnlocked: true } : l
          )
        );
        setUserState((prev) => ({
          ...prev,
          points: prev.points + 300,
          unlockedIds: [...prev.unlockedIds, 'host_hotel'],
        }));
        setPromoMessage('Hotel Unlocked! +300 Pts');
      }
    } else if (code === 'OWNER') {
      setUserState((prev) => ({ ...prev, isAdmin: true }));
      setPromoMessage('Admin Mode');
    } else {
      setPromoMessage('Invalid');
    }
    setPromoCode('');
    setTimeout(() => setPromoMessage(null), 3000);
  };

  const handleFeedbackSubmit = async (data: string | ReviewData) => {
    if (typeof data === 'string') {
      await addDoc(collection(db, 'bugs'), {
        userId: user?.uid,
        description: data,
        timestamp: serverTimestamp(),
        status: 'open',
      });
    } else {
      await addDoc(collection(db, 'reviews'), {
        ...data,
        userId: user?.uid,
        userName: user?.displayName,
        timestamp: serverTimestamp(),
      });
    }
    alert('Sent!');
  };

  const handlePlannerNavigate = (landmarkId: string) => {
    setShowPlanner(false);
    setMapActiveId(landmarkId);
  };

  if (!user) return <LoginScreen onLoginSuccess={handleLoginSuccess} />;

  const renderNavItem = (
    viewName: AppView,
    icon: React.ReactNode,
    label: string
  ) => {
    const isActive = view === viewName;
    return (
      <button
        onClick={() => setView(viewName)}
        className='group flex-1 flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform duration-200'
      >
        <div
          className={`relative p-2.5 rounded-2xl transition-all duration-300 ${
            isActive
              ? 'bg-slate-900 text-white shadow-lg'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          {icon}
          {viewName === AppView.PROFILE &&
            userState.inventory.length > 0 &&
            view !== AppView.PROFILE && (
              <span className='absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse'></span>
            )}
        </div>
        <span
          className={`text-[10px] font-bold ${
            isActive
              ? 'text-slate-900'
              : 'text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity'
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  // --- SVG CIRCLE MATH ---
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (progressPercent / 100) * circumference;

  return (
    <div className='fixed inset-0 flex flex-col overflow-hidden bg-white'>
      {showWelcome && (
        <WelcomeModal
          userName={user.displayName?.split(' ')[0] || 'Explorer'}
          onClose={() => setShowWelcome(false)}
        />
      )}

      {/* --- UNIFIED PLAYER HUD --- */}
      {view === AppView.MAP && (
        <header className='absolute top-0 left-0 right-0 z-30 p-4 pointer-events-none pt-safe'>
          <div
            onClick={() => setShowDebug(!showDebug)}
            className='pointer-events-auto mx-auto w-full max-w-[340px] bg-white/95 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-2xl flex items-center justify-between p-2 pl-3 hover:scale-[1.02] transition-transform active:scale-95 duration-200'
          >
            {/* LEFT: LEVEL & AVATAR */}
            <div className='flex items-center gap-3'>
              <div className='relative w-14 h-14 flex items-center justify-center'>
                {/* Progress Circle */}
                <svg
                  className='absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-md'
                  viewBox='0 0 52 52'
                >
                  <circle
                    cx='26'
                    cy='26'
                    r={radius}
                    stroke='#e2e8f0'
                    strokeWidth='4'
                    fill='none'
                  />
                  <circle
                    cx='26'
                    cy='26'
                    r={radius}
                    stroke='#10b981'
                    strokeWidth='4'
                    fill='none'
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap='round'
                    className='transition-all duration-1000 ease-out'
                  />
                </svg>
                {/* Avatar */}
                <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-white z-10 bg-slate-200 shadow-sm'>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <span className='flex items-center justify-center h-full text-sm'>
                      👤
                    </span>
                  )}
                </div>
                {/* Level Pill */}
                <div className='absolute -bottom-1 bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white z-20 shadow-md'>
                  LVL {userState.level}
                </div>
              </div>

              <div className='flex flex-col'>
                <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5'>
                  Explorer
                </span>
                <span className='text-sm font-black text-slate-800 leading-none truncate max-w-[80px]'>
                  {user.displayName?.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* VERTICAL DIVIDER */}
            <div className='w-px h-8 bg-slate-200 mx-2'></div>

            {/* RIGHT: COINS (Clickable to Shop) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                setView(AppView.SHOP);
              }}
              className='flex items-center gap-2 pr-2 cursor-pointer group'
            >
              <div className='flex flex-col items-end'>
                <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5'>
                  Balance
                </span>
                <span className='text-lg font-black text-amber-500 leading-none drop-shadow-sm'>
                  {userState.points}
                </span>
              </div>
              <div className='w-10 h-10 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-200 group-hover:rotate-12 transition-transform'>
                <span className='text-xl drop-shadow-sm'>🪙</span>
              </div>
            </div>
          </div>
        </header>
      )}

      {showDebug && (
        <div className='absolute top-28 left-4 z-50 bg-slate-900/95 text-white p-4 rounded-2xl backdrop-blur-xl w-64 border border-white/10 animate-fadeIn shadow-2xl'>
          <button
            onClick={() => {
              setIsDevMode(false);
            }}
            className='block w-full text-left p-2 border-b border-white/10'
          >
            Use Real GPS
          </button>
          <button
            onClick={() => teleportTo(42.2773, 42.7043)}
            className='block w-full text-left p-2'
          >
            Teleport Bagrati
          </button>
        </div>
      )}

      <main className='flex-1 relative overflow-hidden bg-white z-0'>
        <Suspense
          fallback={
            <div className='absolute inset-0 flex items-center justify-center bg-white'>
              <div className='animate-spin text-4xl text-emerald-500'>🧭</div>
            </div>
          }
        >
          {view === AppView.MAP && (
            <>
              <QuestMap
                landmarks={landmarks}
                userLocation={userLocation}
                accuracy={gpsAccuracy}
                heading={heading}
                onCheckIn={handleManualCheckIn}
                unlockedHints={userState.unlockedHints}
                onUnlockHint={handleUnlockHint}
                onOpenHint={setActiveHintLandmark}
                userPoints={userState.points}
                onShowDriver={(l) => setActiveDriverCardLandmark(l)}
                activeLandmarkId={mapActiveId}
              />
              <ConciergeFab onOpenPlanner={() => setShowPlanner(true)} />
            </>
          )}

          {view === AppView.CAMERA && (
            <Scanner
              onAnalyzeComplete={handleAnalysisComplete}
              onClose={() => setView(AppView.MAP)}
              userLocation={userLocation}
            />
          )}

          {view === AppView.LEADERBOARD && (
            <Leaderboard
              users={MOCK_LEADERBOARD}
              currentUserPoints={userState.points}
              currentUserAvatar={user.photoURL}
            />
          )}

          {view === AppView.ADMIN && (
            <AdminDashboard onClose={() => setView(AppView.PROFILE)} />
          )}

          {view === AppView.PROFILE && (
            <div className='h-full bg-white flex flex-col pt-safe'>
              <div className='pt-6 pb-4 px-6 bg-white border-b border-slate-100 z-10'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-2xl font-black text-slate-900'>
                    Explorer Profile
                  </h2>
                  <div className='flex gap-2'>
                    {/* NEW DONATE BUTTON */}
                    <button
                      onClick={() => setShowSupportModal(true)}
                      className='bg-amber-400 text-amber-900 px-3 py-2 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse hover:bg-amber-500 hover:text-white transition-colors'
                    >
                      ☕ Support
                    </button>

                    {userState.isAdmin && (
                      <button
                        onClick={() => setView(AppView.ADMIN)}
                        className='bg-slate-900 text-white px-3 py-2 rounded-full text-xs font-bold flex items-center gap-2'
                      >
                        🛠️
                      </button>
                    )}
                    <button
                      onClick={() => setFeedbackMode('bug')}
                      className='w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all'
                    >
                      🐞
                    </button>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className='bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 active:scale-95 transition-transform'
                    >
                      Share
                    </button>
                  </div>
                </div>

                <div className='flex p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar'>
                  <button
                    onClick={() => setProfileTab('journal')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap ${
                      profileTab === 'journal'
                        ? 'bg-white text-slate-900 shadow-lg'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Quest Log
                  </button>
                  <button
                    onClick={() => setProfileTab('passport')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap ${
                      profileTab === 'passport'
                        ? 'bg-white text-slate-900 shadow-lg'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Passport
                  </button>
                  <button
                    onClick={() => setProfileTab('photos')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap ${
                      profileTab === 'photos'
                        ? 'bg-white text-slate-900 shadow-lg'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Photos
                  </button>
                  <button
                    onClick={() => setProfileTab('kitchen')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap ${
                      profileTab === 'kitchen'
                        ? 'bg-white text-slate-900 shadow-lg'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Kitchen
                  </button>
                  <button
                    onClick={() => setProfileTab('legends')}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap ${
                      profileTab === 'legends'
                        ? 'bg-white text-slate-900 shadow-lg'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Legends
                  </button>
                </div>
              </div>

              <div className='flex-1 overflow-y-auto px-6 py-6 pb-32 no-scrollbar'>
                {/* Profile content stays same */}
                {profileTab === 'journal' && (
                  <div className='space-y-6'>
                    {/* Collection Summary */}
                    <div className='bg-emerald-600 rounded-3xl p-6 text-white shadow-2xl'>
                      <h3 className='text-lg font-bold mb-1'>
                        Your Collection
                      </h3>
                      <p className='text-emerald-200 text-xs mb-4'>
                        Track your riddles and hints
                      </p>
                      <div className='flex gap-4'>
                        <div>
                          <span className='block text-2xl font-black'>
                            {userState.unlockedHints.length}
                          </span>
                          <span className='text-[10px] opacity-60'>Hints</span>
                        </div>
                        <div>
                          <span className='block text-2xl font-black'>
                            {landmarks.filter((l) => l.isUnlocked).length}
                          </span>
                          <span className='text-[10px] opacity-60'>Found</span>
                        </div>
                      </div>
                    </div>
                    {/* List */}
                    <div className='space-y-4'>
                      {landmarks
                        .filter((l) => l.category === 'quest')
                        .map((quest) => (
                          <div
                            key={quest.id}
                            className={`relative bg-white rounded-3xl p-4 shadow-lg ${
                              quest.isUnlocked
                                ? 'border border-emerald-200 bg-emerald-50/30'
                                : 'border border-slate-100'
                            }`}
                          >
                            <div className='flex items-start gap-4'>
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg ${
                                  quest.isUnlocked
                                    ? 'bg-emerald-50 text-white'
                                    : 'bg-slate-100 text-slate-400'
                                }`}
                              >
                                {quest.isUnlocked ? quest.reward_icon : '?'}
                              </div>
                              <div className='flex-1'>
                                <div className='flex justify-between items-start mb-1'>
                                  <h4
                                    className={`font-bold text-sm ${
                                      quest.isUnlocked
                                        ? 'text-emerald-900'
                                        : 'text-slate-800'
                                    }`}
                                  >
                                    {quest.name}
                                  </h4>
                                  {quest.isUnlocked && (
                                    <span className='text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full'>
                                      Found
                                    </span>
                                  )}
                                </div>
                                <div className='bg-amber-50/50 p-3 rounded-2xl border border-amber-100 mb-2'>
                                  <p className='text-xs text-amber-900 italic font-medium'>
                                    "{quest.riddle}"
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {profileTab === 'passport' && (
                  <DigitalPassport landmarks={landmarks} />
                )}
                {profileTab === 'photos' && (
                  <SouvenirBoard
                    landmarks={landmarks}
                    unlockedIds={userState.unlockedIds}
                  />
                )}
                {profileTab === 'kitchen' && (
                  <RecipeBook
                    userState={userState}
                    unlockedCount={
                      landmarks.filter(
                        (l) => l.isUnlocked && l.category === 'quest'
                      ).length
                    }
                  />
                )}
                {profileTab === 'legends' && <HallOfFame />}

                <div className='mt-8 pt-8 border-t border-slate-200 space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <button
                      onClick={() => setFeedbackMode('review')}
                      className='p-4 bg-white rounded-2xl border border-slate-100 shadow-lg flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all'
                    >
                      <span className='text-2xl'>✍️</span>
                      <span className='text-xs font-bold text-slate-700'>
                        Review
                      </span>
                    </button>
                    <button
                      onClick={() => setUser(null)}
                      className='p-4 bg-white rounded-2xl border border-slate-100 shadow-lg flex flex-col items-center justify-center gap-2 hover:bg-red-50 hover:border-red-100 transition-all group'
                    >
                      <span className='text-2xl group-hover:scale-110'>🚪</span>
                      <span className='text-xs font-bold text-slate-700 group-hover:text-red-600'>
                        Log Out
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === AppView.SHOP && (
            <Shop
              userState={userState}
              onPurchase={purchaseCoupon}
              onOpenMysteryBox={openMysteryBox}
              isOpeningBox={isOpeningBox}
              lootBoxMessage={lootBoxMessage}
            />
          )}
        </Suspense>
      </main>

      {showPlanner && (
        <ItineraryPlanner
          onClose={() => setShowPlanner(false)}
          userLocation={userLocation}
          landmarks={landmarks}
          onNavigateToLandmark={handlePlannerNavigate}
        />
      )}

      {showSupportModal && (
        <SupportModal onClose={() => setShowSupportModal(false)} />
      )}

      <nav className='absolute bottom-8 left-0 right-0 z-30 pointer-events-none flex justify-center pb-safe'>
        <div className='pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2.5rem] flex items-center justify-between px-3 py-2 gap-1 w-auto min-w-[320px] max-w-sm relative'>
          {renderNavItem(
            AppView.MAP,
            <svg
              className='w-6 h-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
              />
            </svg>,
            'Map'
          )}
          {renderNavItem(
            AppView.LEADERBOARD,
            <svg
              className='w-6 h-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
              />
            </svg>,
            'Rank'
          )}

          <div className='mx-2 -mt-12 group'>
            <button
              onClick={() => setView(AppView.CAMERA)}
              className='w-16 h-16 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center justify-center transform transition-all duration-300 active:scale-90 border-4 border-white relative z-10'
            >
              <svg
                className='w-6 h-6 text-white'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            </button>
          </div>

          {renderNavItem(
            AppView.SHOP,
            <svg
              className='w-6 h-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
              />
            </svg>,
            'Shop'
          )}
          {renderNavItem(
            AppView.PROFILE,
            <svg
              className='w-6 h-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
              />
            </svg>,
            'Profile'
          )}
        </div>
      </nav>

      {lastResult && <ResultModal result={lastResult} onClose={closeResult} />}
      {feedbackMode && (
        <FeedbackModal
          type={feedbackMode}
          onClose={() => setFeedbackMode(null)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
      {showShareModal && (
        <ShareModal
          userState={userState}
          onClose={() => setShowShareModal(false)}
          userName={user.displayName?.split(' ')[0] || 'Traveler'}
          customImage={latestPhoto}
        />
      )}
      {activeDriverCardLandmark && (
        <DriverCard
          landmark={activeDriverCardLandmark}
          onClose={() => setActiveDriverCardLandmark(null)}
        />
      )}
      {activeHintLandmark && (
        <HintModal
          landmark={activeHintLandmark}
          onClose={() => setActiveHintLandmark(null)}
        />
      )}
    </div>
  );
};

export default App;
