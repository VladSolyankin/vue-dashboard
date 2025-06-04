<template>
  <div class="dashboard-projects p-4">
    <h2 class="text-xl font-semibold mb-4">Последние проекты</h2>

    <!-- Краткая статистика -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="text-sm text-gray-500">Всего проектов</h3>
        <p class="text-2xl font-bold">{{ projects.length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="text-sm text-gray-500">Всего коммитов</h3>
        <p class="text-2xl font-bold">{{ totalCommits }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="text-sm text-gray-500">Активных проектов</h3>
        <p class="text-2xl font-bold">{{ activeProjects }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="text-sm text-gray-500">Звёзд на GitHub</h3>
        <p class="text-2xl font-bold">{{ totalStars }}</p>
      </div>
    </div>

    <!-- Графики -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="text-sm font-semibold mb-2">Технологии</h3>
        <canvas id="techChart"></canvas>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="text-sm font-semibold mb-2">Активность</h3>
        <canvas id="activityChart"></canvas>
      </div>
    </div>

    <!-- Список последних проектов -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <h3 class="text-sm font-semibold mb-4">Последние обновления</h3>
      <div class="space-y-4">
        <div
          v-for="project in sortedProjects"
          :key="project.id"
          class="project-card flex items-center justify-between p-2 hover:bg-gray-50 rounded"
        >
          <div>
            <h4 class="font-medium">{{ project.name }}</h4>
            <p class="text-sm text-gray-500">{{ project.description }}</p>
          </div>
          <div class="text-sm text-gray-500">
            {{ new Date(project.lastUpdate).toLocaleDateString() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useCharts } from "../../composables/useCharts";
import { useAnimations } from "../../composables/useAnimations";
import { mockProjects, mockCommitActivity } from "../../data/mockData";

const projects = ref(mockProjects);
const commitActivity = ref(mockCommitActivity);

// Вычисляемые свойства для статистики
const totalCommits = computed(() =>
  projects.value.reduce((sum, project) => sum + project.commits, 0)
);

const totalStars = computed(() =>
  projects.value.reduce((sum, project) => sum + project.stars, 0)
);

const activeProjects = computed(
  () =>
    projects.value.filter((project) => {
      const lastUpdate = new Date(project.lastUpdate);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return lastUpdate >= monthAgo;
    }).length
);

const sortedProjects = computed(() =>
  [...projects.value].sort(
    (a, b) =>
      new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
  )
);

const { initCharts } = useCharts(projects, commitActivity);
const { animateProjects } = useAnimations();

onMounted(() => {
  initCharts();
  animateProjects();
});
</script>

<style scoped>
.dashboard-projects {
  max-width: 100%;
  margin: 0 auto;
}

.project-card {
  transition: all 0.2s ease-in-out;
}

.project-card:hover {
  transform: translateX(5px);
}
</style>
