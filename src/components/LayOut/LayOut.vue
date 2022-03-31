<script setup lang="ts">
import BaseHeader from '@/components/LayOut/components/LayOutHeader.vue';
import LayOutLeftMenu from '@/components/LayOut/components/LayOutLeftMenu.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="transition-colors duration-300">
    <base-header />
    <div class="flex">
      <LayOutLeftMenu />
      <!-- 鼠标移入缩放条 -->
      <div class="w-1 h-main cursor-ew-resize bg-main" />
      <div class="w-full h-main bg-main">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
