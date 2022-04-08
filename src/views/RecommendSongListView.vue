<script setup lang="ts">
import { getTopPlayList, getTopPlayListTags } from '@/service/index';
import { ArrowForwardIosRound } from '@vicons/material';
import { useAsyncState } from '@vueuse/core';
import { onBeforeMount, reactive, ref, watch } from 'vue';
//精品歌单
const topPlaySong = reactive({ coverImgUrl: '', name: '', description: '' });
const isLoading = ref(true);
const {
  state: songsTags,
  isLoading: songsTagsIsLoading
} = useAsyncState<any[]>(getTopPlayListTags()
  .then(res => {
    return [{ name: '全部' }].concat(res.data.tags.slice(0, 10));
  }), []);
const songList = ref<any[][]>([]);
const selectValue = ref('全部');
const selectIndex = ref(0);


const fetchSongList = (cat = '全部', index) => {
  getTopPlayList({ cat, limit: 50 }).then(res => {
    let firstSongList = res.data.playlists[0];
    topPlaySong.name = firstSongList.name;
    topPlaySong.coverImgUrl = firstSongList.coverImgUrl;
    topPlaySong.description = firstSongList.description;
    songList.value[index] = res.data.playlists;
    isLoading.value = false;
  });
};
watch(() => selectValue.value, (newVal) => {
  let index = songsTags.value.findIndex((item) => item.name === newVal);
  selectIndex.value = index;
  if (!songList.value[index]) {
    fetchSongList(selectValue.value, index);
  }
});
onBeforeMount(() => {
  fetchSongList('全部', 0);
});
</script>

<template>
  <div class="px-6 pb-10">
    <n-skeleton v-if="isLoading" class="w-full h-44 rounded-xl" />
    <div v-else class="overflow-hidden relative h-44 rounded-xl cursor-pointer">
      <div
        class="flex absolute w-full h-44 blur-lg"
        :style="{ backgroundImage: `url(${topPlaySong.coverImgUrl})` }"
      />
      <div class="flex absolute z-50 p-4 h-44 bg-black/30">
        <img :src="topPlaySong.coverImgUrl" class="w-36 h-36 rounded-md">
        <div class="flex-1 ml-4">
          <n-tag type="success">
            精品歌单
          </n-tag>
          <p class="py-2 text-white">
            {{ topPlaySong.name }}
          </p>
          <n-ellipsis
            :line-clamp="5"
            :tooltip="false"
            class="text-xs text-white opacity-80"
          >
            {{ topPlaySong.description }}
          </n-ellipsis>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <div v-if="songsTagsIsLoading" class="flex justify-between">
        <n-skeleton size="medium" width="106px" />
        <n-skeleton size="medium" width="700px" />
      </div>
      <template v-else>
        <n-button
          ghost class="absolute" round
          size="medium"
        >
          <span>{{ selectValue }}</span>
          <n-icon :component="ArrowForwardIosRound" />
        </n-button>
        <n-tabs ref="tabsInstRef" v-model:value="selectValue" animated>
          <n-tab-pane
            v-for="(tab, index) in songsTags"
            :key="tab.name"
            display-directive="show:lazy"
            :name="tab.name"
          >
            <SongListSkeleton v-if="!songList[selectIndex]" />
            <sons-list v-else :songs="songList[selectIndex]" />
          </n-tab-pane>
        </n-tabs>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
:deep(.n-tabs-bar) {
  display: none;
}
:deep(.n-tabs .n-tabs-nav.n-tabs-nav--line-type .n-tabs-nav-scroll-content) {
  transition: border-color 0.3s var(--n-bezier);
  border: none;
}
:deep(.n-tabs-nav-scroll-content) {
  justify-content: flex-end;
}
:deep(.n-tag__content) {
  display: flex;
}
</style>
