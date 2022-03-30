import { darkTheme } from 'naive-ui';
import { defineStore } from 'pinia';
export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    theme: localStorage.theme || 'light'
  }),
  getters: {
    activeTheme(state) {
      return state.theme === 'dark' ? darkTheme : null;
    },
    isActiveDarkTheme(state) {
      return state.theme === 'dark';
    }
  },
  actions: {
    changeTheme() {
      if (this.theme === 'dark') {
        document.documentElement.classList.remove('dark');
        this.theme = 'light';
        localStorage.theme = 'light';
      } else {
        document.documentElement.classList.add('dark');
        this.theme = 'dark';
        localStorage.theme = 'dark';
      }
    },
    initDocumentTheme() {
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  },
});