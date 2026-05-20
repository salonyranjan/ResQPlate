import React, { useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DonatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    food_title: "",
    quantity: "",
    food_type: "vegetarian",
    expiry_datetime: "",
    notes: "",
    address: "",
  });
  const [customCoords, setCustomCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCustomCoords([longitude, latitude]); // MongoDB uses [lng, lat]
        setForm((prev) => ({ ...prev, address: "Current GPS Location" }));
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setError(
          "Failed to fetch location. Please check your browser permissions.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const defaultCoords =
        user?.location?.coordinates?.length === 2
          ? user.location.coordinates
          : [88.3639, 22.5726];
      const finalCoords = customCoords || defaultCoords;

      const location = {
        type: "Point",
        coordinates: finalCoords,
        address: form.address || user?.location?.address || "Donor Address",
      };

      const res = await api.post("/donations", { ...form, location });
      setResult(res.data);
      setForm({
        food_title: "",
        quantity: "",
        food_type: "vegetarian",
        expiry_datetime: "",
        notes: "",
        address: "",
      });
      setCustomCoords(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post donation.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border bg-gray-50 transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700";

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight font-serif">
          Post a Food Donation
        </h1>
        <p className="mt-2 text-lg text-gray-500">
          Provide details about your surplus food to notify nearby NGOs.
        </p>
      </div>

      <div className="bg-white shadow-xl shadow-gray-200/50 rounded-2xl overflow-hidden border border-gray-100">
        <div className="px-4 py-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClasses}>
                Food Title <span className="text-red-500">*</span>
              </label>
              <input
                name="food_title"
                value={form.food_title}
                onChange={handleChange}
                placeholder="e.g., 2 Trays of Veg Biryani"
                required
                className={inputClasses}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>
                  Quantity / Servings <span className="text-red-500">*</span>
                </label>
                <input
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g., Serves 20 people"
                  required
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Dietary Type</label>
                <select
                  name="food_type"
                  value={form.food_type}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="vegetarian">🥦 Vegetarian</option>
                  <option value="non-vegetarian">🍗 Non-Vegetarian</option>
                  <option value="vegan">🌿 Vegan</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}>
                Expiry Date & Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                name="expiry_datetime"
                value={form.expiry_datetime}
                onChange={handleChange}
                required
                className={inputClasses}
              />
              <p className="mt-1 text-xs text-gray-500">
                Donation will automatically disappear from the map after this
                time.
              </p>
            </div>

            {/* LOCATION SECTION WITH COORDINATE DISPLAY */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex justify-between items-end mb-2">
                <label className={labelClasses}>
                  Pickup Location <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-100/50 px-3 py-1.5 rounded-md border border-emerald-200 transition-colors flex items-center gap-1"
                >
                  {isLocating ? "Locating..." : "📍 Use Current GPS"}
                </button>
              </div>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder={
                  user?.location?.address ||
                  "Enter specific address or landmark"
                }
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border bg-white transition-colors"
              />

              {/* Added explicit coordinate display */}
              {customCoords && (
                <div className="mt-3 flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                  <span className="text-emerald-500">✓</span>
                  <span>GPS Coordinates Captured:</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded shadow-sm border border-emerald-100">
                    Lat: {customCoords[1].toFixed(5)}, Lng:{" "}
                    {customCoords[0].toFixed(5)}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className={labelClasses}>Additional Instructions</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Gate code, packaging details, contact person, etc."
                rows={3}
                className={inputClasses}
              />
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200 text-sm font-medium text-red-800">
                {error}
              </div>
            )}

            {result ? (
              <div className="rounded-xl bg-emerald-50 p-6 border border-emerald-200 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                  <svg
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-emerald-900 mb-2">
                  Donation Published Successfully!
                </h3>
                <p className="text-sm text-emerald-700 mb-4">
                  Nearby volunteers have been prioritized and notified.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white transition-all ${loading ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
                >
                  {loading ? "Processing..." : "Publish Donation"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
