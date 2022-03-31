<script setup lang="ts">
import { h, ref, type Component } from 'vue';
import { NIcon } from 'naive-ui';
import type { MenuOption } from 'naive-ui';
import {
  List, VideocamOutline, SparklesOutline
} from '@vicons/ionicons5';
import { User, Music } from '@vicons/carbon'; 
function renderIcon (icon: Component) {
  return () => h(
    NIcon, null, { default: () => h(icon) }
  );
}
const menuOptions: MenuOption[] = [
  {
    label: '登录',
    key: 'login',
    icon: renderIcon(User),
  },
  {
    label: '推荐歌单',
    key: 'recommend',
    icon: renderIcon(List),
  },
  {
    label: '发现音乐',
    key: 'find',
    icon: renderIcon(SparklesOutline),
  },
  {
    label: '最新音乐',
    key: 'list',
    icon: renderIcon(Music),
  },
  {
    label: '最新MV',
    key: 'mv',
    icon: renderIcon(VideocamOutline),
  }
];
let activeKey = ref<string | null>(null);
let collapsed = ref(false);
</script>
<template>
  <div class="w-56 h-main bg-zinc-200 dark:bg-secondBack ColorDarkOrWhite">
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
