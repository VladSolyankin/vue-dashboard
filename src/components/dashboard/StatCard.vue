<script setup lang="ts">
import { onMounted, ref } from "vue";
import { gsap } from "gsap";

interface Props {
  title: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

const props = defineProps<Props>();
const cardRef = ref<HTMLElement | null>(null);

// Анимация при наведении
const handleMouseEnter = () => {
  if (!isDragging.value && cardRef.value) {
    gsap.to(cardRef.value, {
      scale: 1.02,
      duration: 0.3,
      ease: "power2.out",
    });
  }
};

const handleMouseLeave = () => {
  if (!isDragging.value && cardRef.value) {
    gsap.to(cardRef.value, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }
};

const isDragging = ref(false);

onMounted(() => {
  // Анимация значения при монтировании
  if (cardRef.value) {
    const valueEl = cardRef.value.querySelector(".stat-value");
    gsap.from(valueEl, {
      textContent: 0,
      duration: 2,
      ease: "power1.out",
      snap: { textContent: 1 },
      stagger: {
        each: 1.0,
        onUpdate: function () {
          this.targets()[0].innerHTML = props.value;
        },
      },
    });
  }
});
</script>

<template>
  <div
    ref="cardRef"
    class="stat-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-move"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="flex items-center justify-between mb-4">
      <div
        :class="[
          color,
          'w-12 h-12 rounded-lg flex items-center justify-center',
        ]"
      >
        <div :class="[icon, 'text-2xl text-white']" />
      </div>
      <div
        class="flex items-center space-x-1"
        :class="change >= 0 ? 'text-green-500' : 'text-red-500'"
      >
        <div
          :class="change >= 0 ? 'i-carbon-arrow-up' : 'i-carbon-arrow-down'"
        />
        <span class="font-medium">{{ Math.abs(change) }}%</span>
      </div>
    </div>

    <h3 class="text-gray-500 text-sm mb-1">{{ title }}</h3>
    <div class="stat-value text-2xl font-bold text-gray-800">{{ value }}</div>
  </div>
</template>

<style scoped>
.stat-card {
  height: 100%;
  transition: box-shadow 0.3s ease;
  will-change: transform;
}

.stat-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}
</style>
