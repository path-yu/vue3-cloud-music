<script setup lang="ts">
import { likeMusic } from '@/service';
import { useMainStore } from '@/stores/main';
import { HeartOutline, Heart } from '@vicons/ionicons5';
import { useThemeVars } from 'naive-ui';
import { NIcon } from 'naive-ui';
export interface HeartIconExpose{
  triggerLike:() => any;
}
const themeVars = useThemeVars();
const props = withDefaults(defineProps<{
  like:boolean;
  id:number;
  size?:number;
  triggerClick?:boolean;
  likeSuccess?:((like:boolean) => void) | null;
}>(), { size: 20, triggerClick: false, likeSuccess: null });
const mainStore = useMainStore();
const emit = defineEmits(['likeSuccess']);
const triggerLike = () => {
  if (!mainStore.isLogin) {
    return window.$message.error('请先登录');
  }
  let like = props.like
    ? false
    : true;
  return likeMusic(props.id, like).then(res => {
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
    emit('likeSuccess', like);
    props.likeSuccess && props.likeSuccess(like);
    return null;
  });
};
const handleClick = () => {
  if (!props.triggerClick) {
    triggerLike();
  }
};
defineExpose({ triggerLike });

</script>

<template>
  <n-icon
    :size="size"
    :color="like ? themeVars.primaryColor : themeVars.textColor2"
    class="cursor-pointer"
    @click="handleClick"
  >
    <Transition name="scale" mode="out-in">
      <Heart v-if="like" />
      <HeartOutline v-else />
    </Transition>
  </n-icon>
</template>
