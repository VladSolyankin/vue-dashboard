<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from "vue";
import { gsap } from "gsap";

interface TextItem {
  text: string;
  velocity: number;
  opacity: number;
  x: number;
}

const texts = ref<TextItem[]>([
  { text: "Scroll", velocity: 0, opacity: 0.3, x: 0 },
  { text: "to", velocity: 0, opacity: 0.3, x: 0 },
  { text: "control", velocity: 0, opacity: 0.3, x: 0 },
  { text: "the", velocity: 0, opacity: 0.3, x: 0 },
  { text: "velocity", velocity: 0, opacity: 0.3, x: 0 },
]);

// Тексты для бесконечной прокрутки
const infiniteTexts = {
  left: [
    "Vue.js",
    "•",
    "TypeScript",
    "•",
    "GSAP",
    "•",
    "Tailwind",
    "•",
    "Animations",
    "•",
  ],
  right: [
    "Frontend",
    "•",
    "Development",
    "•",
    "Interactive",
    "•",
    "Modern",
    "•",
    "Design",
    "•",
  ],
};

const lastScrollTop = ref(0);
const scrollVelocity = ref(0);
const maxVelocity = 30;
const velocityFactor = 0.1;
const container = ref<HTMLElement | null>(null);

const updateVelocity = () => {
  if (!container.value) return;

  const st = window.pageYOffset || document.documentElement.scrollTop;
  scrollVelocity.value = Math.max(
    Math.min((st - lastScrollTop.value) * velocityFactor, maxVelocity),
    -maxVelocity
  );

  texts.value.forEach((item, index) => {
    const targetVelocity = scrollVelocity.value * (index + 1) * 0.2;
    item.velocity = gsap.utils.interpolate(item.velocity, targetVelocity, 0.1);
    item.x += item.velocity;

    // Обновляем прозрачность на основе скорости
    const speed = Math.abs(item.velocity);
    item.opacity = gsap.utils.clamp(0.3, 1, 0.3 + (speed / maxVelocity) * 0.7);
  });

  lastScrollTop.value = st;
  requestAnimationFrame(updateVelocity);
};

// Функция для ограничения позиции текста в пределах контейнера
const checkBounds = () => {
  if (!container.value) return;

  const containerWidth = container.value.offsetWidth;
  texts.value.forEach((item) => {
    if (Math.abs(item.x) > containerWidth / 2) {
      item.x = (Math.sign(item.x) * -containerWidth) / 2;
    }
  });
};

// Рефы для контейнеров прокрутки
const leftScrollContainer = ref<HTMLElement | null>(null);
const rightScrollContainer = ref<HTMLElement | null>(null);

// Функция для создания бесконечной анимации
const createInfiniteScroll = (
  element: HTMLElement,
  direction: "left" | "right"
) => {
  // Получаем ширину контента
  const contentWidth = element.offsetWidth;
  const duration = direction === "left" ? 20 : 25;

  // Создаем timeline с правильными параметрами
  const tl = gsap.timeline({
    repeat: -1,
    defaults: { ease: "none" },
  });

  // Сначала установим начальную позицию
  gsap.set(element, { x: direction === "left" ? 0 : -contentWidth / 2 });

  // Анимируем в зависимости от направления
  if (direction === "left") {
    tl.to(element, {
      x: -contentWidth / 2,
      duration,
      onComplete: () => {
        gsap.set(element, { x: 0 });
      },
    });
  } else {
    tl.to(element, {
      x: 0,
      duration,
      onComplete: () => {
        gsap.set(element, { x: -contentWidth / 2 });
      },
    });
  }

  return tl;
};

onMounted(() => {
  updateVelocity();
  window.addEventListener("resize", checkBounds);

  if (leftScrollContainer.value && rightScrollContainer.value) {
    createInfiniteScroll(leftScrollContainer.value, "left");
    createInfiniteScroll(rightScrollContainer.value, "right");
  }

  // Запускаем счетчики с небольшой задержкой
  setTimeout(startCounters, 500);

  // Устанавливаем начальную позицию фона меню
  nextTick(() => {
    if (menuItems_el.value[0] && menuBackground.value) {
      const firstItem = menuItems_el.value[0];
      const firstItemRect = firstItem.getBoundingClientRect();
      const navRect = firstItem.closest("nav")?.getBoundingClientRect();

      if (navRect) {
        const relativeLeft = firstItemRect.left - navRect.left;
        gsap.set(menuBackground.value, {
          x: relativeLeft,
          width: firstItemRect.width,
        });
      }
    }
  });

  // Запускаем анимацию градиента
  nextTick(() => {
    updateGradientAnimation();
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", checkBounds);
  gsap.killTweensOf(".scroll-left");
  gsap.killTweensOf(".scroll-right");
  if (gradientTimeline.value) {
    gradientTimeline.value.kill();
  }
});

// Состояние для счетчиков
const counters = ref({
  visitors: 0,
  sales: 0,
  rating: 0,
  progress: 0,
});

// Храним активные анимации
const activeAnimations = ref<gsap.core.Tween[]>([]);

// Функция для анимации числа
const animateNumber = (
  target: keyof typeof counters.value,
  endValue: number,
  duration = 2,
  suffix = ""
) => {
  const element = document.querySelector(`[data-counter="${target}"]`);
  if (!element) return;

  // Сбрасываем значение
  counters.value[target] = 0;
  element.textContent = "0" + suffix;

  // Создаем новую анимацию
  const tween = gsap.to(counters.value, {
    [target]: endValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      const value = counters.value[target];
      let displayValue = "";

      if (Number.isInteger(value)) {
        displayValue = Math.floor(value).toString();
      } else {
        displayValue = value.toFixed(1);
      }

      element.textContent = displayValue + suffix;
    },
  });

  // Сохраняем анимацию
  activeAnimations.value.push(tween);
};

// Функция для запуска всех анимаций
const startCounters = () => {
  // Останавливаем все активные анимации
  activeAnimations.value.forEach((tween) => tween.kill());
  activeAnimations.value = [];

  // Сбрасываем все значения
  Object.keys(counters.value).forEach((key) => {
    const k = key as keyof typeof counters.value;
    counters.value[k] = 0;
  });

  // Запускаем новые анимации с небольшой задержкой
  nextTick(() => {
    animateNumber("visitors", 15679, 3);
    animateNumber("sales", 1234, 2.5, "K");
    animateNumber("rating", 4.9, 1.5);
    animateNumber("progress", 100, 2, "%");
  });
};

// Состояние для Flowing Menu
const menuItems = ref([
  { id: 1, label: "Главная", icon: "i-carbon-home" },
  { id: 2, label: "Профиль", icon: "i-carbon-user" },
  { id: 3, label: "Сообщения", icon: "i-carbon-email" },
  { id: 4, label: "Настройки", icon: "i-carbon-settings" },
  { id: 5, label: "Помощь", icon: "i-carbon-help" },
]);

const activeMenuItem = ref(menuItems.value[0]);
const menuBackground = ref<HTMLElement | null>(null);
const menuItems_el = ref<HTMLElement[]>([]);

const updateMenuPosition = (
  item: (typeof menuItems.value)[0],
  index: number
) => {
  if (!menuBackground.value || !menuItems_el.value[index]) return;

  const menuItem = menuItems_el.value[index];
  const menuItemRect = menuItem.getBoundingClientRect();
  const navRect = menuItem.closest("nav")?.getBoundingClientRect();

  if (!navRect) return;

  // Вычисляем позицию относительно родительского nav
  const relativeLeft = menuItemRect.left - navRect.left;

  gsap.to(menuBackground.value, {
    x: relativeLeft,
    width: menuItemRect.width,
    duration: 0.4,
    ease: "power2.out",
  });

  activeMenuItem.value = item;
};

// Состояние для Blob Cursor
const blobCursor = ref<HTMLElement | null>(null);
const blobArea = ref<HTMLElement | null>(null);
const blobActive = ref(false);

// Функция для анимации blob-курсора
const animateBlob = (e: MouseEvent) => {
  if (!blobCursor.value || !blobArea.value) return;

  const bounds = blobArea.value.getBoundingClientRect();
  const x = e.clientX - bounds.left;
  const y = e.clientY - bounds.top;

  gsap.to(blobCursor.value, {
    x,
    y,
    duration: 0.3,
    ease: "power2.out",
  });
};

// Функция для активации/деактивации blob-эффекта
const toggleBlobActive = (
  active: boolean,
  type: "default" | "success" | "warning" = "default"
) => {
  blobActive.value = active;
  if (!blobCursor.value) return;

  // Изменяем цвет в зависимости от типа
  const colors = {
    default: ["#4f46e5", "#7c3aed"],
    success: ["#059669", "#0d9488"],
    warning: ["#d97706", "#ea580c"],
  };

  const [colorFrom, colorTo] = colors[type];

  gsap.to(blobCursor.value, {
    scale: active ? 2 : 1,
    duration: 0.4,
    ease: "elastic.out(1, 0.5)",
  });

  // Анимируем изменение градиента
  gsap.to(blobCursor.value, {
    background: `radial-gradient(circle at center, ${colorFrom} 0%, ${colorTo} 100%)`,
    duration: 0.3,
  });
};

// Состояние для градиентного текста
const gradientColors = ref({
  from: "#3b82f6",
  via: "#8b5cf6",
  to: "#ec4899",
});

const gradientSpeed = ref(3);
const gradientTimeline = ref<gsap.core.Timeline | null>(null);

// Функция для обновления анимации градиента
const updateGradientAnimation = () => {
  if (gradientTimeline.value) {
    gradientTimeline.value.kill();
  }

  const gradientElement = document.querySelector(
    ".gradient-text"
  ) as HTMLElement;
  if (!gradientElement) return;

  // Устанавливаем начальный градиент
  const gradient = `linear-gradient(to right, 
    ${gradientColors.value.from}, 
    ${gradientColors.value.via}, 
    ${gradientColors.value.to}, 
    ${gradientColors.value.from}
  )`;

  gradientElement.style.backgroundImage = gradient;

  // Сначала сбрасываем позицию
  gsap.set(gradientElement, {
    backgroundPosition: "0% center",
  });

  // Создаем новую бесконечную анимацию
  gradientTimeline.value = gsap.to(gradientElement, {
    backgroundPosition: "-200% center",
    duration: gradientSpeed.value,
    ease: "none",
    repeat: -1,
  });
};

// Обновляем анимацию при изменении цветов или скорости
watch(
  [gradientColors, gradientSpeed],
  () => {
    updateGradientAnimation();
  },
  { deep: true }
);
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Анимации</h1>
        <p class="mt-2 text-gray-600">Коллекция интерактивных анимаций</p>
      </div>

      <div
        class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mt-8"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-8">
          Бесконечная прокрутка
        </h2>
        <div
          class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Левая прокрутка -->
          <div
            class="relative overflow-hidden mb-8 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg"
          >
            <div
              ref="leftScrollContainer"
              class="scroll-left whitespace-nowrap inline-block"
            >
              <span
                v-for="(text, index) in [
                  ...infiniteTexts.left,
                  ...infiniteTexts.left,
                  ...infiniteTexts.left,
                ]"
                :key="'left-' + index"
                class="inline-block text-2xl font-medium text-indigo-600 px-4"
              >
                {{ text }}
              </span>
            </div>
          </div>

          <!-- Правая прокрутка -->
          <div
            class="relative overflow-hidden py-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg"
          >
            <div
              ref="rightScrollContainer"
              class="scroll-right whitespace-nowrap inline-block"
            >
              <span
                v-for="(text, index) in [
                  ...infiniteTexts.right,
                  ...infiniteTexts.right,
                  ...infiniteTexts.right,
                ]"
                :key="'right-' + index"
                class="inline-block text-2xl font-medium text-purple-600 px-4"
              >
                {{ text }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Animated Counters -->
      <div
        class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mt-8"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-8">
          Анимированные счетчики
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Счетчик посетителей -->
          <div
            class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 text-center"
          >
            <div class="text-3xl font-bold text-blue-600 mb-2">
              <span data-counter="visitors">0</span>
            </div>
            <div class="text-sm text-gray-600">Активных пользователей</div>
          </div>

          <!-- Счетчик продаж -->
          <div
            class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 text-center"
          >
            <div class="text-3xl font-bold text-green-600 mb-2">
              <span data-counter="sales">0</span>
            </div>
            <div class="text-sm text-gray-600">Продаж в этом месяце</div>
          </div>

          <!-- Рейтинг -->
          <div
            class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-6 text-center"
          >
            <div class="text-3xl font-bold text-yellow-600 mb-2">
              <span data-counter="rating">0</span>
            </div>
            <div class="text-sm text-gray-600">Средний рейтинг</div>
          </div>

          <!-- Прогресс -->
          <div
            class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 text-center"
          >
            <div class="text-3xl font-bold text-purple-600 mb-2">
              <span data-counter="progress">0</span>
            </div>
            <div class="text-sm text-gray-600">Выполнено задач</div>
          </div>
        </div>

        <!-- Кнопка для перезапуска анимации -->
        <button
          @click="startCounters"
          class="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Перезапустить анимацию
        </button>
      </div>

      <!-- Flowing Menu -->
      <div
        class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mt-8"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-8">Flowing Menu</h2>

        <div class="flex justify-center mb-8">
          <nav class="relative bg-gray-100 rounded-lg p-1 flex items-center">
            <!-- Плавающий фон -->
            <div
              ref="menuBackground"
              class="absolute left-0 top-0 h-10 bg-white rounded-md shadow-sm transition-colors duration-200 mt-1"
              style="transform-origin: left center"
            ></div>

            <!-- Пункты меню -->
            <div class="relative flex space-x-1">
              <button
                v-for="(item, index) in menuItems"
                :key="item.id"
                ref="menuItems_el"
                class="relative flex items-center h-10 px-4 py-2 text-sm font-medium transition-colors duration-200"
                :class="{
                  'text-gray-900': activeMenuItem.id === item.id,
                  'text-gray-600 hover:text-gray-900':
                    activeMenuItem.id !== item.id,
                }"
                @mouseenter="updateMenuPosition(item, index)"
                @click="updateMenuPosition(item, index)"
              >
                <div :class="[item.icon, 'w-5 h-5 mr-2']"></div>
                {{ item.label }}
              </button>
            </div>
          </nav>
        </div>

        <div class="text-center text-gray-600">
          Наведите курсор на пункты меню
        </div>
      </div>

      <!-- Blob Cursor -->
      <div
        class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mt-8"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-8">Blob Cursor</h2>

        <div
          ref="blobArea"
          class="relative h-[300px] bg-gradient-to-br from-slate-900 to-gray-900 rounded-lg overflow-hidden cursor-none"
          @mousemove="animateBlob"
          @mouseleave="blobActive = false"
          @mouseenter="toggleBlobActive(true)"
        >
          <!-- Blob курсор -->
          <div
            ref="blobCursor"
            class="blob-cursor"
            :class="{ 'blob-active': blobActive }"
          ></div>

          <!-- Интерактивные элементы -->
          <div
            class="relative z-10 h-full flex flex-col items-center justify-center gap-4"
          >
            <button
              class="px-6 py-3 bg-emerald-500/20 backdrop-blur-sm rounded-lg text-emerald-300 font-medium transition-colors hover:bg-emerald-500/30"
              @mouseenter="toggleBlobActive(true, 'success')"
              @mouseleave="toggleBlobActive(true)"
            >
              Зеленый курсор
            </button>
            <button
              class="px-6 py-3 bg-amber-500/20 backdrop-blur-sm rounded-lg text-amber-300 font-medium transition-colors hover:bg-amber-500/30"
              @mouseenter="toggleBlobActive(true, 'warning')"
              @mouseleave="toggleBlobActive(true)"
            >
              Оранжевый курсор
            </button>
          </div>
        </div>

        <div class="text-center text-gray-600 mt-8">
          Перемещайте курсор и наводите на кнопки
        </div>
      </div>

      <!-- Gradient Text -->
      <div
        class="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mt-8"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-8">Градиентный текст</h2>

        <!-- Текст с градиентом -->
        <div class="flex flex-col items-center justify-center mb-8">
          <h1
            class="gradient-text text-4xl md:text-5xl lg:text-6xl font-bold text-center"
          >
            Анимированный градиентный текст
          </h1>
        </div>

        <!-- Контролы -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <!-- Цвет From -->
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-2">Начальный цвет</label>
            <div class="flex gap-2">
              <input
                v-model="gradientColors.from"
                type="color"
                class="w-12 h-12 rounded cursor-pointer"
              />
              <input
                v-model="gradientColors.from"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-200 rounded"
              />
            </div>
          </div>

          <!-- Цвет Via -->
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-2">Промежуточный цвет</label>
            <div class="flex gap-2">
              <input
                v-model="gradientColors.via"
                type="color"
                class="w-12 h-12 rounded cursor-pointer"
              />
              <input
                v-model="gradientColors.via"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-200 rounded"
              />
            </div>
          </div>

          <!-- Цвет To -->
          <div class="flex flex-col">
            <label class="text-sm text-gray-600 mb-2">Конечный цвет</label>
            <div class="flex gap-2">
              <input
                v-model="gradientColors.to"
                type="color"
                class="w-12 h-12 rounded cursor-pointer"
              />
              <input
                v-model="gradientColors.to"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-200 rounded"
              />
            </div>
          </div>
        </div>

        <!-- Скорость анимации -->
        <div class="flex flex-col items-center">
          <label class="text-sm text-gray-600 mb-2"
            >Скорость анимации: {{ gradientSpeed }}с</label
          >
          <input
            v-model="gradientSpeed"
            type="range"
            min="1"
            max="10"
            step="0.5"
            class="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-6xl {
  font-size: 4rem;
  line-height: 1;
  background: linear-gradient(45deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scroll-left,
.scroll-right {
  will-change: transform;
}

/* Градиентные маски для плавного исчезновения текста по краям */
.overflow-hidden {
  mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
}

/* Стили для Flowing Menu */
.flowing-menu-enter-active,
.flowing-menu-leave-active {
  transition: all 0.4s ease;
}

.flowing-menu-enter-from,
.flowing-menu-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Стили для Blob Cursor */
.blob-cursor {
  position: absolute;
  width: 30px;
  height: 30px;
  background: radial-gradient(circle at center, #4f46e5 0%, #7c3aed 100%);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.8;
  mix-blend-mode: lighten;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  will-change: transform;
}

.blob-cursor::before {
  content: "";
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: inherit;
  filter: blur(12px);
  opacity: 0.7;
}

.blob-active {
  opacity: 1;
}

/* Стили для градиентного текста */
.gradient-text {
  background-image: linear-gradient(
    to right,
    #3b82f6,
    #8b5cf6,
    #ec4899,
    #3b82f6
  );
  background-size: 200% 100%;
  background-position: 0% center;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  will-change: background-position;
}

/* Стили для range input */
input[type="range"] {
  -webkit-appearance: none;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: #4f46e5;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #4338ca;
}
</style>
