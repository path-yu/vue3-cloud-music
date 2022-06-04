<script setup lang="ts">

import { useThemeVars } from 'naive-ui';
import obverser from '@/utils/obverser';
import { computed, onMounted, type CSSProperties } from 'vue';
import { useMainStore } from '@/stores/main';
import { ref } from 'vue';
import { parseLyric, type LineItem } from '@/utils/lyric';
const mainStore = useMainStore();
const themeVars = useThemeVars();
const currentPlayLine = ref(0);
const scrollBarRef = ref<{scrollTo:(data:{ left?: number, top?: number, behavior:string })=>void}>();

const lyricData = computed(() => {
  let tlyricData: LineItem[] | undefined;
  if (mainStore.currentPlaySong?.tlyric) {
    tlyricData = parseLyric(mainStore.currentPlaySong?.tlyric);
  }
  if (!mainStore.currentPlaySong.lyric) {
    return [];
  } else {
    let lyric = parseLyric(mainStore.currentPlaySong?.lyric);
    if (tlyricData) {
      return lyric.map((
        item, index: number
      ) => {
        item.translateContent = tlyricData![index].content;
        return item;
      });
    } else {
      return lyric;
    }
  }
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
  let currentLyricIndx = lyricData.value.findIndex(item => item.time === time);
  if (currentLyricIndx !== -1 && !lyricData.value[currentLyricIndx].isFind) {
    lyricData.value[currentLyricIndx].isFind = true;
    currentPlayLine.value = currentLyricIndx;
    let targetELe = document.querySelector(`#time${time}`) as HTMLElement;
    scrollBarRef.value?.scrollTo({ top: targetELe!.offsetTop - 175, behavior: 'smooth' });
  }
}

onMounted(() => {
  obverser.on(
    'timeUpdate', (time:number) => {
      handlePlayLyric(time);
    }
  );
 
});
</script>

<template>
  <div class="mt-10">
    <n-scrollbar ref="scrollBarRef" style="max-height: 350px;width:400px" trigger="none">
      <div style="height:175px" />
      <div
        v-for="(item,index) in lyricData" :id="'time'+item.time" :key="index"
        class="max-w-xs lyric-item"
      > 
        <p :style="currentLyricStyle(index)">
          {{ item.content }}
        </p>
        <p v-if="item.translateContent" :style="currentLyricStyle(index)">
          {{ item.translateContent }}
        </p>
      </div>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="less">
:deep(.n-scrollbar-content){
  padding-right:80px;
}
.lyric-item{
  // margin-top:20px;
  p{
    line-height:45px;
    color:#646463;
  }
}
</style>
