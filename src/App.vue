<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import BaseHeader from './components/BaseHeader/BaseHeader.vue';
import LayOutLeft from './components/LayoutLeft/LayOutLeft.vue';
import { useMainStore } from './stores/main';
const mainStore = useMainStore();
onMounted(() => {
  mainStore.initDocumentTheme();
});

</script>
<template>
  <n-config-provider :theme="mainStore.activeTheme">
    <base-header />
    <div class="flex">
      <LayOutLeft />
      <RouterView />
    </div>
  </n-config-provider>
</template>

<style>
@import "@/assets/base.css";
</style>
