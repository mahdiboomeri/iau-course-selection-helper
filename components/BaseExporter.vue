<script setup lang="ts">
const props = defineProps<{
  selectedClasses: string[];
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

const fullSelectedClasses = computed(() => {
  return props.classes
    .filter((c) => props.selectedClasses.includes(c.class_id))
    .map((c) => {
      const courseName = props.courses.find(
        (course) => course.course_id === c.course_id
      );
      return {
        ...c,
        course_name: courseName?.name ?? "-",
      };
    });
});

const toast = useToast();
function copyCodes() {
  let input = "";

  fullSelectedClasses.value.forEach((c) => {
    input += `${c.course_name}: ${c.class_id}\n`;
  });

  navigator.clipboard.writeText(input);
  toast.add({
    title: "کپی شد",
  });
}
function filterByDay(day: Days) {
  return fullSelectedClasses.value
    .filter((c) => c.day === day)
    .sort((a, b) => {
      const parseTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        return hours * 60 + minutes;
      };
      return parseTime(a.start_at) - parseTime(b.start_at);
    });
}

const daily = computed(() => {
  let input = '';

  input += 'شنبه:\n';
  filterByDay('sat').forEach(c => {
    input +=  `${ c.course_name } => ${ c.start_at } تا ${ c.end_at }\n`
  })
  input += '\n';

  input += 'یکشنبه:\n';
  filterByDay('sun').forEach(c => {
    input +=  `${ c.course_name } => ${ c.start_at } تا ${ c.end_at }\n`
  })
  input += '\n';

  input += 'دوشنبه:\n';
  filterByDay('mon').forEach(c => {
    input +=  `${ c.course_name } => ${ c.start_at }:${ c.end_at }\n`
  })
  input += '\n';

  input += 'سه‌شنبه:\n';
  filterByDay('tues').forEach(c => {
    input +=  `${ c.course_name } => ${ c.start_at } تا ${ c.end_at }\n`
  })
  input += '\n';

  input += 'چهارشنبه:\n';
  filterByDay('wed').forEach(c => {
    input +=  `${ c.course_name } => ${ c.start_at } تا ${ c.end_at }\n`
  })
  input += '\n';

  input += 'پنجشنبه:\n';
  filterByDay('fri').forEach(c => {
    input +=  `${ c.course_name } => ${ c.start_at } تا ${ c.end_at }\n`
  })
  input += '\n';

  return input
})

function copyDaily() {
  navigator.clipboard.writeText(daily.value);
  toast.add({
    title: "کپی شد",
  });
}
</script>

<template>
  <div>
    <UAlert
    description="مسئولیت توجه به درست بودن کد‌ها و دابل چک کردن همه چی تو آموزشیار با خودتونه."
    title="توجه"
    class="my-10"
    color="red"
  />

    <h2 class="font-bold">دروسی که باید توی آموزشیار وارد کنی</h2>
    <div
      class="p-5 rounded-lg bg-gray-800 grid grid-cols-1 gap-2 relative cursor-pointer pt-16"
      @click="copyCodes"
    >
      <UBadge class="absolute left-5 top-5">کلیک کن تا کپی بشه</UBadge>
      <div v-for="c in fullSelectedClasses">
        {{ c.course_name }}: {{ c.class_id }}
      </div>
    </div>

    <h2 class="font-bold mt-10">برنامه هفتگی</h2>
    <div
      class="p-5 rounded-lg bg-gray-800 grid grid-cols-1 gap-2 relative cursor-pointer mb-10 pt-10"
      @click="copyDaily"
    >
      <UBadge class="absolute left-5 top-5">کلیک کن تا کپی بشه</UBadge>

      <div v-for="line in daily.split('\n')">{{ line }}</div>
     </div>
  </div>
</template>
