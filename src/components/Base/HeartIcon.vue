<script setup lang="ts">
import { HeartOutline, Heart } from '@vicons/ionicons5';
import { useThemeVars } from 'naive-ui';
import { NIcon } from 'naive-ui';
const themeVars = useThemeVars();
defineProps<{
  like:boolean;
}>();
</script>

<template>
  <NIcon
    size="20"
    :color="like ? themeVars.primaryColor : themeVars.textColor2"
    class="cursor-pointer"
    :component="like ? Heart
      :HeartOutline"
  />
</template>

<style scoped>

</style>
