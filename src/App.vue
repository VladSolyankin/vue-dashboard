<script setup lang="ts">
import { onMounted } from "vue";
import { gsap } from "gsap";
import Sidebar from "./components/layout/Sidebar.vue";

// Инициализация GSAP анимаций
onMounted(() => {
  gsap.from(".dashboard-container", {
    opacity: 0,
    duration: 1,
    ease: "power2.inOut",
  });
});
</script>

<template>
  <div class="dashboard-layout">
    <Sidebar class="dashboard-sidebar" />
    <main class="dashboard-main">
      <router-view />
    </main>
  </div>
</template>

<style>
@import "tailwindcss";

body {
  @apply antialiased text-gray-800;
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100vh;
}

.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.dashboard-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 10;
}

.dashboard-main {
  flex: 1;
  margin-left: 280px;
  height: 100vh;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: rgb(249 250 251);
  transition: margin-left 0.5s ease;
}
</style>
