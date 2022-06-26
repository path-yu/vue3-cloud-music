import { isEven } from '@/utils';
import { useThemeVars } from 'naive-ui';
import { computed, type CSSProperties } from 'vue';

export default function useThemeStyle(otherStyle?:CSSProperties) {
  const themeVars = useThemeVars();
  const tableStripedStyle = computed(() => {
    return (index:number) => {
      let value:CSSProperties = {
        background: isEven(index)
          ? themeVars.value.tableColorStriped
          : themeVars.value.tableColor
      };
      if (otherStyle) {
        value = { ...value, ...otherStyle };
      }
      return value;
    };
  });
  const tagColor = computed(() => {
    return {
      textColor: themeVars.value.primaryColor,
      borderColor: themeVars.value.primaryColor
    };
  });
  const baseColor = computed(() => {
    return themeVars.value.baseColor;
  });
  const primaryColor = computed(() => {
    return themeVars.value.primaryColor;
  });
  const stripedClass = computed(() => {
    return (index:number) => {
      let classes = '';
      if (isEven(index)) {
        classes = 'bg-white hover:bg-gray-100 dark:bg-black/50 dark:hover:bg-gray-200/10';
      } else {
        classes = 'bg-gray-50 hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-200/10';
      }
      return classes;
    };
  });
  return { tableStripedStyle, themeVars, tagColor, baseColor, primaryColor, stripedClass };
}