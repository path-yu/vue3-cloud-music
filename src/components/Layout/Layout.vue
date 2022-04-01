<script setup lang="ts">
import BaseHeader from '@/components/Layout/components/LayoutHeader.vue';
import LayoutLeftMenu from '@/components/Layout/components/LayoutLeftMenu.vue';
</script>

<template>
  <div :class="['transition-colors','duration-300']">
    <base-header />
    <layout-left-menu />
  </div>
</template>

<style scoped>
</style>
