<script setup lang="ts">
import { useMyI18n } from '@/i18n';
import { useMainStore } from '@/stores/main';
import { Moon, SunnySharp } from '@vicons/ionicons5';
import { ref, watch } from 'vue';
let mainStore = useMainStore();
let active = ref(mainStore.isActiveDarkTheme);

let { t, changeLocale, messageTitle } = useMyI18n();

watch(() => active.value, () => {
  mainStore.changeTheme();
});
</script>

<template>
  <header
    class="flex justify-between items-center px-6 h-20 transition-colors duration-500 bgColorLightOrBlack"
  >
    <span class="ColorDarkOrWhite">{{ t('title') }}</span>
   
    <div>
      <n-button
        class="mr-5"
        @click="changeLocale"
      >
        <span class="ColorDarkOrWhite"> {{ messageTitle }}</span>
      </n-button>
      <n-switch
        v-model:value="active"
        size="large"
      >
        <template #checked-icon>
          <n-icon :component="Moon" />
        </template>
        <template #unchecked-icon>
          <n-icon :component="SunnySharp" />
        </template>
      </n-switch>
    </div>
  </header>
</template>
