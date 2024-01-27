<script setup lang="ts">
import { z } from "zod";
import { classes } from "@/schema/class";
import type { FormSubmitEvent } from "#ui/types";

type Schema = z.output<typeof classes>;
const form = reactive<Schema>({
  name: "",
  course_id: "",
});

const toast = useToast();

const adding = ref(false);
async function onSubmit(event: FormSubmitEvent<Schema>) {
  adding.value = true;

  const { error } = await useFetch("/api/add-class", {
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
</script>

<template>
  <UCard class="my-10 max-w-lg mx-auto">
    <template #header>
      <h1 class="font-bold">اضافه کردن درس</h1>
    </template>
    <ClientOnly>
      <UForm
        :schema="classes"
        :state="form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="کد درس" name="course_id">
          <UInput v-model="form.course_id" placeholder="" />
        </UFormGroup>

        <UFormGroup label="نام درس" name="name">
          <UInput v-model="form.name" />
        </UFormGroup>

        <UButton type="submit" :loading="adding"> ثبت </UButton>
      </UForm>
    </ClientOnly>
  </UCard>
</template>
