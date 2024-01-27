<script setup lang="ts">
defineProps<{
  courses: {
    id: number;
    course_id: string | null;
    name: string | null;
  }[];
  pickedClasses: string[];
}>();

const { currentCourse } = defineModels<{
  currentCourse: string;
}>();
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <UBadge
      v-for="course in courses"
      :color="currentCourse === course.course_id ? 'black' : 'white'"
      variant="solid"
      size="lg"
      class="cursor-pointer transition-colors"
      @click="currentCourse = course.course_id ?? ''"
    >
      <UIcon v-if="pickedClasses?.includes(course.course_id ?? '')" name="i-heroicons-check-circle" class="ml-2" />
      {{ course.name }}
    </UBadge>
  </div>
</template>
