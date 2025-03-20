<!-- src/views/LoginView.vue -->
<template>
  <AuthGuard :requireAuth="false">
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="w-full max-w-md">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <LoginForm />
        </div>
      </div>
    </div>
  </AuthGuard>
</template>

<script setup lang="ts">
import AuthGuard from '@/components/auth/AuthGuard.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
</script>
