<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { Moon, Search, SunnySharp } from '@vicons/ionicons5';
import { ArrowBackIosSharp, ArrowForwardIosRound } from '@vicons/material';
import { useThemeVars } from 'naive-ui';
import { ref, watch } from 'vue';
import { userHistory } from '../hook/useHistoryRoutePath';
import { useElementHover } from '@vueuse/core';
let mainStore = useMainStore();
let active = ref(mainStore.isActiveDarkTheme);
const themeVars = useThemeVars();
const { backPath, forwardPath } = userHistory();
const backIconRef = ref();
const forwardIconRef = ref();
const backHover = useElementHover(backIconRef);
const forwardHover = useElementHover(forwardIconRef);

watch(
  () => active.value, () => {
    mainStore.changeTheme();
  }
);
const arrowIconClass = (value:string) => {
  return value
    ? 'opacity-100 cursor-pointer'
    : 'opacity-50';
};
const handleArrowClick = (type:'back' | 'forward') => {
  if (type === 'back' && backPath) {
    history.back();
  }
  if (type === 'forward' && forwardPath) {
    history.forward();
  }
};
watch(
  [backHover, forwardHover], (value:boolean[]) => {
    let [backIsHover, forwardIsHover] = value;
    
    if (backPath.value) {
      let backIconEle = (backIconRef.value as HTMLSpanElement);
      backIsHover
        ? backIconEle.style.color = themeVars.value.primaryColor
        : backIconEle.style.color = '';
    } 
    if (forwardPath.value) { 
      let forwardIconEle = (forwardIconRef.value as HTMLSpanElement);
      forwardIsHover
        ? forwardIconEle.style.color = themeVars.value.primaryColor
        : forwardIconEle.style.color = '';
    } 
  }
);
</script>

<template>
  <n-layout-header bordered class="flex justify-between items-center px-6 h-14 sm:px-3">
    <div class="flex">
      <span class=" truncate">奇妙音乐屋!</span>
      <div class="flex items-center ml-8">
        <span ref="backIconRef">
          <n-icon
            :class="['text-base',arrowIconClass(backPath)]"
            :component="ArrowBackIosSharp"
            @click="handleArrowClick('back')"
          />
        </span>
        <span ref="forwardIconRef">
          <n-icon
          
            :class="['text-base ml-2',arrowIconClass(forwardPath)]"
            :component="ArrowForwardIosRound"
            @click="handleArrowClick('forward')"
          />
        </span>
      </div>
    </div>

    <div class="flex items-center">
      <n-input
        size="small" round class="mr-5"
        placeholder="请输入"
      >
        <template #prefix>
          <n-icon :component="Search" />
        </template>
      </n-input>
      <div class="flex items-center">
        <n-switch v-model:value="active" size="large">
          <template #checked-icon>
            <n-icon :component="Moon" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="SunnySharp" />
          </template>
        </n-switch>
      </div>
    </div>
  </n-layout-header>
</template>
