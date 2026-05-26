import React from "react";
import { formatExpiry } from "../utils/haversine";

export default function DonationCard({
  donation,
  distanceKm,
  onClaim,
  userRole,
}) {
  const isVegetarian =
    donation.food_type === "vegetarian" || donation.food_type === "vegan";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
          ● {donation.status}
        </span>
        {distanceKm && (
          <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
            {distanceKm} km away
          </span>
        )}
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
          {donation.food_title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-medium">
            <span className="mr-1">👥</span> {donation.quantity}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded bg-amber-50 text-amber-700 text-xs font-medium">
            <span className="mr-1">⏱</span>{" "}
            {formatExpiry(donation.expiry_datetime)}
          </span>
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${isVegetarian ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {isVegetarian ? "🥦 Veg" : "🍗 Non-Veg"}
          </span>
        </div>

        <div className="space-y-2 mt-auto">
          <div className="flex items-start text-sm text-gray-600">
            <span className="mr-2">📍</span>
            <span className="line-clamp-2">{donation.location?.address}</span>
          </div>

          {donation.notes && (
            <div className="flex items-start text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-100 mt-2">
              <span className="italic line-clamp-2">"{donation.notes}"</span>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm">
            {donation.donor_id?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700 truncate w-24">
            {donation.donor_id?.name}
          </span>
        </div>

        {userRole === "ngo" && donation.status === "available" && (
          <button
            onClick={() => onClaim(donation._id)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            Claim Pickup
          </button>
        )}
      </div>
    </div>
  );
}
