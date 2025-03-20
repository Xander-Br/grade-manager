<!-- src/components/EmptyState.vue -->
<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="bg-gray-100 rounded-full p-6 mb-4">
      <i :class="[icon, 'text-4xl text-gray-400']"></i>
    </div>
    <h2 class="text-xl font-semibold text-gray-700 mb-2">{{ title }}</h2>
    <p class="text-gray-500 mb-6 max-w-md">{{ description }}</p>
    <button
      @click="$emit('action')"
      class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
    >
      <i :class="[actionIcon, 'mr-1']"></i>
      {{ actionText }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: 'fas fa-book',
  },
  title: {
    type: String,
    default: 'Aucune donnée',
  },
  description: {
    type: String,
    default: "Il n'y a actuellement aucune donnée à afficher.",
  },
  actionText: {
    type: String,
    default: 'Créer',
  },
  actionIcon: {
    type: String,
    default: 'fas fa-plus',
  },
})

defineEmits(['action'])
</script>
