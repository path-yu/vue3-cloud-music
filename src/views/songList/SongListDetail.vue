<script setup lang="ts">

import { getPlaylistAllDetail, getPlaylistDetail, updatePlayListSubscribe, updatePlaylistTags } from '@/service';
import type { AnyObject } from 'env';
import { formateNumber } from '@/utils';
import { computed, ref, shallowRef, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadImg from '@/components/Base/LoadImg.vue';
import { Play, AddOutline, StarOutline, Star, ShareSocialOutline } from '@vicons/ionicons5';
import { Edit } from '@vicons/carbon';
import { useMainStore } from '@/stores/main';
import type { SelectSongListTagModalExpose } from '@/components/SongsList/SelectSongListTagModal.vue';
import { useDialog } from 'naive-ui';

const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const songListDetail = ref<AnyObject>();
const isLoading = ref(true);
const imageRef = ref();
const selectSongListTagRef = ref<SelectSongListTagModalExpose>();
const btnLoading = ref(false);
const dialog = useDialog();

const isMySongList = computed(() => {
  return songListDetail.value 
   && mainStore.userProfile
   && songListDetail.value.userId === mainStore.userProfile.profile.userId;
});
const starButtonDisabled = computed(() => {
  return songListDetail.value 
   && mainStore.userProfile
    && songListDetail.value.userId === mainStore.userProfile.profile.userId;
});
const fetchSongListDetail = (songListId:string) => {
  isLoading.value = true;
  getPlaylistDetail(songListId).then(res => {
    if (res.data.playlist.name === (res.data.playlist.creator.nickname +'喜欢的音乐')) {
      res.data.playlist.isMyLike = true;
      res.data.playlist.name = '我喜欢的音乐';
    } else {
      res.data.playlist.isMyLike = false;
    }
    isLoading.value = false;
    songListDetail.value = res.data.playlist;
  });
};


const handleCompleteClick = (selectTagList:any[]) => {
  let detail = songListDetail.value as AnyObject;
  let tags = selectTagList.map((item: { name: any; }) => item.name);
  if (tags.length === 0) {
    return window.$message.warning('请选择标签');
  }
  let params = {
    id: detail.id,
    tags: tags.join(';')
  };
  btnLoading.value = true;
  return updatePlaylistTags(params).then(res => {
    if (res.data.code === 200) {
      window.$message.success('标签设置成功');
      (songListDetail.value as AnyObject).tags = tags;
      selectSongListTagRef.value?.close();
    } else {
      window.$message.error('标签设置失败');
    }
    btnLoading.value = false;
  });
};
watchEffect(() => {
  if (!route.path.includes('edit')) {
    fetchSongListDetail(route.params.id as string);
  }
});
const toSongListEdit = () => {
  let id = route.params.id;
  if (songListDetail.value) {
    router.push({
      path: '/songList/edit/'+id,
      query: {
        songListName: songListDetail.value.name,
        desc: songListDetail.value.description,
        tags: songListDetail.value.tags.join(','),
        coverUrl: songListDetail.value.coverImgUrl
      }
    });
  }
};
// 点击收藏/取消收藏事件
const handleSubscribeClick = (subscribed:boolean) => {
  let params = {
    id: route.params.id as string,
    t: subscribed
      ? 2
      : 1
  };
  if (params.t === 2) {
    dialog.warning({
      title: '警告',
      content: '确定不在收藏该歌单?',
      positiveText: '确定', 
      onPositiveClick: () => {
        console.log('确定');
        updatePlayListSubscribe(params).then((res) => {
          if (res.data.code === 200) {
            window.$message.success('取消收藏成功');
            (songListDetail.value as AnyObject).subscribed = false;
            (songListDetail.value as AnyObject).subscribedCount-=1;
          } else {
            window.$message.error('取消收藏失败');
          }
        });
      } 
    });
  } else {
    updatePlayListSubscribe(params).then((res) => {
      if (res.data.code === 200) {
        window.$message.success('收藏成功!');
        (songListDetail.value as AnyObject).subscribed = true;
        (songListDetail.value as AnyObject).subscribedCount+=1;
      } else {
        window.$message.error('收藏失败');
      }
    });
  }
};

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
        <div class="flex-1 ml-8">
          <div class="flex items-center">
            <n-tag type="primary">
              歌单
            </n-tag>
            <p class="ml-4 text-2xl font-bold">
              {{ songListDetail.name }}
            </p>
            <div class="ml-2" style="line-height:0" @click="toSongListEdit">
              <n-icon v-if="isMySongList" :size="20" :component="Edit" />
            </div>
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
              <n-button
                size="medium" round
                :disabled="starButtonDisabled"
                @click="handleSubscribeClick(songListDetail!.subscribed)"
              >
                <template #icon>
                  <n-icon :component="songListDetail.subscribed ? Star : StarOutline" />
                </template>
                {{ songListDetail.subscribed ? '已收藏' :' 收藏' }}
                ({{ formateNumber(songListDetail.subscribedCount) }})
              </n-button>
              <n-button size="medium" round>
                <template #icon>
                  <n-icon :component="ShareSocialOutline" />
                </template>
                分享
                ({{ formateNumber(songListDetail.shareCount) }})
              </n-button>
            </n-space>
          </div>
          <div class="mt-3">
            <div v-if="!songListDetail.isMyLike">
              <span>标签</span>
              <span class="px-1">:</span>
              <span class="cursor-pointer text-primary"> {{ songListDetail.tags.join(' / ') }} </span>
              <span
                v-if="isMySongList && !songListDetail.tags.length " 
                class="cursor-pointer text-primary" @click="() => selectSongListTagRef?.show()"
              > 添加标签</span>
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
            <div v-if="isMySongList && !songListDetail.description && !songListDetail.isMyLike" class="flex">
              <span>简介</span>
              <span class="px-1">:</span>
              <span class="cursor-pointer text-primary" @click="toSongListEdit">添加简介</span>
            </div>
            <div v-else-if="songListDetail.description" class="flex">
              <n-ellipsis
                expand-trigger="click" line-clamp="1"
                :tooltip="false"
              >
                <span>简介</span>
                <span class="px-1">:</span>
                {{ songListDetail.description }}
              </n-ellipsis>
            </div>
          </div>
        </div>
      </div>
      <!-- 标签选择弹窗 -->
      <select-song-list-tag-modal
        ref="selectSongListTagRef"
        :handle-complete-click="handleCompleteClick" 
        :btn-loading="btnLoading"
      />
    </n-spin>
  </div>
</template>

<style>
:deep(.n-card-header__main){
  text-align: center;
}
.tag:hover{
  color: var(--n-color-target);
}
</style>
