<script setup lang="ts">
defineProps<{
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
  }[];
}>();

const { pickedClasses } = defineModels<{
  pickedClasses: string[];
}>();
</script>

<template>
  <WeekView v-model:picked-classes="pickedClasses" :courses="courses ?? []" :events="classes ?? []" />
</template>
