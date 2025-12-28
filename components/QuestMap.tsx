
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { Landmark, Coordinates } from '../types';
import { MAP_CENTER, DEFAULT_ZOOM, WALKING_ROUTE } from '../constants';
import { calculateDistance } from '../utils';
import ImageWithSkeleton from './ImageWithSkeleton';
import L from 'leaflet';

// --- ADVANCED USER MARKER (With Direction) ---
const createUserIcon = (heading: number | null) => {
    const transformStyle = heading !== null ? `rotate(${heading}deg)` : '';
    
    const html = heading !== null 
    ? `
      <div class="relative w-12 h-12 flex items-center justify-center -ml-3 -mt-3">
         <!-- Vision Cone -->
         <div class="user-compass-bearing absolute w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[60px] border-t-blue-400/30 -top-8 left-1/2 -translate-x-1/2 blur-[2px]" style="transform: translateX(-50%) ${transformStyle}; transform-origin: bottom center;"></div>
         <!-- Core Dot -->
         <div class="w-5 h-5 bg-blue-500 rounded-full border-[3px] border-white shadow-lg relative z-10"></div>
         <!-- Pulse -->
         <div class="absolute inset-0 bg-blue-500/20 rounded-full animate-ping z-0"></div>
      </div>
    `
    : `
      <div class="relative w-4 h-4">
         <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative z-10"></div>
         <div class="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping"></div>
      </div>
    `;

    return L.divIcon({
        className: 'bg-transparent',
        html: html,
        iconSize: [20, 20],
        iconAnchor: [10, 10], // Centered
    });
};

const MapLayoutFix = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

// Smoother Recenter
const UserRecenter = ({ userLocation }: { userLocation: Coordinates }) => {
    const map = useMap();
    useEffect(() => {
       const center = map.getCenter();
       const dist = calculateDistance(center.lat, center.lng, userLocation.lat, userLocation.lng);
       if (dist > 2000) { 
           map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 2 });
       }
    }, [map, userLocation]);
    return null;
};

const createLandmarkIcon = (landmark: Landmark, isHovered: boolean) => {
  const size = isHovered ? 64 : 48; 
  const anchorY = isHovered ? 70 : 54;
  
  const isQuest = landmark.category === 'quest';
  const isHotel = landmark.category === 'hotel';
  const isUnlocked = landmark.isUnlocked;
  
  let borderColor = 'border-white';
  if (isQuest) {
     borderColor = isUnlocked ? 'border-yellow-400' : 'border-slate-300';
  } else if (isHotel) {
     borderColor = 'border-purple-500';
  } else {
     borderColor = 'border-orange-500';
  }
    
  const shadowClass = isHovered ? 'shadow-2xl scale-110' : 'shadow-lg';
  const filterClass = (isQuest && !isUnlocked) ? 'grayscale contrast-125' : '';

  let badge = '';
  if (isHotel) {
      badge = '<div class="absolute bottom-0 right-0 bg-purple-600 text-white text-[10px] p-1 rounded-tl-md rounded-br-full">🏡</div>';
  } else if (!isQuest) {
      badge = '<div class="absolute bottom-0 right-0 bg-orange-500 text-white text-[8px] p-0.5 rounded-tl-md">🍴</div>';
  } else if (isQuest && !isUnlocked) {
      badge = '<div class="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-lg font-bold drop-shadow-md">🎯</div>';
  }

  const html = `
    <div class="relative flex flex-col items-center transition-transform duration-300 ease-spring ${shadowClass}">
       <div class="w-${isHovered ? '16' : '12'} h-${isHovered ? '16' : '12'} rounded-full border-[3px] ${borderColor} overflow-hidden bg-white z-10 relative">
         <img src="${landmark.image}" class="w-full h-full object-cover ${filterClass}" alt="${landmark.name}" loading="lazy" />
         ${badge}
       </div>
       <div class="w-0.5 h-3 bg-gray-400/50 -mt-1"></div>
       <div class="w-2 h-0.5 bg-gray-400/30 rounded-full blur-[1px]"></div>
    </div>
  `;

  return L.divIcon({
    className: `!bg-transparent pointer-events-none`,
    html: html,
    iconSize: [size, anchorY],
    iconAnchor: [size / 2, anchorY],
    popupAnchor: [0, -anchorY + 10],
  });
};

// --- PROXIMITY RADAR COMPONENT ---
const ProximityRadar = ({ distance }: { distance: number }) => {
    // Logic for color stages
    let mainColor = "bg-blue-500";
    let statusText = "SCANNING";
    let pulseRate = "animate-pulse-slow"; 

    if (distance > 1000) {
        mainColor = "bg-slate-500";
        statusText = "NO SIGNAL";
        pulseRate = "";
    } else if (distance < 100) {
        mainColor = "bg-red-600";
        statusText = "TARGET LOCKED";
        pulseRate = "animate-ping"; 
    } else if (distance < 300) {
        mainColor = "bg-amber-500";
        statusText = "NEARBY";
        pulseRate = "animate-pulse"; 
    } else {
        statusText = "TRACKING";
    }

    return (
        <div className="absolute bottom-32 left-0 right-0 flex justify-center z-[1000] pointer-events-none animate-fade-in-up">
            <div className="bg-white/10 backdrop-blur-xl border border-white/40 rounded-full p-2 pr-6 shadow-2xl flex items-center gap-4 relative overflow-hidden group">
                <div className={`relative w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center bg-black/20 shadow-inner`}>
                    <div className={`absolute w-full h-full rounded-full ${mainColor} opacity-20 ${pulseRate}`}></div>
                    <div className={`w-3 h-3 rounded-full ${mainColor} shadow-[0_0_10px_currentColor] z-10`}></div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-black tracking-[0.2em] text-white/80 uppercase mb-0.5">{statusText}</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white leading-none drop-shadow-md font-mono">{distance}</span>
                        <span className="text-xs font-bold text-white/70">METERS</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface QuestMapProps {
  landmarks: Landmark[];
  userLocation: Coordinates;
  accuracy?: number; 
  heading?: number | null;
  onCheckIn?: (id: string) => void;
  unlockedHints?: string[];
  onUnlockHint?: (id: string, cost: number) => void;
  onOpenHint?: (landmark: Landmark) => void; 
  userPoints?: number;
  onShowDriver?: (landmark: Landmark) => void;
}

const QuestMap: React.FC<QuestMapProps> = ({ 
    landmarks, userLocation, heading = null, onCheckIn, 
    unlockedHints = [], onUnlockHint, onOpenHint, userPoints = 0, onShowDriver 
}) => {
  const mapRef = useRef<L.Map>(null); 
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'quest' | 'dining' | 'hotel'>('all');
  const [isMapReady, setIsMapReady] = useState(false);
  const [showRoute, setShowRoute] = useState(true);

  const userIcon = useMemo(() => createUserIcon(heading), [heading]);

  const filteredLandmarks = useMemo(() => {
    return landmarks.filter(l => {
        const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || l.category === filterType;
        return matchesSearch && matchesType;
    });
  }, [landmarks, searchQuery, filterType]);

  const nearestTarget = useMemo(() => {
    const lockedLandmarks = landmarks.filter(l => l.category === 'quest' && !l.isUnlocked);
    if (lockedLandmarks.length === 0) return null;

    let minDistance = Infinity;
    let nearest = null;

    lockedLandmarks.forEach(l => {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, l.position.lat, l.position.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { id: l.id, name: l.name, distance: dist };
      }
    });

    return nearest;
  }, [landmarks, userLocation]);

  const handleSearchResultClick = (landmark: Landmark) => {
      mapRef.current?.flyTo([landmark.position.lat, landmark.position.lng], 18, {
          duration: 1.5
      });
      setSelectedId(landmark.id);
      setHoveredId(landmark.id);
      setSearchQuery("");
  };

  const mapMarkers = useMemo(() => {
      return filteredLandmarks.map((landmark) => {
          const isHovered = hoveredId === landmark.id || selectedId === landmark.id;
          const distToUser = calculateDistance(userLocation.lat, userLocation.lng, landmark.position.lat, landmark.position.lng);
          const isQuest = landmark.category === 'quest';
          const isHotel = landmark.category === 'hotel';
          const displayName = landmark.name; 
          const isHintUnlocked = unlockedHints.includes(landmark.id);
          const canAffordHint = userPoints >= 50;
          
          return (
            <Marker 
              key={landmark.id} 
              position={[landmark.position.lat, landmark.position.lng]}
              icon={createLandmarkIcon(landmark, isHovered)}
              eventHandlers={{
                mouseover: () => setHoveredId(landmark.id),
                mouseout: () => setHoveredId(null),
                click: () => {
                    setHoveredId(landmark.id);
                    setSelectedId(landmark.id); 
                },
              }}
            >
              <Popup 
                className="custom-popup" 
                closeButton={false} 
                autoPanPaddingTopLeft={[0, 150]} 
                autoPanPaddingBottomRight={[0, 200]} 
                autoPan={true}
                eventHandlers={{
                    remove: () => setSelectedId(null) 
                }}
              >
                 <div 
                   className="w-64 max-h-[50vh] overflow-y-auto custom-scrollbar bg-white rounded-2xl shadow-none"
                   ref={(el) => { if(el) { L.DomEvent.disableScrollPropagation(el); L.DomEvent.disableClickPropagation(el); }}}
                 >
                   <div className="h-32 w-full relative">
                     <ImageWithSkeleton 
                       src={landmark.image} 
                       className={`w-full h-full rounded-t-2xl ${(!isQuest || landmark.isUnlocked) ? '' : 'grayscale contrast-125'}`} 
                       alt={landmark.name} 
                     />
                     <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm z-20">
                        {distToUser}m away
                     </div>
                   </div>
                   
                   <div className="p-4 pt-3">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg text-slate-800 leading-tight font-serif max-w-[80%]">
                                {displayName}
                            </h3>
                            {isQuest && !landmark.isUnlocked && (
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 uppercase font-bold tracking-wider">Locked</span>
                            )}
                        </div>
                    
                    <div className="flex gap-2 mb-3">
                        {/* DRIVER CARD BUTTON */}
                        <button 
                            onClick={() => onShowDriver && onShowDriver(landmark)}
                            className="flex-1 bg-yellow-400 text-yellow-900 py-2 rounded-xl text-xs font-bold text-center border border-yellow-500 hover:bg-yellow-500 transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                            <span>🚕</span> Taxi Card
                        </button>
                        
                        {(landmark.isUnlocked || !isQuest) && landmark.instagram && (
                            <a href={landmark.instagram} target="_blank" rel="noopener noreferrer" className="flex-1 bg-pink-50 text-pink-600 py-2 rounded-xl text-xs font-bold text-center border border-pink-100 flex items-center justify-center">
                                Insta
                            </a>
                        )}
                        {landmark.airbnbLink && (
                            <a href={landmark.airbnbLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-rose-50 text-rose-600 py-2 rounded-xl text-xs font-bold text-center border border-rose-100 flex items-center justify-center">
                                Book
                            </a>
                        )}
                    </div>

                    {/* CONTENT LOGIC: Updated to show FACTS even if Locked */}
                    
                    {(landmark.isUnlocked || !isQuest) ? (
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                            {landmark.description}
                        </p>
                    ) : (
                         <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 mb-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-amber-500">📜</span>
                                <h4 className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Riddle</h4>
                            </div>
                            <p className="text-xs text-amber-900 italic leading-relaxed">"{landmark.riddle}"</p>
                        </div>
                    )}

                    {/* FACTS SECTION: Visible for everyone (contains Hours & Tips) */}
                    {landmark.facts && landmark.facts.length > 0 && (
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3 space-y-2">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Useful Info
                            </h4>
                            {landmark.facts.map((fact, idx) => (
                                <p key={idx} className="text-xs text-slate-600 leading-relaxed border-l-2 border-slate-200 pl-2">
                                    {fact}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* HINT BUTTON (Only for Locked Quests) */}
                    {isQuest && !landmark.isUnlocked && (
                         <div className="space-y-2">
                            {landmark.hints && landmark.hints.length > 0 && (
                                isHintUnlocked ? (
                                    <button 
                                        onClick={() => onOpenHint && onOpenHint(landmark)}
                                        className="w-full py-2.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors shadow-sm"
                                    >
                                        <span>💡</span> View Secret Hint
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => {
                                            if (onUnlockHint) onUnlockHint(landmark.id, 50);
                                        }}
                                        disabled={!canAffordHint}
                                        className={`w-full py-2.5 rounded-xl border-2 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                                            canAffordHint
                                            ? 'bg-white border-emerald-500 text-emerald-700 hover:bg-emerald-50' 
                                            : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <span className="text-lg">🔐</span>
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="text-[10px] font-black uppercase tracking-wider">Unlock Hint</span>
                                            <span className={`text-[9px] font-bold ${canAffordHint ? 'text-emerald-600' : 'text-slate-400'}`}>Cost: 50 Pts</span>
                                        </div>
                                    </button>
                                )
                            )}
                            <div className="mt-2 text-[10px] text-amber-600/70 font-medium text-center">
                                Go to location and scan to unlock!
                            </div>
                         </div>
                    )}


                    {isQuest && (
                        landmark.isUnlocked ? (
                            <div className="mt-3 w-full py-2 rounded-xl text-xs font-bold uppercase text-center bg-emerald-100 text-emerald-700">
                                Unlocked
                            </div>
                        ) : (
                            distToUser <= 500 && onCheckIn ? (
                                <button 
                                    onClick={() => onCheckIn(landmark.id)}
                                    className="mt-3 w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-900 text-white shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 animate-pulse"
                                >
                                    <span>📸</span> Verify Location
                                </button>
                            ) : (
                                <div className="mt-3 w-full py-2 rounded-xl text-xs font-bold uppercase text-center bg-slate-100 text-slate-400">
                                    Get Closer to Scan
                                </div>
                            )
                        )
                    )}
                  </div>
                 </div>
              </Popup>
            </Marker>
          );
      });
  }, [filteredLandmarks, hoveredId, selectedId, onCheckIn, userLocation, unlockedHints, onUnlockHint, onOpenHint, userPoints, onShowDriver]);

  return (
    <div className="relative w-full h-full bg-[#f0f2f5]">
      
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
          <div className="animate-spin text-4xl">🧭</div>
        </div>
      )}
      
      {/* Search Bar & Filters (Same as before) */}
      <div className="absolute top-24 left-0 right-0 z-[1000] px-4 flex flex-col items-center gap-3 pointer-events-none transition-all duration-300">
        <div className="w-full max-w-xs pointer-events-auto relative">
            <div className="relative group shadow-lg rounded-2xl z-20">
                <input
                    type="text"
                    className="block w-full pl-10 pr-10 py-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-bold transition-all"
                    placeholder="Search places..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-3 top-3 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">✕</button>
                )}
            </div>
            {/* Results dropdown hidden for brevity, logic remains same */}
            {searchQuery.length > 0 && filteredLandmarks.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden z-10 animate-fadeIn max-h-[300px] overflow-y-auto custom-scrollbar">
                    {filteredLandmarks.map((landmark) => (
                        <button key={landmark.id} onClick={() => handleSearchResultClick(landmark)} className="w-full flex items-center gap-3 p-3 hover:bg-emerald-50 transition-colors text-left border-b border-slate-100 last:border-0">
                            <img src={landmark.image} alt={landmark.name} className="w-10 h-10 rounded-lg object-cover bg-slate-200" />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-800 truncate">{landmark.name}</h4>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
        
        <div className="flex gap-2 pointer-events-auto bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl shadow-lg border border-white/60 overflow-x-auto max-w-full no-scrollbar">
            {['all', 'quest', 'dining', 'hotel'].map((type) => (
                <button 
                    key={type}
                    onClick={() => setFilterType(type as any)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 whitespace-nowrap active:scale-95 ${filterType === type ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    {type === 'all' ? 'All' : (type === 'hotel' ? 'Stay' : type)}
                </button>
            ))}
        </div>
        <button onClick={() => setShowRoute(!showRoute)} className="pointer-events-auto bg-white/95 backdrop-blur-xl px-4 py-2 rounded-full text-[10px] font-bold text-slate-600 shadow-md border border-white/60 flex items-center gap-2 hover:bg-emerald-50 transition-colors active:scale-95">
            <span className={`w-2 h-2 rounded-full ${showRoute ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
            <span>{showRoute ? 'Hide Path' : 'Show Path'}</span>
        </button>
      </div>

      {nearestTarget && filterType !== 'dining' && filterType !== 'hotel' && !selectedId && (
         <ProximityRadar distance={nearestTarget.distance} />
      )}

      <MapContainer 
        ref={mapRef}
        center={[MAP_CENTER.lat, MAP_CENTER.lng]} 
        zoom={DEFAULT_ZOOM} 
        className="w-full h-full z-0 outline-none"
        zoomControl={false}
        whenReady={() => setIsMapReady(true)}
      >
        <MapLayoutFix />
        <UserRecenter userLocation={userLocation} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          keepBuffer={20}
          updateWhenZooming={false}
        />
        
        {showRoute && (
            <Polyline 
                positions={WALKING_ROUTE.map(p => [p.lat, p.lng])}
                pathOptions={{ color: '#34d399', weight: 6, dashArray: '15, 10', opacity: 0.8, lineCap: 'round', className: 'animate-dash' }} 
            />
        )}
        
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
        {mapMarkers}
      </MapContainer>
    </div>
  );
};

export default React.memo(QuestMap);
