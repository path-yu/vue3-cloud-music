<script setup lang="ts">
import { search, type SearchParams } from '@/service';
import { PlayCircleOutlined } from '@vicons/antd';
import { useMainStore } from '@/stores/main';
import { useAsyncState } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { formateNumber } from '@/utils';
import { watch, computed, type Ref, reactive, ref, type CSSProperties } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useThemeStyle from '@/hook/useThemeStyle';

let immediateCall = false;
let backTopEle:HTMLElement;
const playListPageParams = reactive({
  pageCount: 0,
  page: 1,
  pageSize: 20
});
const songListPageParams = reactive({
  pageCount: 0,
  page: 1,
  pageSize: 50
});
const currentTabIndex = ref(0);
const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const { themeVars, stripedClass } = useThemeStyle();
const { state: songsSearchResult, isLoading: songListIsLoading, execute: getSearchSongList } = useAsyncState(
  (val) => search(val).then(async res => {
    let result = res.data.result;
    res.data.result.songs = mainStore.mapSongListAddLike(result.songs);
    songListPageParams.pageCount = Math.round(result.songCount / songListPageParams.pageSize) || 1;
    return res.data.result;
  }), {}, { resetOnExecute: true, immediate: false }
);
const { state: playListSearchResult, isLoading: playListIsLoading, execute: getSearchPlayList } = useAsyncState(
  (val) => search(val).then(async res => {
    let result = res.data.result;
    playListPageParams.pageCount = Math.round(result.playlistCount / playListPageParams.pageSize) || 1;
    return result;
  }), {}, { resetOnExecute: true, immediate: false }
);

const activeTabStyle:(index:number) => CSSProperties = (index:number) => {
  if (index === currentTabIndex.value) {
    return {
      color: themeVars.value.primaryColor,
      borderBottom: `2px solid ${themeVars.value.primaryColor}`
    };
  } 
  return {};
};

watch(
  [() => route.query, () => playListPageParams.page, () => playListPageParams.pageSize], () => {
    let songParams:SearchParams = {
      limit: 30,
      keywords: route.query.keyword as string,
      type: '1',
      offset: 0
    };
    let playListParams = {
      keywords: route.query.keyword as string,
      type: '1000',
      limit: playListPageParams.pageSize,
      offset: ((playListPageParams.page) - 1) * playListPageParams.pageSize
    };
    if (!immediateCall) {
      getSearchSongList(
        0, songParams
      );
      getSearchPlayList(
        0, playListParams
      );
    } else {
      if (currentTabIndex.value === 0) {
        getSearchSongList(
          0, songParams
        );
      } else {
        getSearchPlayList(
          0, playListParams
        );
      }
    }
    if (!immediateCall) {
      immediateCall = true;
    }
    
  },
  { immediate: true }
);
watch(
  [playListPageParams, songListPageParams], () => {
    backTopEle = document.querySelector('.n-back-top') as HTMLElement;
    backTopEle && backTopEle.click();
  }
);
</script>

<template>
  <div>
    <h2 class="pl-8">
      搜索 {{ route.query.keyword }}
    </h2>
    <div class="flex px-4">
      <div :style="activeTabStyle(0)" class="px-4  pb-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer" @click="currentTabIndex = 0">
        单曲
      </div>
      <div :style="activeTabStyle(1)" class="px-4 pb-2 ml-4 hover:opacity-100 transition-opacity cursor-pointer" @click="currentTabIndex = 1">
        歌单
      </div>
    </div>
    <div v-show="currentTabIndex === 0">
      <n-spin :show="songListIsLoading" description="搜索中">
        <div v-show="songListIsLoading" class="h-80" />
        歌曲
      </n-spin>
    </div>
    <div v-show="currentTabIndex === 1">
      <n-spin :show="playListIsLoading" description="搜索中">
        <div v-show="playListIsLoading" class="h-80" />
        <p v-if="playListSearchResult.playlistCount" class="pl-8 mt-4 mb-2 opacity-50">
          共找到{{ playListSearchResult.playlistCount }}个歌单
        </p>
        <div
          v-for="(item,index) in playListSearchResult.playlists"
          :key="item.id" :class="'flex items-center py-4 px-8 cursor-pointer ' + stripedClass(index)" 
          @click="router.push(`/songList/${item.id}`)"
        >
          <load-img
            loading-height="64px"
            class-name="w-16 h-16 rounded-md"
            :src="item.coverImgUrl"
          />
          <n-ellipsis :tooltip="false" class="pl-2 w-80">
            {{ item.name }}
          </n-ellipsis>
          <p class="w-20 opacity-50">
            {{ item.trackCount }}首
          </p>
          <p class="w-80">
            <span class="opacity-50">by </span> 
            <span class="opacity-80">{{ item.creator.nickname }}首</span>
          </p>
          <p class="flex items-center w-80 opacity-50">
            <n-icon :component="PlayCircleOutlined" />
            <span class="pl-2"> {{ formateNumber(item.playCount) }}</span>
          </p>
        </div>
        
        <!-- 分页 -->
        <div v-if="playListPageParams.pageCount > 1" class="flex justify-center my-6">
          <n-pagination
            v-model:page="playListPageParams.page" 
            v-model:page-size="playListPageParams.pageSize" 
            :page-count="playListPageParams.pageCount" 
            show-size-picker
            :page-sizes="[10, 20, 30, 40,50]"
          />
        </div>
      </n-spin>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-tabs .n-tab-pane){
  padding:0;
}
:deep(.n-tabs-tab-wrapper){
  padding:0 20px;
}
</style>
