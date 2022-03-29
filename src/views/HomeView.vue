<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t, locale }= useI18n();

const changeLocale = () => {
  console.log(locale.value);
  locale.value = locale.value === 'zh-cn' ? 'en' :'zh-cn';
};
</script>

<template>
  <main>
    <p>{{ t("hello") }}</p>
    <a-button @click="changeLocale">
      改变语言
    </a-button>
  </main>
</template>
