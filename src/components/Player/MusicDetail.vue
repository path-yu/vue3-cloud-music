<script setup lang="ts">
import { computed, type CSSProperties, ref, type Ref, watch, reactive } from 'vue';
import analyze from 'rgbaster';
import { BackToTop, Music, User } from '@vicons/carbon';
import { formateSongsAuthor, getArrLast } from '@/utils';
import { KeyboardArrowDownOutlined } from '@vicons/material';
import color from 'color';
import { useMainStore } from '@/stores/main';
import useThemeStyle from '@/hook/useThemeStyle';
import { useRouter } from 'vue-router';
import type { AnyObject } from 'env';
import { getMusicComment } from '@/service/songs';

export interface MusicDetailExpose {
  show: () => void;
  close: () => void;
  toggle: () => void;
  active: Ref<boolean>;
}
let backTopEle:HTMLElement;
const mainStore = useMainStore();
const router = useRouter();
const commentLoading = ref(false);
const scrollContainerRef = ref<HTMLElement>(null as unknown as HTMLElement);
const { tagColor } = useThemeStyle();
const background = ref<CSSProperties>({});
const active = ref(false);
const musicComment = ref<AnyObject>({});
const pageParams = reactive({
  pageCount: 10,
  page: 1,
  pageSize: 50
});
const target = () => scrollContainerRef.value;
defineExpose({
  show() {
    active.value = true;
  },
  close() {
    active.value = false;
  },
  toggle() {
    if (active.value) {
      active.value = false;
    } else {
      active.value = true;
    }
  },
  active
});

watch(
  () => mainStore.currentPlaySong, (val) => {
    setBackgroundStyle();
  }
);
watch(
  () => mainStore.theme, () => {
    setBackgroundStyle();
  }
);

const setBackgroundStyle = async () => {
  if (!mainStore.currentPlaySong) return;
  let primary;
  if (!mainStore.currentPlaySong.primaryColor) {
    const result = await analyze(mainStore.currentPlaySong.al.picUrl);
    mainStore.currentPlaySong.primaryColor = result[1].color;
    primary = result[1].color;
  } else {
    primary = mainStore.currentPlaySong.primaryColor;
  }
  let baseColor = mainStore.theme === 'dark'
    ? '#121212'
    : 'white';
  let bgColor = color(baseColor).mix(
    color(primary), 0.2
  )
    .hex();
  background.value = { background: `linear-gradient(to bottom,${bgColor}, ${baseColor}` };
};
// 获取歌单评论
const fetchMusicComment = (id:string) => {
  let params:{
    id:string;limit:number;offset:number;before?:string;
  } = {
    id,
    limit: pageParams.pageSize,
    offset: ((pageParams.page) - 1) * pageParams.pageSize
  };
  if (musicComment.value.total > 5000) {
    params.before = musicComment.value.comments[getArrLast(musicComment.value.comments)];
  }
  commentLoading.value = true;
  getMusicComment(params).then(res => {
    pageParams.pageCount = Math.round(res.data?.total || 1 / pageParams.pageSize) || 1;
    musicComment.value = res.data;
  })
    .finally(() => commentLoading.value = false);
};
const updateCommentList = (value:any) => {
  musicComment.value.total += 1;
  musicComment.value.comments.unshift(value);
};
const updateCommentLiked = (
  data:{liked:boolean, index:number}, isHot:boolean
) => {
  let { index, liked } = data;
  console.log(isHot);
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
watch(
  () => mainStore.currentPlaySong, (val) => {
    console.log(3);
    if (val) {
      fetchMusicComment(val.id);
    }
  }, { immediate: true }
);
watch(
  pageParams, () => {
    backTopEle = document.querySelector('.n-back-top') as HTMLElement;
    backTopEle && backTopEle.click();
    if (mainStore.currentPlaySong.id) {
      fetchMusicComment(mainStore.currentPlaySong.id);
    }
  }
);

setBackgroundStyle();
</script>

<template>
  <transition name="bottom-slide-transform">
    <div
      v-show="active" ref="scrollContainerRef" class="fixed inset-x-0 m-auto music-detail"
      :style="background"
    > 
      <div class="flex items-center p-4">
        <n-icon
          size="35" :component="KeyboardArrowDownOutlined" class="ml-4"
          @click="active = false"
        />
        <div class="flex flex-1 items-center ml-20">
          <layout-header-search />
        </div>
      </div>
      <div class="flex px-20 pt-5">
        <rotate-cd />
        <div class="ml-10 text-center">
          <div class="relative">
            <div class="text-3xl text-center">
              <span> {{ mainStore.currentPlaySong.name }}</span>
              <div class="absolute">
                <!-- <n-tag
                  v-if="mainStore.currentPlaySong.mv !== 0"
                  size="small" :color="tagColor"
                  @click="router.push(`/mv/${mainStore.currentPlaySong.mv.mv}`)"
                >
                  MV
                </n-tag> -->
              </div>
            </div>
          </div>
          <p class="mt-2 text-sm opacity-50">
            {{ mainStore.currentPlaySong.al.name }}
            <span>-</span>
            {{ formateSongsAuthor(mainStore.currentPlaySong.ar || []) }}
          </p>
          <music-lyric />
        </div>
      </div>
      <div style="width:600px;height:300px;padding-left: 500px;">
        <comment-list
          :type="0"
          :comment-total-num="musicComment.total"
          :resource-id="mainStore.currentPlaySong.id" title="精彩评论" :list="musicComment.hotComments || []"
          @update-comment-list="updateCommentList"
          @update-comment-liked="(data:any) => updateCommentLiked(data,true)"
        />
        <!-- 最新评论 -->
        <comment-list
          :resource-id="mainStore.currentPlaySong.id"
          :type="0"
          :comment-total-num="musicComment.total" title="最新评论" :list="musicComment.comments || []"
          @update-comment-list="updateCommentList"
          @update-comment-liked="(data:any) => updateCommentLiked(data,false)"
        />
        <p v-if="!musicComment.comments?.length" class="text-center opacity-50">
          还没有评论, 快来抢沙发~
        </p>
        <div v-if="pageParams.pageCount > 1 && musicComment.comments" class="flex justify-end mt-6">
          <n-pagination
            v-model:page="pageParams.page" 
            v-model:page-size="pageParams.pageSize" 
            :page-count="pageParams.pageCount" 
            show-size-picker
            :page-sizes="[10, 20, 30, 40,50]"
          />
        </div>
        <div class="h-10" />
      </div>
    </div>
  </transition>
  <n-back-top
    :listen-to="target" :bottom="220"
    :visibility-height="100"
  >
    <n-icon :component="BackToTop" />
  </n-back-top>
</template>

<style scoped>
.music-detail {
  bottom: 73px;
  width: 85vw;
  height: calc(100vh - 73px);
  overflow: scroll;
  z-index: 999;
}
:deep(.n-back-top-placeholder){
  z-index:8888 !important;
}
/* 从底部弹出或隐藏过渡 */
.bottom-slide-transform-leave-active {
  transition: height .2s cubic-bezier(0.4, 0, 0.2, 1);
}

.bottom-slide-transform-enter-active {
  transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);;
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
</style>
