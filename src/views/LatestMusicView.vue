<script setup lang="tsx">
import { formateSongsAuthor } from '@/utils';
import { useThemeVars, type DataTableColumns, NTime, NEllipsis } from 'naive-ui';
import { ref, type CSSProperties } from 'vue';
import { getTopSong } from '../service';
import LoadImg from '@/components/Base/LoadImg.vue';
import PlayIcon from '@/components/Base/PlayIcon.vue';
import {} from '@vueuse/core';
import { useMemorizeRequest } from '@/hook/useMemorizeRequest';
const typeList = [
  {
    value: '0',
    name: '全部'
  },
  {
    value: '7',
    name: '华语'
  },
  {
    value: '96',
    name: '欧美'
  },
  {
    value: '8',
    name: '日本'
  },
  {
    value: '16',
    name: '韩国'
  }
];
const isLoading = ref(true);
const newSongList = ref([]);
const activeType = ref('0');
const themeVars = useThemeVars();
const activeStyle = (value: string):CSSProperties => {
  return {
    color: value === activeType.value
      ? themeVars.value.primaryColor
      : themeVars.value.textColorBase,
    opacity: value === activeType.value
      ? 1
      : '0.5',
    fontSize: value === activeType.value
      ? '0.9rem'
      : '0.8rem'
  };
};

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
        <NEllipsis class="w-xs text-sm">{row.name}</NEllipsis>
      );
    }
  },
  {
    key: 'author',
    render(row: any) {
      return (
        <p class="w-xs text-sm opacity-50">
          <NEllipsis>{formateSongsAuthor(row.artists)}</NEllipsis>
        </p>
      );
    }
  },
  {
    key: 'albumName',
    render(row: any) {
      return (
        <p class="flex-1 w-xs text-sm opacity-50">
          <NEllipsis>{row.album.name}</NEllipsis>
        </p>
      );
    }
  },
  {
    key: 'time',
    render(row: any) {
      return (
        <NTime
          class="pl-4 mr-2 text-sm opacity-50"
          time={row.bMusic.playTime}
          format="mm:ss"
        />
      );
    }
  }
];
const { wrapRequest, isRepeat } = useMemorizeRequest(getTopSong);
const fetchData = () => {
  isLoading.value = true;
  newSongList.value = [];
  wrapRequest(activeType.value as any)
    .then(async (res: { data: { data: never[]; }; }) => {
      if (isRepeat.value) {
        setTimeout(
          () => {
            newSongList.value = res.data.data;
            isLoading.value = false;
          }, 600
        );
      } else {
        newSongList.value = res.data.data;
        isLoading.value = false;
      }
     
    });
};

const handleTypeClick = (value:string) => {
  activeType.value = value;
  fetchData();
};
const handlMouseEnter = (
  e:MouseEvent, value:string
) => {
  if (value === activeType.value) return;
  (e.target as HTMLElement).style.opacity = '1';
};
const handleMouseLeave = (
  e:MouseEvent, value:string
) => {
  if (value === activeType.value) return;
  (e.target as HTMLElement).style.opacity = '0.5';
};
fetchData();

</script>

<template>
  <div class="p-6">
    <div>
      <span
        v-for="item in typeList"
        :key="item.value" class="px-2 rounded-md opacity-50 transition duration-150 ease-in-out cursor-pointer"
        :style="activeStyle(item.value)"
        @mouseenter="handlMouseEnter($event,item.value)"
        @mouseleave="handleMouseLeave($event,item.value)"
        @click="handleTypeClick(item.value)"
      >{{ item.name }}</span>
    </div>
    <!-- 新歌速递列表 -->
    <div class="mt-4">
      <div v-show="isLoading">
        <div v-for="item in 15" :key="item" class="flex justify-between items-center">
          <div class="flex items-center">
            <n-skeleton width="15px" class="mt-2" type="text" />
            <n-skeleton
              class="mt-2 ml-2" height="64px" width="64px"
              :sharp="false"
            />
          </div>
          <n-skeleton
            width="30%" height="30px" class="m-4"
            type="text" :repeat="3"
          />
          <n-skeleton
            width="5%" height="30px" class="m-2"
            type="text"
          />
        </div>
      </div>
      <transition
        name="fade"
        appear
      >
        <n-data-table
          v-show="!isLoading" style="100%" striped
          :data="newSongList" :columns="columns" :bordered="false"
        />
      </transition>
    </div>
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
