<script setup lang="ts">
import { usePrimaryColor } from '@/stores/main';
import { PlayFilledAlt } from '@vicons/carbon';
import { defineProps, type CSSProperties } from 'vue';
const { primaryColor } = usePrimaryColor();
defineProps<{
  style?: CSSProperties;
  color?: string;
  size?: number;
}>();
</script>

<template>
  <div
    :style="style"
    :class="['play-icon flex-items-justify-center', !style && 'right-4 bottom-4' ]"
  >
    <n-icon
      :component="PlayFilledAlt"
      :size="size ? size : 20"
      :color="color ? color : primaryColor"
    />
  </div>
</template>

<style scoped>
.play-icon {
  @apply absolute  w-10 h-10 bg-white
   rounded-full opacity-0 group-hover:opacity-100
   transition-opacity duration-300;
}
</style>
