<script setup lang="ts">
import { computed, ref, watch, type CSSProperties, type Ref } from 'vue';
import analyze from 'rgbaster';
import color from 'color';
import { useMainStore } from '@/stores/main';
import { useThemeVars } from 'naive-ui';
export interface MusicDetailExpose {
  show:() => void;
  close:() => void;
  toggle:() => void;
  active: Ref<boolean>;
}
const mainStore = useMainStore();
const themeVars = useThemeVars();
const active = ref(false);
defineExpose({
  show() {
    active.value = true;
  },
  close() {
    active.value = false;
  },
  toggle() {
    if (active.value) {
      active.value = false;
    } else {
      active.value = true;
    }
  },
  active
});
const backgroundColor = computed(() => {
  return { backgroundColor: '#fff' };
});

watch(
  () => mainStore.currentPlaySong.value, (val) => {
    if (!val.backgroundStyle) {
      setBackgroundStyle();
     
    }  
  }
);
const setBackgroundStyle = async () => {
  if (!mainStore.currentPlaySong.backgroundStyle) {
    const result = await analyze(mainStore.currentPlaySong.al?.picUrl);
    let primary, secondary, third;
    if (mainStore.theme === 'dark') {
      primary = color(result[0].color).darken(0.9)
        .hex();
      secondary = color(result[1].color).darken(0.8)
        .hex();
      third = color(result[2].color).darken(1)
        .hex();
    } else {
      primary = color(result[0].color).lighten(0.9)
        .hex();
      secondary = color(result[1].color).lighten(0.8)
        .hex();
      third = color(result[2].color).lighten(1)
        .hex();
    }
    
    // 匹配rgb颜色,添加高斯模糊
    let style:CSSProperties = {
      // background: `linear-gradient(to bottom,${result[20].color},${themeVars.value.baseColor} )`,
      background: `linear-gradient(to bottom,${primary},${secondary},${third} )`
    };
    mainStore.currentPlaySong.backgroundStyle = style;
  }  
};
setBackgroundStyle();
</script>

<template>
  <transition name="bottom-slide-transform">
    <div v-show="active" :style="mainStore.currentPlaySong.backgroundStyle" class="fixed inset-x-0 m-auto music-detail">
      音乐详情
    </div>
  </transition>
</template>

<style scoped>
.music-detail{
  bottom:73px;
  width: 85vw;
  height: calc(100vh - 73px);
  z-index: 999;
}
/* 从底部弹出或隐藏过渡 */
.bottom-slide-transform-leave-active{
  transition: height .2s cubic-bezier(0.4, 0, 0.2, 1);
}
.bottom-slide-transform-enter-active {
  transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);;
}
.bottom-slide-transform-enter-from {
   height: 0;
}
.bottom-slide-transform-enter-to {
   height: calc(100vh - 73px);
}
.bottom-slide-transform-leave-to {
   height: 0;
}

</style>
