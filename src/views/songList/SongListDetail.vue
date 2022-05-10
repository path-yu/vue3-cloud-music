<script setup lang="ts">

import { getPlaylistAllDetail, getPlaylistDetail, getTopPlayListTags } from '@/service';
import type { AnyObject } from 'env';
import { formateNumber } from '@/utils';
import { computed, ref, shallowRef, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadImg from '@/components/Base/LoadImg.vue';
import { Play, AddOutline, StarOutline, Star, ShareSocialOutline } from '@vicons/ionicons5';
import { useMainStore } from '@/stores/main';
const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const songListDetail = shallowRef<AnyObject>();
const isLoading = ref(true);
const imageRef = ref();
const isMySongList = computed(() => {
  return songListDetail.value && songListDetail.value.userId === mainStore.userProfile.profile.userId;
});
const fetchSongListDetail = (songListId:string) => {
  isLoading.value = true;
  getPlaylistDetail(songListId).then(res => {
    if (res.data.playlist.name === (res.data.playlist.creator.nickname +'喜欢的音乐')) {
      res.data.playlist['isMyLike'] = true;
    } else {
      res.data.playlist['isMyLike'] = false;
    }
    isLoading.value = false;
    songListDetail.value = res.data.playlist;
  });
};
const fetchPlayListTags = () => {
  getTopPlayListTags().then(res => {
    console.log(res);
  });
};
fetchPlayListTags();
watchEffect(() => {
  fetchSongListDetail(route.params.id as string);
});

</script>

<template>
  <div class="p-8">
    <n-spin :show="isLoading">
      <div v-if="songListDetail" class="flex justify-between">
        <load-img
          ref="imageRef"
          :has-hover-scale="false"
          loading-height="200px"
          :src="songListDetail.coverImgUrl "
        />
        <div class="flex-1 ml-4">
          <div class="flex items-center">
            <n-tag type="primary">
              歌单
            </n-tag>
            <p class="ml-4 text-2xl font-bold">
              {{ songListDetail.name }}
            </p>
          </div>
          <div class="mt-3 text-sm flex-items-center">
            <n-avatar round :size="30" :src="songListDetail.creator.avatarUrl" />
            <span class="pl-4 text-primary">{{ songListDetail.creator.nickname }}</span>
            <div class="ml-3 text-gray-600">
              <n-time :time="songListDetail.createTime" type="date" />
              <span>创建</span>
            </div>
          </div>
          <div class="mt-3">
            <n-space>
              <n-button size="medium" type="primary" round>
                <template #icon>
                  <n-icon :component="Play" />
                </template>
                播放全部
                <div class="ml-4 ">
                  <n-tooltip placement="bottom-start" trigger="hover">
                    <template #trigger>
                      <n-icon :component="AddOutline" size="20" />
                    </template>
                    <span>添加全部到播放列表</span>
                  </n-tooltip>
                </div>
              </n-button>
              <n-button size="medium" round :disabled="songListDetail.userId === mainStore.userProfile.profile.userId">
                <template #icon>
                  <n-icon :component="songListDetail.subscribed ? Star : StarOutline" />
                </template>
                {{ songListDetail.subscribed ? '已收藏' :' 收藏' }}
                ({{ songListDetail.subscribedCount }})
              </n-button>
              <n-button size="medium" round>
                <template #icon>
                  <n-icon :component="ShareSocialOutline" />
                </template>
                分享
                ({{ songListDetail.shareCount }})
              </n-button>
            </n-space>
          </div>
          <div class="mt-3">
            <div v-if="!songListDetail.isMyLike">
              <span>标签</span>
              <span class="px-1">:</span>
              <span class="text-primary"> {{ songListDetail.tags.join(' / ') }} </span>
              <span v-if="isMySongList" class="cursor-pointer text-primary"> 添加标签</span>
            </div>
            <div class="flex">
              <div>
                <span>歌曲</span>
                <span class="px-1">:</span>
                {{ songListDetail.trackCount }}
              </div>
              <div class="ml-4">
                <span>歌曲</span>
                <span class="px-1">:</span>
                {{ formateNumber(songListDetail.playCount) }}
              </div>
            </div>
            <div v-if="!songListDetail.isMyLike" class="flex">
              <n-ellipsis
                expand-trigger="click" line-clamp="1"
                :tooltip="false"
              >
                <span>简介</span>
                <span class="px-1">:</span>
                <span v-if="isMySongList" class="cursor-pointer text-primary">添加简介</span>
                {{ songListDetail.description }}
              </n-ellipsis>
            </div>
          </div>
        </div>
      </div>
    </n-spin>
  </div>
</template>

<style scoped>

</style>
