<script setup lang="ts">
import Lyric from 'lyric-parser';
import { useThemeVars } from 'naive-ui';
import obverser from '@/utils/obverser';
import { computed, onMounted } from 'vue';
import { useMainStore } from '@/stores/main';
import { ref } from 'vue';
const mainStore = useMainStore();
const themeVars = useThemeVars();
const currentPlayLine = ref(0);
const scrollBarRef = ref<{scrollTo:(data:{ left?: number, top?: number, behavior:string })=>void}>();
const lyricData = computed(() => {
  let tlyricData: any;
  if (mainStore.currentPlaySong?.tlyric) {
    tlyricData = new Lyric(mainStore.currentPlaySong.tlyric);
  }
  if (!mainStore.currentPlaySong.lyric) {
    return [];
  } else {
    let lyric = new Lyric(mainStore.currentPlaySong.lyric);
    if (tlyricData) {
      return lyric.lines.map((
        item: { time: number, txt: string, translateTxt: string }, index: number
      ) => {
        item.translateTxt = tlyricData.lines[index].txt;
        return item;
      }) as { time: number, txt: string, translateTxt: string }[];
    }
    return [];
  }
});
const currentLyricData = computed(() => {
  return new Lyric(
    mainStore.currentPlaySong.lyric, handlePlayLyric
  );
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
  };
};
function handlePlayLyric(data:{ lineNum:number, txt:string }) {
  currentPlayLine.value = data.lineNum;
  let currentTime = currentLyricData.value.lines[data.lineNum].time;
  let targetELe = document.querySelector(`#time${currentTime}`) as HTMLElement;
  scrollBarRef.value?.scrollTo({ top: targetELe!.offsetTop - 25, behavior: 'smooth' });
}
onMounted(() => {
  obverser.on(
    'play', () => {
      currentLyricData.value.togglePlay();
    }
  );
  obverser.on(
    'pause', () => {
      currentLyricData.value.togglePlay();
    }
  );
});
</script>

<template>
  <div class="mt-10">
    <n-scrollbar ref="scrollBarRef" style="max-height: 350px" trigger="none">
      <div
        v-for="(item,index) in lyricData" :id="'time'+item.time" :key="index"
        class="max-w-xs lyric-item"
      >
        <p :style="currentLyricStyle(index)">
          {{ item.txt }}
        </p>
        <p v-if="item.translateTxt" :style="currentLyricStyle(index)">
          {{ item.translateTxt }}
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
  margin-top:25px;
  p{
    line-height:30px;
    color:#646463;
  }
}
</style>
