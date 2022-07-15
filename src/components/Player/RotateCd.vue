<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import playBar from '@/assets/img/play-bar.png';
import { ref, watch } from 'vue';
import useThemeStyle from '@/hook/useThemeStyle';

let maxCircleLine = 7;
let baseSize = 280;
let gap = 10;
let rotate = ref(0);
let cancelAnimationFrameId:number;
let imgSize = baseSize - (maxCircleLine * gap);
const mainStore = useMainStore();
const { baseColor } = useThemeStyle();
const computedCircleStyle = (index:number) => {
  return {
    width: `${baseSize - (gap * index)}px`,
    height: `${baseSize - (gap * index)}px`,
    border: '1px solid #232426'
  };
};
watch([() => mainStore.playing, () => mainStore.playWaiting], ([playing, playWaiting]) => {
  if (playing && !playWaiting) {
    cancelAnimationFrameId = window.requestAnimationFrame(loopSetRotate);
  } else {
    window.cancelAnimationFrame(cancelAnimationFrameId);
  }
});
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
    <div class="playerBarContainer" :style="{transform: mainStore.playing ? 'rotate(0deg)' : 'rotate(-40deg)'}">
      <img :src="playBar" class="playBar">
      <div class="playBarSupport">
        <div class="center">
          <div class="dot" />
        </div>
      </div>
    </div>
    <div class="cd" :style="{background: mainStore.isDark ? '#373636' : '#DBDCDA'}">
      <div class="transition-all  blackCenter" :style="{transform:`rotate(${rotate}deg)`,background: mainStore.isDark ? '#1D1E21' : '#1B1C1F'}">
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
  width:400px;
  height:400px;
  .playerBarContainer{
    position:absolute;
    top:20px;
    right:120px;
    width:100px;
    height:150px;
    z-index:999;
    transform-origin: 0 0;
    transition:transform 300ms linear;
    transform: rotate(0deg);
    >img{
      position:absolute;
      width:100px;
      height:150px;
     
    }
    .playBarSupport{
      position:absolute;
      width:26px;
      height:26px;
      z-index:999;
      background: #E4E4E4;
      border-radius:50%;
      transform:translate(-7px, -12px);;
      .center{
        width:15px;
        height:15px;
        border-radius: 50%;
        background:#FFFFFF;
        .absolute-center();
        .dot{
          width:5px;
          height:5px;
          background: #E4E4E4;
          border-radius: 50%;
          .absolute-center();
        }
      }
    }
  }
  >.cd{
    position:absolute;
    top:100px;
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
           background: v-bind(baseColor);
        }
      }
    }
  }
}
</style>
