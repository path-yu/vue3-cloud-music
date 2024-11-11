<template>
  <div>
    <n-switch :value="mainStore.isActiveDarkTheme" size="large" :on-update:value="handleThemeSwitchUpdateChange">
      <template #checked-icon>
        <n-icon :component="Moon" />
      </template>
      <template #unchecked-icon>
        <n-icon :component="SunnySharp" />
      </template>
    </n-switch>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { Moon, SunnySharp } from '@vicons/ionicons5';
let mainStore = useMainStore();
const handleThemeSwitchUpdateChange = () => {
  mainStore.toggleTheme();
};
</script>

<style lang="scss" scoped></style>