<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import StatCard from "../components/dashboard/StatCard.vue";
import Chart from "../components/dashboard/Chart.vue";
import DataTable from "../components/dashboard/DataTable.vue";
import Calendar from "../components/dashboard/Calendar.vue";
import draggable from "vuedraggable";

interface StatData {
  id: number;
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

const stats = ref<StatData[]>([
  {
    id: 1,
    title: "Общий доход",
    value: "₽124,500",
    change: 12.5,
    icon: "i-carbon-money",
    color: "bg-green-500",
  },
  {
    id: 2,
    title: "Новые клиенты",
    value: "54",
    change: -2.4,
    icon: "i-carbon-user-multiple",
    color: "bg-blue-500",
  },
  {
    id: 3,
    title: "Активные проекты",
    value: "12",
    change: 8.3,
    icon: "i-carbon-document",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Конверсия",
    value: "24.8%",
    change: 5.7,
    icon: "i-carbon-chart-line",
    color: "bg-yellow-500",
  },
]);

const drag = ref(false);

onMounted(() => {
  // Анимация появления заголовка
  gsap.from(".dashboard-title", {
    y: -20,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  // Анимация появления карточек статистики
  gsap.from(".stat-card", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out",
  });
});

const onDragStart = () => {
  drag.value = true;
};

const onDragEnd = () => {
  drag.value = false;
};
</script>

<template>
  <div class="dashboard">
    <!-- Заголовок -->
    <div class="dashboard-title mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Обзор показателей</h1>
      <p class="text-gray-500 mt-1">Добро пожаловать в панель управления</p>
    </div>

    <!-- Статистика -->
    <div class="stats-container mb-12">
      <h2 class="text-lg font-bold text-gray-800 mb-4">
        Статистика (drag and drop)
      </h2>
      <draggable
        v-model="stats"
        :animation="200"
        item-key="id"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        ghost-class="stat-card-ghost"
        @start="onDragStart"
        @end="onDragEnd"
      >
        <template #item="{ element }">
          <div class="stat-card-wrapper">
            <StatCard
              :title="element.title"
              :value="element.value"
              :change="element.change"
              :icon="element.icon"
              :color="element.color"
              class="stat-card"
              :class="{ 'cursor-move': !drag, 'cursor-grabbing': drag }"
            />
          </div>
        </template>
      </draggable>
    </div>

    <!-- Основной контент -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- График -->
      <div class="lg:col-span-2">
        <Chart />
      </div>

      <!-- Таблица проектов -->
      <div class="lg:col-span-1">
        <DataTable />
      </div>

      <!-- Календарь -->
      <div class="lg:col-span-1">
        <Calendar />
      </div>
    </div>

    <!-- Здесь будут добавлены другие компоненты (таблицы, календарь и т.д.) -->
  </div>
</template>

<style scoped>
.stats-container {
  position: relative;
  min-height: 150px;
}

.stat-card-wrapper {
  height: 100%;
}

.stat-card {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card-ghost {
  opacity: 0.5;
  background: #f3f4f6;
}

/* Исправляем стили draggable */
:deep(.sortable-drag) {
  z-index: 10;
}

:deep(.sortable-ghost) {
  opacity: 0.5;
}
</style>
