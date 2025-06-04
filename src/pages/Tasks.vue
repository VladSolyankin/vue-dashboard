<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Chart, registerables } from "chart.js";
import { gsap } from "gsap";

// Регистрируем компоненты Chart.js
Chart.register(...registerables);

interface Task {
  id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  deadline: string;
  assignee: string;
  tags: string[];
  progress: number;
}

// Моковые данные для задач
const tasks = ref<Task[]>([
  {
    id: 1,
    title: "Разработка дашборда",
    description: "Создание современного адаптивного дашборда с графиками",
    status: "in_progress",
    priority: "high",
    deadline: "2024-04-15",
    assignee: "Александр",
    tags: ["Frontend", "Vue", "TypeScript"],
    progress: 65,
  },
  {
    id: 2,
    title: "Оптимизация производительности",
    description: "Улучшение времени загрузки и отзывчивости приложения",
    status: "todo",
    priority: "medium",
    deadline: "2024-04-20",
    assignee: "Мария",
    tags: ["Performance", "Optimization"],
    progress: 0,
  },
  {
    id: 3,
    title: "Интеграция API",
    description: "Подключение внешних сервисов и настройка взаимодействия",
    status: "review",
    priority: "high",
    deadline: "2024-04-18",
    assignee: "Дмитрий",
    tags: ["Backend", "API", "Integration"],
    progress: 90,
  },
  {
    id: 4,
    title: "Тестирование безопасности",
    description: "Проведение аудита безопасности и исправление уязвимостей",
    status: "done",
    priority: "high",
    deadline: "2024-04-10",
    assignee: "Елена",
    tags: ["Security", "Testing"],
    progress: 100,
  },
  {
    id: 5,
    title: "Обновление документации",
    description: "Актуализация технической документации проекта",
    status: "todo",
    priority: "low",
    deadline: "2024-04-25",
    assignee: "Игорь",
    tags: ["Documentation"],
    progress: 0,
  },
]);

// Статистика по статусам
const statusChart = ref<Chart | null>(null);
const statusData = computed(() => {
  const statuses = new Map<string, number>();
  tasks.value.forEach((task) => {
    statuses.set(task.status, (statuses.get(task.status) || 0) + 1);
  });

  return {
    labels: ["К выполнению", "В работе", "На проверке", "Завершено"],
    datasets: [
      {
        data: [
          statuses.get("todo") || 0,
          statuses.get("in_progress") || 0,
          statuses.get("review") || 0,
          statuses.get("done") || 0,
        ],
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(34, 197, 94, 0.8)",
        ],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };
});

// График прогресса по приоритетам
const priorityChart = ref<Chart | null>(null);
const priorityData = computed(() => {
  const priorities = new Map<string, { total: number; completed: number }>();
  tasks.value.forEach((task) => {
    if (!priorities.has(task.priority)) {
      priorities.set(task.priority, { total: 0, completed: 0 });
    }
    const data = priorities.get(task.priority)!;
    data.total++;
    data.completed += task.progress / 100;
  });

  return {
    labels: ["Высокий", "Средний", "Низкий"],
    datasets: [
      {
        label: "Всего задач",
        data: [
          priorities.get("high")?.total || 0,
          priorities.get("medium")?.total || 0,
          priorities.get("low")?.total || 0,
        ],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        type: "bar" as const,
      },
      {
        label: "Выполнено",
        data: [
          priorities.get("high")?.completed || 0,
          priorities.get("medium")?.completed || 0,
          priorities.get("low")?.completed || 0,
        ],
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 2,
        type: "line" as const,
        fill: false,
        tension: 0.4,
      },
    ],
  };
});

// Функция для анимации текста
const animateText = (element: Element) => {
  // Разбиваем текст на буквы
  const text = element.textContent || "";
  element.textContent = "";
  const letters = text.split("");

  letters.forEach((letter, i) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.opacity = "0";
    span.style.display = "inline-block";
    element.appendChild(span);

    gsap.to(span, {
      opacity: 1,
      duration: 0.1,
      delay: i * 0.03,
      y: 0,
      ease: "power2.out",
    });
  });
};

// Инициализация графиков
const initCharts = () => {
  // График статусов (Polar Area)
  const statusCtx = document.getElementById("statusChart") as HTMLCanvasElement;
  if (statusCtx) {
    statusChart.value = new Chart(statusCtx, {
      type: "polarArea",
      data: statusData.value,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
        scales: {
          r: {
            ticks: {
              display: false,
            },
          },
        },
      },
    });
  }

  // График приоритетов (Mixed: Bar + Line)
  const priorityCtx = document.getElementById(
    "priorityChart"
  ) as HTMLCanvasElement;
  if (priorityCtx) {
    priorityChart.value = new Chart(priorityCtx, {
      type: "bar",
      data: priorityData.value,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
        },
      },
    });
  }
};

onMounted(() => {
  initCharts();

  // Анимация заголовка
  const title = document.querySelector(".page-title");
  if (title) {
    animateText(title);
  }

  // Анимация появления карточек
  gsap.from(".task-card", {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out",
  });

  // Анимация прогресс-баров
  gsap.from(".progress-bar div", {
    scaleX: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.1,
  });
});

// Вспомогательные функции для стилей
const getStatusColor = (status: Task["status"]) => {
  const colors = {
    todo: "bg-indigo-600",
    in_progress: "bg-orange-500",
    review: "bg-purple-600",
    done: "bg-green-500",
  };
  return colors[status];
};

const getPriorityColor = (priority: Task["priority"]) => {
  const colors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };
  return colors[priority];
};

const getStatusText = (status: Task["status"]) => {
  const texts = {
    todo: "К выполнению",
    in_progress: "В работе",
    review: "На проверке",
    done: "Завершено",
  };
  return texts[status];
};

// Состояния фильтров
const selectedStatus = ref("");
const selectedPriority = ref("");
const selectedAssignee = ref("");

// Отфильтрованные задачи
const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    const statusMatch =
      !selectedStatus.value || task.status === selectedStatus.value;
    const priorityMatch =
      !selectedPriority.value || task.priority === selectedPriority.value;
    const assigneeMatch =
      !selectedAssignee.value || task.assignee === selectedAssignee.value;
    return statusMatch && priorityMatch && assigneeMatch;
  });
});

// Уникальные исполнители
const uniqueAssignees = computed(() => {
  return [...new Set(tasks.value.map((task) => task.assignee))];
});
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title text-2xl font-bold text-gray-800">Задачи</h1>
        <p class="text-gray-500 mt-2">Управление задачами и их статусами</p>
      </div>
      <!-- <button
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Новая задача
      </button> -->
    </div>

    <!-- Графики -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- График статусов -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          Распределение по статусам
        </h3>
        <div class="h-[300px]">
          <canvas id="statusChart"></canvas>
        </div>
      </div>

      <!-- График приоритетов -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          Прогресс по приоритетам
        </h3>
        <div class="h-[300px]">
          <canvas id="priorityChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div class="flex flex-wrap gap-4">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700">Статус:</span>
          <select
            v-model="selectedStatus"
            class="form-select rounded-lg border-gray-200 text-sm"
          >
            <option value="">Все статусы</option>
            <option value="todo">К выполнению</option>
            <option value="in_progress">В работе</option>
            <option value="review">На проверке</option>
            <option value="done">Завершено</option>
          </select>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700">Приоритет:</span>
          <select
            v-model="selectedPriority"
            class="form-select rounded-lg border-gray-200 text-sm"
          >
            <option value="">Все приоритеты</option>
            <option value="high">Высокий</option>
            <option value="medium">Средний</option>
            <option value="low">Низкий</option>
          </select>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700">Исполнитель:</span>
          <select
            v-model="selectedAssignee"
            class="form-select rounded-lg border-gray-200 text-sm"
          >
            <option value="">Все исполнители</option>
            <option
              v-for="assignee in uniqueAssignees"
              :key="assignee"
              :value="assignee"
            >
              {{ assignee }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Задачи -->
    <div class="grid grid-cols-1 gap-4">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-card bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <h4 class="font-medium text-gray-800">{{ task.title }}</h4>
            <p class="text-sm text-gray-500">{{ task.description }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getPriorityColor(task.priority)"
            >
              {{
                task.priority === "high"
                  ? "Высокий"
                  : task.priority === "medium"
                  ? "Средний"
                  : "Низкий"
              }}
            </span>
          </div>
        </div>

        <div class="mt-4">
          <div
            class="flex items-center justify-between text-sm text-gray-500 mb-1"
          >
            <span>Прогресс</span>
            <span>{{ task.progress }}%</span>
          </div>
          <div
            class="progress-bar h-2 bg-gray-100 rounded-full overflow-hidden"
          >
            <div
              class="h-full transition-all duration-300"
              :class="getStatusColor(task.status)"
              :style="{ width: `${task.progress}%` }"
            ></div>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between">
          <div class="flex gap-2">
            <span
              v-for="tag in task.tags"
              :key="tag"
              class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
            >
              {{ tag }}
            </span>
          </div>
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span>{{ task.assignee }}</span>
            <span>{{ task.deadline }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  position: relative;
}

.task-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, #4f46e5, #a855f7);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.task-card:hover::before {
  opacity: 1;
}

.form-select {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.progress-bar div {
  transform-origin: left;
}
</style>
