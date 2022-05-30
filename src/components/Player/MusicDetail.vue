<script setup lang="ts">
import { ref } from 'vue';
export interface MusicDetailExpose {
  show:() => void;
  close:() => void;
  toggle:() => void;
  active: Ref<boolean>;
}
const active = ref(false);
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
  },
  active
});
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
  height: calc(100vh - 73px);
}
/* 从底部弹出或隐藏过渡 */
.bottom-slide-transform-leave-active{
  transition: height .2s cubic-bezier(0.4, 0, 0.2, 1);
}
.bottom-slide-transform-enter-active {
  transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);;
}
.bottom-slide-transform-enter-from {
   height: 0;
}
.bottom-slide-transform-enter-to {
   height: calc(100vh - 73px);
}
.bottom-slide-transform-leave-to {
   height: 0;
}

</style>
