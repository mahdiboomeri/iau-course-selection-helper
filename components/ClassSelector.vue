<script setup lang="ts">
const props = defineProps<{
  selectedCourses: string[];
  activeCalCourse: string;
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

const filteredClasses = computed(() =>
  props.classes?.filter((c) => props.activeCalCourse === c.course_id)
);

function doEntriesOverlap(
  entry1: (typeof props.classes)[number],
  entry2: (typeof props.classes)[number]
) {
  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const start1 = parseTime(entry1.start_at);
  const end1 = parseTime(entry1.end_at);
  const start2 = parseTime(entry2.start_at);
  const end2 = parseTime(entry2.end_at);

  // Check for overlap
  return start1 < end2 && end1 > start2;
}

const filteredWithConflicts = computed(() => {
  return filteredClasses.value.map((c) => {
    const pickedTimes = props.classes
      .filter((t) => pickedClasses.value.includes(t.class_id))
      .filter((t) => t.day === c.day);

    return {
      ...c,
      conflicts: pickedTimes.filter((pickedTime) => {
        return doEntriesOverlap(pickedTime, c) && pickedTime.class_id !== c.class_id && pickedTime.course_id !== c.course_id;
      }),
    };
  });
});
</script>

<template>
  <WeekView
    v-model:picked-classes="pickedClasses"
    :courses="courses ?? []"
    :events="filteredWithConflicts ?? []"
  />
</template>
