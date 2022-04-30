<script setup lang="ts">
import { getMvDetail, getSimiMv, getVideoUrl } from '@/service';
import { ArrowBack } from '@vicons/ionicons5';
import { useAsyncState } from '@vueuse/core';
import { ref, reactive, watchEffect, onMounted, onBeforeMount } from 'vue';
import { formateSongsAuthor } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
import VideoPlayer, { type VideoPlayerExpose } from '@/components/Base/VideoPlayer.vue';

const route = useRoute();
let mvid = route.params.id as string;
const loadingMaps = reactive({
  mvUrlLoading: true,
  myDetailLoading: true,
  simiMvLoading: true
});
const mvUrl = ref('');
const videoPlayRef = ref<VideoPlayerExpose>();
const { state: simiMvList } = useAsyncState(
  getSimiMv(+mvid).then(res => res.data.mvs), []
);
const { state: mvDetail } = useAsyncState<any>(
  getMvDetail(+mvid).then(res => res.data.data), {}
);
const getMvVideoUrl = (mvId:number=+mvid) => {
  loadingMaps.mvUrlLoading = true;
  getVideoUrl(+mvId).then(res => {
    mvUrl.value = res.data.data.url;
    loadingMaps.mvUrlLoading = false;
  });
};
getMvVideoUrl();

const history = useRouter();
const handleImgClick = (id:number) => {
  videoPlayRef.value!.stop();
  getMvVideoUrl(id);
};
</script>

<template>
  <div class="px-20 pt-10">
    <div class="flex justify-between">
      <div class="flex-1">
        <div class="flex items-center mb-5 cursor-pointer">
          <n-icon :component="ArrowBack" size="20" @click="history.back()" />
          <p class="ml-2 title">
            Mv详情
          </p>
        </div>
        <!-- 播放器 -->
        <div id="mv-player">
          <div v-show="loadingMaps.mvUrlLoading">
            <n-skeleton height="390px" width="100%" />
          </div>
          <video-player
            v-show="loadingMaps.mvUrlLoading === false" ref="videoPlayRef" :url="mvUrl"
            :poster="mvDetail.cover"
          />
        </div>
      </div>
      <div class="ml-6">
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
          <div v-for="(item,index) in 5" :key="index" class="flex mt-4">
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
