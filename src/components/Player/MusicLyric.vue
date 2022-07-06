<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import obverser from '@/utils/obverser';
import { PlayArrowSharp } from '@vicons/material';
import { computed, nextTick, onMounted, toRaw, watch, type CSSProperties } from 'vue';
import { useMainStore } from '@/stores/main';
import { ref } from 'vue';
import { parseLyric, parseRangeLyric, type LineItem, type RangeLyricItem } from '@/utils/lyric';
import { useElementHover } from '@vueuse/core';
let timeId:any;// 回退滚动位置延时器
let clearTriggerScrollTimer:any;// 设置滚动是否触发延时器
let triggerScroll = true;
const mainStore = useMainStore();
const themeVars = useThemeVars();
const currentPlayLine = ref(0);
const eleScrollTopMap = new Map();// 歌词元素对应的scrollTop 集合
const selectLyricLine = ref<{time:number;index:number} | null>(null);// 当前滚动选择的歌词
const showSelectLyric = ref(false);
const lyricContainer = ref<HTMLDivElement>();
const scrollBarRef = ref<{scrollTo:(data:{ left?: number, top?: number, behavior:string })=>void}>();
const scrollContainerRef = ref();
const footerMaskBackground = ref<CSSProperties>({});
const topMaskBackground = ref<CSSProperties>({});
const isHover = useElementHover(scrollContainerRef);
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
  return (index:number) => {
    let isCurrent = index === currentPlayLine.value;
    return {
      color: isCurrent
        ? themeVars.value.primaryColor
        : selectLyricLine.value?.index === index
          ? themeVars.value.primaryColorSuppl
          : '#646463',
      fontWeight: isCurrent
        ? 'bold'
        :'500',
      fontSize: isCurrent
        ? '16px'
        :'14px'
    } as CSSProperties;

  };
});

function handlePlayLyric(time:number) {
  if (mainStore.currentPlaySong.isNotLyric) return;
  if (!lyricData.value.length) return;
  // 如果当前鼠标正在滚动歌词
  if (selectLyricLine.value) return;
  // 重置状态
  if (time === 0) {
    lyricData.value.forEach(item => item.isFind = false);
  }
  let index = rangeLyricList.value.get(time)?.index as number;
  let currentLyric = lyricData.value[index];
  if (currentLyric && !currentLyric.isFind) {
    lyricData.value[index].isFind = true;
    currentPlayLine.value = index;
    setScroll(currentLyric.time);
  }
}
const handleSliderChange = (time:number) => {
  if (mainStore.currentPlaySong.isNotLyric) return;
  if (!lyricData.value.length) return;
  let currentLyric = rangeLyricList.value.get(time) as RangeLyricItem;
  if (currentLyric) {
    lyricData.value.forEach(item => item.isFind = false);
    lyricData.value[currentLyric.index].isFind = true;
    currentPlayLine.value = currentLyric.index;
    setScroll(currentLyric.time);
  }
};
const handleScroll = (event:Event) => {
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
  clearTimeout(timeId);
  timeId = setTimeout(
    () => {
      selectLyricLine.value = null;
      showSelectLyric.value = false;
      scrollTo(currentScrollTop);
    }, 2500
  );
};
const handlePlayIconClick = () => {
  let time = selectLyricLine.value!.time;
  currentPlayLine.value = selectLyricLine.value!.index;
  showSelectLyric.value = false;
  triggerScroll = true;
  selectLyricLine.value = null;
  obverser.emit(
    'selectLyricPlay', time
  );
};
const handleWheel = (event:WheelEvent) => {
  triggerScroll = true;
  clearTimeout(clearTriggerScrollTimer);
  clearTriggerScrollTimer = setTimeout(
    () => {
      triggerScroll = false;
    }, 1000
  );
};
const initEleScrollTopMap = () => {
  eleScrollTopMap.clear();
  let children = Array.from(lyricContainer.value!.children) as HTMLElement[];
  let valueList = children.map((
    child, index
  ) => {
    return {
      offsetTop: child.offsetTop - 175,
      index,
      time: child.getAttribute('data-time')
    };
  });
  let currentIndex = 0;
  let nextIndex = 1;
  while (currentIndex !== valueList.length - 1) {
    const cur = valueList[currentIndex];
    const next = valueList[nextIndex];
    for (let start = cur.offsetTop; start < next.offsetTop; start++) {
      eleScrollTopMap.set(
        start, {
          index: cur.index,
          time: cur.time
        }
      );
    }
    if (next) {
      currentIndex++;
      nextIndex++;
    }
    if (currentIndex === valueList.length - 1) {
      eleScrollTopMap.set(
        next.offsetTop, {
          index: next.index,
          time: next.time
        }
      );
    }
  }
};
const setScroll = (time:number) => {
  let targetELe = document.querySelector(`#time${time}`) as HTMLElement;
  if (targetELe) {
    currentScrollTop = targetELe!.offsetTop - 175;
    scrollTo(currentScrollTop);
  }
};
const scrollTo = (top:number) => {
  triggerScroll = false;
  scrollBarRef.value?.scrollTo({ top: top, behavior: 'smooth' });
};

watch(
  isHover, (val) => {
    if (!val) {
      showSelectLyric.value = false;
    } else {
      if (selectLyricLine.value && !mainStore.currentPlaySong?.isNotLyric) {
        showSelectLyric.value = true;
      } else {
        showSelectLyric.value = false;
      }
    }
  }
);
watch(
  () => mainStore.currentPlaySong, async () => {
    currentScrollTop = 0;
    scrollTo(0);
    if (mainStore.showMusicDetail) {
      await nextTick();
      initEleScrollTopMap();
    }
  }
);
watch(
  () => mainStore.showMusicDetail, async (val) => {
    if (val && eleScrollTopMap.size === 0) {
      await nextTick();
      initEleScrollTopMap(); 
    }
  }, { immediate: true }
);
obverser.on(
  'updateLyricMaskStyle', ({ footerMaskStyle, topMaskStyle }) => {
    if (footerMaskStyle !== footerMaskBackground.value) {
      footerMaskBackground.value = footerMaskStyle;
    }
    if (topMaskStyle !== topMaskBackground.value) {
      topMaskBackground.value = topMaskStyle;
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
      currentScrollTop = 0;
      scrollTo(0);
    }
  );
});

</script>

<template>
  <div ref="scrollContainerRef" class="relative mt-10 scrollContainer">
    <n-scrollbar
      ref="scrollBarRef" style="height: 350px;width:550px"
      :on-scroll="handleScroll" @wheel="handleWheel"
    >
      <div style="height:175px" />
      <div ref="lyricContainer">
        <div
          v-for="(item,index) in lyricData" :id="'time'+item.time" :key="index"
          class="text-center lyric-item" :data-time="item.time"
        > 
          <p :style="currentLyricStyle(index)" class="transition-color">
            {{ item.content }}
          </p>
          <p v-if="item.translateContent" :style="currentLyricStyle(index)" class="transition-color">
            {{ item.translateContent }}
          </p>
        </div>
      </div>
      <div style="height:175px" />
    </n-scrollbar>
    <!-- 歌词滚动选择 -->
    <div v-show="showSelectLyric" class="selectLyricContainer"> 
      <div class="flex items-center">
        <n-time v-if="selectLyricLine" format="mm:ss" :time="selectLyricLine.time * 1000" />
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
.lyric-item{
  p{
    line-height:35px;
    color:#646463;
  }
}
.footer-mask{
  position: absolute;
  width:500px;
  height:50px;
  bottom: 0px;
}
.top-mask{
  position: absolute;
  width:500px;
  height:50px;
  bottom: 300px;
}
.selectLyricContainer{
  position: absolute;
  top:175px;
  width: 540px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.line{
  width: 60px;
  height:1px;
}
</style>
