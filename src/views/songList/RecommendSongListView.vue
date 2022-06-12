<script setup lang="ts">
import { useMemoryScrollTop } from '@/hook/useMemoryScrollTop';
import { getTopPlayList, getTopPlayListTags } from '@/service';
import { getArrLast } from '@/utils';
import { useAsyncState } from '@vueuse/core';
import { useLoadingBar, useThemeVars } from 'naive-ui';
import { computed, nextTick, onBeforeMount, ref, watch } from 'vue';
//精品歌单
const tabsTabSelector = '.myTabs > .n-tabs-nav .n-tabs-wrapper > .n-tabs-tab-wrapper>.n-tabs-tab';
const {
  state: songsTags,
  isLoading: songsTagsIsLoading
} = useAsyncState<any[]>(
  getTopPlayListTags()
    .then(res => {
      return [{ name: '全部' }].concat(res.data.tags);
    }), []
);
let tabsNavEle: Element | null = null;
let allTabEleChildren: NodeList | null = null;

const songList = ref<{ list: any[], loading: boolean, noMore: boolean }[]>([]);
const selectValue = ref('全部');
const selectIndex = ref(0);
const isLoading = ref(true);
const currentSongList = computed(() => songList.value[selectIndex.value]);
const loadingBar = useLoadingBar();
const themeVars = useThemeVars();
const bodyColor = computed(() => themeVars.value.bodyColor);
useMemoryScrollTop('.rightMain>.n-layout-scroll-container');
watch(
  () => selectValue.value, async (
    newVal, oldVal
  ) => {
    let index = findIndex(newVal);
    await changeScrollBarPosition(
      findIndex(oldVal), index
    );
    selectIndex.value = index;
    if (!songList.value[index]) {
      loadingBar.start();
      await fetchSongList(
        selectValue.value, index, () => {
          loadingBar.finish();
        }
      );
    } else {
      loadingBar.start();
      await nextTick();
      setTimeout(
        () => {
          loadingBar.finish();
        }, 200
      );
    }
  }
);

const fetchSongList = async (
  cat = '全部', index = 0, successCallback?: (() => any) | undefined
) => {
  songList.value[index] = {
    list: [],
    loading: true,
    noMore: false
  };
  getTopPlayList({ cat, limit: 50 }).then(res => {
    let playlists = res.data.playlists;
    if (playlists !== 0) {
      songList.value[index].list = res.data.playlists;
    }
    successCallback && successCallback();
    isLoading.value = false;
    songList.value[index].noMore = !res.data.more;
    songList.value[index].loading = false;
  });
};

const findIndex = (val: string) => songsTags.value.findIndex((item) => item.name === val);
//点击tab时移动滚动条位置
const changeScrollBarPosition = async (
  oldIndex: number, newIndex: number
) => {
  await nextTick();
  tabsNavEle = tabsNavEle === null
    ? document.querySelector('.myTabs>.n-tabs-nav')
    : tabsNavEle;
  allTabEleChildren = allTabEleChildren === null
    ? document.querySelectorAll(tabsTabSelector)
    : allTabEleChildren;
  if (tabsNavEle === null || allTabEleChildren.length === 0) {
    console.error('dom 节点为空!');
    return;
  }
  let oldChild = allTabEleChildren[oldIndex] as HTMLElement;
  let newChild = allTabEleChildren[newIndex] as HTMLElement;
  let moveDiff = newChild.offsetLeft - oldChild.offsetLeft;

  tabsNavEle.scrollTo({
    left: moveDiff,
    behavior: 'smooth'
  });
};

onBeforeMount(() => {
  fetchSongList(
    '全部', 0
  );
});
const loadMore = (successCallback: any) => {
  let params = {
    cat: selectValue.value,
    limit: 20,
    before: getArrLast(songList.value[selectIndex.value].list).updateTime
  };
  getTopPlayList(params).then(res => {
    const playlists = res.data.playlists;
    if (playlists.length !== 0) {
      songList.value[selectIndex.value].list.push(...playlists);
    }
    songList.value[selectIndex.value].noMore = !res.data.more;
    successCallback && successCallback();

  });
};
</script>

<template>
  <div class="px-6">
    <div v-if="!currentSongList.list[0]" class="relative">
      <div class="flex p-4">
        <n-skeleton class="w-36 h-36 rounded-xl" />
        <div class="flex-1 ml-4">
          <n-skeleton width="70px" height="28px" :sharp="false" />
          <n-skeleton
            class="my-2" :sharp="false"
            type="text"
          />
          <n-skeleton
            height="28px" :sharp="false"
            type="text"
          />
        </div>
      </div>
    </div>
    <div v-else class="overflow-hidden relative mt-4 h-44 rounded-xl cursor-pointer">
      <div
        class="flex absolute w-full h-44 blur-lg"
        :style="{ backgroundImage: `url(${currentSongList.list[0]?.coverImgUrl})` }"
      />
      <div class="box-border flex absolute z-50 p-4 w-full h-44 bg-black/30">
        <load-img
          loading-height="144px "
          class-name="w-36 h-36 rounded-md"
          :src="currentSongList.list[0]?.coverImgUrl"
        />
        <div class="flex-1 ml-4">
          <n-tag type="success">
            {{ selectValue }}
          </n-tag>
          <p class="py-2 text-white">
            {{ currentSongList.list[0]?.name }}
          </p>
          <n-ellipsis :line-clamp="5" :tooltip="false" class="text-xs text-white opacity-80">
            {{ currentSongList.list[0]?.description }}
          </n-ellipsis>
        </div>
      </div>
    </div>
    <div>
      <div v-if="songsTagsIsLoading" class="flex justify-between mt-4">
        <n-skeleton height="28px" :sharp="false" />
      </div>
      <div v-else class="relative">
        <n-tabs ref="tabsInstRef" v-model:value="selectValue" class="min-w-3xl myTabs">
          <n-tab-pane
            v-for="(tab) in songsTags" :key="tab.name" display-directive="show:lazy"
            :name="tab.name"
          >
            <SongListSkeleton v-if="currentSongList.loading" />
            <div v-else class="mt-4">
              <SongList :songs="currentSongList.list" />
              <ListLoading
                v-if="currentSongList.list.length > 15"
                :no-more="currentSongList.noMore"
                :load-more="loadMore"
              />
            </div>
          </n-tab-pane>
        </n-tabs>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-tabs-bar) {
  display: none;
}
:deep(.n-tabs .n-tabs-nav.n-tabs-nav--line-type .n-tabs-nav-scroll-content) {
  transition: border-color 0.3s var(--n-bezier);
  border: none;
}
:deep(.n-tag__content) {
  display: flex;
}
:deep(.n-tabs .n-tab-pane){
  padding-top: 0;
}
:deep(.n-tabs .n-tabs-nav) {
  overflow-x: scroll;
  position: sticky;
  top: 0px;
  z-index: 999;
  padding-top: 10px;
  background-color: v-bind(bodyColor);
}
:deep(.n-tabs .n-tabs-nav::-webkit-scrollbar-thumb) {
  height: 15px;
  background-color: transparent;
}
:deep(.n-tabs .n-tabs-nav):hover.n-tabs-nav::-webkit-scrollbar-thumb {
  @apply bg-gray-400/40;
}
:deep(.n-tabs .n-tabs-nav-scroll-wrapper) {
  overflow: visible;
}</style>
