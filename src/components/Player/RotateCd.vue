<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import playBar from '@/assets/img/play-bar.png';
import { ref, watch } from 'vue';
let maxCircleLine = 7;
let baseSize = 280;
let gap = 10;
let rotate = ref(0);
let timer:number|undefined;
let cancelAnimationFrameId:number;
let imgSize = baseSize - (maxCircleLine * gap);
const mainStore = useMainStore();
const computedCircleStyle = (index:number) => {
  const style = {
    width: `${baseSize - (gap * index)}px`,
    height: `${ baseSize - (gap * index)}px`,
    border: '1px solid #232426'
  };
  return style;
};

watch(
  () => mainStore.playing, (
    val, oldVal
  ) => {
    if (val) {
      cancelAnimationFrameId = window.requestAnimationFrame(loopSetRotate);
    } else {
      window.cancelAnimationFrame(cancelAnimationFrameId);
    }
  }
);
let start:undefined|number;
const loopSetRotate = (timestamp:number) => {
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = timestamp - start;
  if (elapsed > 1000) { // 在两秒后停止动画
    rotate.value = rotate.value + 5;
    start = timestamp;
  }
  cancelAnimationFrameId = window.requestAnimationFrame(loopSetRotate);
};

</script>

<template>
  <div class="wrapContainer">
    <img :src="playBar" class="playBar" :style="{transform: mainStore.playing ? 'rotate(0deg)' : 'rotate(-40deg)'}">
    <div class="cd">
      <div class="transition-all  blackCenter" :style="{transform:`rotate(${rotate}deg)`}">
        <div
          v-for="item in maxCircleLine" :key="item" class="rounded-full circleItem"
          :style="computedCircleStyle(item)"
        />
        <div class="imgBg">
          <n-image
            :width="imgSize" :height="imgSize"
            :src="mainStore.currentPlaySong.al.picUrl"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.absolute-center{
  position:absolute;
  top:0;
  left:0;
  right:0;
  bottom:0;
  margin:auto;
}
.wrapContainer{
  position:relative;
  width:500px;
  height:500px;
  .playBar{
    position:absolute;
    top:20px;
    right:150px;
    width:100px;
    height:150px;
    z-index:999;
    transform-origin: 0 0;
    transition:transform 300ms linear;
    transform: rotate(0deg);
  }
  >.cd{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    margin:auto;
    width:300px;
    height:300px;
    background: #DBDCDA;
    border-radius:50%;
    padding:10px;
    .blackCenter{
      position:relative;
      width:300px;
      height:300px;
      border-radius:50%;
      background: #1D1E21;
      transition:transform 1s linear;
      .circleItem{
       .absolute-center()
      }
      .imgBg{
        .absolute-center();
        display:flex;
        justify-content: center;
        align-items: center;
        .n-image{
          border-radius:50%;
        }
      }
    }
  }
}
</style>
