<script setup lang="ts">
const { data: courses } = await useFetch("/api/classes");
const { data: classes } = useFetch<
  {
    id: number;
    course_id: string;
    class_id: string;
    prof: string;
    day: Days;
    start_at: string;
    end_at: string;
  }[]
>("/api/courses");

const steps = {
  courses: "انتخاب دروس",
  classes: "انتخاب کلاس",
  // backup: "انتخاب بکاپ",
  export: "دریافت خروجی",
} as const satisfies Record<string, string>;
const step = ref<keyof typeof steps>("courses");

function nextStep() {
  const currentStep = Object.entries(steps).findIndex(
    (c) => c[0] === step.value
  );

  step.value = Object.entries(steps)[currentStep + 1]![0] as keyof typeof steps;
}
function prevStep() {
  const currentStep = Object.entries(steps).findIndex(
    (c) => c[0] === step.value
  );

  step.value = Object.entries(steps)[currentStep - 1]![0] as keyof typeof steps;
}

const pickedCourses = ref<string[]>([]);

const titles: Record<keyof typeof steps, string> = {
  courses: "درس‌هایی که این ترم میخوای برداری رو انتخاب کن",
  classes: "کلاس‌هایی که دوست داری رو از تقویم زیر انتخاب کن",
  // backup: "بکاپ پلن بچین",
  export: "خروجی بگیر",
};
const level: Record<keyof typeof steps, string> = {
  courses: "اول",
  classes: "دوم",
  // backup: "سوم",
  export: "آخر",
};

const nextStepDisabled = computed(() => {
  if (pickedCourses.value.length === 0) {
    return true;
  }

  if (step.value === "classes" && pickedClasses.value.length === 0) {
    return true;
  }

  if (step.value === "export") {
    return true;
  }

  return false;
});
const prevStepDisabled = computed(() => {
  if (step.value === "courses") return true;
  return false;
});

const activeCalCourse = ref("");
watch(
  pickedCourses.value,
  (val) => {
    if (!activeCalCourse.value) {
      console.log(val[0]);
      activeCalCourse.value = val[0];
    }
  },
  { immediate: true }
);

const fullPickedCourses = computed(() =>
  courses.value?.filter((c) => pickedCourses.value.includes(c.course_id ?? ""))
);

const pickedClasses = ref<string[]>([]);
const coursesThatHavePickedClasses = computed(() => {
  return (classes.value ?? [])
    .filter((c) => pickedClasses.value.includes(c.class_id))
    ?.map((c) => c.course_id);
});
</script>

<template>
  <BaseSteps :step="step" :steps="steps" class="mt-10" />

  <header class="flex justify-between mt-10">
    <h1 class="font-bold text-xl">
      <span class="text-zinc-400">مرحله {{ level[step] }}:</span>
      {{ titles[step] }}
    </h1>
    <div class="flex gap-2">
      <UButton :disabled="nextStepDisabled" @click="nextStep">
        مرحله بعدی
      </UButton>
      <UButton :disabled="prevStepDisabled" @click="prevStep"
        >مرحله قبل</UButton
      >
    </div>
  </header>

  <div v-if="step === 'courses'" class="mt-10 grid gird-cols-1 gap-8">
    <CourseSelector
      :courses="courses ?? []"
      v-model:pickedCourses="pickedCourses"
    />
  </div>

  <div v-if="step === 'classes'" class="my-10">
    <CourseTab
      :courses="fullPickedCourses ?? []"
      v-model:currentCourse="activeCalCourse"
      :coursesThatHavePickedClasses="coursesThatHavePickedClasses"
      class="mb-5"
    />
    <ClassSelector
      v-model:pickedClasses="pickedClasses"
      :classes="classes ?? []"
      :activeCalCourse="activeCalCourse"
      :courses="courses ?? []"
      :selectedCourses="pickedCourses"
    />
  </div>

  <div v-if="step === 'export'" class="mt-10">
    <BaseExporter :courses="courses ?? []" :classes="classes ?? []" :selectedClasses="pickedClasses" />
  </div>
</template>
