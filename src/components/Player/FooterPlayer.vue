<script setup lang="ts">
import LoadImg from '../Base/LoadImg.vue';
import { Heart, List } from '@vicons/ionicons5';
import { CaretLeftFilled, CaretRightFilled } from '@vicons/antd';
import { SkipPreviousSharp, SkipNextSharp, PlayArrowSharp, VolumeUpRound } from '@vicons/material';
import HeartbeatIcon from '@/components/Icon/HeartbeatIcon.vue';
import { useThemeVars } from 'naive-ui';
import { computed } from 'vue';
const themeVars = useThemeVars();
const primaryColor = computed(() => themeVars.value.primaryColor);
</script>

<template>
  <div class="flex items-center p-2 footer-player">
    <div class="flex items-center w-40 h-full">
      <load-img
        loading-height="48px"
        class-name="w-12"
        src="https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/music/poster-big.jpeg"
      />
      <div class="ml-4">
        <p class="text-base">
          <n-ellipsis>
            Sum
          </n-ellipsis>
          <heart-icon class="ml-2" :like="true" /> 
        </p>
        <n-ellipsis>
          <p>mack jack</p>
        </n-ellipsis>
      </div>
    </div>
    <div class="flex flex-col flex-1 items-center control">
      <div style="width:300px" class="flex justify-between items-center">
        <n-icon class="custom-icon" :size="22" :component="HeartbeatIcon" />
        <n-icon class="prev custom-icon" :size="22" :component="SkipPreviousSharp" />
        <div class="flex justify-center items-center w-9 h-9  bg-neutral-200/60 hover:bg-neutral-200 dark:bg-slate-100/20 dark:hover:bg-slate-100/40 rounded-full">
          <n-icon :size="22" :component="PlayArrowSharp" />
        </div>
        <n-icon class="next custom-icon" :size="22" :component="SkipNextSharp" />
        <n-button text>
          词
        </n-button>
      </div>
      <div style="width:500px" class="flex items-center mt-1">
        <span class="mr-3 text-xs opacity-50">02.44</span>
        <n-progress
          status="success" type="line" :percentage="50"
          :show-indicator="false"
          rail-style="height:5px"
        />
        <span class="ml-3 text-xs opacity-50">02.44</span>
      </div>
    </div>
    <div class="flex items-center">
      <n-icon :component="VolumeUpRound" :size="25" class="mr-2 custom-icon" />
      <n-icon :component="List" :size="25" class="mr-2 custom-icon" />
    </div>
  </div>
</template>

<style scoped>
.footer-player{
  height: calc(100vh - 800px - 57px);
  box-sizing: border-box;
}
:deep(.custom-icon:hover){
  color: v-bind(primaryColor);
}
:deep(.n-icon){
  cursor: pointer;
}
</style>
