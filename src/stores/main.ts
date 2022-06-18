/* eslint-disable consistent-return */

import { checkMusic, getLyric, getMusicUrl } from '@/service';
import { getNextIndex, getPrevIndex, getRandomIntInclusive } from '@/utils';
import type { AnyObject } from 'env';
import { darkTheme } from 'naive-ui';
import { defineStore } from 'pinia';
import state, { type playMode } from './state';

export const useMainStore = defineStore({
  id: 'main',
  state: () => state,
  getters: {
    activeTheme(state) {
      return state.theme === 'dark'
        ? darkTheme
        : null;
    },
    isActiveDarkTheme(state) {
      return state.theme === 'dark';
    },
    likeSongsIndexMap(state) {
      const map:{[key:number]:number} = Object.create(null);
      state.likeSongs.forEach((
        item:number, index:number
      ) => {
        map[item] = index;
      });
      return map;
    },
    currentPlaySong(state) {
      return state.playList[state.currentPlayIndex];
    },
    playListCount(state) {
      return state.playList.length;
    },
    isDark(state) {
      return state.theme === 'dark';
    }
  },
  actions: {
    changeTheme() {
      if (this.theme === 'dark') {
        document.documentElement.classList.remove('dark');
        this.theme = 'light';
        document.documentElement.style.colorScheme = '';
        localStorage.theme = 'light';
        
      } else {
        document.documentElement.classList.add('dark');
        // 设置网页的配色方案为dark 
        document.documentElement.style.colorScheme = 'dark';
        this.theme = 'dark';
        localStorage.theme = 'dark';
      }
    },
    initDocumentTheme() {
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = '';
      }
    },
    setLikeList(data:number[]) {
      this.likeSongs = data;
      localStorage.likeSongs = JSON.stringify(data);
    },
    removeLikeList(id:number) {
      this.likeSongs = this.likeSongs.filter((item: number) => item !== id);
      localStorage.likeSongs = JSON.stringify(this.likeSongs);
    },
    removeAllLikeList() {
      this.likeSongs = [];
      localStorage.likeSongs = JSON.stringify(this.likeSongs);
    },
    addLikeList(id:number) {
      this.likeSongs.push(id);
      localStorage.likeSongs = JSON.stringify(this.likeSongs);
    },
    hasLikeSong(id:number) {
      return !!this.likeSongs[this.likeSongsIndexMap[id]];
    },
    mapSongListAddLike(data:any[]) {
      return data.map((
        item, index
      ) => {
        if (this.likeSongs) {
          const hasLike = this.hasLikeSong(item.id);
          item.like = hasLike;
        } else {
          item.like = false;
        }
        item.key = index;
        return item;
      });
    },
    // 初始化播放 列表
    async initPlayList(
      data:any[], index=0, playListId:number|string, message='亲爱的, 暂无版权'
    ) {
      // 如果没有获取url, 则获取歌曲url
      if (!data[index].url) {
        const res = await this.setMusicData(
          data, data[index].id, index, message
        );
        if (!res.success) return;
      }
      this.playList = data;
      this.currentPlayIndex = index;
      this.playListIdList = [+playListId];
      localStorage.currentPlayIndex = index;
      localStorage.playListIdList = JSON.stringify(this.playListIdList);
      console.log('33');
      localStorage.playList = JSON.stringify(this.playList);
      localStorage.currentPlayListId = playListId;
      this.currentPlayListId = playListId;
      this.playMode = 'order';
      this.changePlaying(true);
    },
    resetPlayList() {
      this.playList = [];
      this.currentPlayIndex = 0;
      localStorage.currentPlayIndex = 0;
      localStorage.playList = JSON.stringify(this.playList);
      localStorage.currentPlayListId = 0;
      this.currentPlayListId = 0;
      this.playMode = 'order';
    },
    addPlaylist(
      list:any[], id:number|string
    ) {
      this.playList = [...this.playList, ...list];
      this.playListIdList.push(+id);
      localStorage.playList = JSON.stringify(this.playList);
    },
    // 切换播放音乐
    async changePlayIndex(
      index:number, message='亲爱的, 暂无版权'
    ) {
      // 如果没有获取url, 则获取歌曲url
      if (!this.playList[index].url) {
        const res = await this.setMusicData(
          this.playList, this.playList[index].id, index, message
        );
        if (!res.success) return { success: false };
      }
      this.currentPlayIndex = index;
      localStorage.currentPlayIndex = index;
      localStorage.playList = JSON.stringify(this.playList);
      this.changePlaying(true);
    },
    // 切换播放模式
    changePlayMode(mode:playMode) {
      this.playMode = mode;
      localStorage.playMode = mode;
    },
    // 切换播放状态
    changePlaying(playing:boolean) {
      this.playing = playing;
    },
    // 切换下一首
    async toggleNext(index?:number) {
      const resultIndex = this.getNextPlayIndex(index);
      if (!this.playList[resultIndex].url) {
        const res = await this.setMusicData(
          this.playList, this.playList[resultIndex].id, resultIndex
        );
        // 如果获取失败说明无版权,则获取下一首
        if (!res.success) {
          const nextIndex = getNextIndex(
            this.currentPlayIndex, this.playListCount - 1
          );
          this.toggleNext(nextIndex);
          return; 
        }
      }
      this.currentPlayIndex = resultIndex;
      localStorage.currentPlayIndex = resultIndex;
      localStorage.playList = JSON.stringify(this.playList);
      this.changePlaying(true);
      return { success: true };
    },
    // 切换上一首
    async togglePrev(index?:number) {
      const resultIndex = this.getPrevPlayIndex(index);
      if (!this.playList[resultIndex].url) {
        const res = await this.setMusicData(
          this.playList, this.playList[resultIndex].id, resultIndex
        );
        if (!res.success) {
          const prevIndex = getPrevIndex(
            this.currentPlayIndex, this.playListCount - 1
          );
          this.togglePrev(prevIndex);
          return;
        }
      }
      this.currentPlayIndex = resultIndex;
      localStorage.currentPlayIndex = resultIndex;
      localStorage.playList = JSON.stringify(this.playList);
      this.changePlaying(true);
      return { success: true };
    },
    // 插入播放
    async insertPlay(value:any) {
      // 未添加则插入
      if (this.playList.findIndex(item => item.id === value.id) === -1) {
        this.playList.splice(
          this.currentPlayIndex+1, 0, value
        );
        const insertIndex = this.playList.findIndex((item:any) => item.id === value.id);
        localStorage.playList = JSON.stringify(this.playList);
        this.changePlayIndex(insertIndex);
      }
    },
    updatePlayListLike(
      like:boolean, index?:number
    ) {
      const resultIndex = index
        ? index
        : this.currentPlayIndex;
      this.playList[resultIndex].like = like;
      localStorage.playList = JSON.stringify(this.playList);
    },
    async setMusicData(
      data:any[], id:string, index:number, message='亲爱的,暂无版权!为你自动跳过此首歌曲'
    ):Promise<any> {
      const result:AnyObject={};
      window.$message.loading(
        '获取歌曲数据中...', { duration: 0 }
      );
      // 检查歌曲是否可用
      const checkRes = await checkMusic(id) as any;
      if (!checkRes.musicSuccess && !checkRes?.data?.success) {
        window.$message.destroyAll();
        window.$message.info(message);
        return { success: false };
      }
      // 获取音乐url
      const res = await getMusicUrl(id);
      if (res.data.code === 200) {
        result.url = res.data.data[0].url + '?id=' + id;
      } else {
        window.$message.error('获取歌曲播放地址失败!');
        return { success: false };
      }
      // 获取歌曲歌词
      const lyricRes = await getLyric(id);
      if (res.data.code === 200) {
        result.lyric = lyricRes.data?.lrc?.lyric;
        result.tlyric = lyricRes.data?.tlyric?.lyric;
      } else {
        console.log('获取歌词失败');
      }
      result.isLoading = false;
      window.$message.destroyAll();
      window.$message.success('获取成功');
      data[index] = {
        ...data[index],
        ...result
      };
      return { success: true };
    },
    getNextPlayIndex(index?:number) {
      const currentPlayIndex = index
        ? +index
        : +this.currentPlayIndex;
      // 判断播放模式 如果为随机播放
      if (this.playMode === 'random') {
        return getRandomIntInclusive(
          0, this.playListCount - 1, currentPlayIndex
        );
      } else {
        return getNextIndex(
          currentPlayIndex, this.playListCount - 1
        );
      }
    },
    getPrevPlayIndex(index?:number) {
      const currentPlayIndex = index
        ? +index
        : +this.currentPlayIndex;
      // 判断播放模式 如果为随机播放
      if (this.playMode === 'random') {
        return getRandomIntInclusive(
          0, this.playListCount - 1, currentPlayIndex
        );
      } else {
        return getPrevIndex(
          currentPlayIndex, this.playListCount - 1
        );
      }
    },
    setMySubscribeSongList(list:any[]) {
      this.mySubscribeSongList = list;
      localStorage.mySubscribeSongList = JSON.stringify(list);
    }
  }
});
