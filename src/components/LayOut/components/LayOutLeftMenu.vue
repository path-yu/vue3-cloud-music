<script setup lang="tsx">
import { useMyI18n } from '@/i18n';
import { Music, User } from '@vicons/carbon';
import { List, SparklesOutline, VideocamOutline } from '@vicons/ionicons5';
import type { MenuOption } from 'naive-ui';
import { NIcon } from 'naive-ui';
import { h, ref, type Component } from 'vue';
import { RouterLink } from 'vue-router';
const { t, isZhCn } = useMyI18n();
const menuOptions: MenuOption[] = [
  {
    label: '登录',
    key: 'login',
    icon: renderIcon(User),
  },
  {
    label: () => <RouterLink to='songList'>{t('recommendSongsList')}</RouterLink>,
    key: 'songList',
    icon: renderIcon(List),
  },
  {
    label: () => <RouterLink to='discovery'>{t('discovrMusic')}</RouterLink>,
    key: 'discovery',
    icon: renderIcon(SparklesOutline),
  },
  {
    label: () => <RouterLink to='latestMusic'>{t('latestMusic')}</RouterLink>,
    key: 'latestMusic',
    icon: renderIcon(Music),
  },
  {
    label: () => <RouterLink to='latestMv'>{t('latestMv')}</RouterLink>,
    key: 'latestMv',
    icon: renderIcon(VideocamOutline),
  }
];
function renderIcon(icon: Component) {
  return () => h(
    NIcon, null, { default: () => h(icon) }
  );
}
let activeKey = ref<string | null>('');
let collapsed = ref(false);
</script>
<template>
  <div
    :class="[
      'pr-2',
      'h-main',
      'bg-second-main',
      'transition-width',
      isZhCn ? 'w-48' : 'w-72',
    ]"
  >
    <n-menu
      v-model:value="activeKey"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
    />
  </div>
</template>

<style lang="less" scoped>
</style>
