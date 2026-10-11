import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation as NavIcon,
  X,
  Search,
  Check,
  Globe,
  Sparkles,
  ArrowRight,
  Compass,
  Building2,
} from 'lucide-react';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  isCurrentLocation: boolean;
  onSelectLocation: (location: string, isGPS?: boolean) => void;
  onClearLocation: () => void;
}

interface DanceHubKnowledge {
  name: string;
  city: string;
  description: string;
  keywords: string[];
}

// Database of authentic dance clusters for intelligent prompt suggestions when users enter keywords
const DANCE_HUB_KNOWLEDGE: DanceHubKnowledge[] = [
  // Bhubaneswar Hubs
  {
    name: 'Patia, Bhubaneswar',
    city: 'Bhubaneswar',
    description: 'KIIT & Infocity corridor • 5+ verified hip-hop & contemporary academies',
    keywords: ['patia', 'kiit', 'infocity', 'bhubaneswar', 'odisha', '751024'],
  },
  {
    name: 'Saheed Nagar, Bhubaneswar',
    city: 'Bhubaneswar',
    description: 'Central cultural hub • Classical Odissi, Bollywood & wedding choreographers',
    keywords: ['saheed nagar', 'sahid nagar', 'vani vihar', 'bhubaneswar', '751007'],
  },
  {
    name: 'Jayadev Vihar, Bhubaneswar',
    city: 'Bhubaneswar',
    description: 'Near Mayfair & Pal Heights • Sprung hardwood floors & national intensives',
    keywords: ['jayadev vihar', 'jaydev', 'bhubaneswar', '751013'],
  },
  {
    name: 'Chandrasekharpur, Bhubaneswar',
    city: 'Bhubaneswar',
    description: 'North tech cluster • High-energy dance fitness, Zumba & K-pop crews',
    keywords: ['chandrasekharpur', 'cspur', 'damana', 'bhubaneswar', '751016'],
  },
  {
    name: 'Khandagiri, Bhubaneswar',
    city: 'Bhubaneswar',
    description: 'Heritage district • Traditional Odissi gurukuls & breaking cyphers',
    keywords: ['khandagiri', 'udayagiri', 'bhubaneswar', '751030'],
  },
  {
    name: 'Pokhariput, Bhubaneswar',
    city: 'Bhubaneswar',
    description: 'Aerodrome & Old Town road • Classical foundations & freestyle workshops',
    keywords: ['pokhariput', 'airport', 'bhubaneswar', '751020'],
  },
  {
    name: 'Nayapalli, Bhubaneswar',
    city: 'Bhubaneswar',
    description: 'IRC Village & Behera Sahi • Latin salsa, bachata & open battle arenas',
    keywords: ['nayapalli', 'irc village', 'bhubaneswar', '751015'],
  },
  {
    name: 'All Bhubaneswar, Odisha',
    city: 'Bhubaneswar',
    description: 'Entire smart city • All 12+ verified studios, workshops & jams',
    keywords: ['bhubaneswar', 'bbsr', 'odisha', 'capital'],
  },

  // Cuttack Hubs
  {
    name: 'CDA Sector 9, Cuttack',
    city: 'Cuttack',
    description: 'Modern dance cluster • Acrobatics, locking & street cypher venues',
    keywords: ['cda', 'cda sector 9', 'sector 9', 'sector 7', 'sector 10', 'cuttack', '753014'],
  },
  {
    name: 'Badambadi, Cuttack',
    city: 'Cuttack',
    description: 'Central transit zone • Commercial hip-hop, Sangeet choreo & troop rehearsals',
    keywords: ['badambadi', 'cuttack', 'bus stand', '753012'],
  },
  {
    name: 'College Square, Cuttack',
    city: 'Cuttack',
    description: 'Historic youth precinct near Ravenshaw • Freestyle battles & dance crews',
    keywords: ['college square', 'ravenshaw', 'cuttack', '753003'],
  },
  {
    name: 'Odia Bazar, Cuttack',
    city: 'Cuttack',
    description: 'Heritage performing arts • Odissi nritya mandirs & folk dance centers',
    keywords: ['odia bazar', 'purighat', 'cuttack', '753001'],
  },
  {
    name: 'All Cuttack, Odisha',
    city: 'Cuttack',
    description: 'Millennium silver city • All verified studios, battle events & faculty',
    keywords: ['cuttack', 'silver city', 'odisha'],
  },

  // National Dance Capitals
  {
    name: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    description: 'Bollywood, commercial jazz, international faculty & premier dance academies',
    keywords: ['mumbai', 'bombay', 'bandra', 'andheri', 'juhu', 'worli', 'maharashtra', '400050'],
  },
  {
    name: 'Delhi NCR',
    city: 'Delhi',
    description: 'National street cyphers, hip-hop jams, contemporary troupes & masterclasses',
    keywords: ['delhi', 'new delhi', 'ncr', 'gurgaon', 'noida', 'south delhi', '110001'],
  },
  {
    name: 'Bengaluru, Karnataka',
    city: 'Bengaluru',
    description: 'Indiranagar, Koramangala & HSR Layout dance hubs • Urban choreo & breaking',
    keywords: ['bengaluru', 'bangalore', 'indiranagar', 'koramangala', 'hsr', 'karnataka', '560038'],
  },
  {
    name: 'Kolkata, West Bengal',
    city: 'Kolkata',
    description: 'Salt Lake & Park Street • Classical Kathak, contemporary ballet & street crews',
    keywords: ['kolkata', 'calcutta', 'salt lake', 'park street', 'west bengal', '700001'],
  },
  {
    name: 'Pune, Maharashtra',
    city: 'Pune',
    description: 'Koregaon Park & FC Road • Latin socials, salsa congress & hip-hop intensives',
    keywords: ['pune', 'koregaon park', 'viman nagar', 'maharashtra', '411001'],
  },
  {
    name: 'Hyderabad, Telangana',
    city: 'Hyderabad',
    description: 'Jubilee Hills & Hitec City • Tollywood commercial, hip-hop & jazz funk',
    keywords: ['hyderabad', 'hitec city', 'jubilee hills', 'telangana', '500081'],
  },
];

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  isCurrentLocation,
  onSelectLocation,
  onClearLocation,
}) => {
  const [typedLocation, setTypedLocation] = useState('');
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Dynamically prompt matching dance hubs ONLY when user enters text (No preset choices by default)
  const dynamicPrompts = useMemo(() => {
    const raw = typedLocation.trim().toLowerCase();
    if (!raw) return [];

    return DANCE_HUB_KNOWLEDGE.filter((hub) => {
      const nameMatch = hub.name.toLowerCase().includes(raw);
      const cityMatch = hub.city.toLowerCase().includes(raw);
      const keywordMatch = hub.keywords.some((k) => k.includes(raw));
      return nameMatch || cityMatch || keywordMatch;
    }).slice(0, 5);
  }, [typedLocation]);

  const isNumericPincode = /^\d{3,6}$/.test(typedLocation.trim());

  const handleApplyTyped = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (typedLocation.trim()) {
      onSelectLocation(typedLocation.trim(), false);
      setTypedLocation('');
      onClose();
    }
  };

  const handleSelectPrompt = (locationName: string) => {
    onSelectLocation(locationName, false);
    setTypedLocation('');
    onClose();
  };

  const handleDetectCurrentLocation = () => {
    setIsDetectingGPS(true);
    setGpsError(null);

    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported by your browser.');
      setIsDetectingGPS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingGPS(false);
        const lat = position.coords.latitude.toFixed(2);
        const lon = position.coords.longitude.toFixed(2);
        const label = `Current Location (${lat}°, ${lon}°)`;
        onSelectLocation(label, true);
        onClose();
      },
      (error) => {
        setIsDetectingGPS(false);
        if (error.code === error.PERMISSION_DENIED) {
          onSelectLocation('Current Location (Detected)', true);
          onClose();
        } else {
          setGpsError('Unable to retrieve location automatically. Please enter your city or area.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0c0d11] border border-white/[0.12] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.08)] overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#111217]">
          <div>
            <span className="text-xs font-mono tracking-[0.25em] text-amber-300 uppercase font-bold block">
              PLATFORM GEOLOCATION
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
              Enter Your Dance Discovery Location
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Enter your city, neighborhood, or pincode. DanceOne will prompt matching dance studios, local workshops, and cyphers as you type.
          </p>

          {/* Location Entry Input Form */}
          <form onSubmit={handleApplyTyped} className="space-y-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                autoFocus
                value={typedLocation}
                onChange={(e) => setTypedLocation(e.target.value)}
                placeholder="Enter city, area, or pincode (e.g. Patia, Saheed Nagar, CDA, Mumbai)..."
                className="w-full pl-10 pr-24 py-3 bg-[#15161c] border border-white/[0.1] focus:border-amber-400/80 text-xs sm:text-sm text-white placeholder:text-zinc-500 rounded-xl outline-none transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!typedLocation.trim()}
                className="absolute right-2 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Apply
              </button>
            </div>
          </form>

          {/* DYNAMIC PROMPTS SECTION: Triggered as the user enters characters */}
          {typedLocation.trim().length > 0 ? (
            <div className="space-y-2 pt-1 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Prompted Suggestions for "{typedLocation}"</span>
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">Press Enter or Tap</span>
              </div>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {/* 1. Primary Direct Prompt */}
                <button
                  type="button"
                  onClick={() => handleSelectPrompt(typedLocation.trim())}
                  className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-left transition-all group flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-1.5 rounded-lg bg-amber-400 text-black shrink-0 font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white group-hover:text-amber-200 truncate">
                        Set location to "{typedLocation.trim()}"
                      </div>
                      <div className="text-[11px] text-amber-300/80 truncate">
                        Filter all studios, battles & workshops for this exact query
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </button>

                {/* 2. Pincode Prompt (if numbers entered) */}
                {isNumericPincode && (
                  <button
                    type="button"
                    onClick={() => handleSelectPrompt(`Pincode ${typedLocation.trim()}`)}
                    className="w-full p-2.5 rounded-xl bg-[#15161c] border border-white/10 hover:border-amber-500/50 text-left transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="p-1.5 rounded-lg bg-white/10 text-zinc-300 shrink-0">
                        <Compass className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-amber-200 truncate">
                          Explore Pincode {typedLocation.trim()}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          Locate dance batches & studios within 10 km radius
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white shrink-0 ml-2" />
                  </button>
                )}

                {/* 3. Matching Dance Hub Knowledge Prompts */}
                {dynamicPrompts.map((hub) => (
                  <button
                    key={hub.name}
                    type="button"
                    onClick={() => handleSelectPrompt(hub.name)}
                    className="w-full p-2.5 rounded-xl bg-[#15161c] border border-white/10 hover:border-amber-500/50 text-left transition-all group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="p-1.5 rounded-lg bg-white/10 text-amber-400 shrink-0">
                        <Building2 className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-amber-200 truncate">
                          {hub.name}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {hub.description}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* EMPTY INPUT STATE: Prompt instruction guidelines without preset chips */
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center space-y-2">
              <Compass className="w-6 h-6 text-zinc-500 mx-auto" />
              <p className="text-xs text-zinc-300 font-medium">
                No preset locations. Enter any city, district, area, or pincode above.
              </p>
              <p className="text-[11px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
                As you type, DanceOne will dynamically prompt verified dance hubs and nearby academies.
              </p>
            </div>
          )}

          {/* System Device Location Options (GPS / Global) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-white/[0.06]">
            {/* GPS Detection */}
            <button
              type="button"
              onClick={handleDetectCurrentLocation}
              disabled={isDetectingGPS}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                isCurrentLocation
                  ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-sm'
                  : 'bg-[#15161c] border-white/[0.08] hover:border-white/20 text-[#fafafa]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrentLocation ? 'bg-amber-400 text-black font-bold' : 'bg-white/[0.08] text-amber-300'
                }`}
              >
                <NavIcon className={`w-4 h-4 ${isDetectingGPS ? 'animate-spin' : ''}`} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold block truncate text-white">
                  {isDetectingGPS ? 'Locating...' : 'Use Device GPS'}
                </span>
                <span className="text-xs text-zinc-500 block truncate">
                  Auto-detect current coordinates
                </span>
              </div>
              {isCurrentLocation && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
            </button>

            {/* Global / Platform-wide */}
            <button
              type="button"
              onClick={() => {
                onClearLocation();
                onClose();
              }}
              className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                !currentLocation
                  ? 'bg-white/[0.08] border-white/30 text-white'
                  : 'bg-[#15161c] border-white/[0.08] hover:border-white/20 text-[#fafafa]'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center shrink-0 text-zinc-400">
                <Globe className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold block truncate text-white">
                  All Locations (Global)
                </span>
                <span className="text-xs text-zinc-500 block truncate">
                  Show platform-wide studios & events
                </span>
              </div>
              {!currentLocation && <Check className="w-4 h-4 text-white shrink-0" />}
            </button>
          </div>

          {gpsError && (
            <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
              {gpsError}
            </p>
          )}

          {/* Active Location Display */}
          {currentLocation && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-mono text-zinc-400">Active Filter:</span>
                <span className="text-xs font-bold text-white">{currentLocation}</span>
              </div>
              <button
                type="button"
                onClick={onClearLocation}
                className="text-xs font-mono text-zinc-400 hover:text-white uppercase tracking-wider underline transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
