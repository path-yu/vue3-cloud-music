<script setup lang="ts">
import { likeMusic } from '@/service';
import { useMainStore } from '@/stores/main';
import { HeartOutline, Heart } from '@vicons/ionicons5';
import { useThemeVars } from 'naive-ui';
import { NIcon } from 'naive-ui';
const themeVars = useThemeVars();
const props = defineProps<{
  like:boolean;
  id:number;
}>();
const mainStore = useMainStore();
const emit = defineEmits(['likeSuccess']);
const handleLikeClick = () => {
  if (!mainStore.isLogin) {
    return window.$message.error('请先登录');
  }
  let like = props.like
    ? false
    : true;
  return likeMusic(
    props.id, like
  ).then(res => {
    if (res.data.code !== 200) {
      return window.$message.error('喜欢音乐失败!');
    }
    if (like) {
      mainStore.addLikeList(props.id);
      window.$message.success('已添加到我喜欢的音乐');
    } else {
      mainStore.removeLikeList(props.id);
      window.$message.success('取消喜欢成功');
    }
    emit(
      'likeSuccess', like
    );
    return null;
  });
};
</script>

<template>
  <NIcon
    size="20"
    :color="like ? themeVars.primaryColor : themeVars.textColor2"
    class="cursor-pointer"
    :component="like ? Heart
      :HeartOutline"
    @click="handleLikeClick"
  />
</template>
