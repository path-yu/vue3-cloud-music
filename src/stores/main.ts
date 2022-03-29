import { defineStore } from 'pinia';

export const useMainStore = defineStore({
  id: 'main',
  state: () => ({
    locale: 'zh-cn',
  }),
  actions: {
    changeLocale(locale:'zh-cn' | 'en') {
      this.locale = locale;
    },
  },
});
