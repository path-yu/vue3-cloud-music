import { useMainStore } from '@/stores/main';
import type { Ref } from 'vue';
import useValidateVipSong from './useValidateVipSong';

export function useDbClickPlay() {
  let isLoad = false;
  return async (
    list:any[]| Ref<any[]>, playListId:string, item:any, index:number
  ) => {
    const value = useValidateVipSong(item);
    if (value) return;
    if (isLoad) return;
    const mainStore = useMainStore();
    let songList;
    if (list instanceof Array) {
      songList = list;
    } else {
      songList = list.value;
    }
    isLoad = true;
    const message = '亲爱的, 暂无版权';
    // 初始化歌曲列表
    if (!mainStore.playList.length) {
      await mainStore.initPlayList(
        songList, index, playListId, message
      );
    } else {
      if (mainStore.currentPlayListId === playListId) {
        await mainStore.changePlayIndex(index, message);
      } else {
        await mainStore.initPlayList(
          songList, index, playListId, message
        );
      }
    }
    isLoad = false;
  };
}
