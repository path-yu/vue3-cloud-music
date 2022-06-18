<script setup lang="ts">
import { updatePlaylistTracks, createPlaylist } from '@/service/playlist';
import { useMainStore } from '@/stores/main';
import obverser from '@/utils/obverser';
import { ArrowBackIosSharp } from '@vicons/material';
import { computed, ref, watch } from 'vue';
const showModal = ref(false);
const mainStore = useMainStore();
const showCreatePlayList = ref(false);
const isPrivate = ref(false);
const playListTitle = ref('');
const props = defineProps<{
  tracks:number;
}>();
const modalStyle = computed(() => {
  return {
    padding: 0,
    width: '500px',
    height: showCreatePlayList.value
      ? '250px'
      : '450px',
    overflow: 'hidden' 
  };
});
const handleItemClick = (item:any) => {
  if (!mainStore.isLogin) {
    return window.$message.error('请先登录');
  }
  let params:{tracks:number, op:'add'|'del', pid:number} = {
    tracks: props.tracks,
    op: 'add',
    pid: item.id
  };
  return updatePlaylistTracks(params).then((res) => {
    if (res.data?.code === 200) {
      window.$message.success('添加成功');
    } 
  });
};
const handleCreateClick = () => {
  if (!mainStore.isLogin) {
    return window.$message.error('请先登录');
  }
  let params:{name:string, privacy?:string} = { name: playListTitle.value };
  if (isPrivate.value) {
    params.privacy = '10';
  }
  return createPlaylist(params).then((res) => {
    if (res.data?.code === 200) {
      window.$message.success('创建成功');
      showCreatePlayList.value = false;
      playListTitle.value = '';
      mainStore.mySubscribeSongList.push(res.data.playlist);
      obverser.emit(
        'updateMyCreatePlayList', res.data.playlist
      );
    } 
  });
};
defineExpose({
  show() {
    showModal.value = true;
  }
});
watch(
  showModal, (val) => {
    if (!val) {
      setTimeout(
        () => {
          showCreatePlayList.value = false;
        }, 300
      );
    }
  }
);
</script>

<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    transform-origin="center"
    :show-icon="false"
    :mask-closable="false"
    class="transition-all duration-300"
    :style="modalStyle"
  >
    <div class="my-4">
      <transition name="fade" mode="out-in">
        <div v-if="!showCreatePlayList">
          <div class="flex items-center pb-4 pl-4" @click="showCreatePlayList = true">
            <div class="bg-gray-200 dark:bg-gray-200/20 add">
              <div class="line" />
              <div class="line" />
            </div>
            <span class="pl-2 cursor-default">新建歌单</span>
          </div>
          <base-empty v-if="!mainStore.mySubscribeSongList.length" description="您还未创建歌单" />
          <n-scrollbar style="max-height: 300px">
            <div
              v-for="item in mainStore.mySubscribeSongList"
              :key="item.id"
              class="flex items-center py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-200/20 transition-all cursor-pointer"
              @click="handleItemClick(item)"
            >
              <n-image class="w-14 h-14 rounded-lg" :src="item.coverImgUrl" />
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
        <div v-else class="p-4">
          <n-space vertical>
            <n-input v-model:value="playListTitle" placeholder="请输入新歌单标题" />
            <n-checkbox v-model:checked="isPrivate" size="small" label="设置为隐私歌单" />
          </n-space>
          <div class="flex justify-center mt-4">
            <n-button :disabled="!playListTitle" type="primary" @click="handleCreateClick">
              创建
            </n-button>
          </div>
        </div>
      </transition>
    </div>
    <template #header>
      <div class="flex flex-1 items-center">
        <n-icon
          v-if="showCreatePlayList"
          :size="20" class="ml-4 cursor-pointer" :component="ArrowBackIosSharp"
          @click="showCreatePlayList = false"
        />
        <h4 class="flex-1 my-5 text-center">
          {{ showCreatePlayList ? '新建歌单' : '收藏到歌单' }}
        </h4>
      </div>
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
</style>
