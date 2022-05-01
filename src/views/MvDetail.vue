<script setup lang="ts">
import { getMvDetail, getSimiMv, getSingerSong, getVideoUrl, getMvComment } from '@/service';
import { ArrowBack } from '@vicons/ionicons5';
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import { formateSongsAuthor, formateNumber, getArrLast } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
import VideoPlayer, { type VideoPlayerExpose } from '@/components/Base/VideoPlayer.vue';
import type { AnyObject } from 'env';
import CommentList from '../components/CommentList/CommentList.vue';
import { useMainStore } from '@/stores/main';

const route = useRoute();
let mvid = route.params.id as string;
let backTopEle:HTMLElement;
const loadingMaps = reactive({
  mvUrlLoading: true,
  myDetailLoading: true,
  simiMvLoading: true,
  reloadLoading: false,
  authorInfoLoading: true,
  commentLoading: true
});
const pageParams = reactive({
  pageCount: 10,
  page: 1,
  pageSize: 50
});
const mvUrl = ref('');
const simiMvList = ref<any[]>([]);
const mvDetail = ref<AnyObject>({});
const videoPlayRef = ref<VideoPlayerExpose>();
const authorInfo = ref<AnyObject>({});
const mvComment = ref<AnyObject>({});

const router = useRouter();
const mainStore = useMainStore();
const getMvVideoUrl = (
  mvId:number=+mvid, setReloadLoading=false
) => {
  getVideoUrl(+mvId).then(res => {
    mvUrl.value = res.data.data.url;
    if (!loadingMaps.reloadLoading) {
      loadingMaps.mvUrlLoading = false;
    }
    if (setReloadLoading) {
      loadingMaps.reloadLoading = false;
    }
  });
};
const getSimiMvList = (mvId:number=+mvid) => {
  getSimiMv(mvId).then(res => {
    simiMvList.value = res.data.mvs;
    !loadingMaps.reloadLoading && (loadingMaps.simiMvLoading = false);
  });
};
const getMvDetailInfo = (mvId:number=+mvid) => {
  getMvDetail(+mvId).then(res => {
    mvDetail.value = res.data.data;
    !loadingMaps.reloadLoading && (loadingMaps.myDetailLoading = false);
    getSingerSongInfo(res.data.data.artistId);
  });
};
const getSingerSongInfo = (id:number) => {
  getSingerSong(id).then((res) => {
    authorInfo.value = res.data.artist;
    !loadingMaps.reloadLoading && (loadingMaps.authorInfoLoading = false);
  });
};
const getMvCommentInfo = (mvId:string=mvid) => {
  !loadingMaps.reloadLoading && (loadingMaps.commentLoading = true);
  let params = {
    id: mvId,
    limit: pageParams.pageSize,
    offset: ((pageParams.page) - 1) * pageParams.pageSize,
    before: ''
  };
  if (mvComment.value.total > 5000) {
    params.before = mvComment.value.comments[getArrLast(mvComment.value.comments)];
  }
  getMvComment(params).then(res => {
    pageParams.pageCount = Math.round(res.data.total / pageParams.pageSize);
    mvComment.value = res.data;
    !loadingMaps.reloadLoading && (loadingMaps.commentLoading = false);
  });
};

const init = () => {
  getMvDetailInfo();
  getSimiMvList();
  getMvVideoUrl();
  getMvCommentInfo();
};

init();
const handleImgClick = async (id:number) => {
  videoPlayRef.value?.stop();
  router.push(`/mv/${id}`);
};
watch(
  () => route.path, (val:string) => {
    reloadMvData();
  
  } 
);
const reloadMvData = () => {
  let id = +route.params.id;
  if (id) {
    loadingMaps.reloadLoading = true;
    getMvVideoUrl(
      id, true
    );
    getMvDetailInfo(id);
    getSimiMvList(id);
    getMvCommentInfo(id.toString());
  }
};
watch(
  pageParams, () => {
    backTopEle = document.querySelector('.n-back-top') as HTMLElement;
    backTopEle && backTopEle.click();
    getMvCommentInfo();
  }
);
onMounted(() => {
  mainStore.backTopLeft = '32vw';
});
onUnmounted(() => {
  mainStore.backTopLeft = '7vw';
});
</script>

<template>
  <div class="py-10 px-20">
    <div class="flex justify-between">
      <div class="flex-1">
        <div class="flex items-center mb-5 cursor-pointer" @click="router.push('/latestMv')">
          <n-icon :component="ArrowBack" size="20" />
          <p class="ml-2 title">
            Mv详情
          </p>
        </div>
        <!-- 播放器 -->
        <div id="mv-player">
          <div v-show="loadingMaps.mvUrlLoading">
            <n-skeleton height="440px" width="100%" />
          </div>
          <n-spin :show="loadingMaps.reloadLoading">
            <video-player
              v-show="loadingMaps.mvUrlLoading === false" ref="videoPlayRef" :url="mvUrl"
              :poster="mvDetail.cover"
            />
          </n-spin>
           
          <div v-if="!loadingMaps.authorInfoLoading">
            <!-- 歌手信息 -->
            <div class="flex items-center mt-5">
              <n-avatar
                round
                :size="75"
                :src="authorInfo.picUrl"
              />
              <div class="ml-4">
                <p class=" text-lg">
                  {{ authorInfo.name }}
                </p>
                <n-ellipsis class="max-w-2xl text-xs opacity-60" :line-clamp="2">
                  {{ authorInfo.briefDesc }}
                </n-ellipsis>
              </div>
            </div>
            <!-- mv详情 -->
            <div class="mt-8">
              <p class="text-2xl font-bold">
                {{ mvDetail.name }}
              </p>
              <div class="mt-6 text-xs opacity-60">
                <span>
                  发布：{{ mvDetail.publishTime }}
                </span>
                <span class="ml-6">
                  播放：{{ formateNumber(mvDetail.playCount) }}
                </span>
              </div>
            </div>
          </div>
          <div v-else>
            <!-- 歌手信息 -->
            <div class="flex items-center mt-5">
              <n-skeleton width="70px" height="75px" circle />
              <div class="flex flex-col ml-4">
                <n-skeleton text width="80px" />
                <n-skeleton text width="600px" class="mt-2" />
              </div>
            </div>
            <!-- mv详情 -->
            <div class="mt-8">
              <n-skeleton width="450px" text />
              <div class="flex mt-6 text-xs opacity-60">
                <n-skeleton width="100px" text />
                <n-skeleton width="100px" class="ml-6" text />
              </div>
            </div>
          </div>
          <div v-show="loadingMaps.commentLoading">
            <div v-for="item in 15" :key="item" class="flex mt-5">
              <n-skeleton circle width="50px" height="50px" />
              <div class="flex-1 pb-5 ml-4">
                <n-skeleton text />
                <n-skeleton text />
                <div class="flex justify-between mt-2 text-xs opacity-60">
                  <n-skeleton width="100px" />
                  <n-skeleton width="100px" />
                </div>
              </div>
            </div>
          </div>
          <div v-show="!loadingMaps.commentLoading">
            <!-- 精彩评论 -->
            <comment-list title="精彩评论" :list="mvComment.hotComments || []" />
            <!-- 最新评论 -->
            <comment-list :comment-total-num="mvComment.total" title="最新评论" :list="mvComment.comments || []" />
          </div>
          <!-- 分页 -->
          <div class="flex justify-end mt-6">
            <n-pagination
              v-model:page="pageParams.page" 
              v-model:page-size="pageParams.pageSize" 
              :page-count="pageParams.pageCount" 
              show-size-picker
              :page-sizes="[10, 20, 30, 40,50]"
            />
          </div>
        </div>
      </div>
      <div class="ml-10">
        <p class="mb-5  title">
          相关推荐
        </p>
        <div v-if="simiMvList.length">
          <div v-for="item in simiMvList" :key="item.id" class="group flex mt-4">
            <mv-list-img-item
              :is-to-detail="false" :item="item" height="6vw"
              @handle-img-click="handleImgClick"
            />
            <div class="flex flex-col justify-center ml-4 w-48">
              <n-ellipsis>
                {{ item.name }}
              </n-ellipsis>
              <n-ellipsis class="opacity-60">
                buy {{ formateSongsAuthor(item.artists) }}
              </n-ellipsis>
            </div>
          </div>
        </div>
        <div v-else>
          <div v-for="item in 5" :key="item" class="flex mt-4">
            <n-skeleton width="204px" height="6vw" class="rounded-md" />
            <div class="flex flex-col justify-center ml-4 w-48">
              <n-skeleton text :repeat="2" class="mt-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title{
  @apply text-lg font-bold;
}

</style>
