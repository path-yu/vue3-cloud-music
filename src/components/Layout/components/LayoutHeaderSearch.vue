<script setup lang="ts">
import { getDefaultSearchKeyword, getHotSearchList, getSuggestSearchList, getAlbumDetail } from '@/service';
import { useMainStore } from '@/stores/main';
import { Search, List } from '@vicons/ionicons5';
import { Delete, Music } from '@vicons/carbon';
import { ArrowBackIosSharp, ArrowForwardIosRound } from '@vicons/material';
import { useAsyncState, useElementHover } from '@vueuse/core';
import { isArray, isPlainObject, throttle } from 'lodash';
import { isEmptyObject } from '@/utils';
import { useThemeVars } from 'naive-ui';
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue';
import { useRouter } from 'vue-router';
import { userHistory } from '../hook/useHistoryRoutePath';
import { mapSongs } from '@/utils/arr-map';
import { nanoid } from 'nanoid';
import { markSearchKeyword } from '@/utils/markSearhKeyword';

const backIconRef = ref();
const forwardIconRef = ref();
const target = ref();
const showPopover = ref(false);
const inputRef = ref();
const searchWrapContainerRef = ref();
const spread = ref(false);
const defaultHeight = ref('100%');
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
const { state: suggestResult, isLoading: suggestLoading, execute } = useAsyncState(
  (val) => getSuggestSearchList(val).then(async res => {
    let result = res.data.result;
    let primaryColor = themeVars.value.primaryColor;
    res.data.result.songs = mapSongs(res.data.result.songs);
    res.data.result.songs = markSearchKeyword(
      result.songs, ['name', 'formatAuthor', 'alias'], mainStore.searchKeyword, primaryColor
    );
    res.data.result.playlists = markSearchKeyword(
      result.playlists, ['name'], mainStore.searchKeyword, primaryColor
    );
    return res.data.result;
  }), {}, { resetOnExecute: false, immediate: false }
);

const arrowIconClass = (value: string) => {
  return value
    ? 'opacity-100 cursor-pointer'
    : 'opacity-50';
};
const historyListStyle = computed<CSSProperties>(() => {
  if (spread.value) {
    return { height: defaultHeight.value, overflow: 'visible' };
  }
  return {
    height: defaultHeight.value
      ? parseInt(defaultHeight.value) >= 54
        ? '54px'
        : '100%'
      :'100%', overflow: 'hidden' 
  };
});
const handleArrowClick = (type: 'back' | 'forward') => {
  if (type === 'back' && backPath) {
    history.back();
    mainStore.setShowMusicDetail(false);
  }
  if (type === 'forward' && forwardPath) {
    history.forward();
    mainStore.setShowMusicDetail(false);
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
watch(
  () => mainStore.theme, () => {
    if (suggestResult.value.songs) {
      suggestResult.value.songs = markSearchKeyword(
        suggestResult.value.songs, ['name', 'formatAuthor', 'alias'], mainStore.searchKeyword, themeVars.value.primaryColor
      );
    }
    if (suggestResult.value.playlists) {
      suggestResult.value.playlists = markSearchKeyword(
        suggestResult.value.playlists, ['name'], mainStore.searchKeyword, themeVars.value.primaryColor
      );
    }
   
 
  }
);
const toSearchResult = (val?:string) => {
  if (!mainStore.searchKeyword && defaultSearchKeyWord.value?.realkeyword && !val) {
    mainStore.searchKeyword = defaultSearchKeyWord.value.realkeyword;
  }
  if (val) {
    mainStore.searchKeyword = val;
  }
  mainStore.addSearchHistory(mainStore.searchKeyword);
  showPopover.value = false;
  mainStore.setShowMusicDetail(false);
  router.push({
    path: '/searchResult',
    query: { keyword: mainStore.searchKeyword }
  });
  
};
const getSearchSuggest = (
  val:string, oldVal:string
) => {
  if (val === oldVal) return;
  suggestResult.value = {};
  execute(
    0, val
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
    spread.value = false;
  }
};
const handleSearchSongClick = async(song:any) => {
  if (!song.al.picUrl) {
    const detail = await getAlbumDetail(song.al.id);
    song.al.picUrl = detail.data.album.picUrl;
  }
  song.like = mainStore.hasLikeSong(song.id);
  if (mainStore.playList.length) {
    mainStore.insertPlay(song);
  } else {
    mainStore.initPlayList(
      [song], 0, nanoid()
    );
  }
  showPopover.value = false;
};
const handleClearClick = (
  e:MouseEvent, index:number
) => {
  e.stopPropagation();
  mainStore.removeSearchHistory(index);
};
const handleSearchPlayListClick = (id:string) => {
  router.push(`/songList/${id}`);
  showPopover.value = false;
};
watch(
  () => mainStore.searchKeyword, throttle(
    getSearchSuggest, 300
  )
);
watch(
  showPopover, async (val) => {
    if (val && defaultHeight.value === '100%') {
      await nextTick();
      defaultHeight.value = document.querySelector('#historyList')?.clientHeight + 'px';
    }
  }
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
        ref="target" v-model:value="mainStore.searchKeyword" size="small"
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
        :style="{background:themeVars.modalColor,zIndex:1000,width:mainStore.searchKeyword.length > 0 ? '420px ': '384px'}"
        class="absolute top-10  rounded-sm shadow-lg dark:shadow-black/60 transition-width origin-top-left searchWrapContainer"
      >
        <n-scrollbar style="max-height:500px">
          <!-- 搜索历史 -->
          <div v-if="mainStore.searchHistory.length && showPopover && !mainStore.searchKeyword.length" class="p-4 pb-0">
            <div class="flex justify-between items-center opacity-70">
              <div>
                <span class="pr-2">搜索历史</span>
                <n-popconfirm :on-positive-click="() => mainStore.clearSearchHistory()" positive-text="确定">
                  <template #trigger>
                    <n-icon class="cursor-pointer" :component="Delete" />
                  </template>
                  确定删除历史记录?
                </n-popconfirm>
              </div>
              <n-button v-if="parseInt(defaultHeight) >= 54" text @click="spread = !spread">
                {{ spread ? '收起' :'查看全部' }}
              </n-button>
            </div>
            <div class="mt-2 transition-height" :style="historyListStyle">
              <n-space id="historyList">
                <n-tag
                  v-for="(item,index) in mainStore.searchHistory"
                  :key="item"
                  closable size="small"
                  round
                  @click="toSearchResult(item)"
                  @close="(e:MouseEvent) => handleClearClick(e,index)"
                >
                  {{ item }}
                </n-tag>
              </n-space>
            </div>
          </div>
          <!-- 热搜榜 -->
          <div v-show="showPopover && !mainStore.searchKeyword.length">
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
          <div v-if="mainStore.searchKeyword.length > 0 && showPopover" class="py-4">
            <n-spin :show="suggestLoading" size="small" description="搜索中...">
              <div v-show="suggestLoading" class="h-80" />
              <div>
                <p v-show="!suggestLoading && suggestResult.songs" class="flex items-center pl-4 text-base opacity-50">
                  <n-icon :component="Music" />
                  <span class="ml-2">单曲</span>
                </p>
                <div
                  v-for="item in suggestResult.songs" 
                  :key="item.id"
                  class="py-2 pl-10 cursor-pointer base-hover-bg"
                  @click="handleSearchSongClick(item)"
                >
                  <span v-html="item.nameRichText" />
                  <span v-if="item.alias[0]" class="opacity-50">
                    （<span v-html="item.alias[0]" />）
                  </span>
                  <span> - </span>
                  <span v-html="item.formatAuthorRichText" />
                </div>
                <p v-show="!suggestLoading && suggestResult.playlists" class="flex items-center pl-4 text-base opacity-50">
                  <n-icon :component="List" />
                  <span class="ml-2">歌单</span>
                </p>
                <div
                  v-for="item in suggestResult.playlists" 
                  :key="item.id"
                  class="py-2 pl-10 cursor-pointer base-hover-bg"
                  @click="handleSearchPlayListClick(item.id)"
                  v-html="item.nameRichText"
                />
                <base-empty v-show="mainStore.searchKeyword.length > 0 && isEmptyObject(suggestResult) && !suggestLoading" description="没有搜索到数据" />
              </div>
            </n-spin>
          </div>
        </n-scrollbar>
      </div>
    </transition>
  </div>
</template>