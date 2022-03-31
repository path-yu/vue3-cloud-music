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
      <div class="w-full h-main bg-gray-50 dark:bg-black">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
