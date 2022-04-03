<script setup lang="ts">
import { computed, ref } from 'vue';
const effectRef = ref<'slide' | 'fade' | 'card'>('slide');
const isCardRef = computed(() => effectRef.value === 'card');
</script>

<template>
  <div>
    <n-carousel
      effect="card"
      draggable
      prev-slide-style="transform: translateX(-150%) translateZ(-800px);"
      next-slide-style="transform: translateX(50%) translateZ(-800px);"
      style="height: 240px"
      :show-dots="true"
    >
      <n-carousel-item :style="{ width: '50%' }">
        <img
          class="carousel-img"
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
        >
      </n-carousel-item>
      <n-carousel-item :style="{ width: '55%' }">
        <img
          class="carousel-img"
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
        >
      </n-carousel-item>
      <n-carousel-item :style="{ width: '55%' }">
        <img
          class="carousel-img"
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
        >
      </n-carousel-item>
      <n-carousel-item :style="{ width: '55%' }">
        <img
          class="carousel-img"
          src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
        >
      </n-carousel-item>
    </n-carousel>
  </div>
</template>

<style scoped>
.carousel-img {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
