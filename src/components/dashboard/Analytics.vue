<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { Chart, registerables } from "chart.js";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { nextTick } from "vue";

// Регистрируем необходимые компоненты Chart.js
Chart.register(...registerables);
// Регистрируем GSAP FLIP
gsap.registerPlugin(Flip);

interface AnalyticsData {
  category: string;
  revenue: number;
  growth: number;
  customers: number;
}

const analyticsData = ref<AnalyticsData[]>([
  { category: "Веб-разработка", revenue: 125000, growth: 15, customers: 48 },
  {
    category: "Мобильные приложения",
    revenue: 98000,
    growth: 22,
    customers: 35,
  },
  { category: "UI/UX Дизайн", revenue: 75000, growth: 18, customers: 42 },
  { category: "DevOps", revenue: 110000, growth: 12, customers: 28 },
  { category: "Консалтинг", revenue: 85000, growth: 25, customers: 31 },
]);

// Состояние для отслеживания текущего вида
const currentView = ref<"radar" | "polar" | "bubble">("radar");

// Цвета для графиков
const chartColors = {
  primary: "rgba(79, 70, 229, 0.6)",
  secondary: "rgba(168, 85, 247, 0.6)",
  accent: "rgba(236, 72, 153, 0.6)",
  background: "rgba(79, 70, 229, 0.1)",
};

// Радарная диаграмма
const radarChart = ref<Chart | null>(null);
const radarData = computed(() => ({
  labels: analyticsData.value.map((d) => d.category),
  datasets: [
    {
      label: "Рост (%)",
      data: analyticsData.value.map((d) => d.growth),
      backgroundColor: chartColors.primary,
      borderColor: chartColors.primary,
      borderWidth: 2,
    },
    {
      label: "Клиенты",
      data: analyticsData.value.map((d) => d.customers),
      backgroundColor: chartColors.secondary,
      borderColor: chartColors.secondary,
      borderWidth: 2,
    },
  ],
}));

// Полярная диаграмма
const polarChart = ref<Chart | null>(null);
const polarData = computed(() => ({
  labels: analyticsData.value.map((d) => d.category),
  datasets: [
    {
      data: analyticsData.value.map((d) => d.revenue / 1000),
      backgroundColor: [
        chartColors.primary,
        chartColors.secondary,
        chartColors.accent,
        "rgba(52, 211, 153, 0.6)",
        "rgba(251, 146, 60, 0.6)",
      ],
    },
  ],
}));

// Пузырьковая диаграмма
const bubbleChart = ref<Chart | null>(null);
const bubbleData = computed(() => ({
  datasets: [
    {
      label: "Категории",
      data: analyticsData.value.map((d) => ({
        x: d.growth,
        y: d.revenue / 1000,
        r: d.customers / 3,
      })),
      backgroundColor: chartColors.primary,
    },
  ],
}));

// Функция для переключения видов с FLIP анимацией
const switchView = async (newView: "radar" | "polar" | "bubble") => {
  // Сохраняем состояние до изменений
  const state = Flip.getState(".chart-container");

  // Обновляем текущий вид
  currentView.value = newView;

  // Ждем следующего тика для обновления DOM
  await nextTick();

  // Анимируем изменения
  Flip.from(state, {
    duration: 0.5,
    ease: "power1.inOut",
    scale: true,
    absolute: true,
    onComplete: initializeCharts,
  });
};

// Инициализация графиков
const initializeCharts = () => {
  // Очищаем предыдущие графики
  if (radarChart.value) radarChart.value.destroy();
  if (polarChart.value) polarChart.value.destroy();
  if (bubbleChart.value) bubbleChart.value.destroy();

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: window.devicePixelRatio || 1,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          padding: 20,
        },
      },
    },
  };

  // Инициализируем нужный график в зависимости от текущего вида
  switch (currentView.value) {
    case "radar":
      const radarCtx = document.getElementById(
        "radarChart"
      ) as HTMLCanvasElement;
      if (radarCtx) {
        const ctx = radarCtx.getContext("2d");
        if (ctx) {
          // Устанавливаем размеры canvas с учетом devicePixelRatio
          const container = radarCtx.parentElement;
          if (container) {
            const { width, height } = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            radarCtx.width = width * dpr;
            radarCtx.height = height * dpr;
            radarCtx.style.width = `${width}px`;
            radarCtx.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
          }

          radarChart.value = new Chart(radarCtx, {
            type: "radar",
            data: radarData.value,
            options: {
              ...commonOptions,
              scales: {
                r: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                  },
                  ticks: {
                    font: {
                      size: 11,
                    },
                  },
                  pointLabels: {
                    font: {
                      size: 12,
                      family: "'Inter', sans-serif",
                    },
                  },
                },
              },
            },
          });
        }
      }
      break;

    case "polar":
      const polarCtx = document.getElementById(
        "polarChart"
      ) as HTMLCanvasElement;
      if (polarCtx) {
        const ctx = polarCtx.getContext("2d");
        if (ctx) {
          // Устанавливаем размеры canvas с учетом devicePixelRatio
          const container = polarCtx.parentElement;
          if (container) {
            const { width, height } = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            polarCtx.width = width * dpr;
            polarCtx.height = height * dpr;
            polarCtx.style.width = `${width}px`;
            polarCtx.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
          }

          polarChart.value = new Chart(polarCtx, {
            type: "polarArea",
            data: polarData.value,
            options: {
              ...commonOptions,
              scales: {
                r: {
                  beginAtZero: true,
                  ticks: {
                    font: {
                      size: 11,
                    },
                  },
                },
              },
            },
          });
        }
      }
      break;

    case "bubble":
      const bubbleCtx = document.getElementById(
        "bubbleChart"
      ) as HTMLCanvasElement;
      if (bubbleCtx) {
        const ctx = bubbleCtx.getContext("2d");
        if (ctx) {
          // Устанавливаем размеры canvas с учетом devicePixelRatio
          const container = bubbleCtx.parentElement;
          if (container) {
            const { width, height } = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            bubbleCtx.width = width * dpr;
            bubbleCtx.height = height * dpr;
            bubbleCtx.style.width = `${width}px`;
            bubbleCtx.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
          }

          bubbleChart.value = new Chart(bubbleCtx, {
            type: "bubble",
            data: bubbleData.value,
            options: {
              ...commonOptions,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Рост (%)",
                    font: {
                      size: 12,
                      family: "'Inter', sans-serif",
                    },
                  },
                  ticks: {
                    font: {
                      size: 11,
                    },
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Выручка (тыс.)",
                    font: {
                      size: 12,
                      family: "'Inter', sans-serif",
                    },
                  },
                  ticks: {
                    font: {
                      size: 11,
                    },
                  },
                },
              },
              plugins: {
                ...commonOptions.plugins,
                tooltip: {
                  callbacks: {
                    label: (context: any) => {
                      const data = analyticsData.value[context.dataIndex];
                      return [
                        `Категория: ${data.category}`,
                        `Рост: ${data.growth}%`,
                        `Выручка: ${data.revenue / 1000}K`,
                        `Клиенты: ${data.customers}`,
                      ];
                    },
                  },
                },
              },
            },
          });
        }
      }
      break;
  }
};

// Добавляем обработчик изменения размера окна
let resizeTimeout: number | null = null;
const handleResize = () => {
  if (resizeTimeout) {
    window.clearTimeout(resizeTimeout);
  }
  resizeTimeout = window.setTimeout(() => {
    initializeCharts();
  }, 250);
};

onMounted(() => {
  initializeCharts();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  if (resizeTimeout) {
    window.clearTimeout(resizeTimeout);
  }
});
</script>

<template>
  <div
    class="analytics-container p-6 bg-white rounded-xl shadow-sm border border-gray-100"
  >
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-semibold text-gray-800">
        Аналитика по категориям
      </h2>
      <div class="flex gap-2">
        <button
          v-for="type in ['radar', 'polar', 'bubble']"
          :key="type"
          @click="switchView(type)"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="[
            currentView === type
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          ]"
        >
          {{
            type === "radar"
              ? "Радар"
              : type === "polar"
              ? "Полярная"
              : "Пузырьковая"
          }}
        </button>
      </div>
    </div>

    <div class="chart-wrapper relative h-[400px]">
      <div
        v-show="currentView === 'radar'"
        class="chart-container absolute inset-0"
      >
        <canvas id="radarChart"></canvas>
      </div>
      <div
        v-show="currentView === 'polar'"
        class="chart-container absolute inset-0"
      >
        <canvas id="polarChart"></canvas>
      </div>
      <div
        v-show="currentView === 'bubble'"
        class="chart-container absolute inset-0"
      >
        <canvas id="bubbleChart"></canvas>
      </div>
    </div>

    <!-- Легенда с дополнительной информацией -->
    <div class="grid grid-cols-3 gap-4 mt-6">
      <div
        v-for="(data, index) in analyticsData"
        :key="index"
        class="p-4 rounded-lg"
        :style="{
          backgroundColor: `${
            index === 0 ? chartColors.background : 'rgba(0,0,0,0.03)'
          }`,
        }"
      >
        <h3 class="font-medium text-gray-800">{{ data.category }}</h3>
        <div class="mt-2 space-y-1">
          <p class="text-sm text-gray-600">
            Выручка: {{ (data.revenue / 1000).toFixed(1) }}K
          </p>
          <p class="text-sm text-gray-600">Рост: +{{ data.growth }}%</p>
          <p class="text-sm text-gray-600">Клиенты: {{ data.customers }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  margin: 0 auto;
}

.chart-container {
  transition: opacity 0.3s ease;
  height: 100%;
  width: 100%;
}

.chart-container canvas {
  max-width: 100%;
  max-height: 100%;
}

/* Добавляем стили для улучшения читаемости текста */
:deep(.chart-js-tooltip) {
  background: rgba(255, 255, 255, 0.98) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
  border-radius: 6px !important;
  padding: 8px 12px !important;
  font-family: "Inter", sans-serif !important;
  font-size: 12px !important;
}
</style>
