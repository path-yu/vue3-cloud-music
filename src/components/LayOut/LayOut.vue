<script setup lang="ts">
import BaseHeader from '@/components/LayOut/components/LayOutHeader.vue';
import LayOutLeftMenu from '@/components/LayOut/components/LayOutLeftMenu.vue';
</script>

<template>
  <div :class="['transition-colors','duration-300']">
    <base-header />
    <LayOutLeftMenu />
  </div>
</template>

<style scoped>
</style>
