import { throttle } from '@/utils';
import { nextTick, onMounted, onUnmounted, onUpdated, type Ref } from 'vue';

export function useMemoryScrollTop(ref:Ref<HTMLElement> | string) {
  let targetEle : HTMLElement | null | Window = null;
  let setScrollTopLock = false;
  // 设置滚动位置
  const setScrollPosition = (key:string) => {
    setScrollTopLock = true;
    const scrollTop = sessionStorage.getItem(key);
    
    if (scrollTop) {
      const options:ScrollToOptions = {
        behavior: 'smooth',
        top: +scrollTop
      };
      if (targetEle instanceof Window) {
        document.documentElement.scrollTo(options);
        document.body.scrollTo(options);
        setScrollTopLock = false;
      } else {
        nextTick(() => {
          targetEle!.scrollTo(options);
          setScrollTopLock = false;
        });
      }
    }
  };
  const handleListenScroll = () => {
    if (setScrollTopLock) return;
    
    let scrollTop;
    // 是否为window
    if (targetEle instanceof Window) {
      scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    } else {
      scrollTop = targetEle!.scrollTop;
    }
    
    sessionStorage.setItem('scrollTop', scrollTop!.toString());

  };
  const throttleFn = throttle(handleListenScroll, 500);
  
  onMounted(() => {
    if (!ref) {
      targetEle = window;
      return;
    }
    if (typeof ref === 'string') {
      const dom = document.querySelector(ref);
      targetEle = (dom
        ? dom
        : window) as HTMLElement | Window;
    } else {
      if (ref?.value) {
        targetEle = ref.value;
      } else {
        targetEle = window;
      }
    }
    targetEle.addEventListener('scroll', throttleFn);
    setScrollPosition('scrollTop');
  });
  onUnmounted(() => {
    targetEle!.removeEventListener('scroll', throttleFn);
    sessionStorage.setItem('scrollTop', '0');
    targetEle!.scrollTo({ top: 0 });
  });

  onUpdated(() => {
    setScrollPosition('scrollTop');
  });
}