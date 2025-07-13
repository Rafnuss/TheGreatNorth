const fs = require("fs");

// --- Helper: decode polyline ---
function decodePolyline(str) {
  let index = 0,
    lat = 0,
    lng = 0,
    coordinates = [];

  while (index < str.length) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push([lng / 1e5, lat / 1e5]);
  }
  return coordinates;
}

// --- Read and parse JSON input ---
const input = JSON.parse(fs.readFileSync("./data/route_segments.json", "utf8")); //.slice(0, 5);

step = input.filter((r) => r.type !== "future_directions");

const byStart = Object.fromEntries(step.map((r) => [r.start_object_uuid, r]));

// --- Find true start (not an end anywhere else) ---
const allEnds = new Set(step.map((r) => r.end_object_uuid));
const startUUID = step.find((r) => !allEnds.has(r.start_object_uuid)).start_object_uuid;

// --- Chain routes in order ---
let coords = [];
let current = byStart[startUUID];
while (current) {
  const segment = decodePolyline(current.route);
  if (coords.length && coords.at(-1).toString() === segment[0].toString()) {
    segment.shift(); // avoid duplicate
  }
  coords.push(...segment);
  current = byStart[current.end_object_uuid];
}

// --- Build LineString GeoJSON ---
const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coords,
      },
      properties: {},
    },
  ],
};

// --- Write to file ---
fs.writeFileSync("public/routes.geojson", JSON.stringify(geojson, null, 2));
console.log("✅ LineString GeoJSON saved to routes.geojson");
