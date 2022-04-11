<script setup lang="ts">
import { formateNumber } from '@/utils/index';
import { Play } from '@vicons/carbon';
import { defineProps } from 'vue';
defineProps<{
  list?: any[]
  cols?: number;
}>();
</script>

<template>
  <div v-if="list && list.length !== 0">
    <n-grid
      cols="2 s:3 m:4 l:4 xl:4 2xl:4"
      responsive="screen"
      x-gap="20"
      y-gap="20"
    >
      <n-grid-item
        v-for="item in list"
        :key="item.id"
        class="group"
      > 
        <div class="overflow-hidden relative rounded-md"> 
          <load-img
            loading-height="9vw"
            class-name="w-full rounded-md group-hover-scale"
            :src="item.picUrl "
          />
          <div
            class="flex absolute top-0 right-0 justify-end items-center p-1 w-full text-white card-mask"
          >
            <n-icon :component="Play" />
            <span class="pl-1">{{ formateNumber(item.playCount) }}</span>
          </div>
          <play-icon
            class="cursor-pointer position-center"
            style="width: 40px;height: 40px;"
          />
          <p class="tips">
            {{ item.copywriter }}
          </p>
         
          <div class="absolute bottom-0 w-full text-right bg-linear-mask">
            <n-time
              class="mr-2 text-white"
              :time="item.duration"
              format="mm:ss"
            />
          </div>
        </div>
        <div>
          <p class="mt-1 text-base">
            <n-ellipsis> {{ item.name }}</n-ellipsis>
          </p>
          <p class="mt-2 w-full text-sm opacity-60">
            <n-ellipsis> {{ item.artistName }}</n-ellipsis>
          </p>
        </div>
      </n-grid-item>
    </n-grid>
  </div>
  <div v-else> 
    <n-empty description="暂无数据" />
  </div>
</template>

<style scoped>
.light-green {
  height: 150px;
  background-color: rgba(0, 128, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}
.tips{
  @apply overflow-hidden absolute top-0 w-full h-0 
  group-hover:h-8 leading-8 text-center text-white
bg-black/50 transition-height
}
</style>
