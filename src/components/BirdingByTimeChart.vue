<script setup>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

// Generate 15-min time labels from 00:00 to 23:45
const timeLabels = [];
for (let h = 0; h < 24; h++) {
  for (let m of [0, 15, 30, 45]) {
    timeLabels.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}

// Your full 96-value dataset
const birdingActivity = [
  0, 0.0074, 0.0044, 0.0133, 0.0133, 0.0267, 0.0356, 0.04, 0.0356, 0.0356, 0.0222, 0.0133, 0.0089,
  0.0089, 0.0133, 0.0356, 0.0667, 0.1067, 0.1511, 0.2178, 0.3022, 0.4133, 0.5111, 0.5778, 0.6222,
  0.6267, 0.5822, 0.5422, 0.5156, 0.4844, 0.4533, 0.4267, 0.4, 0.3822, 0.3733, 0.3733, 0.3867,
  0.3956, 0.4311, 0.4622, 0.4889, 0.5289, 0.5378, 0.5289, 0.5111, 0.48, 0.4311, 0.4044, 0.3644,
  0.3244, 0.2889, 0.2578, 0.2444, 0.2267, 0.2133, 0.1911, 0.1778, 0.16, 0.1511, 0.1422, 0.1556,
  0.1644, 0.1778, 0.2089, 0.24, 0.2756, 0.3022, 0.3333, 0.36, 0.3689, 0.3644, 0.3733, 0.3733,
  0.3822, 0.3911, 0.4, 0.4089, 0.4133, 0.3556, 0.3333, 0.2978, 0.2711, 0.2444, 0.2756, 0.2533, 0.28,
  0.2889, 0.2889, 0.2667, 0.2756, 0.24, 0.1867, 0.1378, 0.0889, 0.0444, 0.0074, 0,
];

const chartData = {
  labels: timeLabels,
  datasets: [
    {
      label: "Fraction of days birded",
      data: birdingActivity,
      borderColor: "#40718f",
      tension: 0.2,
      pointRadius: 1.2,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => `${(ctx.raw * 100).toFixed(1)}% of days`,
      },
    },
  },
  scales: {
    x: {
      title: { display: true, text: "Time of Day" },
      ticks: {
        maxTicksLimit: 12,
        maxRotation: 45,
        minRotation: 45,
      },
    },
    y: {
      title: { display: true, text: "Fraction of Days" },
      suggestedMax: 1,
      beginAtZero: true,
    },
  },
};
</script>

<template>
  <p>
    One might think it's the birds that dictate the rhythm of a typical day… but in reality, it's
    more of a default birding flow interrupted by the necessities of daily life. Let's explore when
    we're actually out birding — or rather, when we're <em>not</em> birding!
  </p>
  <ul>
    <li>
      <b>00:00 - 04:00</b> – Thanks to Améline's light sleep, we've managed to catch a few cool
      nocturnal species in the middle of the night.
    </li>
    <li>
      <b>04:00 - 06:00</b> – The day usually begins between 4:00 and 5:00 (mostly solo), with peak
      birding activity around 6:00.
    </li>
    <li>
      <b>08:00</b> – Breakfast calls for a short pause between 8:00 and 9:00, after which the kids
      usually join in.
    </li>
    <li>
      <b>13:00</b> – Mornings are often long and tend to stretch past noon.There's always a good
      lunch, followed by a well-deserved nap for everyone until 16:00.
    </li>
    <li>
      <b>20:00</b> – Evenings generally continue quite late (especially as the days get longer),
      with a break for dinner and the kids' bedtime.
    </li>
    <li>
      <b>22:00</b> – And since there are often nocturnal species still to look for as darkness
      falls, Améline and I usually head back out again!
    </li>
  </ul>
  <Line :data="chartData" :options="chartOptions" />
</template>
