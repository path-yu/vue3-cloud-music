
import { darkTheme } from 'naive-ui';
import { defineStore } from 'pinia';
import state from './state';

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
    initPlayList(
      data:any[], index=0
    ) {
      this.playList = data;
      this.currentPlayIndex = index;
      localStorage.playList = JSON.stringify(data);
      this.playMode = 'order';
    }
  }
});
