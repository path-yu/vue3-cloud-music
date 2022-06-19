<script setup lang="ts">
import { getDefaultSearchKeyword } from '@/service/search';
import { Search } from '@vicons/ionicons5';
import { ArrowBackIosSharp, ArrowForwardIosRound } from '@vicons/material';
import { useAsyncState, useElementHover, useFocus } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { ref, watch } from 'vue';
import { userHistory } from '../hook/useHistoryRoutePath';

const backIconRef = ref();
const forwardIconRef = ref();
const keyword = ref('');
const backHover = useElementHover(backIconRef);
const forwardHover = useElementHover(forwardIconRef);
const target = ref();
const focused = ref(false);
const { backPath, forwardPath } = userHistory();
const themeVars = useThemeVars();
const { state: defaultSearchKeyWord } = useAsyncState(
  getDefaultSearchKeyword().then(res => res.data.data), {}
);
const arrowIconClass = (value: string) => {
  return value
    ? 'opacity-100 cursor-pointer'
    : 'opacity-50';
};
const handleArrowClick = (type: 'back' | 'forward') => {
  if (type === 'back' && backPath) {
    history.back();
  }
  if (type === 'forward' && forwardPath) {
    history.forward();
  }
};
watch(
  [backHover, forwardHover], (value: boolean[]) => {
    let [backIsHover, forwardIsHover] = value;
    let backIconEle = (backIconRef.value as HTMLSpanElement);
    let forwardIconEle = (forwardIconRef.value as HTMLSpanElement);

    if (backPath.value) {
      backIsHover
        ? backIconEle.style.color = themeVars.value.primaryColor
        : backIconEle.style.color = '';
    } else {
      backIconEle.style.color = '';
    }
    if (forwardPath.value) {
      forwardIsHover
        ? forwardIconEle.style.color = themeVars.value.primaryColor
        : forwardIconEle.style.color = '';
    } else {
      forwardIconEle.style.color = '';
    }
  }
);
</script>
<template>
  <div class="flex items-center ml-8">
    <div ref="backIconRef" class="text-base" @click="handleArrowClick('back')">
      <n-icon :class="[arrowIconClass(backPath)]" :component="ArrowBackIosSharp" />
    </div>
    <div ref="forwardIconRef" class="ml-2 text-base" @click="handleArrowClick('forward')">
      <n-icon :class="[arrowIconClass(forwardPath)]" :component="ArrowForwardIosRound" />
    </div>
  </div>
  <div class="relative w-50">
    <n-input
      ref="target" v-model:value="keyword" size="small"
      class="ml-5" round :placeholder="defaultSearchKeyWord.showKeyword"
      @focus="focused = true" @blur="focused = false"
    >
      <template #prefix>
        <n-icon class="cursor-pointer" :component="Search" />
      </template>
    </n-input>
    <transition
      enter-active-class="transition ease-out duration-300" 
      enter-from-class="transform opacity-0 scale-95" 
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-show="focused" :style="{background:themeVars.modalColor,zIndex:1000}"
        class="absolute top-10 w-96 rounded-sm ring-1 ring-black/10 shadow-lg  dark:shadow-black/60 origin-top-left"
      >
        <n-scrollbar style="max-height:450px">
          <div v-for="item in 30">
            222
          </div>
        </n-scrollbar>
      </div>
    </transition>
  </div>
</template>