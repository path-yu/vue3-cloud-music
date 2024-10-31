<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import obverser from '@/utils/obverser';
import { PlayArrowSharp } from '@vicons/material';
import { computed, nextTick, onMounted, toRaw, watch, type CSSProperties } from 'vue';
import { useMainStore } from '@/stores/main';
import { ref } from 'vue';
import { parseLyric, parseRangeLyric, type LineItem, type RangeLyricItem } from '@/utils/lyric';
import { useElementHover } from '@vueuse/core';
let timeId: any;// 回退滚动位置延时器
let clearTriggerScrollTimer: any;// 设置滚动是否触发延时器
let triggerScroll = true;
let triggerPlayLyric = true;
let selectLyricLineIndex = 0;
let pendingSetScrollFn: (() => void) | null = null;
const mainStore = useMainStore();
const themeVars = useThemeVars();
const currentPlayLine = ref(0);
const eleScrollTopMap = new Map();// 歌词元素对应的scrollTop 集合
const selectLyricLine = ref<{ time: number; index: number } | null>();// 当前滚动选择的歌词
const showSelectLyric = ref(false);
const lyricContainer = ref<HTMLDivElement>();
const scrollBarRef = ref<{ scrollTo: (data: { left?: number, top?: number, behavior: string }) => void }>();
const scrollContainerRef = ref();
const footerMaskBackground = ref<CSSProperties>({});
const topMaskBackground = ref<CSSProperties>({});
const isHover = useElementHover(scrollContainerRef);
let lyricChildrenValueList: { offsetTop: number, index: number, time: number }[] = [];
const gapHeight = 157;
let lyricContainerEle: null | HTMLDivElement = null;
let currentScrollTop = 0;
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
const currentLyricStyle = computed(() => {
  return (index: number) => {
    let isCurrent = index === currentPlayLine.value;
    return {
      color: isCurrent
        ? themeVars.value.primaryColor
        : selectLyricLine.value?.index === index
          ? themeVars.value.primaryColorSuppl
          : '#646463',
      fontWeight: isCurrent
        ? 'bold'
        : '500',
      fontSize: isCurrent
        ? '16px'
        : '14px'
    } as CSSProperties;

  };
});

function handlePlayLyric(time: number, listenScroll = false) {
  // 如果当前鼠标正在滚动歌词
  if (selectLyricLine.value) return;
  if (!triggerPlayLyric) return;
  triggerLyricChange(time, listenScroll);
}
const handleSliderChange = (time: number, listenScroll = false) => {
  if (mainStore.showMusicDetail) {
    triggerLyricChange(time, listenScroll);
  } else {
    pendingSetScrollFn = () => triggerLyricChange(time, listenScroll);
  }
};
const triggerLyricChange = (time: number, listenScroll = false) => {
  if (mainStore.currentPlaySong.isNotLyric) return;
  if (!lyricData.value.length) return;
  let currentLyric = rangeLyricList.value.get(time) as RangeLyricItem;
  if (currentLyric) {
    currentPlayLine.value = currentLyric.index;
    mainStore.currentPlayLyric = currentLyric.content;
    setScroll(currentLyric.time, listenScroll);
  }
};
const handleScroll = (event: Event) => {
  if (!triggerScroll) return;
  if (mainStore.currentPlaySong.isNotLyric) return;
  const target = event.target as HTMLElement;
  triggerScroll = true;
  let { scrollTop } = target;
  let current = eleScrollTopMap.get(scrollTop);

  if (!selectLyricLine.value) {
    selectLyricLine.value = current;
  } else {
    if (current && selectLyricLine.value.time !== current.time) {
      selectLyricLine.value = current;
    }
  }
  if (!mainStore.currentPlaySong?.isNotLyric) {
    showSelectLyric.value = true;
  }
  selectLyricLineIndex = selectLyricLine.value!.index;
  clearTimeout(timeId);
  timeId = setTimeout(() => {
    if (selectLyricLineIndex && selectLyricLineIndex !== currentPlayLine.value) {
      triggerPlayLyric = false;
      scrollTo(currentScrollTop, true);
    }
    selectLyricLine.value = null;
    showSelectLyric.value = false;
  }, 2500);
};
const handlePlayIconClick = () => {
  let time = selectLyricLine.value!.time;
  currentPlayLine.value = selectLyricLine.value!.index;
  selectLyricLineIndex = currentPlayLine.value;
  showSelectLyric.value = false;
  triggerScroll = false;
  selectLyricLine.value = null;
  obverser.emit('selectLyricPlay', time / 1000);
};
const handleWheel = (event: WheelEvent) => {
  // disabled default scroll 
  event.preventDefault();
  triggerScroll = true;
  // getting the scrolling speed.
  let deltaY = event.deltaY;
  // decreasing the scrolling speed by 3
  let speed = deltaY / 3;
  // scrolling the content of the div element
  lyricContainerEle!.scrollTop += speed;
  clearTimeout(clearTriggerScrollTimer);
  clearTriggerScrollTimer = setTimeout(() => {
    triggerScroll = false;
  }, 500);
};
const initEleScrollTopMap = () => {
  if (!lyricContainer.value) return;
  if (!lyricData.value.length) return;
  eleScrollTopMap.clear();
  let children = Array.from(lyricContainer.value.children) as HTMLElement[];
  lyricChildrenValueList = children.map((child, index) => {
    return {
      offsetTop: child.offsetTop - gapHeight,
      index,
      time: +child.getAttribute('data-time')!
    };
  });

  let currentIndex = 0;
  let nextIndex = 1;
  while (currentIndex !== lyricChildrenValueList.length - 1) {
    const cur = lyricChildrenValueList[currentIndex];
    const next = lyricChildrenValueList[nextIndex];
    for (let start = cur.offsetTop; start < next.offsetTop; start++) {
      eleScrollTopMap.set(start, {
        index: cur.index,
        time: cur.time
      });
    }
    if (next) {
      currentIndex++;
      nextIndex++;
    }
    if (currentIndex === lyricChildrenValueList.length - 1) {
      eleScrollTopMap.set(next.offsetTop, {
        index: next.index,
        time: next.time
      });
    }
  }
};
const setScroll = (time: number, listen = false) => {
  let targetELe = document.querySelector(`#time${time}`) as HTMLElement;
  if (targetELe) {
    currentScrollTop = targetELe!.offsetTop - gapHeight
      ;
    scrollTo(currentScrollTop, listen);

  }
};
const scrollTo = (top: number, listen = false) => {
  triggerScroll = false;
  scrollBarRef.value?.scrollTo({ top: top, behavior: 'smooth' });
  if (listen) {
    listenScrollComplete(top, () => {
      obverser.emit('scrollComplete');
      triggerPlayLyric = true;
    });
  }

};
const createListenScrollComplete = (selector = '.scrollContainer > .n-scrollbar > .n-scrollbar-container', wait = 50) => {
  let scrollTargetEle: null | HTMLElement = null;
  let timer: any;
  return async (top: number, callback: () => void) => {
    await nextTick();
    if (!scrollTargetEle) {
      scrollTargetEle = document.querySelector(selector) as HTMLElement;
    }
    timer = setInterval(() => {
      if (scrollTargetEle?.scrollTop === top) {
        callback();
        clearInterval(timer);
      }
    }, wait);
  };
};
let listenScrollComplete = createListenScrollComplete();
watch(isHover, (val) => {
  if (!val) {
    showSelectLyric.value = false;
  } else {
    if (selectLyricLine.value && !mainStore.currentPlaySong?.isNotLyric) {
      showSelectLyric.value = true;
    } else {
      showSelectLyric.value = false;
    }
  }
});
watch(() => mainStore.currentPlaySong, async () => {
  currentScrollTop = 0;
  scrollTo(0, true);
  if (mainStore.showMusicDetail && !mainStore.currentPlaySong?.isNotLyric) {
    await nextTick();
    initEleScrollTopMap();
  }
});
watch(
  () => mainStore.showMusicDetail, async (val) => {
    if (val && eleScrollTopMap.size === 0 && !mainStore.currentPlaySong?.isNotLyric) {
      await nextTick();
      initEleScrollTopMap();
    }
    if (val) {
      setTimeout(() => {
        pendingSetScrollFn && pendingSetScrollFn();
      }, 500);
    } else {
      pendingSetScrollFn = null;
    }
  }, { immediate: true }
);
watch(
  lyricData, (val) => {
    if (val.length) {
      mainStore.currentPlayLyric = val[0].content;
    }
  }, { immediate: true }
);
obverser.on('updateLyricMaskStyle', ({ footerMaskStyle, topMaskStyle }) => {
  footerMaskBackground.value = footerMaskStyle;
  topMaskBackground.value = topMaskStyle;
});
onMounted(() => {
  obverser.on('timeUpdate', handlePlayLyric);
  obverser.on('slideValueChange', handleSliderChange);
  lyricContainerEle = document.querySelector('.scrollContainer > .n-scrollbar > .n-scrollbar-container')
  obverser.on('ended', () => {
    currentScrollTop = 0;
    scrollTo(0, true);
  });
});


</script>

<template>
  <div ref="scrollContainerRef" class="relative mt-10 scrollContainer">
    <n-scrollbar ref="scrollBarRef" style="height: 350px;width:550px" :on-scroll="handleScroll" @wheel="handleWheel">
      <div :style="{ height: gapHeight + 'px' }" />
      <div v-if="!mainStore.currentPlaySong?.isNotLyric" ref="lyricContainer">
        <div v-for="(item, index) in lyricData" :id="'time' + item.time" :key="index" class="text-center lyric-item"
          :data-time="item.time">
          <p :style="currentLyricStyle(index)" class="transition-color">
            {{ item.content }}
          </p>
          <p v-if="item.translateContent" :style="currentLyricStyle(index)" class="transition-color">
            {{ item.translateContent }}
          </p>
        </div>
      </div>
      <div v-else class="text-center opacity-40">
        暂无歌词...
      </div>
      <div :style="{ height: gapHeight + 'px' }" />
    </n-scrollbar>
    <!-- 歌词滚动选择 -->
    <div v-show="showSelectLyric" class="selectLyricContainer">
      <div class="flex items-center">
        <n-time v-if="selectLyricLine" format="mm:ss" :time="selectLyricLine.time" />
        <div class="ml-2  bg-gradient-to-r from-gray-300 dark:from-gray-500 line" />
      </div>
      <div class="flex items-center">
        <div class="mr-2 bg-gradient-to-l  from-gray-300 dark:from-gray-500 line" />
        <n-icon :component="PlayArrowSharp" :size="20" @click="handlePlayIconClick" />
      </div>
    </div>
    <div class="top-mask" :style="topMaskBackground" />
    <div class="footer-mask" :style="footerMaskBackground" />
  </div>
</template>

<style scoped lang="less">
.lyric-item {
  width: 500px;

  p {
    line-height: 35px;
    color: #646463;
  }
}

.footer-mask {
  position: absolute;
  width: 500px;
  height: 50px;
  bottom: 0px;
}

.top-mask {
  position: absolute;
  width: 500px;
  height: 50px;
  bottom: 300px;
}

.selectLyricContainer {
  position: absolute;
  top: 140px;
  width: 540px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.line {
  width: 60px;
  height: 1px;
}
</style>
