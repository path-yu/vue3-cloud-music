import { CONSTANT } from './../assets/js/constant';
import { useMainStore } from '@/stores/main';
import { createI18n, useI18n } from 'vue-i18n';
import messages from './messages';


const i18n = createI18n({
  legacy: false, 
  locale: localStorage.getItem(CONSTANT.LOCALE) || 'zh-cn', // 当前语言
  fallbackLocale: 'en', // 备选语言
  messages,
});

export function useMyI18n() {
  const { t, locale } = useI18n();

  const changeLocale = () => {
    const isEn = locale.value === 'en';
    const localeValue = isEn ? 'zh-cn' : 'en';
    locale.value = localeValue;
    localStorage.setItem(CONSTANT.LOCALE, localeValue);
  };

  return {
    t,
    changeLocale,
  };
}

export default i18n;