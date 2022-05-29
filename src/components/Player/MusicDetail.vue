<script setup lang="ts">
import { ref } from 'vue';
export interface MusicDetailExpose {
  show:() => void;
  close:() => void;
  toggle:() => void;
}


defineExpose({
  show() {
    active.value = true;
  },
  close() {
    active.value = false;
  },
  toggle() {
    if (active.value) {
      active.value = false;
    } else {
      active.value = true;
    }
  }
  
});
const active = ref(false);
</script>

<template>
  <transition name="bottom-slide-transform">
    <div v-show="active" class="fixed inset-x-0 z-20 m-auto bg-slate-200 music-detail">
      音乐详情
    </div>
  </transition>
</template>

<style scoped>
.music-detail{
  bottom:73px;
  width: 85vw;
  height:calc(100vh - 73px);
  transform: translateY(0);
}
/* 从底部弹出或隐藏过渡 */
.bottom-slide-transform-leave-active{
  transition: transform .2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.bottom-slide-transform-enter-active {
  transition: transform .4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.bottom-slide-transform-enter-from {
   transform: translateY(100vh);
}
.bottom-slide-transform-enter-to {
   transform: translateY(0);
}
.bottom-slide-transform-leave-to {
  transform: translateY(100vh);
}

</style>
