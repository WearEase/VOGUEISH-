"use client";

import { useMemo, useState, useEffect } from "react";
import { Check, AlertCircle, MapPin, Loader2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Step = 1 | 2 | 3;

interface LeafletMap {
  remove: () => void;
  fitBounds: (bounds: unknown, options?: { padding: [number, number] }) => void;
}

interface LeafletMapContainer extends HTMLElement {
  _leaflet_map?: LeafletMap;
}

interface LeafletGlobal {
  map: (id: string) => {
    setView: (center: [number, number], zoom: number) => LeafletMap;
    remove: () => void;
    fitBounds: (bounds: unknown, options?: { padding: [number, number] }) => void;
  };
  tileLayer: (url: string, options?: { attribution: string }) => {
    addTo: (map: LeafletMap) => void;
  };
  divIcon: (options: { className?: string; html: string; iconSize: [number, number]; iconAnchor: [number, number] }) => unknown;
  marker: (latlng: [number, number], options?: { icon: unknown }) => {
    addTo: (map: LeafletMap) => {
      bindPopup: (content: string) => {
        openPopup: () => void;
      };
    };
  };
  polyline: (latlngs: Array<[number, number]>, options?: { color?: string; dashArray?: string; weight?: number }) => {
    addTo: (map: LeafletMap) => void;
  };
  latLngBounds: (bounds: Array<[number, number]>) => unknown;
}

// Real areas of Delhi with the largest number of NGOs according to the CSV sheet
const POPULAR_AREAS = ["Paharganj", "Pitampura", "Model Town"] as const;

interface NGO {
  name: string;
  area: string;
  address: string;
  lat: number;
  lon: number;
}

interface StoredDonation {
  id: string;
  ngoName: string;
  pickupDate: string;
  timeSlot: string;
  itemType: string;
  status: string;
  linkedTrialId: string;
}

const AREA_COORDINATES: Record<string, { lat: number; lon: number }> = {
  "yusuf sarai": { lat: 28.5604, lon: 77.2057 },
  "mahipalpur": { lat: 28.5482, lon: 77.1232 },
  "hauz khas": { lat: 28.5494, lon: 77.2001 },
  "gautam nagar": { lat: 28.5644, lon: 77.2110 },
  "panchsheel park": { lat: 28.5422, lon: 77.2140 },
  "east of kailash": { lat: 28.5583, lon: 77.2514 },
  "kailash colony": { lat: 28.5517, lon: 77.2435 },
  "rk puram": { lat: 28.5663, lon: 77.1764 },
  "laxmi nagar": { lat: 28.6304, lon: 77.2777 },
  "paharganj": { lat: 28.6433, lon: 77.2155 },
  "subzi mandi": { lat: 28.6675, lon: 77.2023 },
  "model town": { lat: 28.7027, lon: 77.1938 },
  "moti nagar": { lat: 28.6579, lon: 77.1424 },
  "vishnu garden": { lat: 28.6477, lon: 77.1009 },
  "new ashok nagar": { lat: 28.5910, lon: 77.3023 },
  "sarvodaya enclave": { lat: 28.5392, lon: 77.2033 },
  "mayur vihar": { lat: 28.6181, lon: 77.2995 },
  "patparganj": { lat: 28.6181, lon: 77.2995 },
  "jnu": { lat: 28.5397, lon: 77.1663 },
  "malviya nagar": { lat: 28.5284, lon: 77.2062 },
  "sangam vihar": { lat: 28.5034, lon: 77.2289 },
  "devli": { lat: 28.5034, lon: 77.2289 },
  "civil lines": { lat: 28.6829, lon: 77.2238 },
  "pitampura": { lat: 28.6990, lon: 77.1384 },
  "punjabi bagh": { lat: 28.6702, lon: 77.1264 },
  "kirti nagar": { lat: 28.6493, lon: 77.1437 },
  "nawada": { lat: 28.6214, lon: 77.0427 },
  "kalkaji": { lat: 28.5402, lon: 77.2588 },
  "dwarka": { lat: 28.5921, lon: 77.0460 },
  "uttam nagar": { lat: 28.6219, lon: 77.0601 },
  "mehrauli": { lat: 28.5173, lon: 77.1821 },
  "jahangirpuri": { lat: 28.7303, lon: 77.1705 },
  "jasola vihar": { lat: 28.5458, lon: 77.2882 },
  "green park": { lat: 28.5584, lon: 77.2039 },
  "rohini": { lat: 28.7083, lon: 77.1179 },
  "narela": { lat: 28.8527, lon: 77.0945 },
  "bawana": { lat: 28.8020, lon: 77.0371 },
  "burari": { lat: 28.7516, lon: 77.2015 },
  "alipur": { lat: 28.7997, lon: 77.1332 },
  "nangloi": { lat: 28.6836, lon: 77.0673 },
  "sultanpuri": { lat: 28.6974, lon: 77.0805 },
  "kirari": { lat: 28.7008, lon: 77.0560 },
  "mundka": { lat: 28.6766, lon: 77.0266 },
  "karala": { lat: 28.7346, lon: 77.0422 },
  "budh vihar": { lat: 28.7089, lon: 77.0924 },
  "paschim vihar": { lat: 28.6750, lon: 77.0950 },
  "rani khera": { lat: 28.7533, lon: 77.0471 },
  "adarsh nagar": { lat: 28.7160, lon: 77.1706 },
  "azadpur": { lat: 28.7071, lon: 77.1755 },
  "mukherjee nagar": { lat: 28.6946, lon: 77.2144 },
  "gtb nagar": { lat: 28.6934, lon: 77.2057 },
  "shalimar bagh": { lat: 28.7126, lon: 77.1585 },
  "ashok vihar": { lat: 28.6925, lon: 77.1724 },
  "shakurpur": { lat: 28.6883, lon: 77.1328 },
  "tri nagar": { lat: 28.6830, lon: 77.1558 },
  "ramesh nagar": { lat: 28.6479, lon: 77.1309 },
  "neb sarai": { lat: 28.5085, lon: 77.1996 },
  "badarpur": { lat: 28.5042, lon: 77.3009 },
  "shahdara": { lat: 28.6738, lon: 77.2885 },
  "krishna nagar": { lat: 28.6521, lon: 77.2829 },
  "preet vihar": { lat: 28.6418, lon: 77.2917 },
  "geeta colony": { lat: 28.6482, lon: 77.2721 },
  "mandawali": { lat: 28.6256, lon: 77.2968 },
  "janakpuri": { lat: 28.6226, lon: 77.0782 },
  "najafgarh": { lat: 28.6090, lon: 76.9859 },
  "karol bagh": { lat: 28.6514, lon: 77.1903 },
  "patel nagar": { lat: 28.6542, lon: 77.1610 },
  "daryaganj": { lat: 28.6418, lon: 77.2407 },
  "connaught place": { lat: 28.6304, lon: 77.2177 },
  "university area": { lat: 28.6889, lon: 77.2104 },
  "shakarpur": { lat: 28.6304, lon: 77.2777 },
  "delhi university": { lat: 28.6889, lon: 77.2104 },
  "rani bagh": { lat: 28.6990, lon: 77.1384 },
  "netaji subhash place": { lat: 28.6990, lon: 77.1384 }
};

function getCoordinatesForArea(area: string): { lat: number; lon: number } | null {
  const clean = area.toLowerCase().trim();
  for (const [key, coords] of Object.entries(AREA_COORDINATES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return coords;
    }
  }
  return null;
}

function parseCSVLine(line: string) {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function cn(...v: Array<string | false | undefined | null>) {
  return v.filter(Boolean).join(" ");
}

function CircleStep({
  label,
  state,
}: {
  label: string;
  state: "done" | "active" | "todo";
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full border text-xs",
          state === "done" && "border-emerald-600 bg-emerald-600 text-white",
          state === "active" && "border-emerald-600 bg-emerald-50 text-emerald-700",
          state === "todo" && "border-zinc-200 bg-white text-zinc-500"
        )}
        aria-hidden="true"
      >
        {state === "done" ? <Check className="h-4 w-4" /> : ""}
      </div>
      <div
        className={cn(
          "text-xs font-medium",
          state === "todo" ? "text-zinc-500" : "text-zinc-900"
        )}
      >
        {label}
      </div>
    </div>
  );
}

function StepConnector({ active }: { active?: boolean }) {
  return (
    <div className={cn("h-[2px] w-20 rounded-full", active ? "bg-emerald-600" : "bg-zinc-200")} />
  );
}

function Stepper({ step }: { step: Step }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <CircleStep label="1. Select Location" state={step > 1 ? "done" : step === 1 ? "active" : "todo"} />
      <StepConnector active={step >= 2} />
      <CircleStep label="2. Schedule pickup" state={step > 2 ? "done" : step === 2 ? "active" : "todo"} />
      <StepConnector active={step >= 3} />
      <CircleStep label="3. Track impact" state={step === 3 ? "active" : "todo"} />
    </div>
  );
}

export default function DonateFromAnywhere() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [officeQuery, setOfficeQuery] = useState("");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");
  const selectedSlot = useMemo(() => {
    const formatTime12 = (t: string) => {
      if (!t) return "";
      const [hStr, mStr] = t.split(":");
      const h = parseInt(hStr, 10);
      const m = mStr || "00";
      const ampm = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 === 0 ? 12 : h % 12;
      return `${displayH}:${m} ${ampm}`;
    };
    return `${formatTime12(startTime)}–${formatTime12(endTime)}`;
  }, [startTime, endTime]);
  const [monthCursor, setMonthCursor] = useState(() => new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 2, 15));
  const donationTypeLabel = "Formal wear";
  const trackingId = useMemo(() => `#VOG-DON-${Math.floor(10000 + Math.random() * 90000)}`, []);

  // NGO and geocoding state
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [allAreas, setAllAreas] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [searchedCoordinates, setSearchedCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [geocodedMessage, setGeocodedMessage] = useState<string>("");
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.head.appendChild(script);
    } else {
      if ((window as unknown as { L?: LeafletGlobal }).L) {
        setLeafletLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!leafletLoaded) return;
    const L = (window as unknown as { L?: LeafletGlobal }).L;
    if (!L) return;

    if (step < 3) {
      if (!searchedCoordinates) return;
      const container = document.getElementById("leaflet-map");
      if (!container) return;

      let map = (container as LeafletMapContainer)._leaflet_map;
      if (map) {
        map.remove();
      }

      const { lat, lon } = searchedCoordinates;
      map = L.map("leaflet-map").setView([lat, lon], 13);
      (container as LeafletMapContainer)._leaflet_map = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #3b82f6; border: 2px solid white; border-radius: 50%; width: 22px; height: 22px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 8px; font-weight: bold; line-height: 1;">You</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const ngoIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #10b981; border: 2px solid white; border-radius: 50%; width: 26px; height: 26px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 12px; line-height: 1;">🏢</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      L.marker([lat, lon], { icon: userIcon })
        .addTo(map)
        .bindPopup(`<div style="font-size: 11px; font-weight: bold; color: #1f2937;">Your Location</div>`)
        .openPopup();

      const currentRegionNgos = ngos.filter(
        (n) => n.area.toLowerCase() === selectedArea.toLowerCase()
      );

      currentRegionNgos.forEach((ngo) => {
        let finalLat = ngo.lat;
        let finalLon = ngo.lon;
        if (Math.abs(ngo.lat - lat) < 0.0001 && Math.abs(ngo.lon - lon) < 0.0001) {
          finalLat += (Math.random() - 0.5) * 0.003;
          finalLon += (Math.random() - 0.5) * 0.003;
        }

        L.marker([finalLat, finalLon], { icon: ngoIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-size: 11px; width: 150px; text-align: left;">
               <div style="font-weight: bold; color: #065f46;">${ngo.name}</div>
               <div style="color: #6b7280; margin-top: 4px; line-height: 1.2;">${ngo.address}</div>
             </div>`
          );
      });

      if (currentRegionNgos.length > 0) {
        const bounds = L.latLngBounds([
          [lat, lon],
          ...currentRegionNgos.map(n => [n.lat, n.lon] as [number, number])
        ]);
        map.fitBounds(bounds, { padding: [40, 40] });
      }

      return () => {
        if (map) {
          map.remove();
          delete (container as LeafletMapContainer)._leaflet_map;
        }
      };
    } else {
      const container = document.getElementById("leaflet-map-journey");
      if (!container) return;

      let map = (container as LeafletMapContainer)._leaflet_map;
      if (map) {
        map.remove();
      }

      const uLat = searchedCoordinates?.lat || 28.6514;
      const uLon = searchedCoordinates?.lon || 77.1903;
      const shLat = 28.6304;
      const shLon = 77.2177;
      let ngoLat = 28.5604;
      let ngoLon = 77.2057;
      let ngoName = "Smile Foundation";

      if (selectedArea) {
        const areaNgos = ngos.filter(n => n.area.toLowerCase() === selectedArea.toLowerCase());
        if (areaNgos.length > 0) {
          ngoLat = areaNgos[0].lat;
          ngoLon = areaNgos[0].lon;
          ngoName = areaNgos[0].name;
        }
      }

      map = L.map("leaflet-map-journey").setView([shLat, shLon], 11);
      (container as LeafletMapContainer)._leaflet_map = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #3b82f6; border: 2px solid white; border-radius: 50%; width: 22px; height: 22px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 8px; font-weight: bold; line-height: 1;">You</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const hubIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #f59e0b; border: 2px solid white; border-radius: 50%; width: 26px; height: 26px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 11px; line-height: 1;">🏭</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const ngoIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #10b981; border: 2px solid white; border-radius: 50%; width: 26px; height: 26px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 12px; line-height: 1;">🏢</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      L.marker([uLat, uLon], { icon: userIcon }).addTo(map).bindPopup("Your Location");
      L.marker([shLat, shLon], { icon: hubIcon }).addTo(map).bindPopup("Vogueish Sorting Hub");
      L.marker([ngoLat, ngoLon], { icon: ngoIcon }).addTo(map).bindPopup(`Partner NGO: ${ngoName}`);

      L.polyline([[uLat, uLon], [shLat, shLon]], {
        color: '#3b82f6',
        dashArray: '5, 8',
        weight: 3
      }).addTo(map);

      L.polyline([[shLat, shLon], [ngoLat, ngoLon]], {
        color: '#10b981',
        dashArray: '5, 8',
        weight: 3
      }).addTo(map);

      const bounds = L.latLngBounds([[uLat, uLon], [shLat, shLon], [ngoLat, ngoLon]]);
      map.fitBounds(bounds, { padding: [50, 50] });

      return () => {
        if (map) {
          map.remove();
          delete (container as LeafletMapContainer)._leaflet_map;
        }
      };
    }
  }, [leafletLoaded, searchedCoordinates, selectedArea, ngos, step]);

  useEffect(() => {
    async function loadNGOs() {
      try {
        const res = await fetch("/VOGUEISH NGOs Sheet - Sheet1.csv");
        const csvText = await res.text();
        const lines = csvText.split(/\r?\n/);
        const parsedNGOs: NGO[] = [];
        const areas = new Set<string>();

        for (const line of lines) {
          if (!line.trim()) continue;
          const cols = parseCSVLine(line);
          if (cols.length < 2) continue;
          
          let [name, area, address] = cols;
          if (!area || !name) continue;
          
          const nameLower = name.toLowerCase();
          const areaLower = area.toLowerCase();
          if (
            nameLower === 'ngo name' || 
            nameLower === 'ngo' || 
            nameLower === 'area' || 
            areaLower === 'area' || 
            areaLower === 'ngo' ||
            nameLower.includes("belt") ||
            (nameLower.includes("delhi") && area === "" && address === "")
          ) {
            continue;
          }
          
          name = name.replace(/^"|"$/g, '').trim();
          area = area.replace(/^"|"$/g, '').trim();
          address = (address || "").replace(/^"|"$/g, '').trim();
          
          const coords = getCoordinatesForArea(area);
          const lat = coords ? coords.lat : 28.6139;
          const lon = coords ? coords.lon : 77.2090;
          
          parsedNGOs.push({ name, area, address, lat, lon });
          areas.add(area);
        }
        
        setNgos(parsedNGOs);
        setAllAreas(Array.from(areas).sort());
      } catch (err) {
        console.error("Error loading NGOs CSV:", err);
      }
    }
    loadNGOs();
  }, []);

  const monthLabel = useMemo(() => {
    const month = monthCursor.toLocaleString("en-US", { month: "long" });
    return `${month} ${monthCursor.getFullYear()}`;
  }, [monthCursor]);

  const calendar = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const leading = first.getDay();
    const days = last.getDate();
    const cells: Array<{ date: Date | null; day: number | null }> = [];

    for (let i = 0; i < leading; i++) cells.push({ date: null, day: null });
    for (let d = 1; d <= days; d++) cells.push({ date: new Date(year, month, d), day: d });
    while (cells.length % 7 !== 0) cells.push({ date: null, day: null });
    return cells;
  }, [monthCursor]);

  const filteredAreas = useMemo(() => {
    const q = officeQuery.trim().toLowerCase();
    if (!q) return [];
    return allAreas.filter(a => a.toLowerCase().includes(q)).slice(0, 5);
  }, [officeQuery, allAreas]);

  const canContinueToSchedule = Boolean(selectedArea);
  const canConfirmPickup = Boolean(selectedArea && selectedDate && selectedSlot);

  // mapUrl removed because we now use inline Leaflet maps instead of OSM iframe

  const handleSelectArea = (areaName: string) => {
    setSelectedArea(areaName);
    setOfficeQuery(areaName);
    setShowDropdown(false);
    setGeocodedMessage("");
    
    const matchedNgo = ngos.find(n => n.area.toLowerCase() === areaName.toLowerCase());
    if (matchedNgo) {
      setSearchedCoordinates({ lat: matchedNgo.lat, lon: matchedNgo.lon });
    } else {
      const coords = getCoordinatesForArea(areaName);
      if (coords) {
        setSearchedCoordinates(coords);
      }
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    const match = allAreas.find(a => a.toLowerCase() === query.toLowerCase().trim());
    if (match) {
      handleSelectArea(match);
      return;
    }
    
    setIsGeocoding(true);
    setGeocodedMessage("");
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Delhi')}&format=json&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        
        let closestArea = "";
        let minDistance = Infinity;
        
        for (const ngo of ngos) {
          const dist = getDistance(lat, lon, ngo.lat, ngo.lon);
          if (dist < minDistance) {
            minDistance = dist;
            closestArea = ngo.area;
          }
        }
        
        if (closestArea) {
          setSelectedArea(closestArea);
          setSearchedCoordinates({ lat, lon });
          setGeocodedMessage(`Mapped to closest NGO area: ${closestArea} (~${minDistance.toFixed(1)} km away)`);
          toast.success(`Found location! Mapped to closest area: ${closestArea}`);
        } else {
          toast.error("Could not find any nearby partner NGOs.");
        }
      } else {
        toast.error("Location not found in Delhi region. Please check spelling.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      toast.error("Failed to lookup location. Please try again.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const currentAreaNgos = useMemo(() => {
    if (!selectedArea) return [];
    return ngos.filter(n => n.area.toLowerCase() === selectedArea.toLowerCase());
  }, [selectedArea, ngos]);

  const handleConfirmPickup = () => {
    let finalNgoName = "Smile Foundation";
    if (selectedArea) {
      const areaNgos = ngos.filter(n => n.area.toLowerCase() === selectedArea.toLowerCase());
      if (areaNgos.length > 0) {
        finalNgoName = areaNgos[0].name;
      }
    }
    
    const newDonation = {
      id: trackingId,
      ngoName: finalNgoName,
      pickupDate: selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "15 Jun 2026",
      timeSlot: selectedSlot,
      itemType: `${donationTypeLabel} (5 Items)`,
      status: "Pickup Scheduled",
      linkedTrialId: "HT-2931"
    };

    try {
      const existingStr = localStorage.getItem("profileDonations");
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const filtered = Array.isArray(existing) ? (existing as StoredDonation[]).filter((d: StoredDonation) => d.id !== trackingId) : [];
      localStorage.setItem("profileDonations", JSON.stringify([newDonation, ...filtered]));
      toast.success("Donation scheduled successfully!");
    } catch (err) {
      console.error("Error saving donation to profile:", err);
    }
    
    setStep(3);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-zinc-50 to-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-24">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-4xl text-zinc-900">Donate From Anywhere</h1>
        </div>

        <Stepper step={step} />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 text-left">
          {/* LEFT CARD */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {step === 1 && (
              <>
                <h2 className="font-serif text-3xl text-zinc-900">Select Location</h2>

                <div className="mt-4">
                  <div className="mt-2 relative">
                    <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
                      <span className="text-zinc-400">⌕</span>
                      <input
                        value={officeQuery}
                        onChange={(e) => {
                          setOfficeQuery(e.target.value);
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch(officeQuery);
                            setShowDropdown(false);
                          }
                        }}
                        className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                        placeholder="Search Delhi area..."
                      />
                      {isGeocoding && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
                      <button
                        type="button"
                        onClick={() => handleSearch(officeQuery)}
                        className="text-xs bg-zinc-900 text-white px-2.5 py-1 rounded hover:bg-zinc-800 transition"
                      >
                        Search
                      </button>
                    </div>

                    {showDropdown && filteredAreas.length > 0 && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                        <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-zinc-250 rounded-lg shadow-lg z-20">
                          <div className="p-2 text-left">
                            <p className="text-[10px] uppercase font-bold text-zinc-400 px-2 mb-1">Delhi Region Areas</p>
                            {filteredAreas.map((area) => (
                              <button
                                key={area}
                                type="button"
                                onClick={() => handleSelectArea(area)}
                                className="w-full text-left px-2 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 rounded"
                              >
                                📍 {area}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {POPULAR_AREAS.map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => handleSelectArea(area)}
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs transition-colors",
                          selectedArea === area
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                        )}
                      >
                        {area}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      disabled={!canContinueToSchedule}
                      onClick={() => setStep(2)}
                      className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                    >
                      Continue
                    </button>
                    <button
                      type="button"
                      className="text-sm text-zinc-500 underline-offset-4 hover:underline"
                    >
                      Save for later
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-serif text-3xl text-zinc-900">Schedule your pickup</h2>

                {/* Calendar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm font-medium text-zinc-900">
                    <button
                      type="button"
                      aria-label="Previous month"
                      onClick={() =>
                        setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
                      }
                      className="px-2 text-zinc-500 hover:text-zinc-900"
                    >
                      ‹
                    </button>
                    <div className="text-xs font-semibold text-zinc-900">{monthLabel}</div>
                    <button
                      type="button"
                      aria-label="Next month"
                      onClick={() =>
                        setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
                      }
                      className="px-2 text-zinc-500 hover:text-zinc-900"
                    >
                      ›
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <div key={d} className="py-1">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center">
                    {calendar.map((cell, idx) => {
                      const isSelected =
                        !!cell.date &&
                        !!selectedDate &&
                        cell.date.getFullYear() === selectedDate.getFullYear() &&
                        cell.date.getMonth() === selectedDate.getMonth() &&
                        cell.date.getDate() === selectedDate.getDate();

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={!cell.date}
                          onClick={() => cell.date && setSelectedDate(cell.date)}
                          className={cn(
                            "h-9 w-9 rounded-full text-sm",
                            !cell.date && "cursor-default",
                            cell.date && !isSelected && "hover:bg-zinc-100 text-zinc-900",
                            isSelected && "bg-emerald-600 text-white"
                          )}
                        >
                          {cell.day ?? ""}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <div className="mt-5">
                  <div className="text-xs font-semibold text-zinc-900 mb-3">Custom time slots</div>
                  <div className="flex flex-col sm:flex-row gap-4 items-center bg-zinc-50 border border-zinc-200 rounded-2xl p-4">
                    <div className="w-full">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Start Time</label>
                      <div className="relative flex items-center">
                        <Clock className="absolute left-3 text-zinc-400 w-4 h-4" />
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-500 outline-none text-zinc-800"
                        />
                      </div>
                    </div>
                    <div className="text-zinc-400 font-medium hidden sm:block text-xs mt-4">to</div>
                    <div className="w-full">
                      <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">End Time</label>
                      <div className="relative flex items-center">
                        <Clock className="absolute left-3 text-zinc-400 w-4 h-4" />
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:ring-1 focus:ring-emerald-500 outline-none text-zinc-800"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-zinc-550 text-left">
                    Selected interval: <span className="font-semibold text-emerald-700">{selectedSlot}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-4">
                  <button
                    type="button"
                    disabled={!canConfirmPickup}
                    onClick={handleConfirmPickup}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
                  >
                    Confirm pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-zinc-500 underline-offset-4 hover:underline"
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="text-center">
                  <h2 className="font-serif text-3xl text-zinc-900">Donation Confirmed!</h2>
                  <div className="mt-4 flex justify-center text-emerald-600">
                    <Check className="h-16 w-16" />
                  </div>
                  <p className="mt-4 text-sm text-zinc-650">
                    Thank you for your donation. Your pickup has been scheduled.
                  </p>
                </div>

                <div className="mt-6 rounded-lg border border-zinc-200 bg-white">
                  <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 text-left">
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="w-28 text-zinc-500">Tracking ID:</span>
                        <span className="font-medium text-zinc-900">{trackingId}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-28 text-zinc-500">Pickup Schedule:</span>
                        <span className="text-zinc-900">
                          {selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
                          {"  |  "}{selectedSlot}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-28 text-zinc-500">Location:</span>
                        <span className="text-zinc-900">{selectedArea || "—"}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-28 text-zinc-500">NGO Partner:</span>
                        <span className="text-zinc-900">
                          {selectedArea && ngos.filter(n => n.area.toLowerCase() === selectedArea.toLowerCase()).length > 0 ? 
                            ngos.filter(n => n.area.toLowerCase() === selectedArea.toLowerCase())[0].name : "Smile Foundation"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-28 text-zinc-500">Donation Type:</span>
                        <span className="text-zinc-900">{donationTypeLabel}</span>
                      </div>
                    </div>

                    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-600" />
                        Pickup Scheduled
                      </div>

                      <div className="mt-3 space-y-2 text-sm text-zinc-700">
                        {["In Transit", "Received at Hub", "Sorted", "Delivered to NGO"].map((label) => (
                          <div key={label} className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-zinc-300" />
                            <span>{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-center">
                    <button
                      type="button"
                      onClick={() => router.push("/my-account#my-donations")}
                      className="inline-flex h-10 w-full items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-medium text-white hover:bg-emerald-700 sm:w-auto transition-colors"
                    >
                      View My Donations
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 w-full items-center justify-center rounded-full border border-emerald-200 bg-white px-6 text-sm font-medium text-emerald-700 hover:bg-emerald-50 sm:w-auto"
                    >
                      Share Impact
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT CARD */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            {step < 3 ? (
              <>
                <h3 className="text-lg font-semibold text-zinc-900">
                  Donation Location Info
                </h3>

                <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white">
                    <div id="leaflet-map" className="w-full h-full z-0" />
                  </div>
                </div>

                {geocodedMessage && (
                  <div className="mt-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-2.5 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{geocodedMessage}</span>
                  </div>
                )}

                <div className="mt-4 text-left">
                  {selectedArea ? (
                    <>
                      <div className="text-sm font-semibold text-zinc-900">Selected Area: {selectedArea}</div>
                      <div className="mt-3">
                        <p className="text-sm text-zinc-650 font-semibold mb-2">Partner NGOs in this area:</p>
                        {currentAreaNgos.length === 0 ? (
                          <p className="text-xs text-zinc-500">No direct partner NGOs listed. We will route to the nearest facility.</p>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {currentAreaNgos.map((ngo, idx) => (
                              <div key={idx} className="bg-zinc-50 border border-zinc-250 p-2.5 rounded-lg">
                                <div className="text-xs font-semibold text-zinc-800 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                  {ngo.name}
                                </div>
                                <div className="text-[10px] text-zinc-500 mt-1 leading-normal">{ngo.address}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-zinc-500">Search or select a location to view partner NGOs in the area.</p>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="font-serif text-3xl text-zinc-900">Your donation’s journey</h3>

                <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white">
                    <div id="leaflet-map-journey" className="w-full h-full z-0" />
                  </div>
                </div>

                <p className="mt-4 text-sm text-zinc-600">
                  Your clothes are on their way to be sorted and delivered to our partners. Follow their journey here.
                </p>
              </>
            )}
          </div>
        </div>
        {/* Bottom stats strip */}
        <div className="mt-10 rounded-xl border border-zinc-200 bg-white px-6 py-5 shadow-sm">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <div className="text-lg font-semibold text-zinc-900">2,431 kg</div>
              <div className="text-xs text-zinc-500">textiles diverted from landfill</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-lg font-semibold text-zinc-900">1,120</div>
              <div className="text-xs text-zinc-500"> Donors engaged</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-lg font-semibold text-zinc-900">7</div>
              <div className="text-xs text-zinc-500">partner NGOs onboarded</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-div-icon {
          background: none !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}