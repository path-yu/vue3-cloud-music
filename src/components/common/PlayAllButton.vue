<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { Play, AddOutline } from '@vicons/ionicons5';
const mainStore = useMainStore();
const props = withDefaults(
  defineProps<{
  songList?:any[]|undefined;
  songListId:number;
}>(), { songList: () => [] }
);
// 点击播放全部
const handleStartPlayAllClick = () => {
  if (mainStore.playList.length === 0) {
    return window.$message.error('没有可播放的歌曲');
  }
  if (mainStore.currentPlayListId === props.songListId && props.songListId !== 1001) {
    if (mainStore.playing) {
      return window.$message.warning('正在播放中');
    }
    mainStore.initPlayList(
      props.songList, 0, props.songListId
    );
  } else {
    mainStore.initPlayList(
      props.songList, 0, props.songListId
    );
  }
  return null;
};
// 点击添加到全部歌单
const handleAddToAllPlayListClick = () => {
  // 搜索单曲歌单id
  if (!mainStore.playListIdList.includes(+props.songListId) || props.songListId === 1001) {
    return mainStore.addPlaylist(
      props.songList, props.songListId
    );
  } else {
    return window.$message.warning('已添加到播放列表');
  }
};
</script>

<template>
  <n-button size="medium" type="primary" round>
    <template #icon>
      <n-icon :component="Play" />
    </template>
    <p @click="handleStartPlayAllClick">
      播放全部
    </p>
    <div class="ml-4 ">
      <n-tooltip placement="bottom-start" trigger="hover">
        <template #trigger>
          <n-icon :component="AddOutline" size="20" @click="handleAddToAllPlayListClick" />
        </template>
        <span>添加全部到播放列表</span>
      </n-tooltip>
    </div>
  </n-button>
</template>