<template>
  <div id="map" style="height: 100%; width: 100%"></div>
</template>

<script setup>
import { onMounted, watch, ref, createSSRApp, h } from "vue";
import { renderToString } from "@vue/server-renderer";
import mapboxgl from "mapbox-gl";
import Popup from "./Popup.vue";

async function renderPopup(loc) {
  const app = createSSRApp({
    render() {
      return h(Popup, { ...loc });
    },
  });
  return await renderToString(app);
}

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const props = defineProps({
  locations: {
    type: Array,
    required: true,
  },
});

const map = ref(null);
const markers = [];
let showCasual = false;

async function createMarkers(locations) {
  const bounds = new mapboxgl.LngLatBounds();

  for (const loc of locations) {
    const el = document.createElement("img");
    el.src = loc.hotspot ? "/map-marker-hotspot.png" : "/map-marker-personal.png";

    const popupHTML = await renderPopup(loc);
    const popup = new mapboxgl.Popup({
      offset: 10,
      className: "custom-popup",
      maxWidth: "350px",
    }).setHTML(popupHTML);

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([loc.longitude, loc.latitude])
      .setPopup(popup)
      .addTo(map.value);

    marker.only_incidental = loc.only_incidental; // tag for filtering
    marker.taxonomic_order = loc.taxonomic_order; // tag for filtering

    markers.push(marker);

    bounds.extend([loc.longitude, loc.latitude]);
  }

  toggleCasualObservations(showCasual);

  if (!bounds.isEmpty()) {
    map.value.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 500, right: 50 },
      maxZoom: 10,
    });
  }
}

function toggleCasualObservations(show) {
  showCasual = show;
  markers.forEach((marker) => {
    if (marker.only_incidental) {
      marker.getElement().style.display = show ? "block" : "none";
    }
  });
}

function filterMarkers(taxOrder) {
  markers.forEach((marker) => {
    const showAll = !taxOrder || taxOrder.length === 0;
    const hasSpecies = showAll ? true : marker.taxonomic_order.includes(taxOrder);
    marker.getElement().style.display = hasSpecies ? "block" : "none";
  });
}
defineExpose({ filterMarkers });

function addLegend() {
  const legend = document.createElement("div");
  legend.style.position = "absolute";
  legend.style.top = "10px";
  legend.style.right = "10px";
  legend.style.backgroundColor = "white";
  legend.style.padding = "8px";
  legend.style.fontFamily = "Arial, sans-serif";
  legend.style.fontSize = "14px";
  legend.style.borderRadius = "4px";
  legend.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";
  legend.style.zIndex = 10;

  const label = document.createElement("label");
  label.style.cursor = "pointer";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = showCasual;
  checkbox.style.marginRight = "6px";

  checkbox.addEventListener("change", (e) => {
    toggleCasualObservations(e.target.checked);
  });

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode("Show Casual Observations"));

  legend.appendChild(label);
  map.value.getContainer().appendChild(legend);
}

onMounted(() => {
  map.value = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/satellite-v9",
    center: [0, 0], // temporary center
    zoom: 2,
    logoPosition: "bottom-right",
  });

  map.value.on("load", () => {
    fetch("routes.geojson")
      .then((res) => res.json())
      .then((data) => {
        map.value.addSource("route", {
          type: "geojson",
          data: data,
        });

        // White line
        map.value.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#ffffff",
            "line-width": 2,
          },
        });

        // Dots at each point
        map.value.addLayer({
          id: "route-points",
          type: "circle",
          source: "route",
          paint: {
            "circle-radius": 3,
            "circle-color": "#ffffff",
          },
        });
      });

    createMarkers(props.locations);
    addLegend();
  });
});
</script>

<style scoped>
#map {
  width: 100vw;
  height: 600px;
  background-color: #e0e0e0;
}
.mapboxgl-popup.custom-popup {
  max-width: 350px !important; /* widen popup */
  max-height: 400px !important; /* limit height */
  overflow-y: auto !important; /* scroll if content too tall */
}

/* Optional: if you want full control of inner content: */
.mapboxgl-popup.custom-popup .mapboxgl-popup-content {
  padding: 0 !important; /* remove default padding */
  max-width: 350px !important;
}

/* Your Vue popup content */
.map-popup {
  padding: 1rem;
  min-width: 250px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.4;
}
</style>
