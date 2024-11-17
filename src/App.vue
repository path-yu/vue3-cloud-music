<script setup lang="ts">
import LayOut from '@/components/Layout/Layout.vue';
import { useMainStore } from './stores/main';
const mainStore = useMainStore();
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { onMounted } from 'vue';
import type { LogEvent } from '@ffmpeg/ffmpeg/dist/esm/types'
import { fetchFile, toBlobURL } from '@ffmpeg/util';
const ffmpeg = new FFmpeg();
onMounted(() => {
  mainStore.initDocumentTheme();
  let media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', (e) => {
    mainStore.changeTheme(e.matches
      ? 'dark'
      : 'light');
  });
});

</script>
<template>
  <n-config-provider :theme="mainStore.activeTheme">
    <n-loading-bar-provider>
      <div class="w-100vw">
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

::-webkit-scrollbar-thumb {
  width: 5px;
  @apply bg-gray-400/40;
  border-radius: 10px;
}
</style>
