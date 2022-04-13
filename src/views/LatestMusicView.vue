<script setup lang="ts">
import { useAsyncState } from '@vueuse/core';
import { ref, watchEffect } from 'vue';
import { getTopSong } from '../service';

const { state: list } = useAsyncState(
  getTopSong({ type: 0 }).then(res => res.data.data), []
);
const activeTab = ref<'topSong' | 'newAlbum'>('topSong');

watchEffect(() => {
  console.log(activeTab.value);
});
</script>

<template>
  <div class="px-6 pb-10">
    <div class="flex-items-justify-center">
      <n-tabs v-model:value="activeTab" type="segment" class="w-80">
        <n-tab name="topSong" tab="新歌速递" />
        <n-tab name="newAlbum" tab="新碟上架" />
      </n-tabs>
    </div>
    <!-- 新歌速递列表 -->
    <div v-show="activeTab === 'topSong'">
      <div v-for="(item,index) in list" :key="item.id" class="flex">
        <span class="">{{ index < 9 ? '0' + (index + 1) : (index + 1) }}</span>
        <div class="flex">
          43
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-tabs .n-tabs-rail){
  border-radius: 40px;
}
:deep(.n-tabs .n-tabs-rail .n-tabs-tab-wrapper > .n-tabs-tab){
  border-radius: 40px;
}
</style>
