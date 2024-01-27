<script setup lang="ts">
const props = defineProps<{
  steps: Record<string, string>;
  step: string;
}>();

const max = computed(() => Object.entries(props.steps).length * 10);
const current = computed(() => (Object.entries(props.steps).findIndex(s => s[0] === props.step) + 1) * 10)
</script>

<template>
  <UProgress :value="current" :max="max" color="primary" class="ltr">
    <template #indicator="{ percent }">
      <div class="text-right" :style="{ width: `${percent}%` }">
        <template v-for="[key, label] in Object.entries(steps)">
          <span v-if="key === step" class="font-bold text-primary">
            {{ label }}
          </span>
        </template>
      </div>
    </template>
  </UProgress>
</template>
