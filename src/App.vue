<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { RouterView } from 'vue-router';
import BaseHeader from './components/BaseHeader/BaseHeader.vue';
import { useMainStore } from './stores/main';
const mainStore = useMainStore();
onMounted(() => {
  mainStore.initDocumentTheme();
});

</script>
<template>
  <n-config-provider :theme="mainStore.activeTheme">
    <base-header />
    <RouterView />
  </n-config-provider>
</template>

<style>
@import "@/assets/base.css";
</style>
