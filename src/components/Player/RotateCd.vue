<script setup lang="ts">
import { useMainStore } from '@/stores/main';
// import playBar from '@/assets/img/play-bar.png';
import { ref, watch } from 'vue';
import useThemeStyle from '@/hook/useThemeStyle';

let maxCircleLine = 7;
let baseSize = 280;
let gap = 10;
let rotate = ref(0);
let cancelAnimationFrameId: number;
let imgSize = baseSize - (maxCircleLine * gap);
const mainStore = useMainStore();
const { baseColor } = useThemeStyle();
const computedCircleStyle = (index: number) => {
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
let start: undefined | number;
const loopSetRotate = (timestamp: number) => {
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
    <div class="elementC"></div>
    <div class="elementA"></div>
    <div class="stick">
      <div class="turn-element" :style="{ transform: mainStore.playing ? 'rotate(15deg)' : 'rotate(-16deg)' }">
        <div class="element1"></div>
        <div class="element2"></div>
        <!-- <div class="elementB"></div> -->
      </div>
    </div>
    <!-- <div class="playerBarContainer" :style="{ transform: mainStore.playing ? 'rotate(0deg)' : 'rotate(-40deg)' }">
      <img :src="playBar" class="playBar">
      <div class="playBarSupport">
        <div class="center">
          <div class="dot" />
        </div>
      </div>
    </div> -->
    <div class="cd" :style="{ background: mainStore.isDark ? 'rgb(34,34,39)' : '#DBDCDA' }">
      <div class="transition-all  blackCenter" :style="{ transform: `rotate(${rotate}deg)` }">
        <div v-for="item in maxCircleLine" :key="item" class="rounded-full circleItem"
          :style="computedCircleStyle(item)" />
        <div class="imgBg">
          <img crossorigin="anonymous" :width="imgSize" :height="imgSize" :src="mainStore.currentPlaySong.al.picUrl" />
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.absolute-center {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}

.wrapContainer {
  position: relative;
  width: 400px;
  height: 400px;

  .playerBarContainer {
    position: absolute;
    top: 20px;
    right: 120px;
    width: 100px;
    height: 150px;
    z-index: 999;
    transform-origin: 0 0;
    transition: transform 300ms linear;
    transform: rotate(0deg);

    >img {
      position: absolute;
      width: 100px;
      height: 150px;

    }

    .playBarSupport {
      position: absolute;
      width: 26px;
      height: 26px;
      z-index: 999;
      background: #E4E4E4;
      border-radius: 50%;
      transform: translate(-7px, -12px);
      ;

      .center {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #FFFFFF;
        .absolute-center();

        .dot {
          width: 5px;
          height: 5px;
          background: #E4E4E4;
          border-radius: 50%;
          .absolute-center();
        }
      }
    }
  }

  >.cd {
    position: absolute;
    top: 100px;
    left: -20px;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 340px;
    height: 340px;
    background: #DBDCDA;
    border-radius: 50%;
    padding: 10px;

    .blackCenter {
      position: relative;
      top: 10px;
      left: 10px;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      background: #000;
      transition: transform 1s linear;
      box-shadow: 0px 0px 6px 5px #000;

      .circleItem {
        .absolute-center()
      }

      .imgBg {
        .absolute-center();
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 6;

        img {
          border-radius: 50%;
          background: v-bind(baseColor);
        }
      }
    }

    .blackCenter::after {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: conic-gradient(transparent 0deg 10deg,
          rgba(255, 255, 255, .2) 40deg 45deg,
          transparent 75deg 190deg,
          rgba(255, 255, 255, .2) 220deg 225deg,
          transparent 255deg 360deg);
    }

    .blackCenter::before {
      content: '';
      display: block;
      width: 100%;
      height: 100%;
      background: repeating-radial-gradient(circle, darkkhaki, darkkhaki, 1px, transparent 1px, transparent 5px);
      border-radius: 50%;
      margin: auto;
      opacity: .1;
      position: absolute;
      top: 0%;
      left: 0%;
    }
  }
}

.stick {
  position: absolute;
  top: 55px;
  right: 33.5px;
  filter: drop-shadow(-2px 2px 3px rgba(0, 0, 0, 0.8));
  z-index: 4;
}

.stick::after {
  content: '';
  display: block;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  position: absolute;
  background-color: #8C8C8C;
  top: -31px;
  right: -31px;
}

.elementC {
  width: 100px;
  height: 100px;
  z-index: 0;
  position: absolute;
  right: -20px;
  top: 0;
  background-color: #eee;
  background-image: repeating-conic-gradient(from 0deg, rgba(212, 212, 212, 0.2),
      rgba(12, 12, 12, 0.1), rgba(12, 12, 12, 0.21), rgba(212, 212, 212, 0.2) 90deg);
  border-radius: 50%;
  border: 2px solid #242424;
  box-shadow: inset 0px -1px 2px 2px rgba(78, 77, 77, 0.9),
    inset 0px 2px 1px 3px rgba(243, 239, 239, 0.9), 0px 2px 9px 0.2px rgba(0, 0, 0, 0.6);
}

.elementA {

  transform: rotate(5deg);
  position: absolute;
  z-index: 5;
  right: 2.5px;
  top: 22.5px;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  border: 1px solid #8C8C8C;
  transition: transform 0.5s linear;
  background-image: -webkit-radial-gradient(50% 0%, 10% 60%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.1) 100%),
    -webkit-radial-gradient(50% 100%, 12% 50%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1)100%),
    -webkit-radial-gradient(0% 50%, 50% 10%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%),
    -webkit-radial-gradient(50% 50%, 200% 50%, rgb(230, 230, 230) 10%, rgb(217, 217, 217)30%, rgb(153, 153, 153) 100%);
}

.elementA::before,
.elementA::after {
  content: '';
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-image: -webkit-radial-gradient(50% 0%, 10% 50%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0) 100%),
    -webkit-radial-gradient(50% 100%, 10% 50%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0)100%),
    -webkit-radial-gradient(0% 50%, 50% 10%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0)100%),
    -webkit-radial-gradient(100% 50%, 50% 10%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0)100%);
}

.elementA:before {
  transform: rotate(67deg);
}

.elementA:after {
  transform: rotate(-67deg);
}

.element1 {
  box-sizing: content-box;
  z-index: 3;
  transform: rotate(120deg);
  position: absolute;
  top: 244px;
  right: -10px;
  width: 75px;
  height: 2px;
  background-color: #383838;
  background-image: linear-gradient(black 36%, #FBFBFB 55%);
  box-shadow: 0px 5px 0px #212121, 0px -5px 0px #212121;
  border: 8px solid #383838;
  border-right: none;
  border-left: none;
}

.element2 {
  width: 17px;
  height: 230px;
  z-index: 2;
  background: linear-gradient(90deg, rgb(117, 117, 117) 0%, rgb(201, 197, 197) 25%, rgb(255, 255, 255) 50%, rgb(207, 205, 205) 75%, rgb(145, 143, 143) 100%);
  position: absolute;
  top: 85px;
  left: 0;
  transform: translate(-50%, -50%);
}

.element2:after {
  z-index: 2;
  content: '';
  position: absolute;
  transform: skew(-25deg);
  height: 26px;
  width: 17px;
  background: linear-gradient(90deg, rgb(117, 117, 117) 0%, rgb(201, 197, 197) 25%, rgb(255, 255, 255) 50%, rgb(207, 205, 205) 75%, rgb(145, 143, 143) 100%);
  bottom: -25px;
  right: 6px;
}

.turn-element {
  position: relative;
  z-index: 2;
  transition: transform 0.5s linear;
}
</style>
