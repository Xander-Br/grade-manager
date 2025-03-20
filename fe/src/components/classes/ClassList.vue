<!-- src/components/classes/ClassList.vue -->
<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-12">
      <i class="fas fa-spinner fa-spin text-3xl text-indigo-600"></i>
    </div>

    <div v-else-if="classes.length === 0">
      <EmptyState
        icon="fas fa-book"
        title="Aucune classe"
        description="Vous n'avez pas encore de classes. Créez-en une maintenant pour commencer."
        actionText="Créer une classe"
        actionIcon="fas fa-plus"
        @action="$emit('create')"
      />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="classItem in classes" :key="classItem.id" class="cursor-pointer">
        <ClassCard
          :class-data="classItem"
          @view="$emit('view', $event)"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import ClassCard from '@/components/classes/ClassCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import type { Class } from '@/services/classService'

defineProps<{
  classes: Class[]
  loading: boolean
}>()

defineEmits(['view', 'edit', 'create', 'delete'])
</script>
