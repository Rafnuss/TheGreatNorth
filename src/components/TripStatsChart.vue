<script setup>
import { ref, computed } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// List of dates
const dates = Array.from({ length: 48 }, (_, i) =>
  new Date(2025, 4, 16 + i)
    .toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })
    .replace(" ", "-")
);

// Data by variable (dummy values — replace with yours)

const dataByVariable = {
  "Distance (km)": [
    6.4, 18.39, 18.03, 18.59, 14.4, 16.98, 12.131, 12.01, 8.432, 11.269, 10.904, 5.302, 12.931,
    11.245, 4.692, 6.772, 17.084, 2.381, 15.242, 7.426, 6.83, 23.421, 6.851, 13.055, 1.499, 5.41,
    4.919, 6.305, 1.926, 7.055, 5.01, 13.567, 12.374, 16.627, 3.198, 3.208, 6.135, 7.28, 3.399,
    4.214, 2.222, 7.525, 6.646, 6.78, 4.106, 0.898, 5.422, 0.39,
  ],
  "Birding hours (hr)": [
    2.28, 6.87, 6.18, 7.3, 5.42, 10.13, 6.05, 8.98, 7.98, 7.2, 8.63, 4.57, 6.52, 7.33, 7.43, 6.23,
    7.42, 4.63, 9.37, 7.67, 6.92, 3.93, 3.47, 6.25, 0.67, 2.4, 3.82, 9.82, 2.57, 5.45, 3.57, 8.97,
    6.4, 8.87, 5.37, 3.8, 6.92, 7.98, 8.1, 6.75, 6.43, 7.23, 5.1, 4.55, 5.48, 3.08, 5.58, 3.12,
  ],
  "Number of checklists": [
    5, 13, 6, 24, 11, 18, 14, 13, 15, 17, 21, 26, 18, 26, 11, 18, 15, 24, 19, 16, 9, 11, 3, 14, 8,
    2, 5, 13, 9, 7, 9, 16, 12, 13, 32, 29, 32, 20, 19, 10, 14, 10, 8, 8, 16, 8, 7, 7,
  ],
  "Number of species": [
    39, 101, 86, 106, 109, 104, 109, 129, 116, 107, 85, 93, 109, 108, 94, 97, 102, 89, 106, 107, 99,
    85, 67, 91, 42, 16, 66, 92, 56, 56, 50, 70, 53, 46, 71, 57, 56, 66, 64, 44, 62, 39, 51, 56, 94,
    60, 96, 48,
  ],
  "Number of media": [
    0, 35, 37, 5, 14, 36, 8, 24, 38, 55, 7, 24, 34, 12, 3, 8, 39, 6, 33, 12, 12, 2, 1, 19, 1, 0, 3,
    18, 4, 20, 18, 111, 15, 46, 7, 7, 10, 21, 148, 112, 15, 21, 2, 3, 2, 0, 1, 1,
  ],
};

// Dropdown selection
const selectedVariable = ref("Number of species");

// Reactive chart data
const chartData = computed(() => ({
  labels: dates,
  datasets: [
    {
      label: selectedVariable.value,
      data: dataByVariable[selectedVariable.value],
      backgroundColor: "#40718f",
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 45,
        autoSkip: true,
        maxTicksLimit: 15,
      },
    },
    y: {
      beginAtZero: true,
    },
  },
};
</script>

<template>
  <p>In 50 days, we can see some intresting pattern in basic metric</p>
  <div>
    <label for="variable-select" class="form-label">Select Variable:</label>
    <select id="variable-select" v-model="selectedVariable" class="form-select mb-3">
      <option v-for="v in Object.keys(dataByVariable)" :key="v" :value="v">
        {{ v }}
      </option>
    </select>
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
