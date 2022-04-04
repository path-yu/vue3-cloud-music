<script setup lang="ts">
import { usePrimaryColor } from '@/stores/main';
import { formateNumber } from '@/utils/index';
import { Play, PlayFilledAlt } from '@vicons/carbon';
import { useElementHover } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { defineProps, ref } from 'vue';
const themeVars = useThemeVars();
const { primaryColor } = usePrimaryColor();


const props = defineProps<{
  songs?: any[]
}>();
const hoverRef = ref();
const isHovered = useElementHover(hoverRef);
</script>

<template>
  <div class="pb-6">
    <n-grid
      cols="2 s:3 m:5 l:5 xl:5 2xl:7"
      responsive="screen"
      :x-gap="12"
      :y-gap="8"
    >
      <n-grid-item
        v-for="(item, index) in songs"
        :key="index"
        class="group cursor-pointer"
      >
        <n-card
          footer-style="padding: 0 10px 5px"
          size="small"
        >
          <template #cover>
            <div class="relative">
              <n-image
                preview-disabled
                class="w-full h-full"
                :src="item.picUrl"
              />
              <div
                ref="hoverRef"
                class="flex absolute top-0 right-0 justify-end items-center p-1 w-full text-white card-mask"
              >
                <n-icon :component="Play" />
                <span class="pl-1">{{ formateNumber(item.playCount) }}</span>
              </div>
              <div
                class="play-icon flex-items-justify-center"
              >
                <n-icon
                  :component="PlayFilledAlt"
                  size="20"
                  :color="primaryColor"
                />
              </div>
            </div>
          </template>
          <template #footer>
            <n-ellipsis>{{ item.name }}</n-ellipsis>
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
.play-icon {
  @apply absolute right-4 bottom-4 w-10 h-10 bg-white
   rounded-full opacity-0 group-hover:opacity-100
   transition-opacity duration-300;
}
</style>
