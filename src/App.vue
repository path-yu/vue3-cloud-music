<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import BaseHeader from './components/BaseHeader/BaseHeader.vue';
import { useMainStore } from './stores/main';
const { activeTheme, initDocumentTheme } = useMainStore();

onMounted(() => {
  initDocumentTheme();
});
</script>
<template>
  <n-config-provider :theme="activeTheme">
    <base-header />
    <RouterView />
  </n-config-provider>
</template>

<style>
@import "@/assets/base.css";
</style>
