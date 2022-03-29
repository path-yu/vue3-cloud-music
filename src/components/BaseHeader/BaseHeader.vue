<script setup lang="ts">
import { useMyI18n } from '@/i18n';
import { useMainStore } from '@/stores/main';
import { Moon, SunnySharp } from '@vicons/ionicons5';
import { ref } from 'vue';
let active = ref(false);
let { changeTheme } = useMainStore();
let { t, changeLocale, messageTitle } = useMyI18n();
const handleSwitchThemeChange = () => {
  changeTheme();
};
</script>

<template>
  <header class="flex justify-between items-center px-6 h-14 bg-white dark:bg-black">
    <span class="text-black dark:text-white">{{ t('title') }}</span>
   
    <div>
      <n-button
        class="mr-5"
        @click="changeLocale"
      >
        <span class="text-black dark:text-white"> {{ messageTitle }}</span>
      </n-button>
      <n-switch
        v-model:value="active"
        size="large"
        @change="handleSwitchThemeChange"
      >
        <template #checked-icon>
          <n-icon :component="SunnySharp" />
        </template>
        <template #unchecked-icon>
          <n-icon :component="Moon" />
        </template>
      </n-switch>
    </div>
  </header>
</template>
