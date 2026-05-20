import React, { useState, useEffect, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import DonationCard from "../components/DonationCard";
import { haversineDistance } from "../utils/haversine";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
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

  // Changed default radius to 20 to match your requested seed data radius
  const [radius, setRadius] = useState(20);
  const [filter, setFilter] = useState("all");
  const [userCoords, setUserCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Default Fallback Center (Lat: 22.47517, Lng: 88.41864)
  const defaultCenter = [22.47517, 88.41864];

  // BUG FIX: Ensure userCoords ALWAYS has a value so the fetch hook triggers
  useEffect(() => {
    if (user?.location?.coordinates && user.location.coordinates[0] !== 0) {
      // MongoDB stores [lng, lat]
      setUserCoords({
        lat: user.location.coordinates[1],
        lng: user.location.coordinates[0],
      });
    } else {
      // Fallback to target area if user registered without GPS
      setUserCoords({ lat: defaultCenter[0], lng: defaultCenter[1] });
    }
  }, [user]);

  const fetchDonations = useCallback(async () => {
    if (!userCoords) return; // Wait until coords are set
    try {
      const res = await api.get(
        `/donations?lat=${userCoords.lat}&lng=${userCoords.lng}&radius=${radius}&status=available`,
      );
      setDonations(res.data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [userCoords, radius]);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const handleClaim = async (donationId) => {
    try {
      await api.post("/claims", { donation_id: donationId });
      alert("✅ Claimed successfully!");
      fetchDonations(); // Refresh list after claiming
    } catch (err) {
      alert(err.response?.data?.message || "Claim failed");
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert(
          "Unable to retrieve your location. Please check browser permissions.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  const filteredDonations = donations.filter(
    (d) => filter === "all" || d.food_type === filter,
  );
  const filterBtnClass = (active) =>
    `px-4 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap border ${active ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`;

  // Don't render map until coords are set to prevent Leaflet crash
  if (!userCoords)
    return (
      <div className="p-10 text-center text-gray-500">Loading map data...</div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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

        <div className="flex flex-col items-end">
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-white border-2 border-emerald-500 text-emerald-600 font-bold rounded-xl shadow-sm hover:bg-emerald-50 transition-colors"
          >
            {isLocating ? "🎯 Locating..." : "🎯 Locate Me"}
          </button>
          {userCoords && (
            <div className="mt-2 text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Lat: {userCoords.lat.toFixed(5)}, Lng: {userCoords.lng.toFixed(5)}
            </div>
          )}
        </div>
      </div>

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
            className="w-full accent-emerald-600"
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

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-200 mb-10 relative">
        <MapContainer
          center={[userCoords.lat, userCoords.lng]}
          zoom={13}
          className="h-[400px] md:h-[500px] w-full rounded-2xl z-0"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <MapUpdater center={[userCoords.lat, userCoords.lng]} />

          <Marker position={[userCoords.lat, userCoords.lng]}>
            <Popup>
              <div className="text-center p-1">
                <strong className="text-emerald-700 block mb-1">
                  📍 You are here
                </strong>
                <span className="text-xs text-gray-500 font-mono block">
                  {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
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
              fillOpacity: 0.08,
              weight: 1,
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
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                        👥 {d.quantity}
                      </span>
                      <br />
                      <span className="text-xs text-gray-500 font-mono">
                        {d.location.coordinates[1].toFixed(4)},{" "}
                        {d.location.coordinates[0].toFixed(4)}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ),
          )}
        </MapContainer>
      </div>

      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
        {filteredDonations.length > 0 && (
          <span className="bg-emerald-100 text-emerald-800 py-1 px-3 rounded-full text-lg">
            {filteredDonations.length}
          </span>
        )}
        Available Donations
      </h2>

      {filteredDonations.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
          <div className="text-5xl mb-4 opacity-50">📭</div>
          <h3 className="text-lg font-bold text-gray-700 mb-1">
            No food found nearby
          </h3>
          <p className="text-gray-500">
            Try expanding your {radius}km search radius or check back later.
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
