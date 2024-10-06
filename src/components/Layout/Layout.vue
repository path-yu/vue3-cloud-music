<script setup lang="ts">
import BaseHeader from '@/components/Layout/components/LayoutHeader.vue';
import LayoutLeftMenu from '@/components/Layout/components/LayoutLeftMenu.vue';
import { useMainStore } from '@/stores/main';

import { useMessage, useDialog } from 'naive-ui';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import FooterPlayer from '../Player/FooterPlayer.vue';
window.$message = useMessage();
const dialog = useDialog();
const route = useRoute();
const mainStore = useMainStore();
onMounted(() => {
  if (!mainStore.isLogin) {
    dialog.info({
      title: '提示',
      content: '由于网易云接口限制,建议请先登录'
    });
  }
});
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
