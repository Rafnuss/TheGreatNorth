<template>
  <div class="map-popup p-2">
    <div class="d-flex justify-content-between align-items-start mb-2">
      <h5 class="mb-0">
        <template v-if="hotspot">
          <a
            :href="`https://ebird.org/hotspot/${location_id}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-none"
          >
            {{ location_name }}
          </a>
        </template>
        <template v-else>
          {{ location_name }}
        </template>
      </h5>
    </div>

    <div class="text-muted mb-2">{{ location_region }}</div>

    <div class="d-flex justify-content-between mb-3">
      <div class="text-center flex-fill mx-1">
        <div class="h4 mb-0">{{ speciesCount }}</div>
        <small class="text-muted">Species</small>
      </div>
      <div class="text-center flex-fill mx-1">
        <div class="h4 mb-0">{{ submissions.length }}</div>
        <small class="text-muted">Checklists</small>
      </div>
      <div v-if="duration != null" class="text-center flex-fill mx-1">
        <div class="h4 mb-0">{{ duration }}</div>
        <small class="text-muted">Duration</small>
      </div>
      <div v-if="distance != null" class="text-center flex-fill mx-1">
        <div class="h4 mb-0">{{ distance }}</div>
        <small class="text-muted">Distance</small>
      </div>
    </div>

    <hr />

    <ul class="list-unstyled">
      <li
        v-for="sub in submissions"
        :key="sub.submission_id"
        class="d-flex align-items-start gap-3 mb-3"
      >
        <a
          :href="`https://ebird.org/checklist/${sub.submission_id}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-white text-center rounded px-3 py-2"
          style="background: #40718f; min-width: 4rem"
        >
          <div class="h5 mb-0">{{ sub.taxonomic_order.length }}</div>
          <small>Species</small>
        </a>

        <div>
          <a
            :href="`https://ebird.org/checklist/${sub.submission_id}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-none"
          >
            <div>{{ formatDate(sub.datetime) }}</div>
            <small class="text-muted">{{ formatTime(sub.datetime) }}</small>
          </a>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineEmits, computed, toRefs } from "vue";

const props = defineProps({
  location_id: String,
  location_name: String,
  location_region: String,
  submissions: [String, Array],
  distance_km: Number,
  duration_min: Number,
  taxonomic_order: Array,
  latitude: Number,
  longitude: Number,
  hotspot: Boolean,
});

const emit = defineEmits(["close"]);

const {
  location_id,
  location_name,
  location_region,
  submissions,
  distance_km,
  duration_min,
  taxonomic_order,
  latitude,
  longitude,
  hotspot,
} = toRefs(props);

const distance = computed(() => {
  const d = distance_km.value;
  if (!d) return null; // treats 0, null, undefined as null
  return `${+d.toFixed(2)} km`;
});

const duration = computed(() => {
  const totalMinutes = duration_min.value;
  if (!totalMinutes) return null; // covers 0, null, undefined

  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = Math.floor(totalMinutes % 60);

  const parts = [];
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes || parts.length === 0) parts.push(`${minutes}min`);

  return parts.join(" ");
});

const speciesCount = computed(() => taxonomic_order.value?.length ?? 0);

function closePopup() {
  emit("close");
}

function formatDate(datetime) {
  const d = new Date(datetime);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(datetime) {
  const d = new Date(datetime);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}
</script>

<style scoped>
.map-popup {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.4;
}
</style>
