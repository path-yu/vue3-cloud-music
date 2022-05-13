<script setup lang="ts">
import { userCheckLogin } from '@/hook/useCheckLogin';
import { likeComment, sendComment } from '@/service';
import { useMainStore } from '@/stores/main';
import { ThumbsUp, ThumbsUpFilled } from '@vicons/carbon';
import { CommentOutlined } from '@vicons/material';
import { computed, ref } from 'vue';
export interface CommentListProps{
  list:any[],
  title:string;
  resourceId:number;
  commentTotalNum?:string|number;
}
const props = defineProps<CommentListProps>();
const currentClickedComment = ref<any>();
const mainStore = useMainStore();
const commentBtnLoading = ref(false);
const commentContent = ref('');
const emit = defineEmits(['updateCommentList', 'updateCommentLiked']);
const commentPlaceholder = computed(() => {
  return currentClickedComment.value && '回复: ' + currentClickedComment.value.user.nickname;
});

const showModal = ref(false);

const handleClickComment = (index:number) => {
  userCheckLogin(() => {
    showModal.value = true;
    currentClickedComment.value = props.list[index];
  })
  ;
};
const handleSubmitCommitClick = () => {
  let params = {
    t: 2,
    type: 1,
    id: props.resourceId,
    content: commentContent.value,
    commentId: currentClickedComment.value.commentId
  };
  commentBtnLoading.value = true;
  sendComment(params).then(res => {
    if (res.data.code === 200) {
      window.$message.success('评论成功');
      showModal.value = false;
      commentContent.value = '';
      currentClickedComment.value = null;
      res.data.comment.beReplied = [{ user: res.data.comment.beRepliedUser }];
      emit(
        'updateCommentList', res.data.comment
      );
    }
  })
    .finally(() => {
      commentBtnLoading.value = false;
    });
};
// 点赞
const handleLikedClick = (
  item:any, index:number
) => {
  userCheckLogin(() => {
    let t = item.liked
      ? 0
      : 1;
    let params = {
      type: 1,
      id: props.resourceId,
      t,
      cid: item.commentId
    };
    likeComment(params).then((res) => {
      if (res.data.code === 200) {
        emit(
          'updateCommentLiked', { index, liked: t } 
        );
      }
    });
  });
};
</script>

<template>
  <!-- 回复评论模态框 -->
  <teleport to="body">
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="评论"
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
  <p v-if="list.length" class="mt-10 text-base font-bold">
    {{ title }}
    <span v-if="commentTotalNum" class="text-sm">({{ commentTotalNum }})</span>
  </p>
  <div v-for="(item,index) in list" :key="item.id" class="flex mt-5">
    <n-avatar round :size="50" :src="item.user.avatarUrl" />
    <div class="flex-1 pb-5 ml-4 border-0 border-b border-gray-200 dark:border-gray-200/20 border-solid">
      <div>
        <span class="text-sky-500"> {{ item.user.nickname }}：</span>
        <span>{{ item.content }}</span>
      </div>
      <div v-if="item.beReplied.length" class="p-2 mt-2 bg-stone-100 dark:bg-stone-100/10 rounded-md">
        <span class="text-sky-500">@{{ item.beReplied[0].user.nickname }}：</span>
        <span>{{ item.beReplied[0].content }}</span>
      </div>
      <div class="flex justify-between mt-2 text-xs opacity-60">
        <n-time type="datetime">
          {{ item.time }}
        </n-time>
        <div class="flex items-center">
          <div class="flex items-center mr-4 cursor-pointer" @click="handleLikedClick(item,index)">
            <n-icon :component="item.liked ? ThumbsUpFilled : ThumbsUp" />
            <span class="pl-1">{{ item.likedCount }}</span>
          </div>
          <div class="pl-4 border-gray-300 dark:border-gray-300/50 cursor-pointer flex-items-center border-left" @click="handleClickComment(index)">
            <n-icon :component="CommentOutlined" />
          </div>
        </div>
      </div>
    </div> 
  </div>
</template>

<style scoped>

</style>
