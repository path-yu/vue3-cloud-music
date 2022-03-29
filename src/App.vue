<script setup lang="ts">
import { RouterView } from 'vue-router';
import { darkTheme } from 'naive-ui';
</script>
<template>
  <n-config-provider>
    <RouterView />
  </n-config-provider>
</template>

<style>
@import "@/assets/base.css";

</style>
