<script setup lang="tsx">
import { formateSongsAuthor } from '@/utils';
import { useAsyncState } from '@vueuse/core';
import type { DataTableColumns } from 'naive-ui';
import { h, ref, watchEffect } from 'vue';
import { getTopSong } from '../service';
const { state: list } = useAsyncState(
  getTopSong({ type: 0 }).then(res => res.data.data), []
);
const activeTab = ref<'topSong' | 'newAlbum'>('topSong');

watchEffect(() => {
  console.log(activeTab.value);
});
type Song = {
  no: number
  title: string
  length: string
}

const createColumns = (): DataTableColumns => {
  return [
    {
      key: 'order',
      render: (
        row: any, rowIndex: number
      ) => {
        return (
          <div class="flex items-center">
            {<span class="text-sm opacity-80">{rowIndex < 9
              ? '0' + (rowIndex + 1)
              : (rowIndex + 1)}</span>}
            <div class="relative ml-4 w-16 h-16">
              <load-img
                loading-height="64px"
                class-name="w-16 h-16 rounded-md"
                src={row.album.picUrl}
                show-message={false}
              />
              <play-icon
                size={15}
                class="cursor-pointer position-center"
                style="opacity: 1;width: 25px;height: 25px;"
              />
            </div>
          </div>
        );
      }
    },

    {
      key: 'name',
      render(row: any) {
        return (
          <n-ellipsis class="max-w-xs"> {row.name}</n-ellipsis>
        );
      }
    },
    {
      key: 'author',
      render(row: any) {
        return (
          <p class="max-w-xs opacity-50">
            <n-ellipsis> {formateSongsAuthor(row.artists)}</n-ellipsis>
          </p>
        );
      }
    },
    {
      key: 'albumName',
      render(row:any) {
        return (
          <p class="flex-1 max-w-xs opacity-50">
            <n-ellipsis> { row.album.name }</n-ellipsis>
          </p>
        );
      }
    },
    {
      key: 'time',
      render(row:any) {
        return (
          <n-time
            class="pl-4 mr-2  opacity-50"
            time={row.bMusic.playTime}
            format="mm:ss"
          />
        );
      }
    }
  ];
};
const columns = createColumns();
const data: any[] = [
  { no: 3, title: 'Wonderwall', length: '4:18', order: '43' },
  { no: 12, title: 'Champagne Supernova', length: '7:27' }
];
</script>

<template>
  <div class="p-6">
    <div class="flex-items-justify-center">
      <n-tabs v-model:value="activeTab" type="segment" class="w-80">
        <n-tab name="topSong" tab="新歌速递" />
        <n-tab name="newAlbum" tab="新碟上架" />
      </n-tabs>
    </div>
    <!-- 新歌速递列表 -->
    <div v-show="activeTab === 'topSong'" class="mt-4">
      <n-data-table
        striped :data="list" :columns="columns"
        :bordered="false"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.n-tabs .n-tabs-rail) {
  border-radius: 40px;
}

:deep(.n-tabs .n-tabs-rail .n-tabs-tab-wrapper > .n-tabs-tab) {
  border-radius: 40px;
}

:deep(.n-data-table-thead) {
  display: none;
}

.text-left-opacity-50 {
  @apply pl-4 text-left opacity-50;
}
</style>
