<!-- src/components/classes/ClassEmptyState.vue -->
<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-blue-100">
    <div class="p-6 sm:p-8 text-center">
      <!-- Illustration -->
      <div class="mx-auto w-48 h-48 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" class="w-full h-full">
          <!-- Background with soft blue -->
          <rect width="400" height="300" fill="#f0f7ff" />

          <!-- Decorative elements -->
          <circle cx="100" cy="100" r="60" fill="#dbeafe" opacity="0.6" />
          <circle cx="300" cy="220" r="80" fill="#e0e7ff" opacity="0.6" />

          <!-- Classroom elements -->
          <rect x="120" y="150" width="160" height="100" rx="8" fill="#bfdbfe" />
          <rect x="140" y="170" width="50" height="60" rx="4" fill="#93c5fd" />
          <rect x="210" y="170" width="50" height="60" rx="4" fill="#93c5fd" />

          <!-- Book or document icon -->
          <rect x="160" y="80" width="80" height="10" rx="2" fill="#3b82f6" />
          <rect x="170" y="95" width="60" height="8" rx="2" fill="#3b82f6" opacity="0.8" />
          <rect x="180" y="108" width="40" height="8" rx="2" fill="#3b82f6" opacity="0.6" />

          <!-- Plus icon suggesting adding a new class -->
          <circle cx="320" cy="80" r="25" fill="#3b82f6" />
          <rect x="310" y="77" width="20" height="6" rx="2" fill="white" />
          <rect x="317" y="70" width="6" height="20" rx="2" fill="white" />
        </svg>
      </div>

      <!-- Text content -->
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Vous n'avez pas encore de classe</h2>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        Créez votre première classe ou rejoignez-en une avec un code d'invitation pour commencer à
        organiser vos documents et interagir avec vos élèves.
      </p>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          @click="$emit('create')"
          class="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          <span class="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Créer une classe
          </span>
        </button>
        <button
          @click="$emit('join')"
          class="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-blue-600 font-medium rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          <span class="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Rejoindre une classe
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['create', 'join'])
</script>
