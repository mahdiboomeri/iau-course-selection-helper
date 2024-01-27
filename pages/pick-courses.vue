<script setup lang="ts">
const steps = {
  courses: "انتخاب دروس",
  classes: "انتخاب کلاس",
  backup: "انتخاب بکاپ",
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
  backup: "بکاپ پلن بچین",
  export: "خرجی بگیر",
};
const level: Record<keyof typeof steps, string> = {
  courses: "اول",
  classes: "دوم",
  backup: "سوم",
  export: "آخر",
};

const nextStepEnabled = computed(() => {
  if (pickedCourses.value.length === 0) {
    return true;
  }

  if (step.value === "export") {
    return true;
  }

  return false;
});
const prevStepEnabled = computed(() => {
  if (step.value === "courses") return true;
  return false;
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
      <UButton :disabled="nextStepEnabled" @click="nextStep">
        مرحله بعدی
      </UButton>
      <UButton :disabled="prevStepEnabled" @click="prevStep">مرحله قبل</UButton>
    </div>
  </header>

  <div v-if="step === 'courses'" class="mt-10 grid gird-cols-1 gap-8">
    <CourseSelector v-model:pickedCourses="pickedCourses" />
  </div>
</template>
