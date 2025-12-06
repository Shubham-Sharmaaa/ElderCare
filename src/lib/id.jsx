// src/lib/id.js
// This file maps your old short random ids → MongoDB _id (24-hex strings)
// Needed so existing UI keeps working with short ids.

const MAP_KEY = "wn_mongo_id_map_v1"; // <— THIS IS THE KEY YOU ASKED ABOUT

// Load map from localStorage
let idMap = {};
try {
  idMap = JSON.parse(localStorage.getItem(MAP_KEY) || "{}");
} catch {
  idMap = {};
}

// Save map
function saveMap() {
  localStorage.setItem(MAP_KEY, JSON.stringify(idMap));
}

/**
 * Register a mapping:
 * shortId → mongoId
 */
export function registerMapping(shortId, mongoId) {
  if (!shortId || !mongoId) return;
  idMap[shortId] = mongoId;
  saveMap();
}

/**
 * Get Mongo ObjectId for an elder stored under short IDs.
 */
export function getMongoIdFromElder(elder) {
  if (!elder) return null;

  // If it already *is* a MongoId
  if (isHexObjectId(elder.id)) return elder.id;

  // If we have a mapping saved
  if (elder.id && idMap[elder.id]) return idMap[elder.id];

  return null;
}

/**
 * Detect if a string is a valid 24-character Mongo ObjectId.
 */
export function isHexObjectId(str) {
  return /^[a-f0-9]{24}$/i.test(str);
}
