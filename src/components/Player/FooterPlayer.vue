<script setup lang="ts">
import LoadImg from '../Base/LoadImg.vue';
import StopIcon from '@/components/Icon/StopIcon.vue';
import { formateSongsAuthor } from '@/utils';
import { List } from '@vicons/ionicons5';
import { DotMark } from '@vicons/carbon';
import { SkipPreviousSharp, SkipNextSharp, PlayArrowSharp, VolumeUpRound } from '@vicons/material';
import HeartbeatIcon from '@/components/Icon/HeartbeatIcon.vue';
import { useThemeVars } from 'naive-ui';
import { computed, nextTick, onMounted, ref, watch, type CSSProperties } from 'vue';
import { useMainStore } from '@/stores/main';
import dayjs from 'dayjs';
const progressWidth = 500;
const themeVars = useThemeVars();
const mainStore = useMainStore();
const audioRef = ref<HTMLAudioElement>();
const triggerEle = ref<HTMLDivElement>();
const percentage = ref(0);
const currentPlayTime = ref('00:00');
const paused = ref(true); //是否为暂停状态
const primaryColor = computed(() => themeVars.value.primaryColor);
const currentSong = computed(() => mainStore.currentPlaySong);

const dotStyle = computed<CSSProperties>(() => {
  let left = (486 * percentage.value) / 100;
  return { transform: `translateX(${left+7}px)`, zIndex: 999 };
});
// 点击切换上一首
const handlePrevClick = () => {
  mainStore.togglePrev();
};
// 点击切换下一首
const handleNextClick = () => {
  mainStore.toggleNext();
};

watch(
  () => mainStore.currentPlayIndex, (val) => {
    triggerEle.value?.click();
  }
);

const handleTriggerClick = () => {
  setTimeout(async () => {
    await nextTick();
    audioRef.value?.load();
    audioRef.value?.pause();
    if (currentSong.value.url) {
      audioRef.value?.play();
    }
    paused.value = false;
  });
};
// 切换播放状态
const togglePlayStatus = () => {
  if (audioRef.value?.paused) {
    audioRef.value?.play();
    paused.value = false;
  } else {
    audioRef.value?.pause();
    paused.value = true;
  }
};

const playNextMusic = () => {
  // 如果为单曲循环模式,则重新播放
  if (mainStore.playMode === 'singleLoop') {
    audioRef.value!.currentTime = 0;
    audioRef.value?.play();
  } else {
    mainStore.toggleNext();
  }
};
// 播放进度变化
const handleTimeupdate = (event:Event) => {
  const target = event.target as HTMLAudioElement;
  currentPlayTime.value = dayjs(target.currentTime * 1000).format('mm:ss');
  percentage.value = Math.round(((target.currentTime * 1000) / currentSong.value.dt) * 100);
  
};
// 播放开始
const handlePlay = () => {
  if (percentage.value === 100) {
    currentPlayTime.value = '00:00';
    percentage.value = 0;

  }
};
</script>

<template>
  <div class="flex items-center p-2 footer-player">
    <div class="flex items-center w-40 h-full">
      <load-img
        loading-height="48px"
        class-name="w-12"
        :src="currentSong?.al.picUrl"
      />
      <div class="ml-4">
        <p class="flex items-center text-base">
          <n-ellipsis>
            {{ currentSong?.name }}
          </n-ellipsis>
          <heart-icon class="ml-2" :like="true" /> 
        </p>
        <n-ellipsis>
          <p>{{ formateSongsAuthor(currentSong?.ar || []) }}</p>
        </n-ellipsis>
      </div>
    </div>
    <div class="flex flex-col flex-1 items-center control">
      <div style="width:300px" class="flex justify-between items-center">
        <n-icon class="custom-icon" :size="22" :component="HeartbeatIcon" />
        <n-icon
          class="prev custom-icon" :size="22" :component="SkipPreviousSharp"
          @click="handlePrevClick"
        />
        <div class="flex justify-center items-center w-9 h-9  bg-neutral-200/60 hover:bg-neutral-200 dark:bg-slate-100/20 dark:hover:bg-slate-100/40 rounded-full" @click="togglePlayStatus">
          <n-icon :size="paused ? 22 : 18" :component="paused ? PlayArrowSharp :StopIcon" />
        </div>
        <n-icon
          class="next custom-icon" :size="22" :component="SkipNextSharp"
          @click="handleNextClick"
        />
        <n-button text>
          词
        </n-button>
      </div>
      <div class="flex items-center mt-1">
        <span class="mr-2 text-xs opacity-50">{{ currentPlayTime }}</span>
        <div class="flex flex-1 items-center" :style="{width:progressWidth+'px'}">
          <n-icon
            :style="dotStyle" class="transition-transform" :component="DotMark"
            :color="primaryColor"
          />
          <n-progress
            status="success" type="line" :percentage="percentage"
            :show-indicator="false"
            rail-style="height:2px"
          />
        </div>
        <span class="ml-2 text-xs opacity-50">
          <n-time format="mm:ss" :time="currentSong?.dt" />
        </span>
      </div>
    </div>
    <div class="flex items-center">
      <n-icon :component="VolumeUpRound" :size="25" class="mr-2 custom-icon" />
      <n-icon :component="List" :size="25" class="mr-2 custom-icon" />
    </div>
    <audio
      ref="audioRef" :src="currentSong?.url"
      @timeupdate="handleTimeupdate" @ended="playNextMusic" 
      @play="handlePlay"
    />
    <div ref="triggerEle" @click="handleTriggerClick" />
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
