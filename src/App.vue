<template>
  <div class="bg-dark vh-100 overflow-hidden">
    <!-- Fullscreen Map -->
    <MapView
      ref="mapView"
      :locations="locations"
      class="w-100 h-100 position-absolute top-0 start-0"
    />

    <!-- Overlay content -->
    <div
      class="col-12 col-sm-6 col-md-5 col-lg-4 position-absolute top-0 start-0 h-100 overflow-auto text-white"
      style="
        background: linear-gradient(
          to right,
          rgba(0, 0, 0, 0.85) 0%,
          rgba(0, 0, 0, 0.85) 60%,
          rgba(0, 0, 0, 0.5) 80%,
          rgba(0, 0, 0, 0) 100%
        );
      "
    >
      <div class="container">
        <div class="row">
          <Intro />
          <SpeciesList :taxonomy="taxonomy" @update-visible-species="filterMarkersBySpecies" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MapView from "./components/MapView.vue";
import SpeciesList from "./components/SpeciesList.vue";
import Intro from "./components/Intro.vue";

const locations = ref([]);
const taxonomy = ref([]);
const observations = ref([]);
const submissions = ref([]);

const mapView = ref();

function filterMarkersBySpecies(taxOrder) {
  mapView.value?.filterMarkers(taxOrder);
}

onMounted(async () => {
  const [locRes, taxRes, obsRes, subRes] = await Promise.all([
    fetch("/locations.json"),
    fetch("/taxonomy.json"),
    fetch("/observations.json"),
    fetch("/submissions.json"),
  ]);
  let loc = await locRes.json();
  let tax = await taxRes.json();
  let obs = await obsRes.json();
  let sub = await subRes.json();

  // Add information to sumbissions from observations
  sub.map((s) => {
    const filtered = obs.filter((o) => o.submission_id === s.submission_id);
    s.taxonomic_order = filtered.map((o) => o.taxonomic_order);
    s.count = filtered.reduce((acc, o) => acc + o.count, 0);
    return s;
  });

  // Add information to locations from submissions
  loc.map((l) => {
    const filteredSubs = sub.filter((s) => s.location_id === l.location_id);

    l.submissions = filteredSubs;

    l.submission_id = filteredSubs.flatMap((s) => s.submission_id);

    l.taxonomic_order = [...new Set(filteredSubs.flatMap((s) => s.taxonomic_order))];

    l.distance_km = filteredSubs.reduce((acc, s) => acc + (s.distance_km ?? 0), 0);

    l.duration_min = filteredSubs.reduce((acc, s) => acc + (s.duration_min ?? 0), 0);

    l.only_incidental = filteredSubs.every((s) => s.protocol === "eBird - Casual Observation");

    return l;
  });

  let taxReport = Object.values(
    tax.reduce((acc, s) => {
      const key = s.report_as_species_code;
      if (!acc[key]) {
        acc[key] = {
          taxonomic_order: s.report_as_taxonomic_order,
          common_name: s.report_as_common_name,
          primary_com_name: s.report_as_primary_com_name,
          scientific_name: s.report_as_scientific_name,
          order: s.report_as_order,
          family: s.report_as_family,
          species_code: s.report_as_species_code,
          category: s.report_as_category,
          species_codes_reported: [],
          taxonomic_orders_reported: [],
        };
      }
      acc[key].species_codes_reported.push(s.speciesCode);
      acc[key].taxonomic_orders_reported.push(s.taxonomic_order);
      return acc;
    }, {})
  ).sort((a, b) => a.taxonomic_order - b.taxonomic_order);

  taxReport.map((t) => {
    t.obs = obs.filter((o) => t.taxonomic_orders_reported.includes(o.taxonomic_order));

    t.count = t.obs.reduce((acc, o) => acc + (o.count ?? 0), 0);

    t.nobs = t.obs.length;
    t.media = t.obs
      .map((o) => o.ml_catalog_numbers)
      .filter((s) => s && s.trim() !== "")
      .flatMap((s) => s.split(" "));
  });

  console.log([...new Set(taxReport.flatMap((t) => t.category))]);

  locations.value = loc;
  taxonomy.value = taxReport;
  observations.value = obs;
  submissions.value = sub;
});
</script>

<style>
html {
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #000;
}
a {
  text-decoration: none !important;
  color: #40718f !important;
}
a:hover,
a:focus {
  color: #305e78 !important;
}
.btn-outline-primary:hover {
  color: white !important;
}
</style>
