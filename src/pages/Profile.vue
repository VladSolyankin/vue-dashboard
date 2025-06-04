<script setup lang="ts">
import { ref } from "vue";
import { gsap } from "gsap";
import { onMounted } from "vue";

interface UserProfile {
  fullName: string;
  email: string;
  role: string;
  avatar: string;
  joinDate: string;
  stats: {
    projects: number;
    tasks: number;
    completed: number;
  };
}

const profile = ref<UserProfile>({
  fullName: "Солянкин Владислав",
  email: "vlad.solyankin-mail@yandex.ru",
  role: "Frontend Developer",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=19",
  joinDate: "01.01.2024",
  stats: {
    projects: 12,
    tasks: 48,
    completed: 36,
  },
});

const isEditing = ref(false);
const editedProfile = ref({ ...profile.value });

const toggleEdit = () => {
  if (isEditing.value) {
    // Сохраняем изменения
    profile.value = { ...editedProfile.value };
  } else {
    // Начинаем редактирование
    editedProfile.value = { ...profile.value };
  }
  isEditing.value = !isEditing.value;
};

onMounted(() => {
  gsap.from(".profile-card", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  gsap.from(".stats-card", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    stagger: 0.1,
    ease: "power2.out",
  });
});
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <!-- Заголовок -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Профиль</h1>
      <button
        @click="toggleEdit"
        class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors flex items-center space-x-2"
      >
        <div
          :class="isEditing ? 'i-carbon-save' : 'i-carbon-edit'"
          class="text-xl"
        />
        <span>{{ isEditing ? "Сохранить" : "Редактировать" }}</span>
      </button>
    </div>

    <!-- Основная информация -->
    <div
      class="profile-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8"
    >
      <div class="flex items-start space-x-6">
        <div class="relative group">
          <img
            :src="profile.avatar"
            alt="Аватар"
            class="w-32 h-32 rounded-full border-4 border-indigo-100"
          />
          <div
            v-if="isEditing"
            class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <div class="i-carbon-camera text-2xl text-white" />
          </div>
        </div>

        <div class="flex-1">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  Полное имя
                </label>
                <input
                  v-if="isEditing"
                  v-model="editedProfile.fullName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div v-else class="text-lg text-gray-800">
                  {{ profile.fullName }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <input
                  v-if="isEditing"
                  v-model="editedProfile.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div v-else class="text-lg text-gray-800">
                  {{ profile.email }}
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  Роль
                </label>
                <select
                  v-if="isEditing"
                  v-model="editedProfile.role"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Администратор">Администратор</option>
                  <option value="Менеджер">Менеджер</option>
                  <option value="Разработчик">Разработчик</option>
                </select>
                <div v-else class="text-lg text-gray-800">
                  {{ profile.role }}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-500 mb-1">
                  Дата регистрации
                </label>
                <div class="text-lg text-gray-800">
                  {{ profile.joinDate }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Статистика -->
    <div class="grid grid-cols-3 gap-6">
      <div
        class="stats-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4"
      >
        <div
          class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center"
        >
          <div class="i-carbon-folder text-2xl text-indigo-600" />
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-800">
            {{ profile.stats.projects }}
          </div>
          <div class="text-sm text-gray-500">Проектов</div>
        </div>
      </div>

      <div
        class="stats-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4"
      >
        <div
          class="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center"
        >
          <div class="i-carbon-task text-2xl text-green-600" />
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-800">
            {{ profile.stats.tasks }}
          </div>
          <div class="text-sm text-gray-500">Задач</div>
        </div>
      </div>

      <div
        class="stats-card bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4"
      >
        <div
          class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center"
        >
          <div class="i-carbon-checkmark text-2xl text-blue-600" />
        </div>
        <div>
          <div class="text-2xl font-bold text-gray-800">
            {{ profile.stats.completed }}
          </div>
          <div class="text-sm text-gray-500">Выполнено</div>
        </div>
      </div>
    </div>
  </div>
</template>
