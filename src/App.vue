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
    <n-loading-bar-provider>
      <div class="w-100vw bg-main">
        <LayOut />
      </div>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
@import "@/assets/base.css";
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: transparent;
}
::-webkit-scrollbar-thumb{
  width: 5px;
  @apply bg-gray-400/40;
  border-radius: 10px;
}
</style>
