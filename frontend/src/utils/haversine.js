/**
 * Haversine distance for frontend — shows "X km away" on donation cards.
 * Mirrors the backend implementation in utils/algorithms.js
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return parseFloat(
    (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1),
  );
}

/**
 * Format minutes remaining into human-readable string.
 */
export function formatExpiry(expiryDate) {
  const mins = Math.floor((new Date(expiryDate) - Date.now()) / 60000);
  if (mins <= 0) return "Expired";
  if (mins < 60) return `${mins}m remaining`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hrs}h ${rem}m remaining`;
}

/**
 * Returns CSS class based on time urgency.
 */
export function urgencyClass(expiryDate) {
  const mins = Math.floor((new Date(expiryDate) - Date.now()) / 60000);
  if (mins <= 0) return "expired";
  if (mins < 60) return "urgent";
  if (mins < 180) return "soon";
  return "fresh";
}
