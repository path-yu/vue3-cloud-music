<script setup lang="ts">

import { useMemoryScrollTop } from '@/hook/useMemoryScrollTop';
import { getBanner, getNewSong, getPersonalized, getRecommendMv } from '@/service/index';
import { ArrowBackIosSharp, ArrowForwardIosRound } from '@vicons/material';
import { useAsyncState, useElementHover } from '@vueuse/core';
import { computed, ref } from 'vue';
import MvList from '../components/MvList/MvList.vue';
import SongListSkeleton from '../components/SongsList/SongListSkeleton.vue';

const hoverRef = ref();
const currentIndex = ref(0);
const {
  state: banners,
  isLoading
} = useAsyncState(getBanner().then(res => res.data.banners), []);
const {
  state: SongsList,
  isLoading: SongsListIsLoading
} = useAsyncState(getPersonalized().then(res => res.data.result), []);
const {
  state: newSongList,
  isLoading: newSongListIsLoading
} = useAsyncState(getNewSong().then(res => res.data.result), []);
const { state: MVList, isLoading: MVIsLoading }
  = useAsyncState(getRecommendMv().then(res => res.data.result), []);
const isHovered = useElementHover(hoverRef);
const showArrowClass = computed(() => isHovered.value ? 'opacity-50' : 'opacity-0');
useMemoryScrollTop('.rightMain>.n-layout-scroll-container');

const handleArrowClick = (type: 'next' | 'prev') => {
  let index = currentIndex.value;

  if (type === 'next') {
    currentIndex.value = index === banners.value.length - 1 ? 0 : ++index;
  } else {
    currentIndex.value = index === 0 ? banners.value.length - 1 : --index;
  }
};
const formateSongsAuthor = (attr: any[]) => {
  return attr.map(item => item.name).join('/');
};

</script>

<template>
  <div class="px-6 pb-10">
    <div
      v-if="isLoading"
      class="flex items-center"
    >
      <n-skeleton
        width="25%"
        height="170px"
        :sharp="false"
      />
      <n-skeleton
        width="50%"
        height="250px"
        :sharp="false"
      />
      <n-skeleton
        width="25%"
        height="170px"
        :sharp="false"
      />
    </div>
    <div
      v-else
      ref="hoverRef"
      class="relative cursor-pointer"
    >
      <n-carousel
        effect="card"
        dot-type="line"
        draggable
        :autoplay="!isHovered"
        :current-index="currentIndex"
        prev-slide-style="transform: translateX(-150%) translateZ(-450px);opacity:1"
        next-slide-style="transform: translateX(50%) translateZ(-450px);opacity:1"
        style="height: 250px"
        :show-dots="true"
      >
        <n-carousel-item
          v-for="item in banners"
          :key="item.imageUrl"
          :style="{ width: '50%' }"
        >
          <load-img
            loading-height="250px"
            class-name="w-full h-full rounded cursor-pointer cover-banner"
            :src="item.imageUrl"
          />
        </n-carousel-item>
      </n-carousel>
      <div class="absolute top-0 w-full">
        <div
          :class="[showArrowClass, 'left-20', 'toggle-arrow', 'bg-reverse-second-main dark-text-color']"
          @click="handleArrowClick('prev')"
        >
          <n-icon size="15">
            <ArrowBackIosSharp />
          </n-icon>
        </div>
        <div
          :class="[showArrowClass, 'right-20', 'toggle-arrow', 'bg-reverse-second-main dark-text-color']"
          @click="handleArrowClick('next')"
        >
          <n-icon size="15">
            <ArrowForwardIosRound />
          </n-icon>
        </div>
      </div>
    </div>
    <!-- 推荐歌单 -->
    <p class="pb-4 text-xl">
      推荐歌单
    </p>
    <SongListSkeleton v-if="SongsListIsLoading" />
    <sons-List
      v-else
      :songs="SongsList"
    />
    <!-- 最新音乐 -->
    <p class="py-4 text-xl">
      最新音乐
    </p>
    <n-grid
      v-if="newSongListIsLoading"
      cols="3"
      x-gap="20"
      :y-gap="20"
    >
      <n-grid-item
        v-for="(item, index) in 12"
        :key="index"
      >
        <div class="flex justify-between h-16">
          <n-skeleton
            height="64px"
            width="64px"
            :sharp="false"
          />
          <div class="flex-1 ml-2">
            <n-skeleton
              text
              class="mt-2"
              :repeat="2"
              :sharp="false"
            />
          </div>
        </div>
      </n-grid-item>
    </n-grid>
    <n-grid
      v-else
      x-gap="20"
      :y-gap="20"
      cols="2 s:2 m:3 l:3 xl:3 2xl:4"
      responsive="screen"
    >
      <n-grid-item
        v-for="item in newSongList"
        :key="item.id"
        class="hover:bg-zinc-300/40
         dark:hover:bg-gray-700/30 rounded-md 
         transition-colors cursor-pointer"
      >
        <div class="flex justify-between h-16">
          <div class="relative">
            <load-img
              loading-height="64px"
              class-name="w-16 h-16 rounded-md"
              :src="item.picUrl"
              :show-message="false"
            />
            <play-icon
              :size="15"
              class="cursor-pointer position-center"
              style="opacity: 1;width: 25px;height: 25px;"
            />
          </div>
          <div class="flex-1 ml-2 truncate">
            <p class="mt-1 text-base">
              <n-ellipsis>{{ item.name }}</n-ellipsis>
            </p>
            <p class="mt-2 w-full text-sm opacity-60">
              <n-ellipsis>{{ formateSongsAuthor(item.song.artists) }}</n-ellipsis>
            </p>
          </div>
        </div>
      </n-grid-item>
    </n-grid>
    <p class="py-4 text-xl">
      最新MV
    </p>
    <MvListSkeleton v-if="MVIsLoading" />
    <mv-list
      v-else
      :list="MVList"
    />
  </div>
</template>

<style lang="scss" scoped>
.toggle-arrow {
  position: absolute;
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  box-shadow: 0 2px 4px 0px rgb(0 0 0 / 6%);
  z-index: 1;
  user-select: none;
  top: calc(250px * 0.83 / 2);
}
</style>

