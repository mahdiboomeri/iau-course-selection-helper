<script setup lang="ts">
const { data: courses } = await useFetch("/api/classes");

const { pickedCourses } = defineModels<{
  pickedCourses: ModelOptions<
    string[],
    {
      defaultValue: [];
    }
  >;
}>();
function pickCourse(id: string) {
  const course = courses.value?.find((c) => c.course_id === id);

  if (!course) return;

  if (pickedCourses.value.includes(id)) {
    pickedCourses.value = pickedCourses.value.filter((c) => c !== id);
  } else {
    pickedCourses.value.push(id);
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <UBadge
      v-for="course in courses"
      :color="
        pickedCourses.includes(course.course_id ?? '') ? 'green' : 'white'
      "
      variant="solid"
      size="lg"
      class="cursor-pointer transition-colors"
      @click="pickCourse(course.course_id ?? '')"
    >
      {{ course.name }}
    </UBadge>
  </div>
</template>
