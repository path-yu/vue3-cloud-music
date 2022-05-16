
import { checkMusic, getLyric, getMusicUrl } from '@/service';
import { getRandomIntInclusive } from '@/utils';
import type { AnyObject } from 'env';
import { darkTheme } from 'naive-ui';
import { defineStore } from 'pinia';
import state, { type playMode } from './state';

// 记录随机播放情况下, 歌曲的上一首和下一首下标
let prevIndex:number|null, nextIndex: number|null;
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
      return this.likeSongs[this.likeSongsIndexMap[id]]
        ? true
        : false;
    },
    // 初始化播放 列表
    async initPlayList(
      data:any[], index=0, playListId:number
    ) {
      this.playList = data;
      // 如果没有获取url, 则获取歌曲url
      if (!this.playList[index].url) {
        await this.setMusicData(
          this.playList[index].id, index
        );
      }
      this.currentPlayIndex = index;
      localStorage.playList = JSON.stringify(data);
      this.currentPlayListId = playListId;
      this.playMode = 'order';
    },
    // 切换播放音乐
    async changePlayIndex(index:number) {
      // 如果没有获取url, 则获取歌曲url
      if (!this.playList[index].url) {
        await this.setMusicData(
          this.playList[index].id, index
        );
      }
      this.currentPlayIndex = index;
      localStorage.currentPlayIndex = index;
    },
    // 切换播放模式
    changePlayMode(mode:playMode) {
      this.playMode = mode;
    },
    // 切换下一首
    async toggleNext() {
      const playListLen = this.playList.length;
      prevIndex = this.currentPlayIndex;
      // 判断播放模式 如果为随机播放
      if (this.playMode === 'random') {
        if (nextIndex) {
          this.currentPlayIndex = nextIndex;
          nextIndex = null;
        } else {
          const randomIndex = getRandomIntInclusive(
            0, playListLen - 1
          );
          if (randomIndex !== this.currentPlayIndex) {
            this.currentPlayIndex = randomIndex;
          } else {
            // 如果当前的随机数重复
            this.currentPlayIndex = randomIndex === playListLen - 1
              ? 0
              : randomIndex + 1;
          }
        }
      } else {
        const index = this.currentPlayIndex === playListLen - 1
          ? 0
          : this.currentPlayIndex + 1;
        this.currentPlayIndex = index;
      }
      const index = this.currentPlayIndex;
      if (!this.playList[index].url) {
        await this.setMusicData(
          this.playList[index].id, index
        );
      }
    },
    // 切换上一首
    async togglePrev() {
      const playListLen = this.playList.length;
      nextIndex = this.currentPlayIndex;
      // 判断播放模式 如果为随机播放
      if (this.playMode === 'random') {
        if (prevIndex) {
          this.currentPlayIndex = prevIndex;
          prevIndex = null;
        } else {
          const randomIndex = getRandomIntInclusive(
            0, playListLen - 1
          );
          if (randomIndex !== this.currentPlayIndex) {
            this.currentPlayIndex = randomIndex;
          } else {
            // 如果当前的随机数重复
            this.currentPlayIndex = randomIndex === 0
              ? playListLen - 1
              : randomIndex - 1;
          }
        }
      } else {
        const index = this.currentPlayIndex === 0
          ? playListLen - 1
          : this.currentPlayIndex - 1;
        this.currentPlayIndex = index;
      }
      const index = this.currentPlayIndex;
      if (!this.playList[index].url) {
        await this.setMusicData(
          this.playList[index].id, index
        );
      }
    },
    async setMusicData(
      id:string, index:number
    ) {
      const result:AnyObject={};
      window.$message.loading(
        '获取歌曲数据中...', { duration: 0 }
      );
      // 检查歌曲是否可用
      const checkRes = await checkMusic(id) as any;
      if (!checkRes.musicSuccess && !checkRes?.data?.success) {
        window.$message.destroyAll();
        window.$message.warning('亲爱的,暂无版权!');
        return;  
      }
      // 获取音乐url
      const res = await getMusicUrl(id);
      if (res.data.code === 200) {
        result.url = res.data.data[0].url;
      } else {
        window.$message.error('获取歌曲播放地址失败!');
      }
      // 获取歌曲歌词
      const lyricRes = await getLyric(id);
      if (res.data.code === 200) {
        result.lyric = lyricRes.data.lrc.lyric;
        result.tlyric = lyricRes.data.tlyric.lyric;
      } else {
        console.log('获取歌词失败');
      }
      window.$message.destroyAll();
      window.$message.success('获取成功');
      this.playList[index] = {
        ...this.playList[index],
        ...result
      };
    }
  }
});
