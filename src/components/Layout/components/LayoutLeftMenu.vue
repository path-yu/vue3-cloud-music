<script setup lang="tsx">
import { registerRouteHook } from '@/router';
import { BackToTop, Music, User } from '@vicons/carbon';
import { List, SparklesOutline, VideocamOutline } from '@vicons/ionicons5';
import type { MenuOption } from 'naive-ui';
import { NIcon, useLoadingBar } from 'naive-ui';
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const menuOptions: MenuOption[] = [
  {
    label: '登录',
    key: 'login',
    icon: () => <NIcon component={User} />
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
let collapsed = ref(false);
let activeKey = ref<string | null>('');
let hiddenLeftMenu = ref(false);
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
registerRouteHook(
  () => {
    loadingBar.start();
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
            <n-back-top right="7vw" :bottom="220" :visibility-height="800">
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
