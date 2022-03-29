import { useMainStore } from '@/stores/main';
import { createI18n } from 'vue-i18n';
import messages from './messages';


const i18n = createI18n({
  legacy: false, 
  locale: 'zh-cn', // 当前语言
  fallbackLocale: 'en', // 备选语言
  messages,
});

export default i18n;