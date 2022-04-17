<script setup lang="tsx">
import { formateSongsAuthor, sliceArr } from '@/utils';
import type { DataTableColumns } from 'naive-ui';
import { ref, watchEffect, Transition } from 'vue';
import { getTopSong, getNewTopAlbum } from '../service';
import LoadImg from '@/components/Base/LoadImg.vue';
import PlayIcon from '@/components/Base/PlayIcon.vue';
let sliceRawAlbumList = [];
const activeTab = ref<'topSong' | 'newAlbum'>('topSong');
const isLoading = ref(true);
const newSongList = ref([]);
const albumList = ref([]);
const albumListIsLoading = ref(true);
const page = ref(1); // 当前页码
const scrollBottom = ref(false);//是否滚动到底部
const pageSize = ref(20); // 每页条数;

getTopSong(0)
  .then(res => {
    newSongList.value = res.data.data;
    console.log(res);
    isLoading.value = false;
  });
getNewTopAlbum({}).then(res => {
 
  sliceRawAlbumList = sliceArr(
    pageSize.value, res.data.monthData
  );
  albumListIsLoading.value = false;
  // 数组切片
  // albumList.value.slice
});
watchEffect(() => {
  console.log(activeTab.value);
});

const columns: DataTableColumns = [
  {
    key: 'order',
    render: (
      row: any, rowIndex: number
    ) => {
      return (
        <div class="flex items-center" style={{ width: '120px' }}>
          {<span class="text-sm opacity-80">{rowIndex < 9
            ? '0' + (rowIndex + 1)
            : (rowIndex + 1)}</span>}
          <div class="relative ml-4 w-16 h-16 rounded-md">
            <LoadImg
              loading-height="64px"
              class-name="w-16 h-16 rounded-md"
              src={row.album.picUrl}
              show-message={false}
            />
            <PlayIcon
              size={15}
              class="cursor-pointer position-center"
              style={{ opacity: '1', width: '25px', height: '25px' }}
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
        <n-ellipsis class="">{row.name}</n-ellipsis>
      );
    }
  },
  {
    key: 'author',
    render(row: any) {
      return (
        <p class="opacity-50">
          <n-ellipsis>{formateSongsAuthor(row.artists)}</n-ellipsis>
        </p>
      );
    }
  },
  {
    key: 'albumName',
    render(row: any) {
      return (
        <p class="flex-1 opacity-50">
          <n-ellipsis>{row.album.name}</n-ellipsis>
        </p>
      );
    }
  },
  {
    key: 'time',
    render(row: any) {
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
    <transition name="fade" appear>
      <div v-show="activeTab === 'topSong'" class="mt-4">
        <div v-show="isLoading">
          <div v-for="item in 15" :key="item" class="flex justify-between items-center">
            <div class="flex items-center">
              <n-skeleton
                width="15px"
                class="mt-2" type="text"
              />
              <n-skeleton
                class="mt-2 ml-2" height="64px" width="64px"
                :sharp="false"
              />
            </div>
            <n-skeleton
              width="30%"
              height="30px"
              class="m-4" type="text"
              :repeat="3"
            />
            <n-skeleton
              width="5%"
              height="30px"
              class="m-2" type="text"
            />
          </div>
        </div>
        <n-data-table
          v-show="!isLoading"
          style="100%"
          striped :data="newSongList"
          :columns="columns" :bordered="false"
        />
      </div>
    </transition>
    <!-- 新碟上架 -->
    <transition name="fade" appear>
      <n-grid v-show="activeTab === 'newAlbum'" cols="2 400:4 600:6" class="mt-4">
        <n-grid-item>
          <div>
            1
          </div>
        </n-grid-item>
      </n-grid>
    </transition>
  </div>
</template>

<style scoped>
:deep(.n-tabs .n-tabs-rail) {
  border-radius: 30px;
}

:deep(.n-tabs .n-tabs-rail .n-tabs-tab-wrapper > .n-tabs-tab) {
  border-radius: 30px;
}

:deep(.n-data-table-thead) {
  display: none;
}

.text-left-opacity-50 {
  @apply pl-4 text-left opacity-50;
}
</style>
