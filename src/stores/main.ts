
import { darkTheme, useThemeVars } from 'naive-ui';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
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
    }
  }
});
export function usePrimaryColor() {
  const store = useMainStore();
  const themeVars = useThemeVars();
  const primaryColor = ref(themeVars.value.primaryColor);

  watch(() => store.theme, () => {
    primaryColor.value = themeVars.value.primaryColor;
  });
  return {
    primaryColor
  };
}