<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { ArrowRedoCircle, ArrowUndoCircleSharp, Moon, Search, SunnySharp } from '@vicons/ionicons5';
import { ref, watch } from 'vue';
let mainStore = useMainStore();
let active = ref(mainStore.isActiveDarkTheme);

watch(() => active.value, () => {
  mainStore.changeTheme();
});
</script>

<template>
  <header
    class="flex justify-between items-center px-6 h-14 sm:px-3  bg-main"
  >
    <div class="flex">
      <span class=" truncate ColorDarkOrWhite">奇妙音乐屋!</span>
      <div class="flex items-center ml-8 ColorDarkOrWhite">
        <n-button
          text
          class="text-2xl"
        >
          <n-icon :component="ArrowUndoCircleSharp" />
        </n-button>
        <n-button
          text
          class="ml-2 text-2xl"
        >
          <n-icon :component="ArrowRedoCircle" />
        </n-button>
      </div>
    </div>
    
    <div class="flex items-center">
      <n-input
        size="small"
        round
        class="mr-5"
        placeholder="请输入"
      >
        <template #prefix>
          <n-icon :component="Search" />
        </template>
      </n-input>
      <div class="flex items-center ">
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
    </div>
  </header>
</template>
