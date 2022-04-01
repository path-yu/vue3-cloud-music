<script setup lang="tsx">
import { useMyI18n } from '@/i18n';
import { Music, User } from '@vicons/carbon';
import { List, SparklesOutline, VideocamOutline } from '@vicons/ionicons5';
import type { MenuOption } from 'naive-ui';
import { NIcon, useThemeVars } from 'naive-ui';
import { h, ref, watch, type VNode, type VNodeChild } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import useCursorMoveResize from '../hook/useCursorMoveResize';
import { RouterView } from 'vue-router';

const menuOptions: MenuOption[] = [
  {
    label: '登录',
    key: 'login',
    icon: () => <NIcon component={User} />
  },
  {
    label: () => <RouterLink to='songList'>{t('recommendSongsList')}</RouterLink>,
    key: '/songList',
    icon: () => <NIcon component={List} />
  },
  {
    label: () => <RouterLink to='discovery'>{t('discovrMusic')}</RouterLink>,
    key: '/discovery',
    icon: () => <NIcon component={SparklesOutline} />
  },
  {
    label: () => <RouterLink to='latestMusic'>{t('latestMusic')}</RouterLink>,
    key: '/latestMusic',
    icon: () => <NIcon component={Music} />
  },
  {
    label: () => <RouterLink to='latestMv'>{t('latestMv')}</RouterLink>,
    key: '/latestMv',
    icon: () => <NIcon component={VideocamOutline} />
  }
];

const { t, isZhCn } = useMyI18n();
const route = useRoute();
let themeVars = useThemeVars();
let primaryColor = themeVars.value.primaryColor;

const menuRef = ref<HTMLElement | null>(null);
const {
  showResizeBar, handleMouseEnter, 
  handleMouseLeave, handleMouseDown,
  collapsed,
} = useCursorMoveResize(menuRef, 20);
let activeKey = ref<string | null>('');

watch(() => route.path, (newVal) => {
  activeKey.value = newVal;
});
</script>
<template>
  <n-layout
    has-sider
    class="bg-second-main"
    :class="[ 'h-main', 'transition',]"
  >
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="isZhCn ? 192 : 288"
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
    <n-layout>
      <router-view v-slot="{ Component }">
        <transition
          name="fade-transform"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </n-layout>
  </n-layout>
  <!-- <div
      :style="{backgroundColor:showResizeBar ? primaryColor : ''}"
      :class="['w-1', ' h-main', 'cursor-ew-resize', 'bg-main']"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousedown="handleMouseDown"
    /> -->
</template>

<style lang="less" scoped>
</style>
