<script setup lang="ts">
import BaseHeader from '@/components/Layout/components/LayoutHeader.vue';
import LayoutLeftMenu from '@/components/Layout/components/LayoutLeftMenu.vue';

import { useMessage } from 'naive-ui';
window.$message = useMessage();
</script>

<template>
  <div
    style="width: 80vw;margin: auto;"
    :class="['transition-colors','duration-300']"
  >
    <base-header />
    <layout-left-menu />
  </div>
</template>

<style scoped>
</style>
