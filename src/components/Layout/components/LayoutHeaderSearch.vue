<script setup lang="ts">
import { getDefaultSearchKeyword, getHotSearchList, getSuggestSearchList } from '@/service/search';
import { useMainStore } from '@/stores/main';
import { Search, List } from '@vicons/ionicons5';
import { Delete, Music } from '@vicons/carbon';
import { ArrowBackIosSharp, ArrowForwardIosRound } from '@vicons/material';
import { useAsyncState, useElementHover } from '@vueuse/core';
import { throttle } from 'lodash';
import { formateSongsAuthor, isEmptyObject } from '@/utils';
import { useThemeVars } from 'naive-ui';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { userHistory } from '../hook/useHistoryRoutePath';

// 是否启用搜索建议
const backIconRef = ref();
const forwardIconRef = ref();
const keyword = ref('');
const target = ref();
const showPopover = ref(false);
const inputRef = ref();
const searchWrapContainerRef = ref();
const themeVars = useThemeVars();
const mainStore = useMainStore();
const backHover = useElementHover(backIconRef);
const forwardHover = useElementHover(forwardIconRef);
const { backPath, forwardPath } = userHistory();
const router = useRouter();
const { state: defaultSearchKeyWord } = useAsyncState(
  getDefaultSearchKeyword().then(res => res.data.data), {}
);
const { state: hotSearch, isLoading: hotSearchLoading } = useAsyncState(
  getHotSearchList().then(res => res.data.data), {}
);
const { state: suggestList, isLoading: suggestLoading, execute } = useAsyncState(
  (val) => getSuggestSearchList(val).then(res => res.data.result), {}, { resetOnExecute: false, immediate: false }
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
const toSearchResult = (val?:string) => {
  if (!keyword.value && defaultSearchKeyWord.value?.realkeyword && !val) {
    keyword.value = defaultSearchKeyWord.value.realkeyword;
  }
  if (val) {
    keyword.value = val;
  }
  mainStore.addSearchHistory(keyword.value);
  showPopover.value = false;
  router.push({
    path: '/searchResult',
    query: { keyword: keyword.value }
  });
};
const getSearchSuggest = (
  val:string, oldVal:string
) => {
  if (val === oldVal) return;
  suggestList.value = {};
  execute(
    3000, val
  );
};
const handleKeyDown = (e:KeyboardEvent) => {
  if (showPopover.value && e.code === 'Enter') {
    toSearchResult();
  }
};

const handleBodyClick = (ev:MouseEvent) => {
  if (!ev.composedPath().includes(inputRef.value) && !ev.composedPath().includes(searchWrapContainerRef.value)) {
    showPopover.value = false;
  }
};
watch(
  keyword, throttle(
    getSearchSuggest, 300
  )
);

onMounted(() => {
  document.body.addEventListener(
    'keydown', handleKeyDown
  );
  document.body.addEventListener(
    'click', handleBodyClick
  );

});
onUnmounted(() => {
  document.body.removeEventListener(
    'keydown', handleKeyDown
  );
});
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
    <div ref="inputRef" class="wrapInput">
      <n-input
        ref="target" v-model:value="keyword" size="small"
        class="ml-5 headerSearchInput" round :placeholder="defaultSearchKeyWord.showKeyword"
        clearable @focus="showPopover = true"
      >
        <template #prefix>
          <n-icon class="cursor-pointer" :component="Search" @click="() => toSearchResult()" />
        </template>
      </n-input>
    </div>
    <transition
      enter-active-class="transition ease-out duration-300" 
      enter-from-class="transform opacity-0 scale-95" 
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-show="showPopover"
        ref="searchWrapContainerRef"
        :style="{background:themeVars.modalColor,zIndex:1000,width:keyword.length > 0 ? '420px ': '384px'}"
        class="absolute top-10  rounded-sm shadow-lg dark:shadow-black/60 transition-width origin-top-left searchWrapContainer"
      >
        <n-scrollbar style="max-height:500px">
          <!-- 搜索历史 -->
          <div v-if="mainStore.searchHistory.length && showPopover && !keyword.length" class="py-4 pl-4">
            <div class="flex items-center opacity-70">
              <span class="pr-2">搜索历史</span>
              <n-popconfirm :on-positive-click="() => mainStore.clearSearchHistory()" positive-text="确定">
                <template #trigger>
                  <n-icon class="cursor-pointer" :component="Delete" />
                </template>
                确定删除历史记录?
              </n-popconfirm>
            </div>
            <div class="mt-2">
              <n-space>
                <n-tag
                  v-for="(item,index) in mainStore.searchHistory"
                  :key="item"
                  closable size="small"
                  round
                  @click="toSearchResult(item)"
                  @close="mainStore.removeSearchHistory(index)"
                >
                  {{ item }}
                </n-tag>
              </n-space>
            </div>
          </div>
          <!-- 热搜榜 -->
          <div v-show="showPopover && !keyword.length ">
            <p class="pl-4 mt-4 opacity-70">
              热搜榜
            </p>
            <n-spin :show="hotSearchLoading">
              <div v-show="hotSearchLoading" class="h-60" />
              <div 
                v-for="(item,index) in hotSearch" 
                :key="item.searchWord" class="flex items-center p-5 hover:bg-gray-100 dark:hover:bg-gray-100/20 cursor-pointer"
                @click="toSearchResult(item.searchWord)"
              >
                <span
                  class="text-base"
                  :style="{color:index >= 0 && index <= 2 ? themeVars.primaryColor : themeVars.textColor1}"
                >
                  {{ index+1 }}
                </span>
                <div class="ml-4">
                  <span :style="{fontWeight:index >= 0 && index <= 2 ?'bold' :'initial'}"> {{ item.searchWord }}</span>
                  <span class="pl-2 text-sm opacity-40">{{ item.score }}</span>
                </div>
              </div>
            </n-spin>
          </div>
          <!-- 搜索建议 -->
          <div v-if="keyword.length > 0 && showPopover" class="py-4">
            <n-spin :show="suggestLoading" size="small" description="搜索中...">
              <div v-show="suggestLoading" class="h-80" />
              <div>
                <p v-show="!suggestLoading && suggestList.songs" class="flex items-center pl-4 text-base opacity-50">
                  <n-icon :component="Music" />
                  <span class="ml-2">单曲</span>
                </p>
                <div v-for="item in suggestList.songs" :key="item.id" class="py-2 pl-10 cursor-pointer base-hover-bg">
                  {{ item.name }} 
                  <span v-if="item.alias" class="opacity-50">{{ item.alias[0] }}</span>
                  <span>-  {{ formateSongsAuthor(item.artists) }}</span>
                </div>
                <p v-show="!suggestLoading && (suggestList.albums || suggestList.playlists)" class="flex items-center pl-4 text-base opacity-50">
                  <n-icon :component="List" />
                  <span class="ml-2">歌单</span>
                </p>
                <div v-for="item in (suggestList.albums || suggestList.playlists)" :key="item.id" class="py-2 pl-10 cursor-pointer base-hover-bg">
                  {{ item.name }} 
                </div>
                <base-empty v-show="keyword.length > 0 && isEmptyObject(suggestList) && !suggestLoading" description="没有搜索到数据" />
              </div>
            </n-spin>
          </div>
        </n-scrollbar>
      </div>
    </transition>
  </div>
</template>