<script setup lang="ts">
import LayOut from '@/components/Layout/Layout.vue';
import { onMounted } from 'vue';
import { useMainStore } from './stores/main';
const mainStore = useMainStore();
onMounted(() => {
  mainStore.initDocumentTheme();
});

</script>
<template>
  <n-config-provider :theme="mainStore.activeTheme">
    <LayOut />
  </n-config-provider>
</template>

<style>
@import "@/assets/base.css";
</style>
