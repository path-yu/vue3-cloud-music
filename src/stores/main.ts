/* eslint-disable consistent-return */
import { checkMusic, getLyric, getMusicUrl } from '@/service';
import { formateSongsAuthor, getNextIndex, getPrevIndex, getRandomIntInclusive } from '@/utils';
import type { AnyObject } from 'env';
import { cloneDeep, shuffle } from 'lodash';
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
      state.likeSongs.forEach((item:number, index:number) => {
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
    toggleTheme() {
      const theme = this.theme ==='dark'
        ? 'light'
        :'dark';
      this.changeTheme(theme);
    },
    changeTheme(theme:'dark' | 'light') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = '';
      }
      // 设置网页的配色方案为dark 
      this.theme = theme;
      localStorage.theme = theme;
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
      return data.map((item, index) => {
        if (this.likeSongs) {
          const hasLike = this.hasLikeSong(item.id);
          item.like = hasLike;
        } else {
          item.like = false;
        }
        item.formatAuthor = formateSongsAuthor(item.ar);
        item.key = index;
        return item;
      });
    },
    // 初始化播放 列表
    async initPlayList(
      data:any[], index=0, playListId:string, message='亲爱的, 暂无版权'
    ) {
      // 如果没有获取url, 则获取歌曲url
      if (!data[index].url) {
        const res = await this.setMusicData({ data, id: data[index].id, index: index });
        if (!res.success) return;
      }
      this.playList = data;
      this.initPlayListPrevAndNextIndex();
     
      localStorage.rawPlayList = JSON.stringify(cloneDeep(this.playList));
      this.currentPlayIndex = index;
      this.playListIdList = [playListId];
      this.currentPlayListId = playListId;
      localStorage.currentPlayIndex = index;
      localStorage.playListIdList = JSON.stringify(this.playListIdList);
      localStorage.playList = JSON.stringify(data);
      localStorage.currentPlayListId = playListId;
      if (this.playMode === 'random') {
        this.shufflePlayList();
      }
      this.changePlaying(true);
    },
    resetPlayList() {
      this.playList = [];
      this.playListIdList = [];
      this.currentPlayIndex = 0;
      localStorage.currentPlayIndex = 0;
      localStorage.playList = JSON.stringify(this.playList);
      localStorage.playListIdList = JSON.stringify(this.playList);
      localStorage.currentPlayListId = '';
      this.currentPlayListId = '';
      this.playMode = 'order';
    },
    addPlaylist(list:any[], id:string) {
      this.playList = [...this.playList, ...list];
      this.playListIdList.push(id);
      localStorage.playList = JSON.stringify(this.playList);
    },
    // 切换播放音乐
    async changePlayIndex(index:number, message='亲爱的, 暂无版权') {
      // 如果没有获取url, 则获取歌曲url
      if (!this.playList[index].url) {
        const res = await this.setMusicData({ data: this.playList, id: this.playList[index].id, index, message });
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
      if (mode === 'random') {
        this.shufflePlayList();
      } else {
        const currentPlaySong = cloneDeep(this.currentPlaySong);
        const rawPlayList = JSON.parse(localStorage.rawPlayList) as any[];
        const newCurrentPlayIndex = rawPlayList.findIndex(item => item.id === currentPlaySong.id);
        rawPlayList[newCurrentPlayIndex] = currentPlaySong;
        this.playList = rawPlayList;
        this.initPlayListPrevAndNextIndex();
        this.currentPlayIndex = newCurrentPlayIndex;
        localStorage.currentPlayIndex = this.currentPlayIndex;
        localStorage.playList = JSON.stringify(rawPlayList);
      }
    },
    // 切换播放状态
    changePlaying(playing:boolean) {
      this.playing = playing;
    },
    // 切换下一首
    async toggleNext(index?:number) {
      const resultIndex = this.getNextPlayIndex(index);
      if (!this.playList[resultIndex].url) {
        const res = await this.setMusicData({ data: this.playList, id: this.playList[resultIndex].id, index: resultIndex });
        // 如果获取失败说明无版权,则获取下一首
        if (!res.success) {
          const nextIndex = getNextIndex(this.currentPlayIndex, this.playListCount - 1);
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
        const res = await this.setMusicData({ data: this.playList, id: this.playList[resultIndex].id, index: resultIndex });
        if (!res.success) {
          const prevIndex = getPrevIndex(this.currentPlayIndex, this.playListCount - 1);
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
      const index = this.playList.findIndex(item => item.id === value.id);
      value.like = this.hasLikeSong(value.id);
      // 未添加则插入
      if (index === -1) {
        this.playList.splice(
          this.currentPlayIndex+1, 0, value
        );
        const insertIndex = this.playList.findIndex((item:any) => item.id === value.id);
        localStorage.playList = JSON.stringify(this.playList);
        this.changePlayIndex(insertIndex);
      } else {
        this.changePlayIndex(index);
      }
    },
    updatePlayListLike(like:boolean, index?:number) {
      const resultIndex = index
        ? index
        : this.currentPlayIndex;
      this.playList[resultIndex].like = like;
      localStorage.playList = JSON.stringify(this.playList);
    },
    async setMusicData(options:{
      data:any[], id:string, index:number, message?:string;
      showMessage?:boolean;
     }):Promise<any> {
      const { data, id, index, message='亲爱的,暂无版权!为你自动跳过此首歌曲', showMessage=true } = options;
      const result:AnyObject={};
      showMessage && window.$message.loading('获取歌曲数据中...', { duration: 0 });
      try {
        // 检查歌曲是否可用
        const checkRes = await checkMusic(id) as any;
        if (!checkRes.musicSuccess && !checkRes?.data?.success) {
          window.$message.destroyAll();
          showMessage && window.$message.info(message);
          return { success: false };
        }
      } catch (error) {
        window.$message.destroyAll();
        showMessage && window.$message.info('亲爱的,暂无版权');
        return { success: false };
      }
      // 获取音乐url
      const res = await getMusicUrl(id);
      if (res.data.code === 200) {
        result.url = res.data.data[0].url + '?id=' + id;
      } else {
        showMessage && window.$message.error('获取歌曲播放地址失败!');
        return { success: false };
      }
      // 获取歌曲歌词
      const lyricRes = await getLyric(id);
      if (res.data.code === 200) {
        result.lyric = lyricRes.data?.lrc?.lyric;
        if (result.lyric.includes('纯音乐，请欣赏') || !result.lyric) {
          result.isNotLyric = true;
        } else {
          result.isNotLyric = false;
        }
        result.tlyric = lyricRes.data?.tlyric?.lyric;
      } else {
        console.log('获取歌词失败');
      }
      result.isLoading = false;
      window.$message.destroyAll();
      showMessage && window.$message.success('获取成功');
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
      return this.playList[currentPlayIndex].nextIndex;
    },
    getPrevPlayIndex(index?:number) {
      const currentPlayIndex = index
        ? +index
        : +this.currentPlayIndex;
      return this.playList[currentPlayIndex].prevIndex;
    },
    setMySubscribeSongList(list:any[]) {
      this.mySubscribeSongList = list;
      localStorage.mySubscribeSongList = JSON.stringify(list);
    },
    addSearchHistory(value:string) {
      if (this.searchHistory.includes(value)) {
        return;
      }
      this.searchHistory.push(value);
      localStorage.searchHistory = JSON.stringify(this.searchHistory);
    },
    removeSearchHistory(index:number) {
      this.searchHistory.splice(index, 1);
      localStorage.searchHistory = JSON.stringify(this.searchHistory);
    },
    clearSearchHistory() {
      this.searchHistory = [];
      localStorage.searchHistory = JSON.stringify([]);
    },
    setShowMusicDetail(value:boolean) {
      this.showMusicDetail = value;
    },
    toggleShowMusicDetail() {
      this.showMusicDetail = !this.showMusicDetail;
    },
    initPlayListPrevAndNextIndex() {
      const max = this.playListCount-1;
      this.playList.forEach((item, index) => {
        const nextIndex = getNextIndex(index, max);
        const prevIndex = getPrevIndex(index, max);
        item.nextIndex = nextIndex;
        item.prevIndex = prevIndex;
      });
    },
    shufflePlayList() {
      const currentPlaySong = cloneDeep(this.currentPlaySong);
      const shufflePlayList = shuffle(cloneDeep(this.playList));
      const newCurrentPlayIndex = shufflePlayList.findIndex(item => item.id === currentPlaySong.id);
      shufflePlayList.splice(newCurrentPlayIndex, 1);
      shufflePlayList.unshift(currentPlaySong);
      this.playList = shufflePlayList;
      this.initPlayListPrevAndNextIndex();
      this.currentPlayIndex = 0;
      localStorage.currentPlayIndex = 0;
      localStorage.playList = JSON.stringify(shufflePlayList);
    }
  }
});