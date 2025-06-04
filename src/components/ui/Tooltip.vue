<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";

interface Props {
  content: string[];
  position?: "top" | "bottom" | "left" | "right";
}

const props = withDefaults(defineProps<Props>(), {
  position: "top",
});

const tooltipRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let timeline: gsap.core.Timeline;

onMounted(() => {
  if (tooltipRef.value) {
    timeline = gsap.timeline({ paused: true }).fromTo(
      tooltipRef.value,
      {
        opacity: 0,
        y:
          props.position === "top" ? 10 : props.position === "bottom" ? -10 : 0,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      }
    );
  }
});

onBeforeUnmount(() => {
  if (timeline) {
    timeline.kill();
  }
});

const show = () => {
  if (timeline) {
    isVisible.value = true;
    timeline.play();
  }
};

const hide = () => {
  if (timeline) {
    timeline.reverse();
    setTimeout(() => {
      isVisible.value = false;
    }, 200);
  }
};

defineExpose({ show, hide });
</script>

<template>
  <div
    ref="tooltipRef"
    class="tooltip"
    :class="[`tooltip-${position}`, { 'tooltip-visible': isVisible }]"
    v-show="isVisible"
  >
    <div class="tooltip-content">
      <div v-for="(item, index) in content" :key="index" class="tooltip-item">
        <template
          v-for="(line, lineIndex) in item.split('\n')"
          :key="lineIndex"
        >
          {{ line }}
          <br v-if="lineIndex < item.split('\n').length - 1" />
        </template>
      </div>
    </div>
    <div class="tooltip-arrow" :class="`tooltip-arrow-${position}`" />
  </div>
</template>

<style scoped>
.tooltip {
  position: absolute;
  z-index: 100;
  background: white;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  max-width: 300px;
  border: 1px solid #e5e7eb;
  width: max-content;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-content {
  font-size: 0.875rem;
  color: #374151;
}

.tooltip-item {
  padding: 4px 0;
  line-height: 1.4;
}

.tooltip-item:not(:last-child) {
  border-bottom: 1px dashed #e5e7eb;
  margin-bottom: 4px;
}

.tooltip-arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  transform: rotate(45deg);
  border: 1px solid #e5e7eb;
}

.tooltip-top {
  bottom: 100%;
  margin-bottom: 15px;
}

.tooltip-bottom {
  top: 100%;
  margin-top: 15px;
}

.tooltip-left {
  right: 100%;
  top: 50%;
  transform: translate(-15px, -50%);
}

.tooltip-right {
  left: 100%;
  top: 50%;
  transform: translate(15px, -50%);
}

.tooltip-arrow-top {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-top: none;
  border-left: none;
}

.tooltip-arrow-bottom {
  top: -5px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  border-bottom: none;
  border-right: none;
}

.tooltip-arrow-left {
  right: -5px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border-left: none;
  border-bottom: none;
}

.tooltip-arrow-right {
  left: -5px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
  border-top: none;
  border-right: none;
}
</style>
