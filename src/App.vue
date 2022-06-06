<script setup lang="ts">
import LayOut from '@/components/Layout/Layout.vue';
import { zhCN, useDialog } from 'naive-ui';
import { onMounted } from 'vue';
import { useMainStore } from './stores/main';
const mainStore = useMainStore();

onMounted(() => {
  mainStore.initDocumentTheme();

 
});
</script>
<template>
  <n-config-provider :locale="zhCN" :theme="mainStore.activeTheme">
    <n-loading-bar-provider>
      <div class="transition-colors w-100vw">
        <n-message-provider>
          <n-dialog-provider>
            <LayOut />
          </n-dialog-provider>
        </n-message-provider>
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
