<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

interface MenuItem {
  id: number;
  title: string;
  icon: string;
  path: string;
}

const isCollapsed = ref(false);
const menuItems = ref<MenuItem[]>([
  { id: 1, title: "Дашборд", icon: "i-carbon-dashboard", path: "/" },
  { id: 2, title: "Аналитика", icon: "i-carbon-analytics", path: "/analytics" },
  { id: 3, title: "Проекты", icon: "i-carbon-folder", path: "/projects" },
  { id: 5, title: "Задачи", icon: "i-carbon-task", path: "/tasks" },
  { id: 6, title: "Профиль", icon: "i-carbon-user-profile", path: "/profile" },
  { id: 7, title: "Анимации", icon: "i-carbon-ibm-cloud", path: "/animations" },
]);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;

  gsap.to(".sidebar", {
    width: isCollapsed.value ? "80px" : "280px",
    duration: 0.5,
    ease: "power2.inOut",
  });

  gsap.to(".dashboard-main", {
    marginLeft: isCollapsed.value ? "80px" : "280px",
    duration: 0.5,
    ease: "power2.inOut",
  });

  gsap.to(".menu-text", {
    opacity: isCollapsed.value ? 0 : 1,
    duration: 0.3,
    stagger: 0.05,
    ease: "power2.inOut",
  });
};

onMounted(() => {
  gsap.from(".sidebar", {
    x: -280,
    duration: 1,
    ease: "power2.out",
  });

  gsap.from(".menu-item", {
    opacity: 0,
    x: -20,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.out",
  });
});
</script>

<template>
  <aside
    class="sidebar bg-white h-screen w-[280px] border-r border-gray-200 flex flex-col transition-all duration-300"
  >
    <!-- Логотип -->
    <div class="h-16 flex items-center px-4 border-b border-gray-200">
      <div class="flex items-center justify-center w-full">
        <button
          @click="toggleSidebar"
          class="w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
        >
          <div class="i-carbon-menu text-xl" />
        </button>
        <span
          class="menu-text text-2xl font-bold text-indigo-600 ml-3"
          :class="{ 'opacity-0 w-0 overflow-hidden': isCollapsed }"
          >Dashboard</span
        >
      </div>
    </div>

    <!-- Меню -->
    <nav class="flex-1 py-6 px-4">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.id" class="menu-item">
          <router-link
            :to="item.path"
            class="flex rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors"
            :class="{
              'w-10 h-10 mx-auto': isCollapsed,
              'px-4 py-3': !isCollapsed,
            }"
          >
            <div
              class="flex items-center justify-center"
              :class="{ 'w-full': isCollapsed }"
            >
              <div :class="[item.icon, 'text-xl']" />
              <span
                class="menu-text ml-3 whitespace-nowrap transition-all duration-300"
                :class="{ 'opacity-0 w-0 ml-0': isCollapsed }"
                >{{ item.title }}</span
              >
            </div>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Профиль -->
    <div class="border-t border-gray-200 p-4">
      <router-link
        to="/profile"
        class="flex rounded-lg hover:bg-indigo-50 transition-colors"
        :class="{ 'w-10 h-10 mx-auto': isCollapsed, 'p-2': !isCollapsed }"
      >
        <div
          class="flex items-center justify-center"
          :class="{ 'w-full': isCollapsed }"
        >
          <div
            class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"
          >
            <div class="i-carbon-user text-xl text-indigo-600" />
          </div>
          <div
            class="menu-text ml-3 whitespace-nowrap transition-all duration-300"
            :class="{ 'opacity-0 w-0 ml-0': isCollapsed }"
          >
            <div class="font-medium">Владислав Солянкин</div>
            <div class="text-sm text-gray-500">Frontend Developer</div>
          </div>
        </div>
      </router-link>
    </div>
  </aside>
</template>
