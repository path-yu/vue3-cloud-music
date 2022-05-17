<script setup lang="ts">
import LoadImg from '../Base/LoadImg.vue';
import StopIcon from '@/components/Icon/StopIcon.vue';
import { formateSongsAuthor } from '@/utils';
import { List } from '@vicons/ionicons5';
import { SkipPreviousSharp, SkipNextSharp, PlayArrowSharp, VolumeUpRound } from '@vicons/material';
import HeartbeatIcon from '@/components/Icon/HeartbeatIcon.vue';
import { useThemeVars } from 'naive-ui';
import { computed, nextTick, ref, watch } from 'vue';
import { useMainStore } from '@/stores/main';
import dayjs from 'dayjs';
const progressWidth = 500;
const themeVars = useThemeVars();
const mainStore = useMainStore();
const audioRef = ref<HTMLAudioElement>();
// 触发交互元素
const triggerEle = ref<HTMLDivElement>();
// 进度条百分比
const percentage = ref(0);
// 当前播放时间
const currentPlayTime = ref('00:00');
//是否为暂停状态
const paused = ref(true); 
// 音量大小
const volume = ref(+localStorage.volume || 0);
const primaryColor = computed(() => themeVars.value.primaryColor);
const currentSong = computed(() => mainStore.currentPlaySong);
let slideValueChange = false;// 记录slider值是否手动发生了改变

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
  // 如果当前滑动条正在改变,则不设置对应的值, 避免冲突
  if (!slideValueChange) {
    percentage.value = Math.round(((target.currentTime * 1000) / currentSong.value?.dt) * 100);
  }
};
// 播放开始
const handlePlay = () => {
  if (percentage.value === 100) {
    currentPlayTime.value = '00:00';
    percentage.value = 0;
  }
};
const handleUpdateSliderValue = (value:number) => {
  percentage.value = value;
  slideValueChange = true;
};
// 处理鼠标在进度条上抬起事件
const handleSliderMouseUp = () => {
  let currentTime = (currentSong.value?.dt * percentage.value) / 100;
  currentPlayTime.value = dayjs(currentTime).format('mm:ss');
  audioRef.value!.currentTime = currentTime / 1000;
  if (audioRef.value?.paused) {
    audioRef.value.play();
    paused.value = false;
  }
  slideValueChange = false;
};
// 音量滑动选择器监听回调
const handleVolumeChange = (value:number) => {
  localStorage.volume = value;
  volume.value = value;
  audioRef.value!.volume = volume.value / 100;
};
</script>

<template>
  <div v-if="mainStore.playList.length" class="flex items-center p-2 footer-player">
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
          <n-slider
            :on-update:value="handleUpdateSliderValue" :value="percentage" :tooltip="false"
            @mouseup="handleSliderMouseUp"
          />
        </div>
        <span class="ml-2 text-xs opacity-50">
          <n-time format="mm:ss" :time="currentSong?.dt" />
        </span>
      </div>
    </div>
    <div class="flex items-center">
      <n-popover
        placement="bottom"
        trigger="hover"
      >
        <template #trigger>
          <n-icon :component="VolumeUpRound" :size="25" class="mr-2 custom-icon" />
        </template>
        <n-slider
          :value="volume" vertical style="height:100px"
          @update-value="handleVolumeChange"
        />
      </n-popover>
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
