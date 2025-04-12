<script setup lang="ts">
import BaseHeader from '@/components/Layout/components/LayoutHeader.vue';
import LayoutLeftMenu from '@/components/Layout/components/LayoutLeftMenu.vue';
import { useMainStore } from '@/stores/main';
import { useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';
import FooterPlayer from '@/components/Player/FooterPlayer.vue';
window.$message = useMessage();
const route = useRoute();
const mainStore = useMainStore();
</script>

<template>
  <div id="layout-container" style="width: 75vw;margin: auto;">
    <n-layout>
      <base-header />
      <layout-left-menu />
      <n-layout-footer
        :style="{ background: mainStore.showMusicDetail ? mainStore.canvasBackground : 'var(--n-color)' }"
        v-if="!route.meta.hidden" :inverted="false" bordered>
        <footer-player />
      </n-layout-footer>
    </n-layout>
  </div>
</template>

<style scoped></style>
