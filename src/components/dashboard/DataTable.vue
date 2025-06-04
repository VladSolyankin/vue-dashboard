<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

interface TableData {
  id: number;
  project: string;
  client: string;
  status: "completed" | "in_progress" | "pending";
  deadline: string;
  budget: string;
}

const tableData = ref<TableData[]>([
  {
    id: 1,
    project: "Редизайн сайта",
    client: 'ООО "Технологии"',
    status: "completed",
    deadline: "2024-04-15",
    budget: "₽250,000",
  },
  {
    id: 2,
    project: "Мобильное приложение",
    client: "ИП Иванов",
    status: "in_progress",
    deadline: "2024-05-01",
    budget: "₽450,000",
  },
  {
    id: 3,
    project: "SEO оптимизация",
    client: 'ООО "Маркетинг"',
    status: "pending",
    deadline: "2024-04-20",
    budget: "₽120,000",
  },
  {
    id: 4,
    project: "Интеграция CRM",
    client: 'АО "Бизнес"',
    status: "in_progress",
    deadline: "2024-05-10",
    budget: "₽380,000",
  },
]);

const getStatusClass = (status: TableData["status"]) => {
  const classes = {
    completed: "bg-green-100 text-green-800",
    in_progress: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
  };
  return classes[status];
};

const getStatusText = (status: TableData["status"]) => {
  const texts = {
    completed: "Завершен",
    in_progress: "В работе",
    pending: "Ожидание",
  };
  return texts[status];
};

onMounted(() => {
  // Анимация появления строк таблицы
  gsap.from(".table-row", {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.out",
  });
});

// Анимация при наведении на строку
const handleRowHover = (event: MouseEvent) => {
  const row = event.currentTarget as HTMLElement;
  gsap.to(row, {
    backgroundColor: "#f8fafc",
    duration: 0.3,
    ease: "power2.out",
  });
};

const handleRowLeave = (event: MouseEvent) => {
  const row = event.currentTarget as HTMLElement;
  gsap.to(row, {
    backgroundColor: "#ffffff",
    duration: 0.3,
    ease: "power2.out",
  });
};
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
  >
    <div class="p-6 border-b border-gray-100">
      <h2 class="text-lg font-semibold text-gray-800">Активные проекты</h2>
      <p class="text-gray-500 mt-1">Обзор текущих проектов и их статусов</p>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Проект
            </th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Клиент
            </th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Статус
            </th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Дедлайн
            </th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500">
              Бюджет
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in tableData"
            :key="item.id"
            class="table-row border-b border-gray-100 transition-colors"
            @mouseenter="handleRowHover"
            @mouseleave="handleRowLeave"
          >
            <td class="px-6 py-4">
              <div class="font-medium text-gray-800">{{ item.project }}</div>
            </td>
            <td class="px-6 py-4 text-gray-500">{{ item.client }}</td>
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getStatusClass(item.status)"
              >
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-gray-500">{{ item.deadline }}</td>
            <td class="px-6 py-4 font-medium text-gray-800">
              {{ item.budget }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
