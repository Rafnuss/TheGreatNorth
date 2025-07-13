<script setup>
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

// Example: Pass this as a prop or fetch dynamically
const labels = ["0–5 min", "5–10 min", "10–30 min", "30–60 min", "1–2 hrs", ">2 hrs"];
const counts = [95, 108, 185, 102, 79, 16];

const chartData = {
  labels,
  datasets: [
    {
      label: "Number of checklists",
      data: counts,
      backgroundColor: "#40718f",
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.raw} checklists`,
      },
    },
  },
};
</script>

<template>
  <p>
    Checklists are the basic unit that sample bird occurance (how often?) and abundance (how many?).
    I become a firm believer of the usefulness of make many short checklists which a believe to be
    better suited to represent occurence and probably abundance!
  </p>
  <Bar :data="chartData" :options="chartOptions" />
</template>
