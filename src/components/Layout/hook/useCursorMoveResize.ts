import { ref, type Ref, onMounted, onUnmounted, nextTick } from 'vue';

/**
 * @param  {Ref<HTMLElement>} target 目标元素
 * @param  {number} threshold 触发阈值
 * @description 鼠标在元素上移动缩放目标元素
 */
export default function useCursorMoveResize(target:Ref<HTMLElement | null>, threshold:number) {
  let isHovered = false; //鼠标是否在元素上
  let isClick = false;// 鼠标是否在元素上点击
  const moveDiff = { x: 0, y: 0 };
  const mousePosition = { y: 0, x: 0 };// 鼠标坐标 
  let timer: NodeJS.Timeout;
  const showResizeBar = ref(false); // 是否显示缩放条
  const collapsed = ref(false);// 是否收起 
  let triggerTargetEl: HTMLElement | null = null;
  const rawWidth = 0;
  const handleMouseEnter = () => {
    isHovered = true;
    clearTimeout(timer);
    // 鼠标进入后 开启定时器,判断1.5s 后鼠标是否离开
    timer = setTimeout(() => {
      if (isHovered) {
        showResizeBar.value = true;
      }
    }, 500);
  };
  
  // 鼠标离开
  const handleMouseLeave = () => {
    if (isClick) {
      isHovered = true;
      showResizeBar.value = true;
    } else {
      clearTimeout(timer);
      isHovered = false;
      showResizeBar.value = false;
    }
    
  };
  // 鼠标按下
  const handleMouseDown = (e:MouseEvent) => {
    isClick = true;
    mousePosition.x = e.clientX;
    triggerTargetEl = e.target as HTMLElement;
    target.value!.setAttribute('data-rawWidth', target.value!.offsetWidth.toString());
  };
  // 鼠标抬起
  const handleMouseUp = (e:MouseEvent) => {
    if (!isClick) return;
    isHovered = false;
    showResizeBar.value = false;
    isClick = false;
  };
  //鼠标移动
  const handleMouseMove = (e:MouseEvent) => {
    if (!isClick) return;
    moveDiff.x += e.clientX - mousePosition.x;
    moveDom();
    mousePosition.x = e.clientX;
  };
  const moveDom = async () => {
    // 展开状态只能左滑, 即收起
    if (!collapsed.value && moveDiff.x < 0) {
      await nextTick();
      target.value!.style.width = (target.value!.offsetWidth + moveDiff.x) + 'px';
      if (Math.abs(moveDiff.x) > threshold) {
        collapsed.value = true;
        target.value!.style.width = '100%';
      }
    }
    //展开
    if (collapsed.value && moveDiff.x < 0) {
      // if (Math.abs(moveDiff.x) > threshold) {
      //   target.value!.style.width = (target.value!.clientWidth + moveDiff.x) + 'px';
      //   collapsed.value = true;
      // }
    }
  };
  onMounted(() => {
    document.body.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseup', handleMouseUp);
  });
  onUnmounted(() => {
    document.body.removeEventListener('mousemove', handleMouseMove);
    document.body.removeEventListener('mouseup', handleMouseUp);
  });
  return {
    isClick,
    collapsed,
    showResizeBar,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown
  };
}