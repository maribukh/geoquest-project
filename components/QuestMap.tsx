import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { Landmark, Coordinates } from '../types';
import { MAP_CENTER, DEFAULT_ZOOM } from '../constants';
import { calculateDistance } from '../utils';
import L from 'leaflet';

// --- GPS Marker (User) ---
const createUserIcon = (heading: number | null) => {
  const headingRotation = heading !== null ? heading : 0;

  const html = `
    <div class="relative w-16 h-16 flex items-center justify-center -ml-5 -mt-5">
       <div class="absolute inset-0 bg-blue-500 rounded-full gps-pulse-ring opacity-30"></div>
       ${
         heading !== null
           ? `
       <div class="absolute w-[60px] h-[60px] flex items-center justify-center transition-transform duration-300 ease-linear" style="transform: rotate(${headingRotation}deg)">
          <div class="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[40px] border-t-blue-500/20 rounded-full blur-[1px] -mt-8"></div>
       </div>`
           : ''
       }
       <div class="relative w-5 h-5 bg-blue-500 rounded-full border-[3px] border-white shadow-[0_2px_8px_rgba(0,0,0,0.3)] z-20"></div>
    </div>
  `;

  return L.divIcon({
    className: 'bg-transparent',
    html: html,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const LandmarkImage = React.memo(
  ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => {
    const [loaded, setLoaded] = useState(false);

    return (
      <div className={`relative ${className}`}>
        {!loaded && (
          <div className='absolute inset-0 bg-slate-200 animate-pulse' />
        )}
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${
            !loaded ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
          loading='lazy'
          decoding='async'
          onLoad={() => setLoaded(true)}
        />
      </div>
    );
  }
);

LandmarkImage.displayName = 'LandmarkImage';

// --- UNIFIED PHOTO MARKER DESIGN ---
const createLandmarkIcon = (
  landmark: Landmark,
  isHovered: boolean,
  isNearestTarget: boolean
) => {
  const isQuest = landmark.category === 'quest';
  const isHotel = landmark.category === 'hotel';
  const isDining = landmark.category === 'dining';
  const isUnlocked = landmark.isUnlocked;

  // Size Logic
  const size = isHovered ? 74 : isNearestTarget ? 68 : 60;

  // Design Configuration based on Category
  let borderColor = '';
  let badgeIcon = '';
  let badgeColor = '';
  let imageFilter = '';
  let shadowColor = '';

  if (isQuest) {
    if (isUnlocked) {
      borderColor = 'border-emerald-500';
      badgeIcon = '✓';
      badgeColor = 'bg-emerald-500';
      shadowColor = 'shadow-emerald-500/40';
    } else {
      borderColor = 'border-slate-300';
      badgeIcon = isNearestTarget ? '🎯' : '🔒';
      badgeColor = isNearestTarget ? 'bg-amber-500' : 'bg-slate-500';
      imageFilter = 'grayscale brightness-90 contrast-125'; // Mystery effect
      shadowColor = isNearestTarget
        ? 'shadow-amber-500/40'
        : 'shadow-slate-400/40';
    }
  } else if (isDining) {
    borderColor = 'border-orange-500';
    badgeIcon = '🍴';
    badgeColor = 'bg-orange-500';
    shadowColor = 'shadow-orange-500/40';
  } else if (isHotel) {
    borderColor = 'border-purple-600';
    badgeIcon = '🏠';
    badgeColor = 'bg-purple-600';
    shadowColor = 'shadow-purple-500/40';
  }

  const pulseClass =
    isNearestTarget && !isUnlocked ? 'animate-bounce-slow' : '';
  const containerClass = `relative w-full h-full flex items-center justify-center transition-transform duration-300 ${
    isHovered ? 'scale-110 z-50' : ''
  } ${pulseClass}`;

  const html = `
    <div class="${containerClass}">
        <!-- Main Photo Circle -->
        <div class="w-full h-full rounded-full border-[3px] ${borderColor} bg-white ${shadowColor} shadow-xl overflow-hidden relative z-10 box-border">
            <img src="${
              landmark.image
            }" class="w-full h-full object-cover ${imageFilter}" />
            ${
              !isUnlocked && isQuest
                ? '<div class="absolute inset-0 bg-black/10"></div>'
                : ''
            }
        </div>
        <!-- Badge Icon -->
        <div class="absolute -bottom-1 -right-1 w-7 h-7 ${badgeColor} rounded-full border-2 border-white flex items-center justify-center z-20 shadow-md">
            <span class="text-white text-[12px] font-bold">${badgeIcon}</span>
        </div>
        ${
          isNearestTarget && !isUnlocked
            ? `
            <div class="absolute -inset-3 border-2 border-amber-400 rounded-full animate-ping opacity-40 pointer-events-none"></div>
        `
            : ''
        }
    </div>
  `;

  return L.divIcon({
    className: '!bg-transparent',
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const MapController = ({
  userLocation,
  activeLandmarkId,
  isFollowingUser,
  onUserInteraction,
}: {
  userLocation: Coordinates;
  activeLandmarkId: string | null;
  isFollowingUser: boolean;
  onUserInteraction: () => void;
}) => {
  const map = useMap();
  const isFirstLoad = useRef(true);

  useMapEvents({
    dragstart: () => {
      onUserInteraction();
    },
  });

  useEffect(() => {
    if (isFirstLoad.current) {
      map.setView([userLocation.lat, userLocation.lng], 16, { animate: false });
      isFirstLoad.current = false;
      return;
    }

    if (isFollowingUser) {
      map.flyTo([userLocation.lat, userLocation.lng], map.getZoom(), {
        animate: true,
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [map, userLocation, isFollowingUser]);

  useEffect(() => {
    if (activeLandmarkId) {
      onUserInteraction();
    }
  }, [activeLandmarkId, onUserInteraction, map]);

  return null;
};

// --- RADAR COMPONENT ---
const ProximityRadar = React.memo(({ distance }: { distance: number }) => {
  let colorClass = 'text-blue-400';
  let statusText = 'Searching...';

  if (distance > 1000) {
    colorClass = 'text-slate-400';
    statusText = 'Far Away';
  } else if (distance < 50) {
    colorClass = 'text-emerald-400 animate-pulse';
    statusText = 'You are here!';
  } else if (distance < 300) {
    colorClass = 'text-amber-400';
    statusText = 'Very Close';
  } else {
    statusText = 'On Track';
  }

  return (
    <div className='absolute bottom-32 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none animate-slide-up'>
      <div className='bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-full py-2 px-5 shadow-2xl flex items-center gap-3'>
        <div
          className={`relative w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden`}
        >
          <div className='absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent animate-spin-slow rounded-full'></div>
          <span className={`text-xs font-black ${colorClass}`}>
            {distance < 1000 ? distance : '1k+'}
          </span>
        </div>
        <div className='flex flex-col items-start'>
          <span className='text-[8px] font-bold text-slate-400 uppercase tracking-wider'>
            {statusText}
          </span>
          <span className='text-[10px] text-white/80 font-mono'>
            Target Distance (m)
          </span>
        </div>
      </div>
    </div>
  );
});

ProximityRadar.displayName = 'ProximityRadar';

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
  activeLandmarkId?: string | null;
}

const QuestMap: React.FC<QuestMapProps> = ({
  landmarks,
  userLocation,
  heading = null,
  onCheckIn,
  unlockedHints = [],
  onUnlockHint,
  onOpenHint,
  userPoints = 0,
  onShowDriver,
  activeLandmarkId,
}) => {
  const mapRef = useRef<L.Map>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<
    'all' | 'quest' | 'dining' | 'hotel'
  >('all');
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(true);

  // Use debounce for search
  const [searchDebounced, setSearchDebounced] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => setSearchDebounced(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (activeLandmarkId) {
      const landmark = landmarks.find((l) => l.id === activeLandmarkId);
      if (landmark && mapRef.current) {
        setIsFollowingUser(false);
        mapRef.current.flyTo(
          [landmark.position.lat, landmark.position.lng],
          18,
          {
            duration: 1.5,
          }
        );
        setSelectedId(landmark.id);
      }
    }
  }, [activeLandmarkId, landmarks]);

  const userIcon = useMemo(() => createUserIcon(heading), [heading]);

  const filteredLandmarks = useMemo(() => {
    return landmarks.filter((l) => {
      const matchesSearch = l.name
        .toLowerCase()
        .includes(searchDebounced.toLowerCase());
      const matchesType = filterType === 'all' || l.category === filterType;
      return matchesSearch && matchesType;
    });
  }, [landmarks, searchDebounced, filterType]);

  const nearestTarget = useMemo(() => {
    const lockedLandmarks = landmarks.filter(
      (l) => l.category === 'quest' && !l.isUnlocked
    );
    if (lockedLandmarks.length === 0) return null;
    let minDistance = Infinity;
    let nearest = null;
    lockedLandmarks.forEach((l) => {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        l.position.lat,
        l.position.lng
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { id: l.id, name: l.name, distance: dist };
      }
    });
    return nearest;
  }, [landmarks, userLocation]);

  const handleRecenter = useCallback(() => {
    setIsFollowingUser(true);
    if (mapRef.current) {
      mapRef.current.flyTo([userLocation.lat, userLocation.lng], 17, {
        duration: 1,
      });
    }
  }, [userLocation]);

  const handleSearchResultClick = useCallback((landmark: Landmark) => {
    setIsFollowingUser(false);
    mapRef.current?.flyTo([landmark.position.lat, landmark.position.lng], 18, {
      duration: 1.5,
    });
    setSelectedId(landmark.id);
    setSearchQuery('');
  }, []);

  const mapMarkers = useMemo(() => {
    return filteredLandmarks.map((landmark) => {
      const isSelected = selectedId === landmark.id;
      const isNearest = nearestTarget?.id === landmark.id;
      const distToUser = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        landmark.position.lat,
        landmark.position.lng
      );

      const isHintUnlocked = unlockedHints.includes(landmark.id);
      const hintCost = 50;

      return (
        <Marker
          key={landmark.id}
          position={[landmark.position.lat, landmark.position.lng]}
          icon={createLandmarkIcon(landmark, isSelected, isNearest)}
          eventHandlers={{
            click: () => {
              setSelectedId(landmark.id);
              setIsFollowingUser(false);
            },
          }}
        >
          <Popup
            className='custom-popup'
            closeButton={false}
            autoPanPaddingTopLeft={[20, 150]}
            autoPan={true}
            eventHandlers={{
              remove: () => setSelectedId(null),
            }}
          >
            <div className='w-[280px] bg-white rounded-[20px] shadow-none overflow-hidden font-sans'>
              {/* Header Image */}
              <div className='h-40 w-full relative bg-slate-200'>
                <LandmarkImage
                  src={landmark.image}
                  className={`w-full h-full object-cover ${
                    !landmark.isUnlocked && landmark.category === 'quest'
                      ? 'grayscale'
                      : ''
                  }`}
                  alt={landmark.name}
                />

                {/* Distance Badge */}
                <div className='absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm'>
                  {distToUser}m away
                </div>

                {/* Status Badges */}
                <div className='absolute bottom-3 right-3 flex gap-1'>
                  {landmark.category === 'dining' && (
                    <div className='bg-orange-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-md'>
                      Delicious
                    </div>
                  )}
                  {landmark.category === 'hotel' && (
                    <div className='bg-purple-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-md'>
                      Home
                    </div>
                  )}
                  {landmark.category === 'quest' && !landmark.isUnlocked && (
                    <div className='bg-slate-700 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-md'>
                      Locked
                    </div>
                  )}
                </div>
              </div>

              <div className='p-5'>
                {/* Title */}
                <h3 className='font-bold text-xl text-slate-900 leading-tight mb-2 font-serif'>
                  {landmark.name}
                </h3>

                <p className='text-xs text-slate-600 font-medium leading-relaxed mb-4 line-clamp-3'>
                  {landmark.description}
                </p>

                {/* Did you know? */}
                {landmark.facts && landmark.facts.length > 0 && (
                  <div className='mb-4 bg-indigo-50 p-3 rounded-xl border border-indigo-100 relative'>
                    <span className='absolute -top-2 left-3 bg-white px-1 text-[8px] font-bold text-indigo-400 uppercase tracking-widest border border-indigo-100 rounded'>
                      Secret Fact
                    </span>
                    <p className='text-[11px] text-indigo-900 font-medium italic leading-snug pt-1'>
                      "{landmark.facts[0]}"
                    </p>
                  </div>
                )}

                {/* NEW ACTION BUTTONS LAYOUT */}
                <div className='mt-4 space-y-3'>
                  {/* 1. PRIMARY ACTION (Full Width, Modern) */}

                  {/* AUDIO GUIDE: Modern & Centered */}
                  {((landmark.category === 'quest' && landmark.isUnlocked) ||
                    landmark.category === 'dining') && (
                    <button
                      onClick={() => onCheckIn && onCheckIn(landmark.id)}
                      className='group w-full bg-white border border-slate-200 rounded-2xl p-1 pr-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-95'
                    >
                      <div className='w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform'>
                        <span className='text-lg'>🎧</span>
                      </div>
                      <div className='flex flex-col items-start'>
                        <span className='text-xs font-bold text-slate-800'>
                          Play Audio Guide
                        </span>
                        <span className='text-[9px] text-slate-400 font-medium'>
                          Immersive Storytelling
                        </span>
                      </div>
                      <div className='ml-auto w-6 h-6 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-slate-900 group-hover:border-slate-900 transition-colors'>
                        ▶
                      </div>
                    </button>
                  )}

                  {/* HOTEL: Airbnb */}
                  {landmark.category === 'hotel' && landmark.airbnbLink && (
                    <a
                      href={landmark.airbnbLink}
                      target='_blank'
                      rel='noreferrer'
                      className='w-full bg-[#FF5A5F] text-white py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:bg-[#e03e43] active:scale-95 transition-all'
                    >
                      <span>🏠</span> Book on Airbnb
                    </a>
                  )}

                  {/* LOCKED QUEST: Scan or Hint */}
                  {landmark.category === 'quest' &&
                    !landmark.isUnlocked &&
                    (distToUser <= 500 ? (
                      <button
                        onClick={() => onCheckIn && onCheckIn(landmark.id)}
                        className='w-full bg-slate-900 text-white py-3 rounded-2xl text-sm font-bold shadow-lg animate-pulse hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2'
                      >
                        <span>📸</span> Scan Location
                      </button>
                    ) : (
                      // Hint Button
                      <button
                        onClick={() =>
                          isHintUnlocked
                            ? onOpenHint && onOpenHint(landmark)
                            : onUnlockHint &&
                              onUnlockHint(landmark.id, hintCost)
                        }
                        className={`w-full py-3 rounded-2xl text-sm font-bold border flex items-center justify-center gap-2 active:scale-95 transition-all ${
                          isHintUnlocked
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{isHintUnlocked ? '📜' : '💡'}</span>
                        {isHintUnlocked
                          ? 'Read Hint'
                          : `Buy Hint (${hintCost})`}
                      </button>
                    ))}

                  {/* 2. SECONDARY ACTIONS (Taxi & Map) */}
                  <div className='grid grid-cols-2 gap-2'>
                    <button
                      onClick={() => onShowDriver && onShowDriver(landmark)}
                      className='py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors'
                    >
                      🚕 Taxi Card
                    </button>

                    <a
                      href={
                        landmark.mapLink ||
                        `https://maps.google.com/?q=${landmark.position.lat},${landmark.position.lng}`
                      }
                      target='_blank'
                      rel='noreferrer'
                      className='py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center gap-1 transition-colors'
                    >
                      📍 Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      );
    });
  }, [
    filteredLandmarks,
    selectedId,
    userLocation,
    nearestTarget,
    unlockedHints,
    userPoints,
  ]);

  return (
    <div className='relative w-full h-full bg-[#f0f2f5]'>
      {!isMapReady && (
        <div className='absolute inset-0 flex items-center justify-center bg-slate-100 z-10'>
          <div className='animate-spin text-4xl'>🧭</div>
        </div>
      )}

      {/* --- MOBILE SEARCH BAR --- */}
      <div className='absolute top-[90px] left-0 right-0 z-[400] px-4 flex flex-col gap-3 pointer-events-none'>
        <div className='pointer-events-auto shadow-xl shadow-slate-300/30 rounded-2xl'>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <svg
                className='h-5 w-5 text-slate-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
            <input
              type='text'
              className='block w-full pl-10 pr-10 py-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/60 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-bold transition-all shadow-sm'
              placeholder='Find places...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFollowingUser(false)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className='absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600'
              >
                ✕
              </button>
            )}
          </div>

          {searchQuery.length > 0 && filteredLandmarks.length > 0 && (
            <div className='mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/60 overflow-hidden animate-fadeIn max-h-[40vh] overflow-y-auto custom-scrollbar'>
              {filteredLandmarks.map((landmark) => (
                <button
                  key={landmark.id}
                  onClick={() => handleSearchResultClick(landmark)}
                  className='w-full flex items-center gap-3 p-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-100 last:border-0 active:bg-blue-100'
                >
                  <img
                    src={landmark.image}
                    className='w-10 h-10 rounded-lg object-cover bg-slate-200 shrink-0'
                  />
                  <div className='flex-1 min-w-0'>
                    <h4 className='text-sm font-bold text-slate-800 truncate'>
                      {landmark.name}
                    </h4>
                    <p className='text-[10px] text-slate-500 truncate'>
                      {landmark.category.toUpperCase()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Horizontal Filters */}
        <div className='pointer-events-auto flex gap-2 overflow-x-auto no-scrollbar pb-1'>
          {['all', 'quest', 'dining', 'hotel'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 whitespace-nowrap flex-shrink-0 border ${
                filterType === type
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white/90 text-slate-500 border-white/60 backdrop-blur-md'
              }`}
            >
              {type === 'hotel'
                ? '🏠 Stay'
                : type === 'dining'
                ? '🍴 Eat'
                : type === 'quest'
                ? '🦁 Quest'
                : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* --- BOTTOM CONTROLS --- */}
      <div className='absolute bottom-32 right-4 z-[400] flex flex-col gap-3 pointer-events-auto'>
        <button
          onClick={handleRecenter}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center border-4 border-white transition-all active:scale-95 ${
            isFollowingUser
              ? 'bg-blue-500 text-white'
              : 'bg-white text-slate-700'
          }`}
        >
          {isFollowingUser ? (
            <div className='w-4 h-4 bg-white rounded-full animate-pulse'></div>
          ) : (
            <span className='text-2xl'>🎯</span>
          )}
        </button>
      </div>

      {nearestTarget &&
        filterType !== 'dining' &&
        filterType !== 'hotel' &&
        !selectedId && <ProximityRadar distance={nearestTarget.distance} />}

      <MapContainer
        ref={mapRef}
        center={[MAP_CENTER.lat, MAP_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        className='w-full h-full z-0 outline-none'
        zoomControl={false}
        whenReady={() => setIsMapReady(true)}
        attributionControl={false}
      >
        <MapController
          userLocation={userLocation}
          activeLandmarkId={activeLandmarkId}
          isFollowingUser={isFollowingUser}
          onUserInteraction={() => setIsFollowingUser(false)}
        />

        <TileLayer
          url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          keepBuffer={4}
          updateWhenZooming={false}
        />

        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
          zIndexOffset={1000}
        />
        {mapMarkers}
      </MapContainer>
    </div>
  );
};

export default React.memo(QuestMap);
