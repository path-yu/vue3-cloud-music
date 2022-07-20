<template>
  <div ref="playerRef" class=" video-player" />
</template>
<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { computed, ref, watch, onUnmounted } from 'vue';
import Player from 'xgplayer';
export interface VideoPlayProps{
  url?:string;
  poster?:string;
}
export interface VideoPlayerExpose{
  initPlayer:() => void;
  stop:() => void;
}
let player:Player;
const playerRef = ref<HTMLElement>();
const props = defineProps<VideoPlayProps>();
const themVars = useThemeVars();
const primaryColor = computed(() => themVars.value.primaryColor);
const initPlayer = () => {
  if (props.url) {
    player = new Player({
      el: playerRef.value as HTMLElement,
      url: props.url,
      poster: props.poster,
      videoInit: true,
      lang: 'zh-cn',
      width: '100%',
      height: '440px',
      playbackRate: [
        0.5, 0.75, 1, 1.5, 2
      ]
    });
  }
};

defineExpose({
  initPlayer, stop() {
    player.pause();
  } 
});

watch(() => props.url, (url, oldUrl) => {
  if (url && url !== oldUrl) {
    if (!player) {
      initPlayer();
    } else {
      player.src = url;
      player.reload();
    }
  }
});
onUnmounted(() => {
  player.destroy();
});
</script>

<style>
.xgplayer-error {
  display: none;
}
.xgplayer-skin-default .xgplayer-progress-played{
  background: v-bind(primaryColor) !important;
}
.xgplayer-skin-default .xgplayer-drag{
  background: v-bind(primaryColor) !important;
}
.xgplayer-skin-default .xgplayer-error .xgplayer-error-refresh{
  color: v-bind(primaryColor) !important;
}
</style>