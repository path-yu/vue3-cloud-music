<script setup lang="ts">
import { search } from '@/service';
import { PlayCircleOutlined } from '@vicons/antd';
import { useMainStore } from '@/stores/main';
import { useAsyncState } from '@vueuse/core';
import { formateNumber } from '@/utils';
import { watch, reactive, ref, type CSSProperties, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useThemeStyle from '@/hook/useThemeStyle';
import { useNanoid } from '@/hook/useNanoid';
import { markSearchKeyword } from '@/utils/markSearhKeyword';

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
const { set, currentId } = useNanoid();
const { themeVars, stripedClass, primaryColor } = useThemeStyle();
const { state: songsSearchResult, isLoading: songListIsLoading, execute: getSearchSongList } = useAsyncState(
  (val) => search(val).then(async res => {
    let result = res.data.result;
    res.data.result.songs = mainStore.mapSongListAddLike(result.songs);
    res.data.result.songs = markSearchKeyword(
      result.songs, ['name', 'formatAuthor', ['al', 'name']], route.query.keyword as string, primaryColor.value
    );
    songListPageParams.pageCount = Math.round(result.songCount / songListPageParams.pageSize) || 1;
    return res.data.result;
  }), {}, { resetOnExecute: true, immediate: false }
);
const { state: playListSearchResult, isLoading: playListIsLoading, execute: getSearchPlayList } = useAsyncState(
  (val) => search(val).then(async res => {
    let result = res.data.result;
    let keyword = route.query.keyword as string;
    res.data.result.playlists = markSearchKeyword(
      result.playlists, ['name', ['creator', 'nickname']], keyword, primaryColor.value
    );
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
const handleUpdateMusicListLike = (
  like:boolean, index:number
) => {
  songsSearchResult.value.songs[index].like = like;
};
watch(
  [
    () => route.query, () => playListPageParams.page, () => playListPageParams.pageSize, 
    () => songListPageParams.page, () => songListPageParams.pageSize, currentTabIndex
  ], () => {
    let songParams = {
      limit: songListPageParams.pageSize,
      keywords: route.query.keyword as string,
      type: '1',
      offset: ((songListPageParams.page) - 1) * songListPageParams.pageSize
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
      set(JSON.stringify(songParams));
    } else {
      if (currentTabIndex.value === 0) {
        getSearchSongList(
          0, songParams
        );
        set(JSON.stringify(songParams));
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
  <div class="w-full">
    <h2 class="pl-8">
      搜索 {{ route.query.keyword }}
    </h2>
    <div class="flex px-8">
      <div
        :style="activeTabStyle(0)" 
        class="px-4  pb-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
        @click="currentTabIndex = 0"
      >
        单曲
      </div>
      <div
        :style="activeTabStyle(1)"
        class="px-4 pb-2 ml-4 hover:opacity-100 transition-opacity cursor-pointer" 
        @click="currentTabIndex = 1"
      >
        歌单
      </div>
    </div>
    <transition name="fade">
      <div v-show="currentTabIndex === 0" class="m-8 mt-4">
        <div class="flex item-center">
          <play-all-button v-show="songsSearchResult?.songs?.length" :song-list="songsSearchResult?.songs" :song-list-id="currentId" />
          <p v-if="songsSearchResult.songCount" class="my-2 ml-4 opacity-50">
            共找到{{ songsSearchResult.songCount }}首单曲
          </p>
        </div>
        <music-list
          :song-list="songsSearchResult.songs" 
          :loading="songListIsLoading" :play-list-id="currentId" 
          @update-music-list-like="handleUpdateMusicListLike"
        />
        <!-- 分页 -->
        <div v-if="songListPageParams.pageCount > 1" class="flex justify-center my-6">
          <n-pagination
            v-model:page="songListPageParams.page" 
            v-model:page-size="songListPageParams.pageSize" 
            :page-count="songListPageParams.pageCount" 
            show-size-picker
            :page-sizes="[10, 20, 30, 40,50]"
          />
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-show="currentTabIndex === 1" style="margin-right:-5px">
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
            <n-ellipsis :tooltip="false" class="pl-2" style="width:400px">
              <p v-html="item.nameRichText" />
            </n-ellipsis>
            <p class="w-20 opacity-50">
              {{ item.trackCount }}首
            </p>
            <p class="w-80">
              <span class="opacity-50">by </span> 
              <span class="pl-2" v-html="item.creator.nicknameRichText" />
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
    </transition>
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
