<script setup lang="ts">
import { z } from "zod";
import { course } from "@/schema/course";
import type { FormSubmitEvent } from "#ui/types";

type Schema = z.output<typeof course>;
const form = reactive<Schema>({
  prof: "",
  day: "sat",
  end_at: "12:00",
  start_at: "12:00",
  class_id: "",
  course_id: "",
});

const toast = useToast();

const adding = ref(false);
async function onSubmit(event: FormSubmitEvent<Schema>) {
  adding.value = true;

  const { error } = await useFetch("/api/add-course", {
    body: {
      ...event.data
    },
    method: "POST",
  });

  if (error.value) {
    toast.add({
      color: "red",
      title: error.value.message ?? "",
    });
    adding.value = false;
    return;
  }

  toast.add({
    title: "با موفقیت اضافه شد.",
  });

  adding.value = false;
}
const days: {
  label: string;
  id: Days;
}[] = [
  {
    id: "sat",
    label: "شنبه",
  },
  {
    id: "sun",
    label: "یکشنبه",
  },
  {
    id: "mon",
    label: "دوشنبه",
  },
  {
    id: "tues",
    label: "سه‌شنبه",
  },
  {
    id: "wed",
    label: "چهارشنبه",
  },
  {
    id: "thurs",
    label: "پنجشنبه",
  },
  {
    id: "fri",
    label: "جمعه",
  },
];

const { data: courses } = await useFetch("/api/classes");
</script>

<template>
  <UCard class="my-10 max-w-lg mx-auto">
    <template #header>
      <h1 class="font-bold">اضافه کردن کلاس</h1>
    </template>

    <ClientOnly>
      <UForm
        :schema="course"
        :state="form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="کد درس" name="course_id">
          <USelectMenu
            option-attribute="name"
            :model-value="
              (courses ?? []).find((v) => v.course_id === form.course_id)
            "
            @update:model-value="
              (newVal) => {
                form.course_id = newVal.course_id;
              }
            "
            :options="courses ?? []"
            placeholder=""
          />
        </UFormGroup>

        <UFormGroup label="کد ارائه" name="class_id">
          <UInput v-model="form.class_id" placeholder="" />
        </UFormGroup>

        <UFormGroup label="نام استاد" name="prof">
          <UInput v-model="form.prof" />
        </UFormGroup>

        <UFormGroup label="شروع کلاس" name="start_at">
          <UInput v-model="form.start_at" placeholder="00:00" />
        </UFormGroup>

        <UFormGroup label="پایان کلاس" name="end_at">
          <UInput v-model="form.end_at" placeholder="00:00" />
        </UFormGroup>

        <UFormGroup label="روز کلاس" name="day">
          <USelectMenu
            option-attribute="label"
            :model-value="days.find((v) => v.id === form.day)"
            @update:model-value="
              (newVal) => {
                form.day = newVal.id;
              }
            "
            :options="days"
            placeholder="کلاس چه روزیه؟"
          />
        </UFormGroup>
        <UButton type="submit" :loading="adding"> ثبت </UButton>
      </UForm>
    </ClientOnly>
  </UCard>
</template>
