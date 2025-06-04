<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "vue-chartjs";
import { gsap } from "gsap";

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

const chartData = ref<ChartData>({
  labels: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
  datasets: [
    {
      label: "Продажи",
      data: [0, 0, 0, 0, 0, 0], // Начальные значения для анимации
      borderColor: "rgb(99, 102, 241)",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      tension: 0.4,
    },
    {
      label: "Прибыль",
      data: [0, 0, 0, 0, 0, 0], // Начальные значения для анимации
      borderColor: "rgb(34, 197, 94)",
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      tension: 0.4,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Динамика продаж и прибыли",
    },
  },
  interaction: {
    intersect: false,
    mode: "index" as const,
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Реальные данные для анимации
const finalData = {
  sales: [30, 45, 35, 50, 40, 60],
  profit: [20, 35, 25, 40, 30, 45],
};

onMounted(() => {
  // Анимация появления графика
  gsap.to(chartData.value.datasets[0].data, {
    duration: 2,
    ease: "power2.out",
    endArray: finalData.sales,
    onUpdate: () => {
      chartData.value = { ...chartData.value };
    },
  });

  gsap.to(chartData.value.datasets[1].data, {
    duration: 2,
    ease: "power2.out",
    endArray: finalData.profit,
    onUpdate: () => {
      chartData.value = { ...chartData.value };
    },
  });

  // Анимация появления контейнера
  gsap.from(".chart-container", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });
});
</script>

<template>
  <div
    class="chart-container bg-white p-6 rounded-xl shadow-sm border border-gray-100"
  >
    <Line :data="chartData" :options="chartOptions" class="h-[400px]" />
  </div>
</template>
