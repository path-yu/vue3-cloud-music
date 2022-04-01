<script setup lang="tsx">
import { useMyI18n } from '@/i18n';
import { Music, User } from '@vicons/carbon';
import { List, SparklesOutline, VideocamOutline } from '@vicons/ionicons5';
import type { MenuOption } from 'naive-ui';
import { NIcon, useThemeVars } from 'naive-ui';
import { h, ref, watch, type Component } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import useCursorMoveResize from '../hook/useCursorMoveResize';

const menuOptions: MenuOption[] = [
  {
    label: '登录',
    key: 'login',
    icon: renderIcon(User),
  },
  {
    label: () => <RouterLink to='songList'>{t('recommendSongsList')}</RouterLink>,
    key: '/songList',
    icon: renderIcon(List),
  },
  {
    label: () => <RouterLink to='discovery'>{t('discovrMusic')}</RouterLink>,
    key: '/discovery',
    icon: renderIcon(SparklesOutline),
  },
  {
    label: () => <RouterLink to='latestMusic'>{t('latestMusic')}</RouterLink>,
    key: '/latestMusic',
    icon: renderIcon(Music),
  },
  {
    label: () => <RouterLink to='latestMv'>{t('latestMv')}</RouterLink>,
    key: '/latestMv',
    icon: renderIcon(VideocamOutline),
  }
];
function renderIcon(icon: Component) {
  return () => h(
    NIcon, null, { default: () => h(icon) }
  );
}
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
  <div :class="['flex',showResizeBar && 'no-select']">
    <div
      class="bg-second-main"
    >
      <n-layout
        has-sider
        :class="[
          'h-main',
          'transition-width',
          isZhCn ? 'w-50' : 'w-74',
        ]"
        :style="{width: collapsed ? '80px' : ''}"
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
      </n-layout>
    </div>
    <!-- <div
      :style="{backgroundColor:showResizeBar ? primaryColor : ''}"
      :class="['w-1', ' h-main', 'cursor-ew-resize', 'bg-main']"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousedown="handleMouseDown"
    /> -->
  </div>
</template>

<style lang="less" scoped>
</style>
