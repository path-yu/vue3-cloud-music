<script setup lang="ts">

import { getBanner, getPersonalized } from '@/service/index';
import { ArrowBackIosSharp, ArrowForwardIosRound } from '@vicons/material';
import { useAsyncState, useElementHover } from '@vueuse/core';
import { computed, ref } from 'vue';

const hoverRef = ref();
const currentIndex = ref(0);
const { state: banners, isLoading } = useAsyncState(getBanner().then(res => res.data.banners), []);
const { state: SongsList, isLoading: SongsListIsLoading } = useAsyncState(getPersonalized().then(res => res.data.result), []);
const isHovered = useElementHover(hoverRef);
const showArrowClass = computed(() => isHovered.value ? 'opacity-50' : 'opacity-0');

const handleArrowClick = (type: 'next' | 'prev') => {
  let index = currentIndex.value;

  if (type === 'next') {
    currentIndex.value = index === banners.value.length - 1 ? 0 : ++index;
  } else {
    currentIndex.value = index === 0 ? banners.value.length - 1 : --index;
  }
};


</script>

<template>
  <div class="px-6">
    <n-spin
      :show="isLoading"
      description="载入中"
    >
      <div
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
            <img
              class="w-full h-full rounded cursor-pointer cover-banner"
              :src="item.imageUrl"
            >
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
    </n-spin>
    <!-- 推荐歌单 -->
    <n-spin
      :show="SongsListIsLoading"
      description="载入中"
    >
      <p class="text-xl">
        推荐歌单
      </p>
      <sons-List :songs="SongsList" />
    </n-spin>
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
