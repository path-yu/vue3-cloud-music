<script setup lang="ts">
import Lyric from 'lyric-parser';
import { computed } from 'vue';
import { useMainStore } from '@/stores/main';

const mainStore = useMainStore();
const lyricData = computed<any[]>(() => {
  let tlyricData: any;
  if (mainStore.currentPlaySong?.tlyric) {
    tlyricData = new Lyric(mainStore.currentPlaySong.tlyric);
  }
  if (!mainStore.currentPlaySong.lyric) {
    return { message: '暂无歌词' };
  } else {
    let lyric = new Lyric(mainStore.currentPlaySong.lyric);
    if (tlyricData) {
      return lyric.lines.map((
        item: { time: number, txt: string, translateTxt: string }, index: number
      ) => {
        item.translateTxt = tlyricData.lines[index].txt;
        return item;
      });
    }
  }
  return 34;
});
</script>

<template>
  <div class="mt-10">
    <n-scrollbar style="max-height: 300px" trigger="none">
      <div v-for="(item,index) in lyricData" :key="index" class="lyric-item">
        <p class="">
          {{ item.txt }}
        </p>
        <p v-if="item.translateTxt">
          {{ item.translateTxt }}
        </p>
      </div>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="less">
:deep(.n-scrollbar-content){
  padding-right:34px;
}
.lyric-item{
  p{
    line-height:30px;
    color:#646463;
  }
}
</style>
