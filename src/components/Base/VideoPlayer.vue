<template>
  <div ref="playerRef" class=" video-player" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch, watchEffect } from 'vue';
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

const initPlayer = () => {
  if (props.url) {
    player = new Player({
      el: playerRef.value as HTMLElement,
      url: props.url,
      poster: props.poster,
      videoInit: true,
      lang: 'zh-cn',
      width: '100%',
      height: '440px'
    });
  }
};

defineExpose({
  initPlayer, stop() {
    player.pause();
  } 
});

watch(
  () => props.url, (
    url, oldUrl
  ) => {
    if (url && url !== oldUrl) {
      if (!player) {
        initPlayer();
      } else {
        player.src = url;
        player.reload();
      }
    }
  }
);
</script>

<style>
.xgplayer-error {
  display: none;
}
</style>