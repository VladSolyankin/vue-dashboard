<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import Tooltip from "../ui/Tooltip.vue";

interface Event {
  id: number;
  title: string;
  date: string;
  type: "meeting" | "deadline" | "task";
  description?: string;
  time?: string;
}

const currentDate = new Date();
const currentMonth = ref(3); // Апрель (0-based)
const currentYear = ref(2024);

const events = ref<Event[]>([
  {
    id: 1,
    title: "Встреча с клиентом",
    date: "2024-04-03",
    type: "meeting",
    time: "14:00",
    description: "Обсуждение нового проекта",
  },
  {
    id: 2,
    title: "Дедлайн проекта",
    date: "2024-04-15",
    type: "deadline",
    description: "Сдача первой версии дизайна",
  },
  {
    id: 3,
    title: "Обновление сайта",
    date: "2024-04-30",
    type: "task",
    time: "10:00",
    description: "Деплой новой версии",
  },
]);

const getMonthDays = () => {
  const days = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);

  // Добавляем пустые дни в начало месяца
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }

  // Добавляем дни месяца
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(i);
  }

  return days;
};

const days = ref(getMonthDays());
const monthNames = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const getEventType = (type: Event["type"]) => {
  const classes = {
    meeting: "bg-blue-100 text-blue-800",
    deadline: "bg-red-100 text-red-800",
    task: "bg-purple-100 text-purple-800",
  };
  return classes[type];
};

const getEventsForDay = (day: number) => {
  const date = `${currentYear.value}-${String(currentMonth.value + 1).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
  return events.value.filter((event) => event.date === date);
};

const getEventDetails = (event: Event): string => {
  const details = [];
  details.push(`📌 ${event.title}`);

  const typeLabels = {
    meeting: "👥 Встреча",
    deadline: "⏰ Дедлайн",
    task: "📋 Задача",
  };
  details.push(typeLabels[event.type]);

  if (event.time) details.push(`🕐 Время: ${event.time}`);
  if (event.description) details.push(`📝 ${event.description}`);
  return details.join("\n");
};

const tooltipRefs = ref<{ [key: string]: any }>({});

const handleDayMouseEnter = (event: MouseEvent, day: number) => {
  const dayEvents = getEventsForDay(day);
  if (dayEvents.length > 0) {
    const tooltipKey = `tooltip-${day}`;
    if (tooltipRefs.value[tooltipKey]) {
      tooltipRefs.value[tooltipKey].show();
    }
  }

  // Анимация дня
  const dayEl = event.currentTarget as HTMLElement;
  gsap.to(dayEl, {
    scale: 1.05,
    duration: 0.3,
    ease: "power2.out",
  });
};

const handleDayMouseLeave = (event: MouseEvent, day: number) => {
  const tooltipKey = `tooltip-${day}`;
  if (tooltipRefs.value[tooltipKey]) {
    tooltipRefs.value[tooltipKey].hide();
  }

  // Возврат анимации дня
  const dayEl = event.currentTarget as HTMLElement;
  gsap.to(dayEl, {
    scale: 1,
    duration: 0.3,
    ease: "power2.out",
  });
};

onMounted(() => {
  // Анимация появления календаря
  gsap.from(".calendar-container", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  // Анимация появления дней
  gsap.from(".calendar-day", {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    stagger: {
      amount: 1,
      grid: [6, 7],
      from: "start",
    },
    ease: "power2.out",
  });
});
</script>

<template>
  <div
    class="calendar-container bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible"
  >
    <div class="p-6 border-b border-gray-100">
      <h2 class="text-lg font-semibold text-gray-800">Календарь</h2>
      <p class="text-gray-500 mt-1">
        {{ monthNames[currentMonth] }} {{ currentYear }}
      </p>
    </div>

    <div class="p-6">
      <!-- Дни недели -->
      <div class="grid grid-cols-7 gap-2 mb-4">
        <div
          v-for="day in ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']"
          :key="day"
          class="text-center text-sm font-medium text-gray-500"
        >
          {{ day }}
        </div>
      </div>

      <!-- Календарная сетка -->
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="(day, index) in days"
          :key="index"
          class="calendar-day aspect-square p-2 rounded-lg border border-gray-100 relative"
          :class="[
            day ? 'cursor-pointer hover:border-indigo-200' : 'bg-gray-50',
            { 'has-events': day && getEventsForDay(day).length > 0 },
          ]"
          @mouseenter="day && handleDayMouseEnter($event, day)"
          @mouseleave="day && handleDayMouseLeave($event, day)"
        >
          <template v-if="day">
            <div class="day-content">
              <span
                class="text-sm font-medium"
                :class="[
                  'text-gray-700',
                  { 'text-indigo-600': getEventsForDay(day).length > 0 },
                ]"
              >
                {{ day }}
              </span>

              <!-- События дня -->
              <div class="absolute bottom-1 left-1 right-1">
                <div
                  v-for="event in getEventsForDay(day)"
                  :key="event.id"
                  class="text-xs px-1.5 py-0.5 rounded-full mb-1 truncate"
                  :class="getEventType(event.type)"
                >
                  {{ event.title }}
                </div>
              </div>

              <!-- Тултип -->
              <Tooltip
                v-if="getEventsForDay(day).length > 0"
                :ref="
                  (el) => {
                    if (el) tooltipRefs[`tooltip-${day}`] = el;
                  }
                "
                :content="getEventsForDay(day).map(getEventDetails)"
                position="top"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  position: relative;
  z-index: 1;
}

.calendar-day {
  transition: transform 0.3s ease, border-color 0.3s ease;
  will-change: transform;
  min-height: 80px;
}

.calendar-day.has-events {
  background-color: rgba(79, 70, 229, 0.02);
}

.calendar-day:hover {
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.day-content {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
