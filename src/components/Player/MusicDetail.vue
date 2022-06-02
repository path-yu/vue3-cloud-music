<script setup lang="ts">
import { ref, watch, type CSSProperties, type Ref } from 'vue';
import analyze from 'rgbaster';
import { KeyboardArrowDownOutlined } from '@vicons/material';
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
const background = ref<CSSProperties>({});
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

watch(
  () => mainStore.currentPlaySong, (val) => {
    setBackgroundStyle(); 
  }
);
watch(
  () => mainStore.theme, () => {
    setBackgroundStyle();
  }
);

const setBackgroundStyle = async () => {
  if (!mainStore.currentPlaySong) return;
  let primary;
  if (!mainStore.currentPlaySong.primaryColor) {
    const result = await analyze(mainStore.currentPlaySong.al.picUrl);
    mainStore.currentPlaySong.primaryColor = result[1].color;
    primary = result[1].color;
  } else {
    primary = mainStore.currentPlaySong.primaryColor;
  }
  console.log(primary);
  let baseColor = mainStore.theme === 'dark'
    ? '#121212'
    : 'white';
  let bgColor = color(baseColor).mix(
    color(primary), 0.2
  ) 
    .hex();
  background.value = { background: `linear-gradient(to bottom,${bgColor}, ${baseColor}` };
};
setBackgroundStyle();
</script>

<template>
  <transition name="bottom-slide-transform">
    <div v-show="active" class="fixed inset-x-0 m-auto music-detail" :style="background">
      <div class="flex items-center p-4">
        <n-icon
          size="35" :component="KeyboardArrowDownOutlined" class="ml-4"
          @click="active = false"
        />
        <div class="flex flex-1 items-center ml-20">
          <layout-header-search />
        </div>
      </div> 
      <div>
        <rotate-cd />
      </div>
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
