<script setup lang="ts">
import { ThumbsUp } from '@vicons/carbon';
export interface CommentListProps{
  list:any[],
  title:string;
  commentTotalNum?:string|number;
}
defineProps<CommentListProps>();
</script>

<template>
  <p v-if="list.length" class="mt-10 text-xl font-bold">
    {{ title }}
    <span v-if="commentTotalNum" class="text-sm">({{ commentTotalNum }})</span>
  </p>
  <div v-for="item in list" :key="item.id" class="flex mt-5">
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
          <n-icon :component="ThumbsUp" />
          <span class="pl-1">{{ item.likedCount }}</span>
        </div>
      </div>
    </div> 
  </div>
</template>

<style scoped>

</style>
