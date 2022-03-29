<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t }= useI18n();
</script>

<template>
  <main>
    <p>{{ t("hello") }}</p>
    <n-button>
      43
    </n-button>
  </main>
</template>
