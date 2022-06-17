<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { ref } from 'vue';
const showModal = ref(false);
const mainStore = useMainStore();
defineExpose({
  show() {
    showModal.value = true;
  }
});
</script>

<template>
  <!-- 回复评论模态框 -->
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    transform-origin="center"
    :show-icon="false"
    :mask-closable="false"
    style="padding:0;width:500px"
  >
    <div class="my-4">
      <div class="flex items-center pb-4 pl-4">
        <div class="bg-gray-200 dark:bg-gray-200/20 add">
          <div class="line" />
          <div class="line" />
        </div>
        <span class="pl-2 cursor-default">新建歌单</span>
      </div>
      <n-scrollbar style="max-height: 300px">
        <div
          v-for="item in mainStore.mySubscribeSongList"
          :key="item.id"
          class="flex items-center py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-200/20 transition-all cursor-pointer"
        >
          <n-image class="w-20 h-20 rounded-lg" :src="item.coverImgUrl" />
          <div class="ml-2">
            <n-ellipsis>
              <p>{{ item.name }}</p>
            </n-ellipsis>
            <p class="pt-2">
              <span class="text-gray-500">{{ item.trackCount }}首，</span>
              <span class="text-gray-500">{{ item.playCount }}次播放</span>
            </p>
          </div>
        </div>
      </n-scrollbar>
    </div>
    <template #header>
      <h4 class="flex-1 my-5 text-center">
        收藏到歌单
      </h4>
    </template>
  </n-modal>
</template>

<style lang="less" scoped>
.add{
  width:30px;
  height:30px;
  display: flex;
  align-items: center;
  padding:10px;
  justify-content: center;
  .line{
    width:1px;
    height:25px;
    background-color: var(--n-icon-color);
  }
  >div:nth-child(2){
    background-color: var(--n-icon-color);
    transform: rotate(90deg);
  }
}
:deep(.n-dialog.n-modal){
  padding:0 !important;
}
</style>
