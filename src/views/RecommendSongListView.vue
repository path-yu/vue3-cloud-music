<script setup lang="ts">
import { getTopPlayList, getTopPlayListTags } from '@/service/index';
import { useThemeColor } from '@/stores/main';
import { useAsyncState } from '@vueuse/core';
import { onBeforeMount, reactive, ref, watch } from 'vue';
//精品歌单
const topPlaySong = reactive({ coverImgUrl: '', name: '', description: '' });
const isLoading = ref(true);
const { scrollBarColor } = useThemeColor();
const {
  state: songsTags,
  isLoading: songsTagsIsLoading
} = useAsyncState<any[]>(getTopPlayListTags()
  .then(res => {
    return [{ name: '全部' }].concat(res.data.tags.slice(0, 20));
  }), []);
const songList = ref<{ list: any[], loading: boolean }[]>([]);
const selectValue = ref('全部');
const selectIndex = ref(0);


const fetchSongList = (cat = '全部', index = 0) => {
  songList.value[index] = {
    list: [],
    loading: true
  };
  getTopPlayList({ cat, limit: 50 }).then(res => {
    if (res.data.playlists.length !== 0) {
      changeTopSong(res.data.playlists[0]);
      songList.value[index].list = res.data.playlists;
    }
    isLoading.value = false;
    songList.value[index].loading = false;
    console.log(songList.value[0].loading);
    
  });
};
watch(() => selectValue.value, (newVal) => {
  let index = songsTags.value.findIndex((item) => item.name === newVal);
  selectIndex.value = index;
  if (!songList.value[index]) {
    fetchSongList(selectValue.value, index);
  } else {
    songList.value[index].list.length && changeTopSong(songList.value[index].list[0]);
  }
});
const changeTopSong = (song: any) => {
  topPlaySong.name = song.name;
  topPlaySong.coverImgUrl = song.coverImgUrl;
  topPlaySong.description = song.description;
};
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
      <div v-else class="relative">
        <n-tabs
          ref="tabsInstRef" v-model:value="selectValue" class="min-w-3xl"
          animated
        >
          <n-tab-pane
            v-for="(tab) in songsTags"
            :key="tab.name"
            display-directive="show:lazy"
            :name="tab.name"
          >
            <SongListSkeleton v-if="songList[selectIndex].loading" />
            <sons-list v-else :songs="songList[selectIndex].list" />
          </n-tab-pane>
        </n-tabs>
      </div>
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
  margin-left: 100px;
}
:deep(.n-tag__content) {
  display: flex;
}


:deep(.n-tabs .n-tabs-nav){
  overflow-x: scroll;
}
:deep(.n-tabs .n-tabs-nav::-webkit-scrollbar-thumb){
  background-color: transparent;
  transition: all linear 1000ms;
}
:deep(.n-tabs .n-tabs-nav):hover.n-tabs-nav::-webkit-scrollbar-thumb{
  background-color: v-bind(scrollBarColor);
}
:deep(.n-tabs .n-tabs-nav-scroll-wrapper){
  overflow:visible;
}
</style>
