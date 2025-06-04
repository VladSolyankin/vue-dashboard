<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Chart, registerables } from "chart.js";
import { gsap } from "gsap";
import annotationPlugin from "chartjs-plugin-annotation";
import { useCharts } from "../composables/useCharts";
import { useAnimations } from "../composables/useAnimations";
import { mockProjects, mockCommitActivity } from "../data/mockData";

// Регистрируем необходимые компоненты
Chart.register(...registerables, annotationPlugin);

interface Project {
  id: number;
  name: string;
  description: string;
  technologies: string[];
  stars: number;
  commits: number;
  url: string;
  contributors: number;
  lastUpdate: string;
}

interface CommitActivity {
  date: string;
  commits: number;
}

// Моковые данные для проектов
const projects = ref<Project[]>(mockProjects);
const commitActivity = ref<CommitActivity[]>(mockCommitActivity);

// График распределения технологий (Doughnut с градиентами)
const techChart = ref<Chart | null>(null);
const techData = computed(() => {
  const techs = new Map<string, number>();
  projects.value.forEach((project) => {
    project.technologies.forEach((tech) => {
      techs.set(tech, (techs.get(tech) || 0) + 1);
    });
  });
  return {
    labels: Array.from(techs.keys()),
    datasets: [
      {
        data: Array.from(techs.values()),
        backgroundColor: [
          "rgba(79, 70, 229, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(52, 211, 153, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(99, 102, 241, 0.8)",
        ],
      },
    ],
  };
});

// График активности коммитов (Line с аннотациями)
const activityChart = ref<Chart | null>(null);
const activityData = computed(() => ({
  labels: commitActivity.value.map((item) => item.date),
  datasets: [
    {
      label: "Коммиты",
      data: commitActivity.value.map((item) => item.commits),
      borderColor: "rgba(79, 70, 229, 1)",
      backgroundColor: "rgba(79, 70, 229, 0.1)",
      fill: true,
      tension: 0.4,
    },
  ],
}));

// Анимация появления проектов
const animateProjects = () => {
  gsap.from(".project-card", {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "power2.out",
  });
};

// Инициализация графиков
const initCharts = () => {
  // График технологий
  const techCtx = document.getElementById("techChart") as HTMLCanvasElement;
  if (techCtx) {
    const ctx = techCtx.getContext("2d");
    if (ctx) {
      // Создаем градиенты
      const gradients = [
        ctx.createLinearGradient(0, 0, 0, 200),
        ctx.createLinearGradient(0, 0, 0, 200),
      ];

      gradients[0].addColorStop(0, "rgba(79, 70, 229, 0.8)");
      gradients[0].addColorStop(1, "rgba(168, 85, 247, 0.8)");

      gradients[1].addColorStop(0, "rgba(236, 72, 153, 0.8)");
      gradients[1].addColorStop(1, "rgba(52, 211, 153, 0.8)");

      techChart.value = new Chart(techCtx, {
        type: "doughnut",
        data: {
          ...techData.value,
          datasets: [
            {
              ...techData.value.datasets[0],
              backgroundColor: gradients,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                font: {
                  size: 12,
                  family: "'Inter', sans-serif",
                },
                padding: 20,
              },
            },
          },
          cutout: "70%",
        },
      });
    }
  }

  // График активности
  const activityCtx = document.getElementById(
    "activityChart"
  ) as HTMLCanvasElement;
  if (activityCtx) {
    activityChart.value = new Chart(activityCtx, {
      type: "line",
      data: activityData.value,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          annotation: {
            annotations: {
              maxLine: {
                type: "line",
                yMin: Math.max(
                  ...commitActivity.value.map((item) => item.commits)
                ),
                yMax: Math.max(
                  ...commitActivity.value.map((item) => item.commits)
                ),
                borderColor: "rgba(236, 72, 153, 0.5)",
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                  content: "Максимум активности",
                  display: true,
                  position: "end",
                },
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }
};

onMounted(() => {
  initCharts();
  animateProjects();
});
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Проекты</h1>
        <p class="text-gray-500 mt-2">Обзор проектов и их статистика</p>
      </div>
      <!-- <button
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Новый проект
      </button> -->
    </div>

    <!-- Графики -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- График распределения технологий -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          Используемые технологии
        </h3>
        <div class="h-[300px]">
          <canvas id="techChart"></canvas>
        </div>
      </div>

      <!-- График активности -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          Активность коммитов
        </h3>
        <div class="h-[300px]">
          <canvas id="activityChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Проекты -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
      >
        <a
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block p-6"
        >
          <div class="flex items-start justify-between">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ project.name }}
            </h3>
            <div class="flex items-center space-x-2">
              <span class="text-yellow-500">★</span>
              <span class="text-sm text-gray-600">{{ project.stars }}</span>
            </div>
          </div>

          <p class="mt-2 text-gray-600 text-sm">
            {{ project.description }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-indigo-100 text-indigo-700': tech.includes('Vue'),
                'bg-blue-100 text-blue-700': tech.includes('React'),
                'bg-green-100 text-green-700': tech.includes('Node'),
                'bg-purple-100 text-purple-700': tech.includes('Type'),
                'bg-orange-100 text-orange-700': tech.includes('Three'),
                'bg-red-100 text-red-700': tech.includes('GSAP'),
              }"
            >
              {{ tech }}
            </span>
          </div>

          <div
            class="mt-4 flex items-center justify-between text-sm text-gray-500"
          >
            <div class="flex items-center space-x-4">
              <span>{{ project.commits }} коммитов</span>
              <span>{{ project.contributors }} участников</span>
            </div>
            <span
              >Обновлено:
              {{ new Date(project.lastUpdate).toLocaleDateString() }}</span
            >
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  position: relative;
}

.project-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, #4f46e5, #a855f7);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover::before {
  opacity: 1;
}
</style>
