
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { AppView, UserState, Landmark, QuestResponse, Coordinates, Coupon, ReviewData } from './types';
import { INITIAL_LANDMARKS, MAP_CENTER, REWARDS, MOCK_LEADERBOARD, GEORGIAN_PHRASES } from './constants';
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
import { calculateDistance } from './utils';
import { db } from './firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Scanner = React.lazy(() => import('./components/Scanner'));
const Leaderboard = React.lazy(() => import('./components/Leaderboard'));
const DigitalPassport = React.lazy(() => import('./components/DigitalPassport'));
const RecipeBook = React.lazy(() => import('./components/RecipeBook'));
const HallOfFame = React.lazy(() => import('./components/HallOfFame')); 

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<any>(null); // Firebase User
  const [showWelcome, setShowWelcome] = useState(false); // Welcome Modal State

  const [view, setView] = useState<AppView>(AppView.MAP);
  
  // Updated Profile Tab State
  const [profileTab, setProfileTab] = useState<'journal' | 'passport' | 'memories' | 'legends'>('journal');

  const [userState, setUserState] = useState<UserState>({
    points: 100, // Start with some points
    level: 1,
    unlockedIds: [],
    inventory: [],
    redeemedCoupons: [],
    unlockedHints: [] 
  });
  const [landmarks, setLandmarks] = useState<Landmark[]>(INITIAL_LANDMARKS);
  const [lastResult, setLastResult] = useState<QuestResponse | null>(null);
  const [latestPhoto, setLatestPhoto] = useState<string | undefined>(undefined);
  
  // Real User Location tracking
  const [userLocation, setUserLocation] = useState<Coordinates>(MAP_CENTER);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(0);
  const [heading, setHeading] = useState<number | null>(null);
  
  // Feedback & Share State
  const [feedbackMode, setFeedbackMode] = useState<'bug' | 'review' | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // DEV MODE STATE
  const [showDebug, setShowDebug] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  
  // PROMO CODE STATE
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Smart Tip State
  const [smartTip, setSmartTip] = useState<{icon: string, text: string} | null>(null);
  // Loot Box State
  const [lootBoxMessage, setLootBoxMessage] = useState<string | null>(null);
  const [isOpeningBox, setIsOpeningBox] = useState(false);

  // Audio State for phrases
  const [playingPhrase, setPlayingPhrase] = useState<string | null>(null);

  // Modal States
  const [activeDriverCardLandmark, setActiveDriverCardLandmark] = useState<Landmark | null>(null);
  const [activeHintLandmark, setActiveHintLandmark] = useState<Landmark | null>(null); // NEW

  // Throttling refs
  const lastLocationUpdate = useRef<number>(0);

  // Calculate Max Possible Points roughly
  const MAX_POINTS = landmarks.length * 100 + 300; 
  const progressPercent = Math.min(100, (userState.points / MAX_POINTS) * 100);

  // --- WELCOME EFFECT ---
  const handleLoginSuccess = (loggedInUser: any) => {
      setUser(loggedInUser);
      setShowWelcome(true); 
  };

  // --- SMART TIME CONTEXT LOGIC ---
  useEffect(() => {
    if (!user) return;
    const hour = new Date().getHours();
    let tip = null;
    if (hour >= 6 && hour < 11) {
        tip = { icon: '☕', text: 'Good morning! Best coffee is at Coffee Bean nearby.' };
    } else if (hour >= 11 && hour < 15) {
        tip = { icon: '🥟', text: 'Lunch time? Try the Khachapuri at Palaty!' };
    } else if (hour >= 15 && hour < 19) {
        tip = { icon: '📸', text: 'Golden Hour! The light at White Bridge is perfect now.' };
    } else if (hour >= 19 && hour < 23) {
        tip = { icon: '🍷', text: 'Evening vibe. Sisters Bar has live music tonight.' };
    } else {
        tip = { icon: '🌙', text: 'Late night? The Colchis Fountain looks magical in the dark.' };
    }
    
    // Delay showing tip slightly for better UX
    const timer = setTimeout(() => {
        setSmartTip(tip);
    }, 4000); 

    return () => clearTimeout(timer);
  }, [user]);

  // --- COMPASS / HEADING LOGIC ---
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
        const compass = (event as any).webkitCompassHeading || Math.abs((event.alpha || 0) - 360);
        if (compass) {
            setHeading(compass);
        }
    };

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  useEffect(() => {
    if (isDevMode) return;

    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (!isDevMode) {
             const now = Date.now();
             if (now - lastLocationUpdate.current > 1000) {
                 setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                 });
                 setGpsAccuracy(position.coords.accuracy);
                 if (position.coords.heading && position.coords.speed && position.coords.speed > 1) {
                     setHeading(position.coords.heading);
                 }
                 lastLocationUpdate.current = now;
             }
          }
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
        },
        { 
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [isDevMode]);

  const handleAnalysisComplete = (result: QuestResponse, imageBase64?: string) => {
    let finalResult = { ...result };

    if (result.location_confirmed) {
      const matchedLandmark = landmarks.find(l => 
        result.place_name.toLowerCase().includes(l.name.toLowerCase()) ||
        l.name.toLowerCase().includes(result.place_name.toLowerCase())
      );

      if (matchedLandmark) {
        finalResult.reward_icon = matchedLandmark.reward_icon;
        const distance = calculateDistance(
          userLocation.lat, userLocation.lng, 
          matchedLandmark.position.lat, matchedLandmark.position.lng
        );
        
        const MAX_DISTANCE_METERS = 500;

        if (distance > MAX_DISTANCE_METERS) {
          finalResult = {
            ...finalResult,
            location_confirmed: false,
            place_name: "Too Far Away!",
            story: `You found ${matchedLandmark.name}, but you are ${distance}m away. Get closer!`,
            points_earned: 0,
            next_quest_hint: "Move towards the location on the map."
          };
        } else {
            // SUCCESSFUL UNLOCK
            if (imageBase64) {
                setLatestPhoto(imageBase64); 
            }

            if (!matchedLandmark.isUnlocked) {
              setLandmarks(prev => prev.map(l => 
                l.id === matchedLandmark.id 
                    ? { ...l, isUnlocked: true, userPhoto: imageBase64 } 
                    : l
              ));
              
              setUserState(prev => {
                const newPoints = prev.points + result.points_earned;
                const newLevel = Math.floor(newPoints / 100) + 1;
                const newInventory = prev.inventory.includes(matchedLandmark.reward_icon) 
                    ? prev.inventory 
                    : [...prev.inventory, matchedLandmark.reward_icon];
                
                const newUnlockedIds = prev.unlockedIds.includes(matchedLandmark.id) 
                    ? prev.unlockedIds 
                    : [...prev.unlockedIds, matchedLandmark.id];

                return { ...prev, points: newPoints, level: newLevel, inventory: newInventory, unlockedIds: newUnlockedIds };
              });
            } else {
                 if (imageBase64) {
                    setLandmarks(prev => prev.map(l => 
                        l.id === matchedLandmark.id ? { ...l, userPhoto: imageBase64 } : l
                    ));
                 }
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
    const landmark = landmarks.find(l => l.id === landmarkId);
    if (!landmark) return;

    const syntheticResult: QuestResponse = {
        location_confirmed: true,
        place_name: landmark.name,
        story: `${landmark.description} ${landmark.facts[0] || ''}`,
        points_earned: 50,
        next_quest_hint: "Check your map for the next location!",
        reward_icon: landmark.reward_icon
    };
    handleAnalysisComplete(syntheticResult);
  };

  const purchaseCoupon = (coupon: Coupon) => {
     if (userState.points >= coupon.cost && !userState.redeemedCoupons.includes(coupon.id)) {
        setUserState(prev => ({
            ...prev,
            points: prev.points - coupon.cost,
            redeemedCoupons: [...prev.redeemedCoupons, coupon.id]
        }));
     }
  };
  
  const openMysteryBox = () => {
      const COST = 100;
      if (userState.points < COST) return;

      setIsOpeningBox(true);
      setUserState(prev => ({ ...prev, points: prev.points - COST }));

      setTimeout(() => {
          const roll = Math.random();
          let message = "";
          let prizePoints = 0;

          if (roll > 0.9) {
              prizePoints = 500;
              message = "JACKPOT! 🎰 You found a bag of gold! (+500 pts)";
          } else if (roll > 0.6) {
              prizePoints = 150;
              message = "Lucky! You found some loose change. (+150 pts)";
          } else if (roll > 0.3) {
              prizePoints = 50;
              message = "Small win! Better than nothing. (+50 pts)";
          } else {
              prizePoints = 0;
              message = "Oh no! The box was empty. 🕸️ Try again!";
          }

          if (prizePoints > 0) {
             setUserState(prev => ({ ...prev, points: prev.points + prizePoints }));
          }
          setLootBoxMessage(message);
          setIsOpeningBox(false);
          
          setTimeout(() => setLootBoxMessage(null), 3000);
      }, 1500);
  };

  // UPDATED: Now also opens the modal immediately after unlocking
  const handleUnlockHint = (landmarkId: string, cost: number) => {
      if (userState.points >= cost && !userState.unlockedHints.includes(landmarkId)) {
          setUserState(prev => ({
              ...prev,
              points: prev.points - cost,
              unlockedHints: [...prev.unlockedHints, landmarkId]
          }));
          
          // Immediately show the hint modal for better UX
          const landmark = landmarks.find(l => l.id === landmarkId);
          if (landmark) setActiveHintLandmark(landmark);
      }
  };

  const handleRedeemCode = () => {
      const code = promoCode.trim().toUpperCase();
      if (code === "KUTAISI") {
          const hotel = landmarks.find(l => l.id === 'host_hotel');
          if (hotel && !hotel.isUnlocked) {
              setLandmarks(prev => prev.map(l => 
                l.id === 'host_hotel' ? { ...l, isUnlocked: true } : l
              ));
              setUserState(prev => ({ ...prev, points: prev.points + 300, unlockedIds: [...prev.unlockedIds, 'host_hotel'] }));
              setPromoMessage("Hotel Unlocked! +300 Points!");
              setPromoCode("");
          } else if (hotel && hotel.isUnlocked) {
              setPromoMessage("You already unlocked the hotel!");
          }
      } else {
          setPromoMessage("Invalid Code.");
      }
      setTimeout(() => setPromoMessage(null), 3000);
  };

  const handlePlayPhrase = async (phrase: string, geoText: string) => {
      if (playingPhrase) return;
      setPlayingPhrase(geoText);
      
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext();

        const audioBufferData = await generatePhraseAudio(geoText);
        
        const audioBuffer = await ctx.decodeAudioData(audioBufferData);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
            setPlayingPhrase(null);
            ctx.close(); 
        };
        source.start(0);
      } catch (e) {
          console.error("Audio play failed", e);
          setPlayingPhrase(null);
          alert("Audio unavailable. Check your internet.");
      }
  };

  const handleFeedbackSubmit = async (data: string | ReviewData) => {
      try {
        if (typeof data === 'string') {
            await addDoc(collection(db, "bugs"), {
                userId: user?.uid || 'anon',
                email: user?.email,
                description: data,
                timestamp: serverTimestamp(),
                status: 'open',
                device: navigator.userAgent
            });
            alert("Report sent! We'll fix it.");
        } else {
            const reviewPayload: ReviewData = {
                ...data,
                userId: user?.uid || 'anon',
                userName: user?.displayName || 'Traveler',
                avatar: user?.photoURL ? '📸' : '👤',
                timestamp: serverTimestamp()
            };
            await addDoc(collection(db, "reviews"), reviewPayload);
            alert("Review published! Madloba!");
        }
      } catch (e) {
          console.error("Error sending data to Firebase:", e);
          alert("Error sending data. Check your internet connection.");
      }
  };

  if (!user) {
      return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // --- NAVIGATION ITEM ---
  const renderNavItem = (viewName: AppView, icon: React.ReactNode, label: string) => {
      const isActive = view === viewName;
      return (
          <button 
            onClick={() => setView(viewName)}
            className="group flex-1 flex flex-col items-center justify-center gap-1 active:scale-90 transition-transform duration-200"
          >
              <div className={`
                  relative p-2.5 rounded-2xl transition-all duration-300
                  ${isActive ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}
              `}>
                  {icon}
                  {viewName === AppView.PROFILE && userState.inventory.length > 0 && view !== AppView.PROFILE && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-slate-900' : 'text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity'}`}>{label}</span>
          </button>
      );
  };

  // --- QUEST JOURNAL RENDERER ---
  const renderQuestJournal = () => {
      const questLandmarks = landmarks.filter(l => l.category === 'quest');
      
      return (
          <div className="space-y-4 animate-fade-in-up">
              {questLandmarks.map((quest) => {
                  const isHintUnlocked = userState.unlockedHints.includes(quest.id);
                  const isCompleted = quest.isUnlocked;

                  return (
                      <div key={quest.id} className={`relative bg-white rounded-2xl p-4 shadow-sm border transition-all ${isCompleted ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100'}`}>
                          <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                                  {isCompleted ? quest.reward_icon : '?'}
                              </div>
                              <div className="flex-1">
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className={`font-bold text-sm ${isCompleted ? 'text-emerald-900' : 'text-slate-800'}`}>
                                        {quest.name}
                                    </h4>
                                    {isCompleted && <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Found</span>}
                                  </div>
                                  
                                  {/* Riddle Section */}
                                  <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100 mb-2">
                                      <p className="text-xs text-amber-900 italic font-medium leading-relaxed">
                                          "{quest.riddle}"
                                      </p>
                                  </div>

                                  {/* Hint Collection Section */}
                                  {quest.hints && quest.hints.length > 0 && (
                                      <div className="mt-2">
                                          <div className="flex items-center gap-2 mb-1">
                                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Unlocked Hint</span>
                                              {!isHintUnlocked && !isCompleted && <span className="text-[10px] text-slate-300">🔒</span>}
                                          </div>
                                          {isHintUnlocked ? (
                                              <div 
                                                onClick={() => setActiveHintLandmark(quest)}
                                                className="cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors"
                                              >
                                                <p className="text-xs text-slate-600 font-medium truncate">
                                                    {quest.hints[0]}
                                                </p>
                                              </div>
                                          ) : (
                                              <div className="h-8 bg-slate-100 rounded-lg w-full relative overflow-hidden flex items-center px-3">
                                                  <span className="text-[10px] text-slate-400">Hint locked. Find on map to unlock.</span>
                                              </div>
                                          )}
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      );
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden font-sans">
      
      {/* --- WELCOME MODAL --- */}
      {showWelcome && (
          <WelcomeModal 
            userName={user.displayName?.split(' ')[0] || 'Explorer'} 
            onClose={() => setShowWelcome(false)} 
          />
      )}

      {/* --- REFINED HEADER: CLEAR STATUS BAR --- */}
      <header className="absolute top-0 left-0 right-0 z-30 p-4 pointer-events-none flex justify-center">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-full pl-2 pr-5 py-2 flex items-center w-full max-w-sm transition-all duration-300 gap-3">
           
           {/* LEFT: Profile & Level */}
           <div 
             onClick={() => setShowDebug(!showDebug)}
             className="flex items-center gap-3 cursor-pointer group"
           >
              {/* Avatar */}
              <div className="relative w-10 h-10 shrink-0">
                  {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-full h-full object-cover rounded-full border-2 border-white shadow-sm" />
                  ) : (
                      <div className="w-full h-full bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold border-2 border-white shadow-sm">
                          {user.displayName?.[0] || 'U'}
                      </div>
                  )}
                  {/* Floating Level Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                      Lv.{userState.level}
                  </div>
              </div>

              {/* Text Info + XP Bar */}
              <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Explorer</span>
                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                      <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                      ></div>
                  </div>
              </div>
           </div>

           {/* Spacer to push coins to right */}
           <div className="flex-1"></div>

           {/* RIGHT: Coins Display */}
           <div 
                onClick={() => setView(AppView.SHOP)}
                className="flex items-center gap-2.5 bg-amber-50 pl-2 pr-3 py-1.5 rounded-full border border-amber-100 cursor-pointer active:scale-95 transition-transform hover:bg-amber-100"
           >
               <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-[12px] shadow-sm border border-amber-300">
                  🪙
               </div>
               <div className="flex flex-col items-end leading-none">
                   <span className="text-sm font-black text-slate-800">{userState.points}</span>
                   <span className="text-[7px] font-bold text-amber-600 uppercase tracking-wider">Coins</span>
               </div>
           </div>

        </div>
      </header>

      {/* DEBUG MENU */}
      {showDebug && (
        <div className="absolute top-24 left-4 z-50 bg-black/90 text-white p-4 rounded-3xl backdrop-blur-xl w-64 border border-white/10 animate-fadeIn">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Dev Teleport</h3>
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                <button 
                    onClick={() => { setIsDevMode(false); alert("Resumed Real GPS"); }}
                    className={`text-xs px-3 py-2 rounded-lg font-bold border ${!isDevMode ? 'bg-emerald-500 border-emerald-400' : 'bg-transparent border-gray-600'}`}
                >
                    📍 Real GPS
                </button>
                <button 
                    onClick={() => setUserState(p => ({...p, points: p.points + 1000}))}
                    className="text-xs px-3 py-2 rounded-lg font-bold border bg-yellow-600 border-yellow-400"
                >
                    💰 +1000 Pts
                </button>
                {landmarks.map(l => (
                    <button 
                        key={l.id}
                        onClick={() => teleportTo(l.position.lat, l.position.lng)}
                        className="text-xs text-left px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex justify-between items-center transition-colors"
                    >
                        <span>{l.name}</span>
                    </button>
                ))}
            </div>
        </div>
      )}

      {/* MAIN VIEWPORT - Using Suspense for Optimization */}
      <main className="flex-1 relative overflow-hidden bg-[#f0f2f5] z-0">
        <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-[#f0f2f5]">
                <div className="animate-spin text-4xl">🧭</div>
            </div>
        }>
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
                    onOpenHint={setActiveHintLandmark} // PASS MODAL TRIGGER
                    userPoints={userState.points}
                    onShowDriver={(l) => setActiveDriverCardLandmark(l)} 
                />
                
                {/* --- SMART TIP MODAL --- */}
                {smartTip && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-6 animate-fadeIn">
                        <div className="bg-white rounded-[32px] p-6 shadow-2xl max-w-sm w-full relative transform transition-all animate-bounce-in border border-white/40">
                            {/* Close Button */}
                            <button 
                                onClick={() => setSmartTip(null)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 flex items-center justify-center font-bold"
                            >
                                ✕
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-sm border border-emerald-50">
                                    {smartTip.icon}
                                </div>
                                <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-2">Local Insight</h3>
                                <p className="text-lg font-bold text-slate-800 leading-tight mb-6">
                                    {smartTip.text}
                                </p>
                                <button 
                                    onClick={() => setSmartTip(null)}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors shadow-lg shadow-slate-900/20 active:scale-95"
                                >
                                    Thanks, got it!
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                <ConciergeFab />
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

            {/* --- PROFILE VIEW --- */}
            {view === AppView.PROFILE && (
            <div className="h-full bg-[#f8fafc] flex flex-col">
                
                {/* Profile Top Bar - Fixed */}
                <div className="pt-24 pb-4 px-6 bg-white border-b border-slate-100 z-10 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight font-serif">Explorer Profile</h2>
                        <div className="flex gap-2">
                            {/* Bug Report Button */}
                            <button
                                onClick={() => setFeedbackMode('bug')}
                                className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="Report a Bug"
                            >
                                🐞
                            </button>
                            <button 
                                onClick={() => setShowShareModal(true)}
                                className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 active:scale-95 transition-transform"
                            >
                                <span>📸</span> Share
                            </button>
                        </div>
                    </div>

                    {/* Updated Profile Tabs */}
                    <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
                        <button 
                            onClick={() => setProfileTab('journal')}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${profileTab === 'journal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Quest Log
                        </button>
                        <button 
                            onClick={() => setProfileTab('passport')}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${profileTab === 'passport' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Passport
                        </button>
                        <button 
                            onClick={() => setProfileTab('memories')}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${profileTab === 'memories' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Kitchen
                        </button>
                         {/* NEW TAB */}
                         <button 
                            onClick={() => setProfileTab('legends')}
                            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${profileTab === 'legends' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Legends
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 pb-32">
                    
                    {/* --- TAB: QUEST JOURNAL --- */}
                    {profileTab === 'journal' && (
                        <div className="space-y-6">
                            <div className="bg-indigo-900 rounded-[24px] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                                <h3 className="text-lg font-bold relative z-10 mb-1">Your Collection</h3>
                                <p className="text-indigo-200 text-xs relative z-10 mb-4">
                                    Keep track of riddles and hints you've unlocked.
                                </p>
                                <div className="flex gap-4 relative z-10">
                                    <div>
                                        <span className="block text-2xl font-black">{userState.unlockedHints.length}</span>
                                        <span className="text-[10px] uppercase tracking-widest opacity-60">Hints</span>
                                    </div>
                                    <div>
                                        <span className="block text-2xl font-black">{landmarks.filter(l => l.isUnlocked).length}</span>
                                        <span className="text-[10px] uppercase tracking-widest opacity-60">Found</span>
                                    </div>
                                </div>
                            </div>

                            {renderQuestJournal()}
                        </div>
                    )}

                    {/* --- TAB: PASSPORT --- */}
                    {profileTab === 'passport' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <DigitalPassport landmarks={landmarks} />
                            
                            {/* Hotel Code in Passport Tab */}
                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span>🔑</span> Guest Access
                                </h3>
                                <div className="flex gap-2 mb-4">
                                    <input 
                                        type="text" 
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Hotel Code"
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                    <button 
                                        onClick={handleRedeemCode}
                                        className="bg-indigo-600 text-white font-bold px-4 rounded-xl text-sm shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform"
                                    >
                                        Apply
                                    </button>
                                </div>
                                
                                <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-serif font-bold text-lg">
                                        M
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800">Mariam (Host)</p>
                                        <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                                            "Welcome to my 19th-century home! I love <b>Design</b> and <b>Esports</b>. If you see me, ask me about the best <b>Skiing</b> spots in Georgia!"
                                        </p>
                                    </div>
                                </div>

                                {promoMessage && (
                                    <p className="mt-2 text-xs font-bold text-indigo-600 animate-pulse">{promoMessage}</p>
                                )}
                            </div>

                            {/* Phrases with Audio */}
                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-800 mb-4">Phrasebook</h3>
                                <div className="space-y-2">
                                    {GEORGIAN_PHRASES.map((phrase, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                            <div className="flex-1">
                                                <span className="text-xs font-bold text-slate-500 block mb-0.5">{phrase.eng}</span>
                                                <span className="font-serif font-bold text-slate-800">{phrase.geo}</span>
                                            </div>
                                            <button 
                                                onClick={() => handlePlayPhrase(phrase.eng, phrase.geo)}
                                                disabled={!!playingPhrase}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${playingPhrase === phrase.geo ? 'bg-emerald-100 text-emerald-600 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 active:scale-95'}`}
                                            >
                                                {playingPhrase === phrase.geo ? '🔊' : '▶️'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TAB: KITCHEN --- */}
                    {profileTab === 'memories' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <RecipeBook 
                                userState={userState} 
                                unlockedCount={landmarks.filter(l => l.isUnlocked && l.category === 'quest').length} 
                            />
                        </div>
                    )}

                    {/* --- TAB: LEGENDS (New) --- */}
                    {profileTab === 'legends' && (
                        <div className="space-y-6 animate-fade-in-up">
                            <HallOfFame />
                        </div>
                    )}

                    {/* --- BOTTOM ACTIONS --- */}
                    <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
                         
                         <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setFeedbackMode('review')}
                                className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
                            >
                                <span className="text-2xl">✍️</span>
                                <span className="text-xs font-bold text-slate-700">Write Review</span>
                            </button>
                            <button 
                                onClick={() => setUser(null)}
                                className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-red-50 hover:border-red-100 transition-colors group"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">🚪</span>
                                <span className="text-xs font-bold text-slate-700 group-hover:text-red-600">Log Out</span>
                            </button>
                        </div>

                         {/* PATRON SUPPORT CARD (Redesigned) */}
                        <div className="relative group overflow-hidden rounded-[24px] bg-[#2c3e50] shadow-xl transform transition-all hover:scale-[1.01]">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            
                            <div className="relative p-6 flex items-center gap-5">
                                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-white/20">
                                    ☕
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-black text-white font-serif tracking-tight">Become a Patron</h3>
                                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                                        Enjoying the city tales? Support the creators of GeoQuest.
                                    </p>
                                </div>
                                <a 
                                    href="https://ko-fi.com/mariambukhaidze" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-white text-slate-900 px-4 py-3 rounded-xl text-xs font-bold hover:bg-amber-50 transition-colors"
                                >
                                    Support
                                </a>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            )}

            {view === AppView.SHOP && (
                <div className="h-full bg-[#f8fafc] px-6 pt-24 pb-32 overflow-y-auto custom-scrollbar relative">
                    
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-serif">Gift Shop</h2>
                            <p className="text-slate-500 font-bold text-xs mt-1 uppercase tracking-widest">Spend your earnings</p>
                        </div>
                    </div>

                    <div className="mb-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[32px] p-1 shadow-2xl relative overflow-hidden group transform hover:scale-[1.01] transition-transform">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        <div className="bg-white/10 backdrop-blur-md rounded-[28px] p-6 relative flex items-center justify-between">
                            <div>
                                    <h3 className="text-xl font-black text-white italic">MYSTERY CHEST</h3>
                                    <p className="text-indigo-100 text-xs font-bold mt-1">100 PTS</p>
                                    <button 
                                        onClick={openMysteryBox}
                                        disabled={isOpeningBox || userState.points < 100}
                                        className="mt-3 bg-white text-indigo-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
                                    >
                                        {isOpeningBox ? 'Opening...' : 'Open Now'}
                                    </button>
                            </div>
                            <div className="text-6xl drop-shadow-2xl">🎁</div>
                            
                            {lootBoxMessage && (
                                <div className="absolute inset-0 bg-white/95 flex items-center justify-center p-4 text-center rounded-[28px] animate-fade-in-up z-20">
                                    <p className="text-indigo-900 font-bold text-sm">{lootBoxMessage}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 relative z-10">
                        {REWARDS.map(coupon => {
                            const isRedeemed = userState.redeemedCoupons.includes(coupon.id);
                            const canAfford = userState.points >= coupon.cost;
                            
                            return (
                                <div key={coupon.id} className={`group relative overflow-hidden rounded-[28px] border transition-all duration-300 shadow-sm ${!isRedeemed && !canAfford ? 'border-slate-100 bg-white opacity-60' : 'border-slate-100 bg-white hover:shadow-xl hover:border-slate-200'}`}>
                                    <div className={`h-20 w-full bg-gradient-to-r ${coupon.color} relative overflow-hidden flex items-center px-6`}>
                                        <div className="absolute inset-0 bg-white/10 pattern-dots"></div>
                                        <div className="text-white text-4xl drop-shadow-md transform group-hover:scale-110 transition-transform">{coupon.icon}</div>
                                        <div className="ml-auto flex flex-col items-end text-white">
                                            {isRedeemed ? (
                                                <span className="font-black uppercase tracking-widest text-[10px] bg-white/20 px-2 py-1 rounded">Owned</span>
                                            ) : (
                                                <span className="font-black text-xl italic">{coupon.cost}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-extrabold text-slate-800 leading-none mb-1">{coupon.title}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium mb-4">{coupon.description}</p>
                                        <button 
                                            onClick={() => purchaseCoupon(coupon)}
                                            disabled={isRedeemed || !canAfford}
                                            className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all shadow-sm ${
                                                isRedeemed 
                                                ? 'bg-slate-100 text-slate-400 cursor-default shadow-none' 
                                                : (canAfford 
                                                    ? `bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.98]` 
                                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none')
                                            }`}
                                        >
                                            {isRedeemed ? 'Collected' : 'Redeem'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </Suspense>
      </main>

      {/* --- FLOATING DOCK --- */}
      <nav className="absolute bottom-8 left-0 right-0 z-30 pointer-events-none flex justify-center">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] rounded-[2.5rem] flex items-center justify-between px-3 py-2 gap-1 w-auto min-w-[320px] max-w-sm relative transition-all duration-300">
           
           {renderNavItem(AppView.MAP, (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
           ), "Explore")}

           {renderNavItem(AppView.LEADERBOARD, (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
           ), "Rank")}

           {/* Central Camera Button */}
           <div className="mx-2 -mt-12 group">
                <button 
                    onClick={() => setView(AppView.CAMERA)}
                    className="w-16 h-16 rounded-[24px] bg-slate-900 text-white shadow-xl shadow-slate-900/40 flex items-center justify-center transform transition-all duration-300 active:scale-90 border-4 border-[#f0f2f5] relative z-10 group-hover:-translate-y-1"
                >
                    <div className="w-12 h-12 rounded-[18px] border-2 border-white/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                </button>
           </div>

           {renderNavItem(AppView.SHOP, (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
           ), "Shop")}

           {renderNavItem(AppView.PROFILE, (
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
           ), "Profile")}

        </div>
      </nav>

      {/* OVERLAYS */}
      {lastResult && (
        <ResultModal result={lastResult} onClose={closeResult} />
      )}
      
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

      {/* DRIVER CARD MODAL */}
      {activeDriverCardLandmark && (
          <DriverCard 
            landmark={activeDriverCardLandmark} 
            onClose={() => setActiveDriverCardLandmark(null)} 
          />
      )}

      {/* NEW: HINT MODAL */}
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
