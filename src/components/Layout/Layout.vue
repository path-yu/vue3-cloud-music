<script setup lang="ts">
import BaseHeader from '@/components/Layout/components/LayoutHeader.vue';
import LayoutLeftMenu from '@/components/Layout/components/LayoutLeftMenu.vue';

import { useMessage } from 'naive-ui';
import FooterPlayer from '../Player/FooterPlayer.vue';
window.$message = useMessage();
</script>

<template>
  <div
    id="layout-container"
    style="width: 85vw;margin: auto;"
  >
    <n-layout>
      <base-header />
      <layout-left-menu />
      <n-layout-footer :inverted="false" bordered>
        <footer-player />
      </n-layout-footer>
    </n-layout>
  </div>
</template>

<style scoped>
</style>
