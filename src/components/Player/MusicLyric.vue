<script setup lang="ts">

import { useThemeVars } from 'naive-ui';
import obverser from '@/utils/obverser';
import { computed, onMounted, toRaw, watch, type CSSProperties } from 'vue';
import { useMainStore } from '@/stores/main';
import { ref } from 'vue';
import { parseLyric, parseRangeLyric, type LineItem, type RangeLyricItem } from '@/utils/lyric';
import { useElementHover } from '@vueuse/core';
const mainStore = useMainStore();
const themeVars = useThemeVars();
const currentPlayLine = ref(0);
const scrollBarRef = ref<{scrollTo:(data:{ left?: number, top?: number, behavior:string })=>void}>();
const scrollContainerRef = ref();
const isHover = useElementHover(scrollContainerRef);
let currentScrollTop:number;
const lyricData = computed(() => {
  let tlyricData: LineItem[] | undefined;
  if (mainStore.currentPlaySong?.tlyric) {
    tlyricData = parseLyric(mainStore.currentPlaySong?.tlyric);
  }
  if (!mainStore.currentPlaySong?.lyric) {
    return [];
  } else {
    let lyric = parseLyric(mainStore.currentPlaySong?.lyric);
    if (tlyricData) {
      return lyric.map((item) => {
        let target = tlyricData!.find(val => val.time === item.time);
        if (target) {
          item.translateContent = target.content;
        }
        return item;
      });
    } else {
      return lyric;
    }
  }
});
const rangeLyricList = computed(() => {
  return parseRangeLyric(toRaw(lyricData.value));
});
const currentLyricStyle = (index:number) => {
  let isCurrent = index === currentPlayLine.value;
  return {
    color: isCurrent
      ? themeVars.value.primaryColor
      : '#646463',
    fontWeight: isCurrent
      ? 'bold'
      :'500',
    fontSize: isCurrent
      ? '16px'
      :'14px'
  } as CSSProperties;

};

function handlePlayLyric(time:number) {
  // 重置状态
  if (time === 0) {
    lyricData.value.forEach(item => item.isFind = false);
  }
  if (!lyricData.value.length) return;
  // 如果当前鼠标正在悬停在歌词上，则不滚动
  if (isHover.value) return;
  let index = rangeLyricList.value.get(time)?.index as number;
  let currentLyric = lyricData.value[index];
  if (currentLyric && !currentLyric.isFind) {
    lyricData.value[index].isFind = true;
    currentPlayLine.value = index;
    setScroll(currentLyric.time);
  }
}
const handleSliderChange = (time:number) => {
  if (!lyricData.value.length) return;
  let currentLyric = rangeLyricList.value.get(time) as RangeLyricItem;
  if (currentLyric) {
    lyricData.value.forEach(item => item.isFind = false);
    lyricData.value[currentLyric.index].isFind = true;
    currentPlayLine.value = currentLyric.index;
    setScroll(currentLyric.time);
  }
};
const setScroll = (time:number) => {
  let targetELe = document.querySelector(`#time${time}`) as HTMLElement;
  if (targetELe) {
    currentScrollTop = targetELe!.offsetTop - 175;
    scrollBarRef.value?.scrollTo({ top: currentScrollTop, behavior: 'smooth' });
  }
};
watch(
  isHover, (val) => {
    if (!val && currentScrollTop) {
      setTimeout(
        () => {
          scrollBarRef.value?.scrollTo({ top: currentScrollTop, behavior: 'smooth' });
        }, 100
      );
    }
  }
);
onMounted(() => {
  obverser.on(
    'timeUpdate', handlePlayLyric
  );
  obverser.on(
    'slideValueChange', handleSliderChange
  );
  obverser.on(
    'ended', () => {
      scrollBarRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  );
});
</script>

<template>
  <div ref="scrollContainerRef" class="mt-10">
    <div class="header-mask" />
    <n-scrollbar ref="scrollBarRef" style="height: 350px;width:550px" trigger="none">
      <div style="height:175px" />
      <div
        v-for="(item,index) in lyricData" :id="'time'+item.time" :key="index"
        class="text-center lyric-item"
      > 
        <p :style="currentLyricStyle(index)" class="transition-color">
          {{ item.content }}
        </p>
        <p v-if="item.translateContent" :style="currentLyricStyle(index)" class="transition-color">
          {{ item.translateContent }}
        </p>
      </div>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="less">
.lyric-item{
  p{
    line-height:35px;
    color:#646463;
  }
}
</style>
