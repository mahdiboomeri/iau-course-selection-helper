<script setup lang="ts">
const props = defineProps<{
  selectedCourses: string[];
  courses: {
    id: number;
    course_id: string | null;
    name: string | null;
  }[];
  classes: {
    id: number;
    course_id: string;
    class_id: string;
    prof: string;
    day: Days;
    start_at: string;
    end_at: string;
  }[]
}>();
</script>

<template>
  <WeekView :courses="courses ?? []" :events="classes ?? []" />
</template>
