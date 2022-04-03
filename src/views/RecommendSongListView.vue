<script setup lang="ts">

import { getBanner } from '@/service/index';
import { useAsyncState } from '@vueuse/core';
const { state: banners, isLoading } = useAsyncState(getBanner().then(res => res.data.banners), []);


</script>

<template>
  <div>
    <n-spin
      :show="isLoading"
      description="载入中"
    >
      <n-carousel
        effect="card"
        draggable
        prev-slide-style="transform: translateX(-150%) translateZ(-800px);"
        next-slide-style="transform: translateX(50%) translateZ(-800px);"
        style="height: 250px"
        :show-dots="true"
      >
        <n-carousel-item
          v-for="item in banners"
          :key="item.imageUrl"
          :style="{ width: '50%' }"
        >
          <img
            class="w-full h-full rounded cursor-pointer"
            :src="item.imageUrl"
          >
        </n-carousel-item>
      </n-carousel>
    </n-spin>
  </div>
</template>

<style scoped>
</style>
