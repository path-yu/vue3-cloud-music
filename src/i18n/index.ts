import { computed } from 'vue';
import { createI18n, useI18n } from 'vue-i18n';
import { CONSTANT } from './../assets/js/constant';
import messages from './messages';


const i18n = createI18n({
  legacy: false, 
  locale: localStorage.getItem(CONSTANT.LOCALE) || 'zh-cn', // 当前语言
  fallbackLocale: 'en', // 备选语言
  messages,
});

export function useMyI18n() {
  const { t, locale } = useI18n();
  const messageTitle = computed(() => locale.value === 'en' ? 'English' :'中文');
  
  const changeLocale = () => {
    const isEn = locale.value === 'en';
    const localeValue = isEn ? 'zh-cn' : 'en';
    locale.value = localeValue;
    localStorage.setItem(CONSTANT.LOCALE, localeValue);
  };

  return {
    t,
    changeLocale,
    messageTitle
  };
}

export default i18n;