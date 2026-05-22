import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import DonationCard from "../components/DonationCard";
import { haversineDistance } from "../utils/haversine";

// Default Blue Icon for Donations
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom Red Marker for User's "You" Location
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function FindFoodPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [radius, setRadius] = useState(20);
  const [filter, setFilter] = useState("all");
  const [userCoords, setUserCoords] = useState(null);

  // UI States
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const mapWrapperRef = useRef(null);

  const defaultCenter = [22.581373, 88.349279]; // Fallback Center

  // Initial Load: Auto-fetch Live GPS Location
  useEffect(() => {
    const fetchInitialLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setIsInitializing(false);
          },
          (error) => {
            console.warn("GPS access denied or failed, using fallback.", error);
            fallbackToRegisteredLocation();
          },
          { enableHighAccuracy: true, timeout: 5000 },
        );
      } else {
        fallbackToRegisteredLocation();
      }
    };

    const fallbackToRegisteredLocation = () => {
      if (user?.location?.coordinates && user.location.coordinates[0] !== 0) {
        setUserCoords({
          lat: user.location.coordinates[1],
          lng: user.location.coordinates[0],
        });
      } else {
        setUserCoords({ lat: defaultCenter[0], lng: defaultCenter[1] });
      }
      setIsInitializing(false);
    };

    fetchInitialLocation();
  }, [user]);

  // Fullscreen Event Listener (to handle 'Esc' key exits correctly)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Force Leaflet to recalculate its size after a short delay so tiles render correctly
      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 200);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Fetch Donations whenever Coords or Radius change
  const fetchDonations = useCallback(async () => {
    if (!userCoords) return;
    setIsRefreshing(true);
    try {
      const res = await api.get(
        `/donations?lat=${userCoords.lat}&lng=${userCoords.lng}&radius=${radius}&status=available`,
      );
      setDonations(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  }, [userCoords, radius]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  // Filter Donations
  const filteredDonations = donations.filter((d) => {
    const isNotExpired = new Date(d.expiry_datetime) > new Date();
    const matchesFilter = filter === "all" || d.food_type === filter;
    return isNotExpired && matchesFilter;
  });

  // Handle Dragging the Red Marker
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = userMarkerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setUserCoords({ lat: newPos.lat, lng: newPos.lng });
        }
      },
    }),
    [],
  );

  // Action Handlers
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(newCoords);
        setIsLocating(false);
        if (mapRef.current) {
          mapRef.current.flyTo([newCoords.lat, newCoords.lng], 14, {
            animate: true,
          });
        }
      },
      (error) => {
        alert(
          "Unable to retrieve your location. Please check browser permissions.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  const handleResetMap = () => {
    if (user?.location?.coordinates && user.location.coordinates[0] !== 0) {
      const resetCoords = {
        lat: user.location.coordinates[1],
        lng: user.location.coordinates[0],
      };
      setUserCoords(resetCoords);
      if (mapRef.current) {
        mapRef.current.flyTo([resetCoords.lat, resetCoords.lng], 13, {
          animate: true,
        });
      }
    } else {
      alert("No registered home location found. Use 'Locate GPS' instead.");
    }
  };

  const handleClaim = async (donationId) => {
    try {
      await api.post("/claims", { donation_id: donationId });
      alert("✅ Request sent successfully! Waiting for donor approval.");
      fetchDonations();
    } catch (err) {
      alert(err.response?.data?.message || "Claim failed");
    }
  };

  // --- Map View Controls (Fullscreen & Fit Area) ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (mapWrapperRef.current.requestFullscreen) {
        mapWrapperRef.current
          .requestFullscreen()
          .catch((err) => console.log(err));
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleFitArea = () => {
    if (mapRef.current && userCoords) {
      const bounds = L.latLngBounds(
        [userCoords.lat, userCoords.lng],
        [userCoords.lat, userCoords.lng],
      );
      filteredDonations.forEach((d) => {
        if (d.location?.coordinates) {
          bounds.extend([d.location.coordinates[1], d.location.coordinates[0]]);
        }
      });
      mapRef.current.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  };

  const filterBtnClass = (active) =>
    `px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap border ${active ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`;

  // Loading State
  if (isInitializing || !userCoords) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-emerald-700">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-600 mb-4"></div>
        <p className="font-bold text-lg">Finding your location...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Controls */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Live Food Map
          </h1>
          <p className="text-gray-500 mt-1">
            Showing real-time donations within{" "}
            <strong className="text-emerald-600">{radius} km</strong>
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap justify-end gap-2">
            <button
              onClick={fetchDonations}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-xl shadow-sm hover:bg-emerald-100 transition-colors text-sm"
            >
              {isRefreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
            </button>
            <button
              onClick={handleLocateMe}
              disabled={isLocating}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-white border-2 border-emerald-500 text-emerald-600 font-bold rounded-xl shadow-sm hover:bg-emerald-50 transition-colors text-sm"
            >
              {isLocating ? "🎯 Locating..." : "🎯 Locate GPS"}
            </button>
            <button
              onClick={handleResetMap}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-100 transition-colors text-sm"
            >
              ↩️ Home
            </button>
          </div>
          <div className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded shadow-inner">
            Lat: {userCoords.lat.toFixed(4)}, Lng: {userCoords.lng.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="flex items-center gap-4 w-full md:w-1/2 flex-shrink-0">
          <label className="font-semibold text-gray-700 whitespace-nowrap">
            Search Radius: {radius} km
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto pb-2 md:pb-0 overflow-x-auto">
          <button
            className={filterBtnClass(filter === "all")}
            onClick={() => setFilter("all")}
          >
            All Types
          </button>
          <button
            className={filterBtnClass(filter === "vegetarian")}
            onClick={() => setFilter("vegetarian")}
          >
            🥦 Veg Only
          </button>
          <button
            className={filterBtnClass(filter === "non-vegetarian")}
            onClick={() => setFilter("non-vegetarian")}
          >
            🍗 Non-Veg
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white p-3 rounded-3xl shadow-sm border border-gray-200 mb-10 relative">
        {/* Floating helper badge */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md border border-emerald-100 shadow-md px-3 py-1.5 rounded-lg pointer-events-none flex items-center gap-2">
          <span className="text-lg leading-none">💡</span>
          <span className="text-emerald-800 font-bold text-xs tracking-wide">
            Drag red pin to search
          </span>
        </div>

        {/* MAP CONTAINER WRAPPER (Handles Fullscreen logic) */}
        <div
          ref={mapWrapperRef}
          className={`relative z-0 overflow-hidden bg-gray-50 ${isFullscreen ? "h-screen w-screen" : "h-[400px] md:h-[500px] w-full rounded-2xl"}`}
        >
          {/* Custom Production Map Controls (Floating Top-Right) */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            {/* View Desired Area (Fit Bounds) Button */}
            <button
              onClick={handleFitArea}
              title="Fit all food in view"
              className="bg-white text-gray-700 p-2 rounded-lg shadow-md border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center w-10 h-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              className="bg-white text-gray-700 p-2 rounded-lg shadow-md border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center w-10 h-10"
            >
              {isFullscreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              )}
            </button>
          </div>

          <MapContainer
            center={[userCoords.lat, userCoords.lng]}
            zoom={13}
            ref={mapRef}
            className="h-full w-full z-0"
            zoomControl={false} // Disable default zoom to put ours below custom controls if desired
          >
            {/* Re-add default zoom controls on the bottom-right so they don't clash */}
            <div className="leaflet-bottom leaflet-right mb-6 mr-2">
              <div className="leaflet-control-zoom leaflet-bar leaflet-control">
                <a
                  className="leaflet-control-zoom-in"
                  href="#"
                  title="Zoom in"
                  role="button"
                  aria-label="Zoom in"
                  onClick={(e) => {
                    e.preventDefault();
                    mapRef.current.zoomIn();
                  }}
                >
                  +
                </a>
                <a
                  className="leaflet-control-zoom-out"
                  href="#"
                  title="Zoom out"
                  role="button"
                  aria-label="Zoom out"
                  onClick={(e) => {
                    e.preventDefault();
                    mapRef.current.zoomOut();
                  }}
                >
                  −
                </a>
              </div>
            </div>

            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <Marker
              draggable={true}
              eventHandlers={eventHandlers}
              position={[userCoords.lat, userCoords.lng]}
              icon={userIcon}
              ref={userMarkerRef}
            >
              <Popup>
                <div className="text-center p-1">
                  <strong className="text-red-600 block mb-1">
                    📍 Search Center
                  </strong>
                  <span className="text-xs text-gray-500 font-mono block mb-1">
                    {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
                  </span>
                  <span className="text-[10px] text-gray-400 italic">
                    Drag to update search area
                  </span>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[userCoords.lat, userCoords.lng]}
              radius={radius * 1000}
              pathOptions={{
                color: "#10B981",
                fillColor: "#10B981",
                fillOpacity: 0.06,
                weight: 1.5,
              }}
            />

            {filteredDonations.map(
              (d) =>
                d.location?.coordinates && (
                  <Marker
                    key={d._id}
                    position={[
                      d.location.coordinates[1],
                      d.location.coordinates[0],
                    ]}
                  >
                    <Popup>
                      <div className="text-center p-1">
                        <strong className="text-emerald-700 block mb-1">
                          {d.food_title}
                        </strong>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block mb-2 font-medium border border-gray-200">
                          👥 {d.quantity}
                        </span>
                        <br />
                        <span className="text-xs text-gray-400 font-mono">
                          Lat: {d.location.coordinates[1].toFixed(3)}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                ),
            )}
          </MapContainer>
        </div>
      </div>

      {/* Results Header */}
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3">
        {filteredDonations.length > 0 && (
          <span className="bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full text-lg shadow-sm border border-emerald-200">
            {filteredDonations.length}
          </span>
        )}
        Available Donations
      </h2>

      {/* Results Grid */}
      {filteredDonations.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="text-5xl mb-4 opacity-50">📭</div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">
            No food found nearby
          </h3>
          <p className="text-gray-500">
            Try dragging the red pin, expanding the radius, or clicking Refresh.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((d) => {
            const dist = haversineDistance(
              userCoords.lat,
              userCoords.lng,
              d.location.coordinates[1],
              d.location.coordinates[0],
            );
            return (
              <DonationCard
                key={d._id}
                donation={d}
                distanceKm={dist}
                onClaim={handleClaim}
                userRole={user?.role}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
