<script setup lang="ts">
import { formateSongsAuthor } from '@/utils';
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
      <n-space vertical :size="15">
        <div v-for="(item,index) in list" :key="item.id" class="flex items-center">
          <span class="text-sm opacity-80">{{ index < 9 ? '0' + (index + 1) : (index + 1) }}</span>
          <div class="relative ml-4 w-16 h-16">
            <load-img
              loading-height="64px"
              class-name="w-16 h-16 rounded-md"
              :src="item.album.picUrl"
              :show-message="false"
            />
            <play-icon
              :size="15"
              class="cursor-pointer position-center"
              style="opacity: 1;width: 25px;height: 25px;"
            />
          </div>
          <n-grid
            class="flex flex-1 justify-between items-center" :x-gap="12" :y-gap="8"
            :cols="4"
          >
            <n-grid-item>
              <p class="flex-1 pl-4 text-left">
                <n-ellipsis> {{ item.name }}</n-ellipsis>
              </p>
            </n-grid-item>
            <n-grid-item>
              <p class="flex-1 text-left-opacity-50">
                <n-ellipsis> {{ formateSongsAuthor(item.artists) }}</n-ellipsis>
              </p>
            </n-grid-item>
            <n-grid-item>
              <p class="flex-1 text-left-opacity-50">
                <n-ellipsis> {{ item.album.name }}</n-ellipsis>
              </p>
            </n-grid-item>
            <n-grid-item class="text-right">
              <n-time
                class="pl-4 mr-2  opacity-50"
                :time="item.bMusic.playTime"
                format="mm:ss"
              />
            </n-grid-item>
          </n-grid>
        </div>
      </n-space>
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
.text-left-opacity-50{
  @apply pl-4 text-left opacity-50;
}
</style>
