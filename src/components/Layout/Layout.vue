<script setup lang="ts">
import BaseHeader from '@/components/Layout/components/LayoutHeader.vue';
import LayoutLeftMenu from '@/components/Layout/components/LayoutLeftMenu.vue';

import { useMessage } from 'naive-ui';
window.$message = useMessage();
</script>

<template>
  <div
    style="width: 85vw;margin: auto;"
  >
    <base-header />
    <layout-left-menu />
  </div>
</template>

<style scoped>
</style>
