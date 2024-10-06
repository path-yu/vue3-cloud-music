<script setup lang="ts">
import { ref, type Ref, watch, reactive, nextTick, type CSSProperties } from 'vue';
// @ts-ignore
import analyze from 'rgbaster';
import { BackToTop, Edit } from '@vicons/carbon';
import { formateSongsAuthor, getArrLast } from '@/utils';
import { KeyboardArrowDownOutlined } from '@vicons/material';
import color from 'color';
import { useMainStore } from '@/stores/main';
import useThemeStyle from '@/hook/useThemeStyle';
import { useRouter } from 'vue-router';
import type { AnyObject } from 'env';
import { getMusicComment } from '@/service/songs';
import { getSimilarPlaylist, getSimilarSong } from '@/service/playlist';
import { useAsyncState } from '@vueuse/core';
import { mapSongs } from '@/utils/arr-map';
import { useBlurLineGradient } from './hook/useBlurLineGradient';

export interface MusicDetailExpose {
  show: () => void;
  close: () => void;
  toggle: () => void;
  active: Ref<boolean>;
}
let backTopEle: HTMLElement;

const mainStore = useMainStore();
const router = useRouter();
const { tagColor } = useThemeStyle();
const { updateFooterMaskColor, resetBackground } = useBlurLineGradient();
const commentModalRef = ref();
const commentLoading = ref(true);
const scrollContainerRef = ref<HTMLElement>(null as unknown as HTMLElement);
const musicComment = ref<AnyObject>({});
const myCanvas = ref<HTMLCanvasElement>();
const titleRef = ref<HTMLElement>();
const isShowTag = ref(false);
const showTopLyric = ref(false);
const tagPositionStyle = ref<CSSProperties>();
const { isLoading: fetchSimiPlayListLoading, state: similarPlaylist, execute: executeGetSimiPlayList } = useAsyncState(
  (id) => {
    return getSimilarPlaylist(id).then(res => res.data.playlists);
  }, [],
  { resetOnExecute: false, immediate: false }
);
// 相似歌曲数据
const { isLoading: fetchSimilarSongIsLoading, state: similarMusicList, execute: executeGetSimiSong } = useAsyncState(
  (id) => {
    return getSimilarSong(id).then(res => {
      return mapSongs(res.data.songs);
    });
  }, [],
  { resetOnExecute: false, immediate: false }
);
const showBackTop = ref(false);
const pageParams = reactive({
  pageCount: 10,
  page: 1,
  pageSize: 50
});
const target = () => scrollContainerRef.value;

const fillBackground = async (updateMask = true) => {
  await nextTick();
  let ctx = myCanvas.value!.getContext('2d') as CanvasRenderingContext2D;
  let width = (window.innerWidth * 0.85);
  let height = window.innerHeight - 73;
  if (!mainStore.currentPlaySong) return;
  let baseColor = mainStore.theme === 'dark'
    ? '#121212'
    : 'white';
  ctx.fillStyle = baseColor;
  ctx.fillRect(
    0, 0, width, height
  );
  let primary;
  if (!mainStore.currentPlaySong.primaryColor) {
    const result = await analyze(mainStore.currentPlaySong.al.picUrl);
    mainStore.currentPlaySong.primaryColor = result[1].color;
    primary = result[1].color;
  } else {
    primary = mainStore.currentPlaySong.primaryColor;
  }

  let bgColor = color(baseColor).mix(color(primary), 0.2)
    .hex();
  myCanvas.value!.width = width;
  myCanvas.value!.height = height;
  let gradient = ctx!.createLinearGradient(
    width / 2, 0, width / 2, height
  );
  gradient.addColorStop(0, bgColor);
  gradient.addColorStop(1, baseColor);
  ctx.fillStyle = gradient;
  mainStore.canvasBackground = `linear-gradient(${baseColor}, ${bgColor})`;
  ctx.fillRect(
    0, 0, width, height
  );
  if (updateMask) {
    updateFooterMaskColor(ctx);
  }
};
// 获取歌单评论
const fetchMusicComment = (id: string) => {
  let params: {
    id: string; limit: number; offset: number; before?: string;
  } = {
    id,
    limit: pageParams.pageSize,
    offset: ((pageParams.page) - 1) * pageParams.pageSize
  };
  if (musicComment.value?.total > 5000) {
    params.before = musicComment.value.comments[getArrLast(musicComment.value.comments)];
  }
  commentLoading.value = true;
  musicComment.value = [];
  getMusicComment(params).then(res => {
    pageParams.pageCount = Math.round(res.data?.total || 1 / pageParams.pageSize) || 1;
    musicComment.value = res.data;
    commentLoading.value = false;
  });
};
const handleSimiPlayListItem = (id: string) => {
  router.push(`/songList/${id}`);
  mainStore.setShowMusicDetail(false);
};

const handleScroll = (e: Event) => {
  let target = e.target as HTMLElement;
  if (target.scrollTop >= 120) {
    showTopLyric.value = true;
  } else if (target.scrollTop === 0) {
    showTopLyric.value = false;
  }
  updateFooterMaskColor(myCanvas.value!.getContext('2d')!);
};

const updateCommentList = (value: any) => {
  musicComment.value.total += 1;
  musicComment.value.comments.unshift(value);
};
const updateCommentLiked = (data: { liked: boolean, index: number }, isHot: boolean) => {
  let { index, liked } = data;
  if (isHot) {
    musicComment.value.hotComments[index].liked = liked;
    liked
      ? musicComment.value.hotComments[index].likedCount + 1
      : musicComment.value.hotComments[index].likedCount - 1;
  } else {
    musicComment.value.comments[index].liked = liked;
    liked
      ? musicComment.value.comments[index].likedCount + 1
      : musicComment.value.comments[index].likedCount - 1;
  }
};
const handleUpdateShow = (value: boolean) => {
  showBackTop.value = value;
};
const handleContextMenu = (ev: MouseEvent) => {
  ev.preventDefault();
  return false;
};
const handleMvTagClick = () => {
  if (mainStore.playing) {
    mainStore.changePlaying(false);
  }
  router.push(`/mv/${mainStore.currentPlaySong.mvid}`);
};
const handleTransitionAfterEnter = () => {
  updateFooterMaskColor(myCanvas.value!.getContext('2d')!);
};
const setTagPositionStyle = async () => {
  await nextTick();
  isShowTag.value = false;
  let left = titleRef.value!.offsetLeft + titleRef.value!.offsetWidth + 20;
  tagPositionStyle.value = { left: left + 'px', top: '-15px' };
  isShowTag.value = true;
};
watch(() => mainStore.theme, () => {
  resetBackground();
  fillBackground(false);
});
watch(() => mainStore.showMusicDetail, async (val) => {
  if (!val) {
    showBackTop.value = false;
  }
  if (!isShowTag.value) {
    setTagPositionStyle();
  }
});
watch(
  () => mainStore.currentPlaySong, (val, oldVal) => {
    if (oldVal && val.id === oldVal.id) return;
    fetchMusicComment(val.id);
    executeGetSimiPlayList(0, val.id);
    executeGetSimiSong(0, val.id);
    if (oldVal && val.id !== oldVal.id) {
      resetBackground();
    }
    if (mainStore.showMusicDetail) {
      fillBackground();
    } else {
      fillBackground(false);
    }
    isShowTag.value = false;
    if (mainStore.showMusicDetail) {
      setTagPositionStyle();
    }
  }, { immediate: true }
);
watch(pageParams, () => {
  backTopEle = document.querySelector('.n-back-top') as HTMLElement;
  backTopEle && backTopEle.click();
  if (mainStore.currentPlaySong.id) {
    fetchMusicComment(mainStore.currentPlaySong.id);
  }
});

</script>

<template>
  <transition name="bottom-slide-transform" @after-enter="handleTransitionAfterEnter">
    <div v-show="mainStore.showMusicDetail" class="fixed inset-x-0 m-auto music-detail">
      <div class="box-border flex items-center p-4" style="height:77px;">
        <n-icon size="35" :component="KeyboardArrowDownOutlined" class="ml-4"
          @click="mainStore.setShowMusicDetail(false)" />
        <div class="flex items-center ml-20">
          <layout-header-search />
        </div>
        <transition v-show="showTopLyric" name="slide">
          <div class="ml-10 text-center" style="width:550px">
            <p>
              {{ mainStore.currentPlaySong.name }}
            </p>
            <p class="opacity-50">
              {{ mainStore.currentPlayLyric }}
            </p>
          </div>
        </transition>
      </div>
      <div ref="scrollContainerRef" class="flex px-10 pt-5 detail-content" @scroll="handleScroll">
        <rotate-cd />
        <div class="ml-10">
          <div style="width:550px">
            <div class="relative">
              <div class="text-3xl text-center">
                <span ref="titleRef"> {{ mainStore.currentPlaySong.name }}</span>
                <div class="absolute" :style="tagPositionStyle">
                  <n-tag v-if="mainStore.currentPlaySong.mv !== 0" size="small" :color="tagColor"
                    @click="handleMvTagClick">
                    MV
                  </n-tag>
                </div>
              </div>
            </div>
            <p v-if="mainStore.currentPlaySong.alia" class="mt-2 text-sm text-center opacity-50">
              {{ mainStore.currentPlaySong.alia[0] }}
            </p>
            <p class="mt-2 text-sm text-center opacity-50">
              {{ mainStore.currentPlaySong.al.name }}
              <span>-</span>
              {{ formateSongsAuthor(mainStore.currentPlaySong.ar || []) }}
            </p>
          </div>
          <div class="flex">
            <div>
              <music-lyric />
              <!-- 评论-->
              <div style="width:550px;height:300px;" class="mt-5">
                <n-spin :show="commentLoading" description="加载中">
                  <div v-show="commentLoading" class="h-80" />
                  <comment-list :type="0" :comment-total-num="musicComment.total"
                    :resource-id="mainStore.currentPlaySong.id" title="精彩评论" :list="musicComment.hotComments || []"
                    @update-comment-list="updateCommentList"
                    @update-comment-liked="(data: any) => updateCommentLiked(data, true)" />
                  <!-- 最新评论 -->
                  <comment-list :resource-id="mainStore.currentPlaySong.id" :type="0"
                    :comment-total-num="musicComment.total" title="最新评论" :list="musicComment.comments || []"
                    @update-comment-list="updateCommentList"
                    @update-comment-liked="(data: any) => updateCommentLiked(data, false)" />
                </n-spin>
                <p v-if="!musicComment.comments?.length && !commentLoading" class="text-center opacity-50">
                  还没有评论, 快来抢沙发~
                </p>
                <div v-if="pageParams.pageCount > 1 && musicComment.comments" class="flex justify-end mt-6">
                  <n-pagination v-model:page="pageParams.page" v-model:page-size="pageParams.pageSize"
                    :page-count="pageParams.pageCount" show-size-picker :page-sizes="[10, 20, 30, 40, 50]" />
                </div>
                <div class="h-20" />
              </div>
            </div>
            <n-scrollbar style="max-height: 350px;padding-right:20px;" class="pt-10 ml-20">
              <h3 v-if="similarPlaylist.length" class="m-0 text-left">
                包含这首歌的歌单
              </h3>
              <n-divider v-if="similarPlaylist.length" />
              <n-spin :show="fetchSimiPlayListLoading" size="small">
                <div v-show="fetchSimiPlayListLoading" class="w-80 h-32" />
                <!-- 相似歌单推荐 -->
                <div v-for="item in similarPlaylist" v-show="!fetchSimiPlayListLoading" :key="item.id"
                  class="flex items-center p-2 hover:bg-neutral-50 dark:hover:bg-neutral-50/20 cursor-pointer"
                  @click="handleSimiPlayListItem(item.id)">
                  <n-image width="45" height="45" class="rounded-md" :src="item.coverImgUrl" />
                  <div class="ml-4">
                    <p class="w-60 text-sm text-left truncate">
                      {{ item.name }}
                    </p>
                    <p class="mt-2 w-60 text-sm text-left truncate">
                      <span class="opacity-50">by</span> <span class="opacity-80"> {{ item.creator.nickname }}</span>
                    </p>
                  </div>
                </div>
              </n-spin>
              <div class="mt-2">
                <h3 v-if="similarMusicList.length" class="m-0 text-left">
                  喜欢这首歌的也喜欢听
                </h3>
                <n-divider v-if="similarMusicList.length" />
              </div>
              <!-- 相似歌曲 -->
              <n-spin :show="fetchSimilarSongIsLoading">
                <div v-show="fetchSimilarSongIsLoading" class="w-80 h-40" />
                <div v-for="item in similarMusicList" v-show="!fetchSimilarSongIsLoading" :key="item.id"
                  class="flex items-center p-1 hover:bg-neutral-50 dark:hover:bg-neutral-50/20 cursor-pointer"
                  @click="mainStore.insertPlay(item)">
                  <n-image width="45" height="45" class="rounded-md" :src="item.album.picUrl" />
                  <div class="ml-4">
                    <p class="w-60 text-sm text-left truncate">
                      {{ item.name }}
                    </p>
                    <p class="mt-2 w-60 text-sm text-left truncate opacity-50">
                      {{ formateSongsAuthor(item.artists) }}
                    </p>
                  </div>
                </div>
              </n-spin>
            </n-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <transition name="bottom-slide-transform">
    <canvas v-show="mainStore.showMusicDetail" ref="myCanvas" class="background" @contextmenu="handleContextMenu" />
  </transition>

  <n-back-top style="z-index: 9999;" :show="showBackTop" :on-update:show="handleUpdateShow" :listen-to="target"
    :bottom="90" :right="400">
    <n-icon :component="BackToTop" />
  </n-back-top>
  <!-- 发表评论-->
  <replied-comment-modal ref="commentModalRef" comment-placeholder="发表评论"
    :title="'歌曲：' + mainStore.currentPlaySong.name" :update-comment-list="updateCommentList" :t="1" :type="0"
    :resource-id="mainStore.currentPlaySong.id" />
  <transition name="slide">
    <n-button v-show="!showBackTop && mainStore.showMusicDetail" class="fixed"
      style="z-index:9999;bottom: 90px;right:400px" round type="primary" @click="commentModalRef?.show()">
      <n-icon :component="Edit" />
      写评论
    </n-button>
  </transition>
  <!-- 发表我的音乐评论 -->
  <transition name="slide">
    <n-button v-show="showBackTop && mainStore.showMusicDetail" type="primary" class="fixed w-44"
      style="z-index:9999;bottom: 90px;right:0;left:0;margin:auto" round @click="commentModalRef?.show()">
      <n-icon :component="Edit" />
      发表我的音乐评论
    </n-button>
  </transition>
</template>

<style scoped>
.music-detail {
  bottom: 68px;
  width: 75vw;
  height: calc(100vh - 68px);
  z-index: 1000;
  overflow: hidden;
}

.detail-content {
  height: calc(100vh - 68px - 77px);
  box-sizing: border-box;
  overflow-y: scroll;
}

.background {
  position: fixed;
  width: 75vw;
  height: calc(100vh - 68px);
  bottom: 68px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 999;
}

:deep(.n-back-top-placeholder) {
  z-index: 8888 !important;
}

/* 从底部弹出或隐藏过渡 */
.bottom-slide-transform-leave-active {
  transition: height .2s cubic-bezier(0.4, 0, 0.2, 1);
}

.bottom-slide-transform-enter-active {
  transition: height .6s cubic-bezier(0.4, 0, 0.2, 1);
  ;
}

.bottom-slide-transform-enter-from {
  height: 0;
}

.bottom-slide-transform-enter-to {
  height: calc(100vh - 73px);
}

.bottom-slide-transform-leave-to {
  height: 0;
}

:deep(.n-divider:not(.n-divider--vertical)) {
  margin: 10px 0;
}
</style>
