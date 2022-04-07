<script setup lang="ts">
import { getTopPlayList } from '@/service/index';
import { useAsyncState } from '@vueuse/core';
//精品歌单
const {
  state: topPlaySong,
  isLoading: topPlaySongIsLoading
} = useAsyncState(getTopPlayList().then(res => res.data.playlists[0]), []);
</script>

<template>
  <div class="px-6 pb-10">
    <div class="overflow-hidden relative h-44 rounded-xl cursor-pointer">
      <div
        class="flex absolute w-full h-44  blur-lg"
        :style="{ backgroundImage: `url(${topPlaySong.coverImgUrl})` }"
      />
      <div class="flex absolute z-50 p-4 h-44 bg-black/30">
        <img
          :src="topPlaySong.coverImgUrl"
          class="w-36 h-36 rounded-md"
        >
        <div class="flex-1  ml-4">
          <n-tag type="success">
            精品歌单
          </n-tag>
          <p class="py-2 text-white">
            {{ topPlaySong.name }}
          </p>
          <n-ellipsis
            :line-clamp="5"
            class="text-xs text-white opacity-80"
          >
            {{ topPlaySong.description }}
            <template #tooltip>
              <div style="text-align: center;max-width: 70vw;">
                {{ topPlaySong.description }}
              </div>
            </template>
          </n-ellipsis>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
