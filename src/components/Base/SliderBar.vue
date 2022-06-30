<script setup lang="ts">
import { useElementHover } from '@vueuse/core';
import { throttle } from 'lodash';
import { useThemeVars } from 'naive-ui';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
const props = withDefaults(
  defineProps<{
  modelValue:number;  
  loadValue?:number;
  width?:number;
  height?:number;
}>(), { width: 500, height: 4, loadValue: 0 }
);
let isTargetClick = ref(false);
let startWidth = props.width * (props.modelValue / 100);
const mousePosition = { y: 0, x: 0 };// 鼠标坐标 
const moveDiff = { x: 0, y: 0 };// 移动距离
const themeVars = useThemeVars();
const target = ref();
const isHover = useElementHover(target);
const emit = defineEmits(['update:modelValue']);
const progressWidth = computed(() => {
  return props.width * (props.modelValue / 100);
});
const calcPercentage = (value:number) => {
  return Math.round((value / props.width) * 100);
};
const handleSliderClick = (e:MouseEvent) => {
  let target = e.target as HTMLElement;
  if (target.classList.contains('dot') && isTargetClick) return;
  if (isTargetClick.value) return;
  let { offsetX } = e;
  let percentage = calcPercentage(offsetX);
  emit(
    'update:modelValue', percentage
  );
};
// 在小圆点下按下鼠标
const handleDotMouseDown = (e:MouseEvent) => {
  isTargetClick.value = true;
  mousePosition.x = e.clientX;
  moveDiff.x = 0;
};
// 移动鼠标
const handleMouseMove = (e:MouseEvent) => {
  if (!isTargetClick.value) return;
  moveDiff.x += e.clientX - mousePosition.x;
  if (moveDiff.x > 0) {
    moveDiff.x = Math.min(
      props.width, moveDiff.x
    );
  } else {
    moveDiff.x = Math.max(
      -props.width, moveDiff.x
    );
  }
  let value;
  if (e.clientX > mousePosition.x) {
    value = calcPercentage(startWidth + moveDiff.x);
  } else {
    value = calcPercentage(startWidth + moveDiff.x);
  }
  if (value >= 0 && value <= 100) {
    emit(
      'update:modelValue', value
    );
  }
 
  mousePosition.x = e.clientX;
};
// 鼠标抬起
const handleMouseUp = (e:MouseEvent) => {
  if (!isTargetClick.value) return;
  setTimeout(() => {
    isTargetClick.value = false;
  });
  startWidth = getProgressWidth();
};
const getProgressWidth = () => props.width * (props.modelValue / 100);
onMounted(() => {
  document.body.addEventListener(
    'mousemove', handleMouseMove, false
  );
  document.body.addEventListener(
    'mouseup', handleMouseUp, false
  );
});
onUnmounted(() => {
  document.body.removeEventListener(
    'mousemove', handleMouseMove
  );
  document.body.removeEventListener(
    'mouseup', handleMouseUp
  );
});

</script>

<template>
  <div
    ref="target" class="group py-1 no-select" @click="handleSliderClick"
  >
    <div

      :style="{width:width+'px',height:height+'px',transform:`scaleY(${isTargetClick || isHover ? '1.5' : '1'})`}"
      class="relative bg-gray-200 dark:bg-gray-200/50 rounded-md transition-transform"
    >
      <!-- 加载进度条 -->
      <div class="absolute top-0 h-full bg-gray-300 dark:bg-gray-300/50 rounded-md transition-transform" :style="{width:'20%'}" />
      <!-- 播放进度条 -->
      <div class="absolute top-0 h-full rounded-md transition-transform" :style="{background:themeVars.primaryColor, width:modelValue+'%'}" />
      <!-- 小圆点 -->
      <div
        v-show="isHover || isTargetClick" class="dot" :style="{'background-color': themeVars.primaryColor,left:modelValue+'%'}"
        @mousedown="handleDotMouseDown"
      />
      <div />
    </div>
  </div>
</template>

<style scoped>
.dot{
  position:absolute;
  width:8px;
  height:8px;
  border-radius: 50%;
  top:-2px;
  transform: scaleX(1.5);
  cursor: pointer;
}
</style>
