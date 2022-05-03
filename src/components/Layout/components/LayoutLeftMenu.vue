<script setup lang="tsx">
import { registerRouteHook } from '@/router';
import { useMainStore } from '@/stores/main';
import { BackToTop, Music, User } from '@vicons/carbon';
import { List, SparklesOutline, VideocamOutline } from '@vicons/ionicons5';
import type { MenuOption } from 'naive-ui';
import { NIcon, useLoadingBar } from 'naive-ui';
import { onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import LoginModal, { type LoginModalExpose } from './LoginModal.vue';

const menuOptions: MenuOption[] = [
  {
    label: () => (
      mainStore.isLogin
        ? <div class="flex items-center"> 
          <p >我创建的歌单</p>
        </div>
        : <div class="flex items-center" onClick={handleOpenLoginModalClick}> 
          <p >未登录</p>
        </div>
    ),
    key: 'login',
    icon: () => <NIcon class="mr-2" size={20} component={User} />
  },
  {
    label: () => <RouterLink to='/discovery'>发现音乐</RouterLink>,
    key: '/discovery',
    icon: () => <NIcon component={SparklesOutline} />
  },
  {
    label: () => <RouterLink to='/songList'>推荐歌单</RouterLink>,
    key: '/songList',
    icon: () => <NIcon component={List} />
  },
  {
    label: () => <RouterLink to='/latestMusic'>最新音乐</RouterLink>,
    key: '/latestMusic',
    icon: () => <NIcon component={Music} />
  },
  {
    label: () => <RouterLink to='/latestMv'>最新MV</RouterLink>,
    key: '/latestMv',
    icon: () => <NIcon component={VideocamOutline} />
  }
];

const route = useRoute();
const loadingBar = useLoadingBar();
const mainStore = useMainStore();

let collapsed = ref(false);
let scrollContainer:HTMLElement|null;
let activeKey = ref<string | null>('');
let hiddenLeftMenu = ref(false);
const loginModalRef = ref<LoginModalExpose>();

const handleOpenLoginModalClick = () => {
  loginModalRef.value?.show();
};

watch(
  () => route.path, (newVal) => {
    activeKey.value = newVal;
    if (route.meta.hidden) {
      hiddenLeftMenu.value = true;
    } else {
      hiddenLeftMenu.value = false;
    }
  }
);
onMounted(() => {
  scrollContainer = document.querySelector('.rightMain>.n-layout-scroll-container');
});
registerRouteHook(
  (to) => {
    scrollContainer?.scrollTo({
      behavior: 'smooth',
      top: 0
    });
    if (to.meta.auth && !mainStore.isLogin) {
      window.$message.error('请先登录');
      return false;
    } else {
      loadingBar.start();
      return true;
    }
  
  }, () => {
    loadingBar.finish();
  }
);

</script>
<template>
  <n-layout
    has-sider
  >
    <n-layout-sider
      v-show="!hiddenLeftMenu"
      bordered
      collapse-mode="width"
      class="h-main"
      :collapsed-width="64"
      :width="192"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <n-menu
        v-model:value="activeKey"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
      />
    </n-layout-sider>
    <n-layout class="h-main rightMain">
      <router-view v-slot="{ Component }">
        <transition
          name="fade-transform"
          mode="out-in"
        >
          <div>
            <login-modal ref="loginModalRef" />
            <n-back-top :right="mainStore.backTopLeft" :bottom="220" :visibility-height="800">
              <n-icon :component="BackToTop" />
            </n-back-top>
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </n-layout>
  </n-layout>
</template>

<style lang="less" scoped>
.n-layout-sider {
  transition: color 0.3s var(--n-bezier), border-color 0.3s var(--n-bezier),
    min-width 0.3s var(--n-bezier), max-width 0.3s var(--n-bezier) ,width 0.3s var(--n-bezier),
    transform 0.3s var(--n-bezier), background-color 0.3s var(--n-bezier);
}
</style>
