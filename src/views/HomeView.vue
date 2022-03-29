<script setup lang="ts">
import { useMyI18n } from '@/i18n';
import { useI18n } from 'vue-i18n';
const { t, changeLocale }= useMyI18n();
</script>

<template>
  <main>
    <p>{{ t("hello") }}</p>
    <n-button @click="changeLocale">
      切换语言
    </n-button>
  </main>
</template>
