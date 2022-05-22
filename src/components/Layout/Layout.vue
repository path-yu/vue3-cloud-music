<script setup lang="ts">
import BaseHeader from '@/components/Layout/components/LayoutHeader.vue';
import LayoutLeftMenu from '@/components/Layout/components/LayoutLeftMenu.vue';

import { useMessage } from 'naive-ui';
import { useRoute } from 'vue-router';
import FooterPlayer from '../Player/FooterPlayer.vue';
window.$message = useMessage();
const route = useRoute();
</script>

<template>
  <div
    id="layout-container"
    style="width: 85vw;margin: auto;"
  >
    <n-layout>
      <base-header />
      <layout-left-menu />
      <n-layout-footer v-if="!route.meta.hidden" :inverted="false" bordered>
        <footer-player />
      </n-layout-footer>
    </n-layout>
  </div>
</template>

<style scoped>
</style>
