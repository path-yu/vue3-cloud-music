<script setup lang="ts">
import { search, type SearchParams } from '@/service';
import { useMainStore } from '@/stores/main';
import { useAsyncState } from '@vueuse/core';
import { watch, computed, type Ref, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

let immediateCall = false;
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
const tab = ref('playlist');
const route = useRoute();
const mainStore = useMainStore();
const { state: songsSearchResult, isLoading: songListIsLoading, execute: getSearchSongList } = useAsyncState(
  (val) => search(val).then(async res => {
    let result = res.data.result;
    res.data.result.songs = mainStore.mapSongListAddLike(result.songs);
    songListPageParams.pageCount = Math.round(result.songCount / songListPageParams.pageSize) || 1;
    return res.data.result;
  }), {}, { resetOnExecute: false, immediate: false }
);
const { state: playListSearchResult, isLoading: playListIsLoading, execute: getSearchPlayList } = useAsyncState(
  (val) => search(val).then(async res => {
    let result = res.data.result;
    playListPageParams.pageCount = Math.round(result.playlistCount / playListPageParams.pageSize) || 1;
    return result;
  }), {}, { resetOnExecute: false, immediate: false }
);
const tabName = (
  baseName:string, hasValue:Ref<any>, key:string
) => {
  if (hasValue.value[key]) {
    return `${baseName}（找到${hasValue.value[key]}首${baseName}）`;
  }
  return baseName;
};
const singSongTabName = computed(() => tabName(
  '单曲', songsSearchResult, 'songCount'
));
const playListTabName = computed(() => tabName(
  '歌单', playListSearchResult, 'playlistCount'
));
watch(
  [() => route.query, () => playListPageParams.page, () => playListPageParams.pageSize], () => {
   
    let baseParams:SearchParams = {
      limit: 30,
      keywords: route.query.keyword as string,
      type: '1',
      offset: 0
    };
    let playListParams = {
      ...baseParams,
      type: '1000',
      limit: playListPageParams.pageSize,
      offset: ((playListPageParams.page) - 1) * playListPageParams.pageSize
    };
    if (!immediateCall) {
      getSearchSongList(
        3000, baseParams
      );
      getSearchPlayList(
        3000, playListParams
      );
    } else {
      if (tab.value === 'song') {
        getSearchSongList(
          3000, baseParams
        );
      } else {
        getSearchPlayList(
          3000, playListParams
        );
      }
    }
    if (!immediateCall) {
      immediateCall = true;
    }
    
  },
  { immediate: true }
);
</script>

<template>
  <div class="p-4">
    <h2>搜索 {{ route.query.keyword }}</h2>
    <n-tabs v-model:value="tab" type="line" animated>
      <n-tab-pane name="song" :tab="singSongTabName">
        <n-spin :show="songListIsLoading" description="搜索中">
          <div v-show="songListIsLoading" class="h-80" />
          歌曲
        </n-spin>
      </n-tab-pane>
      <n-tab-pane name="playlist" :tab="playListTabName">
        <n-spin :show="playListIsLoading" description="搜索中">
          <div v-show="playListIsLoading" class="h-80" />
          歌单
          <!-- 分页 -->
          <div v-if="playListPageParams.pageCount > 1" class="flex justify-center mt-6">
            <n-pagination
              v-model:page="playListPageParams.page" 
              v-model:page-size="playListPageParams.pageSize" 
              :page-count="playListPageParams.pageCount" 
              show-size-picker
              :page-sizes="[10, 20, 30, 40,50]"
            />
          </div>
        </n-spin>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>

</style>
