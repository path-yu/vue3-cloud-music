<script setup lang="ts">
import LayOut from '@/components/Layout/Layout.vue';
import { useMainStore } from './stores/main';

const mainStore = useMainStore();

</script>
<template>
  <n-config-provider :theme="mainStore.activeTheme">
    <n-loading-bar-provider>
      <LayOut />
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
@import "@/assets/base.css";
</style>
