// preprocess-ebird.js
const fs = require("fs");
const Papa = require("papaparse");

// Define the date range to filter eBird data
const startDate = new Date("2025-05-16");
const endDate = new Date("2025-07-04");

// Load CSV and JSON files
const myDataCSV = fs.readFileSync("./data/MyEBirdData.csv", "utf8");
const taxData = JSON.parse(fs.readFileSync("./data/ebird_taxonomy.json", "utf8"));
const hotspots = JSON.parse(fs.readFileSync("./data/hotspots.json", "utf8"));

// Parse and preprocess eBird data
const myData = Papa.parse(myDataCSV, { header: true })
  .data.filter((row) => row["Submission ID"] && row["Location ID"])
  .map((row) => {
    row.Date = new Date(row["Date"]);
    const timeMatch = row["Time"]?.match?.(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      let [, hour, minute, meridiem] = timeMatch;
      hour = parseInt(hour, 10);
      if (meridiem.toUpperCase() === "PM" && hour !== 12) hour += 12;
      if (meridiem.toUpperCase() === "AM" && hour === 12) hour = 0;
      const hourStr = hour.toString().padStart(2, "0");
      row.datetime = new Date(`${row.Date.toISOString().split("T")[0]}T${hourStr}:${minute}:00`);
    } else {
      row.datetime = row["Date"];
    }
    return {
      //observations data
      count: parseInt(row["Count"], 10),
      observation_details: row["Observation Details"] || "",
      ml_catalog_numbers: row["ML Catalog Numbers"] || "",
      //breeding_code: row["Breeding Code"] || "",

      // taxonomy data
      taxonomic_order: parseInt(row["Taxonomic Order"], 10),
      common_name: row["Common Name"],
      scientific_name: row["Scientific Name"],

      // location data
      location_id: row["Location ID"],
      subnational1: row["State/Province"],
      subnational2: row["County"] || "",
      location_name: row["Location"],
      latitude: parseFloat(row["Latitude"]),
      longitude: parseFloat(row["Longitude"]),

      // submission data
      submission_id: row["Submission ID"],
      //date: row["Date"],
      //time: row["Time"],
      datetime: row.datetime,
      protocol: row["Protocol"],
      duration_min: row["Duration (Min)"] ? parseFloat(row["Duration (Min)"]) : null,
      all_obs_reported: row["All Obs Reported"] === "1",
      distance_km: row["Distance Traveled (km)"] ? parseFloat(row["Distance Traveled (km)"]) : null,
      area_ha: row["Area Covered (ha)"] ? parseFloat(row["Area Covered (ha)"]) : null,
      number_of_observers: parseInt(row["Number of Observers"] || "1", 10),
      checklist_comments: row["Checklist Comments"] || "",
    };
  })
  .filter(
    (row) =>
      !isNaN(row.datetime) &&
      row.datetime >= startDate &&
      row.datetime <= endDate &&
      row.count !== 0
  )
  .sort((a, b) => a.datetime - b.datetime);

// Utility to build unique lookup tables from myData
function buildTable(key, cols, tableName) {
  const map = new Map();
  const conflicts = new Set();
  myData.forEach((row) => {
    const k = row[key];
    const vals = cols.map((c) => row[c] ?? "").join("||");
    if (!map.has(k)) {
      map.set(k, { key: k, vals, row });
    } else if (map.get(k).vals !== vals) {
      conflicts.add(k);
    }
  });
  if (conflicts.size)
    console.warn(`Warning: Conflicting duplicate keys in ${tableName}:`, [...conflicts]);
  return [...map.values()].map(({ row }) => {
    return Object.fromEntries(
      [key, ...cols].map((c) => [
        c
          .toLowerCase()
          .replace(/\(.*?\)/g, "") // remove content in parentheses
          .replace(/[\/ ]+/g, "_") // replace "/" and space with "_"
          .replace(/_+/g, "_") // collapse multiple underscores
          .replace(/^_+|_+$/g, ""), // trim leading/trailing underscores
        row[c],
      ])
    );
  });
}

// Build lookup tables
const taxonomy = buildTable("taxonomic_order", ["scientific_name", "common_name"], "taxonomy");

let locations = buildTable(
  "location_id",
  ["subnational1", "subnational2", "location_name", "latitude", "longitude"],
  "locations"
);

const submissions = buildTable(
  "submission_id",
  [
    "location_id",
    "datetime",
    "protocol",
    "duration_min",
    "all_obs_reported",
    "distance_km",
    "area_covered",
    "number_of_observers",
    "checklist_comments",
  ],
  "submissions"
);

// Extract simplified observation records

const observations = myData.map((r) =>
  Object.fromEntries(
    [
      "submission_id",
      "taxonomic_order",
      "count",
      "breeding_code",
      "observation_details",
      "ml_catalog_numbers",
    ].map((k) => [k, r[k]])
  )
);

// Create lookup by taxonOrder and speciesCode
const taxonOrderMap = {};
const speciesCodeLookup = {};
taxData.forEach((row) => {
  if (row.taxonOrder) taxonOrderMap[row.taxonOrder] = row;
  if (row.speciesCode) speciesCodeLookup[row.speciesCode] = row;
});

// Enrich taxonomy with new JSON schema
let taxonomyEnriched = [];
const unmatched = [];

taxonomy.forEach((tax) => {
  const enriched = taxonOrderMap[tax.taxonomic_order];

  if (enriched) {
    taxonomyEnriched.push({
      taxonomic_order: tax.taxonomic_order,
      common_name: tax.common_name,
      scientific_name: tax.scientific_name,
      comName: enriched.comName,
      sciName: enriched.sciName,
      speciesCode: enriched.speciesCode,
      category: enriched.category,
      order: enriched.order,
      familyComName: enriched.familyComName,
      report_as: enriched.reportAs,
    });
  } else {
    unmatched.push(tax);
  }
});

if (unmatched.length > 0) {
  console.warn(`Unmatched species (${unmatched.length}):`);
  unmatched.forEach((e) => console.warn(`${e.common_name} (${e.scientific_name})`));
}

// Enrich with report_as values if present
taxonomyEnriched = taxonomyEnriched.map((row) => {
  let source = speciesCodeLookup[row["report_as"]];
  if (!source && row["report_as"]) {
    console.warn(`Warning: '${row["report_as"]}' not found in speciesCodeLookup`);
  }
  source = source || row;

  if (row.speciesCode == "egwtea1") {
    console.log(source);
  }

  row.report_as_taxonomic_order = source.taxonomic_order;
  row.report_as_common_name = source.comName;
  row.report_as_primary_com_name = source.comName;
  row.report_as_scientific_name = source.sciName;
  row.report_as_order = source.order;
  row.report_as_family = source.familyComName;
  row.report_as_species_code = source.speciesCode;
  row.report_as_category = source.category;
  return row;
});
//console.log(taxonomyEnriched);

const hotspotLookup = {};
hotspots.forEach((row) => {
  if (row.locId) hotspotLookup[row.locId] = row;
});

// Enrich location with hotspot information
locations = locations.map((l) => {
  const hot = hotspotLookup[l.location_id];
  if (hot) {
    l.hotspot = true;
    l.hotspot_latestObsDt = hot.latestObsDt;
    l.hotspot_numSpeciesAllTime = hot.numSpeciesAllTime;
  } else {
    l.hotspot = false;
  }
  return l;
});

// Write output to public folder
fs.writeFileSync("./src/assets/taxonomy.json", JSON.stringify(taxonomyEnriched, null, 2));
console.log(`✅ Wrote taxonomy.json with ${taxonomyEnriched.length} records.`);

fs.writeFileSync("./src/assets/submissions.json", JSON.stringify(submissions, null, 2));
console.log(`✅ Wrote submissions.json with ${submissions.length} records.`);

fs.writeFileSync("./src/assets/locations.json", JSON.stringify(locations, null, 2));
console.log(`✅ Wrote locations.json with ${locations.length} records.`);

fs.writeFileSync("./src/assets/observations.json", JSON.stringify(observations, null, 2));
console.log(`✅ Wrote observations.json with ${observations.length} records.`);
