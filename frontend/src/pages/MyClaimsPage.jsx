import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function MyClaimsPage() {
  const { user } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await api.get("/claims/my");
      setClaims(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (claimId) => {
    try {
      await api.put(`/claims/${claimId}/complete`);
      setClaims((prev) =>
        prev.map((c) =>
          c._id === claimId ? { ...c, status: "completed" } : c,
        ),
      );
    } catch (err) {
      setError("Failed to mark complete");
    }
  };

  const handleCancel = async (claimId) => {
    if (!window.confirm("Cancel this claim? The donation will be relisted."))
      return;
    try {
      await api.put(`/claims/${claimId}/cancel`);
      setClaims((prev) =>
        prev.map((c) =>
          c._id === claimId ? { ...c, status: "cancelled" } : c,
        ),
      );
    } catch (err) {
      setError("Failed to cancel claim");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  if (loading)
    return (
      <div className="text-center p-20 text-gray-500">Loading claims...</div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          My Claims
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your food donation pickups and history.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {claims.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 shadow-sm">
          No claims found. Go to the map to find food near you!
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim._id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {claim.donation_id?.food_title || "Unknown food"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  👥 {claim.donation_id?.quantity}{" "}
                  <span className="mx-2">•</span> 📍{" "}
                  {claim.donation_id?.location?.address}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>
                    Requested: {new Date(claim.requestedAt).toLocaleString()}
                  </span>
                  {claim.distanceKm && (
                    <span>Distance: {claim.distanceKm} km</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${getStatusColor(claim.status)}`}
                >
                  {claim.status}
                </span>
                {claim.status === "accepted" && (
                  <button
                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition"
                    onClick={() => handleComplete(claim._id)}
                  >
                    ✅ Mark Picked Up
                  </button>
                )}
                {(claim.status === "pending" ||
                  claim.status === "accepted") && (
                  <button
                    className="px-4 py-2 bg-white border border-red-300 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition"
                    onClick={() => handleCancel(claim._id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
