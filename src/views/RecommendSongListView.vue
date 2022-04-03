<script setup lang="ts">

import { getBanner } from '@/service/index';
import { ArrowLeft, ArrowRight } from '@vicons/carbon';
import { useAsyncState, useElementHover } from '@vueuse/core';
import { computed, ref } from 'vue';

const hoverRef = ref();
const currentIndex = ref(0);
const { state: banners, isLoading } = useAsyncState(getBanner().then(res => res.data.banners), []);
const isHovered = useElementHover(hoverRef)
const showArrowClass = computed(() => isHovered.value ? 'opacity-50' : 'opacity-0')

const handleArrowClick = (type: 'next' | 'prev') => {
  let index = currentIndex.value;
  if (type == 'next') {
    index++;
    currentIndex.value = index === banners.value.length ? 0 : index;
  } else {
    index--;
    currentIndex.value = index === 0 ? banners.value.length - 1 : index;
  }
}
</script>

<template>
  <div>
    <n-spin :show="isLoading" description="载入中">
      <div ref="hoverRef" class="relative cursor-pointer">
        <n-carousel
          effect="card"
          dot-type="line"
          draggable
          autoplay
          :current-index="currentIndex"
          prev-slide-style="transform: translateX(-120%) translateZ(-450px);opacity:1"
          next-slide-style="transform: translateX(20%) translateZ(-450px);opacity:1"
          style="height: 250px"
          :show-dots="true"
        >
          <n-carousel-item v-for="item in banners" :key="item.imageUrl" :style="{ width: '50%' }">
            <img class="w-full h-full rounded cursor-pointer cover-banner" :src="item.imageUrl" />
          </n-carousel-item>
        </n-carousel>
        <div class="absolute top-0 w-full">
          <div
            @click="handleArrowClick('prev')"
            :class="[showArrowClass, 'left-40', 'toggle-arrow', 'bg-reverse-second-main dark-text-color']"
            style="top: calc(250px * 0.83 / 2);"
          >
            <n-icon size="20">
              <ArrowLeft />
            </n-icon>
          </div>
          <div
            @click="handleArrowClick('next')"
            :class="[showArrowClass, 'right-40', 'toggle-arrow', 'bg-reverse-second-main dark-text-color']"
            style="top: calc(250px * 0.83 / 2);"
          >
            <n-icon size="20">
              <ArrowRight />
            </n-icon>
          </div>
        </div>
      </div>
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
}
</style>
