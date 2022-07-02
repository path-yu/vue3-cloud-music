import { useMainStore } from '@/stores/main';
import { getPixelColor } from '@/utils/getPixelColor';
import obverser from '@/utils/obverser';
import { nextTick, watch, type CSSProperties } from 'vue';

export function useBlurLineGradient() {
  let lyricFooterMaskELement:HTMLElement;
  let lyricTopMaskElement:HTMLElement;
  const mainStore = useMainStore();
  let footerMaskStyle:CSSProperties;
  let topMaskStyle:CSSProperties;
  const eleHeight = 50;
  const updateFooterMaskColor = async (context:CanvasRenderingContext2D) => {
    await nextTick();
    if (!lyricFooterMaskELement) {
      lyricFooterMaskELement = document.querySelector('.footer-mask') as HTMLElement;
    }
    if (!lyricTopMaskElement) {
      lyricTopMaskElement = document.querySelector('.top-mask') as HTMLElement;
    }
    // dom 还未在页面显示 可能为0
    const { top: FooterEleTop } = lyricFooterMaskELement.getBoundingClientRect();
    const { top: topEleTop } = lyricTopMaskElement.getBoundingClientRect(); 
    let { rgb: footerRgb } = getPixelColor(
      context, 0, FooterEleTop+eleHeight
    );
    let { rgb: topRgb } = getPixelColor(
      context, 0, topEleTop + 25
    );
    if (topRgb === 'rgb(0, 0, 0)'||footerRgb === 'rgb(0, 0, 0)') {
      topRgb = 'transparent';
      footerRgb = 'transparent';
    }
    if (FooterEleTop && topEleTop) {
      footerMaskStyle = { background: `linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, ${footerRgb} 80%)` };
      topMaskStyle = { background: `linear-gradient(${topRgb} , rgba(255, 255, 255, 0)` };
    } else {
      resetBackground();
    }
    obverser.emit(
      'updateLyricMaskStyle', { footerMaskStyle, topMaskStyle }
    );
  };
  const resetBackground = () => {
    footerMaskStyle = { background: 'transparent' };
    topMaskStyle = { background: 'transparent' };
  };
  const initBackground = () => {
    resetBackground();
    obverser.emit(
      'updateLyricMaskStyle', { footerMaskStyle, topMaskStyle }
    );
  };
  watch(
    () => mainStore.theme, () => {
      initBackground();
      obverser.emit(
        'updateLyricMaskStyle', { footerMaskStyle, topMaskStyle }
      );
    }
  );

  return { updateFooterMaskColor, initBackground };
}