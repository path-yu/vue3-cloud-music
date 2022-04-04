<script setup lang="ts">
import { formateNumber } from '@/utils/index';
import { Play } from '@vicons/carbon';
import { defineProps } from 'vue';
defineProps({
  songs: {
    type: <any>Array,
  }
});
</script>

<template>
  <div class="pb-6">
    <n-grid cols="2 s:3 m:5 l:5 xl:5 2xl:7" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item v-for="(item, index) in songs" :key="index">
        <n-card footer-style="padding: 0 10px 5px" class="cursor-pointer" size="small">
          <template #cover>
            <div class="relative">
              <n-image preview-disabled class="w-full h-full" :src="item.picUrl" />
              <div
                class="absolute flex justify-end items-center top-0 right-0 text-white card-mask bg-opacity-20 p-1 w-full"
              >
              <n-icon :component="Play"></n-icon>
              <span class="pl-1">
                {{ formateNumber(item.playCount) }}
              </span>
              </div>
            </div>
          </template>
          <template #footer>
            <n-ellipsis >{{ item.name }}</n-ellipsis>
          </template>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
.card-mask {
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  background-image: linear-gradient(
    0,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
}
</style>
