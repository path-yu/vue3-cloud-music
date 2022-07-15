<script setup lang="ts">
import { ref } from 'vue';
import { useMainStore } from '@/stores/main';
import { sendComment } from '@/service';
const showModal = ref(false);
const commentBtnLoading = ref(false);
const commentContent = ref('');
const props = withDefaults(defineProps<{
  commentPlaceholder?:string;
  title:string;
  resourceId:number;//资源id
  type?:number;//资源类型0: 歌曲 1: mv2: 歌单3: 专辑4: 电台5: 视频6: 动态
  commentId?:number;
  t?:number;//评论类型1: 发送 2: 回复
  updateCommentList:(comment:any)=>void;
}>(), { commentPlaceholder: '请输入评论', title: '评论', type: 1, commentId: 0, t: 2 });

defineExpose({
  show() {
    showModal.value = true;
  }
});
const mainStore = useMainStore();
const handleSubmitCommitClick = () => {
  if (!mainStore.isLogin) {
    return window.$message.error('请先登录!');
  }
  if (!commentContent.value) {
    return window.$message.error('评论不能为空!');
  }
  let params:any = {
    t: props.t,
    type: props.type,
    id: props.resourceId,
    content: commentContent.value
  };
  if (props.commentId) {
    params.commentId = props.commentId;
  }
  commentBtnLoading.value = true;
  return sendComment(params).then(res => {
    if (res.data.code === 200) {
      window.$message.success('评论成功');
      showModal.value = false;
      commentContent.value = '';
      if (res.data.comment.beRepliedUser) {
        res.data.comment.beReplied = [{ user: res.data.comment.beRepliedUser }];
      } else {
        res.data.comment.beReplied = [];
      }
      props.updateCommentList(res.data.comment);
    }
  })
    .finally(() => {
      commentBtnLoading.value = false;
    });
};
</script>

<template>
  <!-- 回复评论模态框 -->
  <teleport to="body">
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      :title="title"
      positive-text="评论"
      transform-origin="center"
      :show-icon="false"
    >
      <div class="my-4 h-32">
        <n-input
          v-model:value="commentContent"
          class="h-full" :placeholder="commentPlaceholder" maxlength="140"
          show-count
          type="textarea"
        />
      </div>
      <template #action>
        <n-button
          :loading="commentBtnLoading"
          :disabled="!commentContent.length" type="primary" size="medium"
          @click="handleSubmitCommitClick"
        >
          评论
        </n-button>
      </template>
      <n-modal />
    </n-modal>
  </teleport>
</template>