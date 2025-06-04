<script setup lang="ts">
import { ref } from "vue";
import Sidebar from "../layout/Sidebar.vue";
import StatCard from "./StatCard.vue";
import Chart from "./Chart.vue";
import DataTable from "./DataTable.vue";
import Calendar from "./Calendar.vue";
import Analytics from "./Analytics.vue";
import Projects from "./Projects.vue";
import gsap from "gsap";

const activeTab = ref<"overview" | "analytics" | "projects">("overview");

// Функция для переключения вкладок с анимацией
const switchTab = (tab: typeof activeTab.value) => {
  const oldTab = activeTab.value;
  activeTab.value = tab;

  // Анимация исчезновения старой вкладки
  gsap.to(`[data-tab="${oldTab}"]`, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    ease: "power2.in",
  });

  // Анимация появления новой вкладки
  gsap.fromTo(
    `[data-tab="${tab}"]`,
    {
      opacity: 0,
      y: -20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
      delay: 0.2,
    }
  );
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Sidebar />
    <div class="lg:pl-72">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Переключатель вкладок -->
        <div class="flex space-x-4 mb-6">
          <button
            v-for="tab in ['overview', 'analytics', 'projects']"
            :key="tab"
            @click="switchTab(tab)"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="[
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50',
            ]"
          >
            {{
              tab === "overview"
                ? "Обзор"
                : tab === "analytics"
                ? "Аналитика"
                : "Проекты"
            }}
          </button>
        </div>

        <!-- Контейнер для вкладок -->
        <div class="relative">
          <!-- Вкладка обзора -->
          <div
            v-show="activeTab === 'overview'"
            data-tab="overview"
            class="space-y-6"
          >
            <!-- Статистика -->
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Общая выручка"
                value="₽2.4M"
                change="+12.5%"
                type="positive"
              />
              <StatCard
                title="Новые клиенты"
                value="184"
                change="+8.2%"
                type="positive"
              />
              <StatCard
                title="Активные проекты"
                value="42"
                change="-2.4%"
                type="negative"
              />
              <StatCard
                title="Конверсия"
                value="24.3%"
                change="+4.1%"
                type="positive"
              />
            </div>

            <!-- График и таблица -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Chart />
              <DataTable />
            </div>

            <!-- Календарь -->
            <Calendar />
          </div>

          <!-- Вкладка аналитики -->
          <div
            v-show="activeTab === 'analytics'"
            data-tab="analytics"
            class="space-y-6"
          >
            <Analytics />
          </div>

          <!-- Вкладка проектов -->
          <div
            v-show="activeTab === 'projects'"
            data-tab="projects"
            class="space-y-6"
          >
            <Projects />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

[data-tab] {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
}

[data-tab].active {
  position: relative;
  opacity: 1;
  pointer-events: auto;
}
</style>
