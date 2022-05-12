<script setup lang="ts">

import { getPlaylistAllDetail, getPlaylistDetail, getTopPlayListTags, updatePlaylistTags } from '@/service';
import type { AnyObject } from 'env';
import { formateNumber } from '@/utils';
import { computed, ref, shallowRef, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadImg from '@/components/Base/LoadImg.vue';
import { Play, AddOutline, StarOutline, Star, ShareSocialOutline } from '@vicons/ionicons5';
import { Edit } from '@vicons/carbon';
import { useMainStore } from '@/stores/main';
import type { SelectSongListTagModalExpose } from '@/components/SongsList/SelectSongListTagModal.vue';

const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const songListDetail = shallowRef<AnyObject>();
const isLoading = ref(true);
const selectTagList = ref<any[]>([]);
const imageRef = ref();
const tagList = ref<any[]>([]);
const selectSongListTagRef = ref<SelectSongListTagModalExpose>();
const btnLoading = ref(false);
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
    console.log(res.data);
    
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
    tagList.value = res.data.tags.map((item: any) => {
      item.checked = false;
      return item;
    });
  });
};
fetchPlayListTags();

const handleTagClick = (
  item:{checked:boolean, name:string}, index:number
) => {
  if (selectTagList.value.length === 3 && !item.checked) {
    window.$message.warning('最多可选三个标签');
    return;
  }
  if (!item.checked) {
    selectTagList.value.push(item);
  } else {
    let removeIndex = selectTagList.value.findIndex(val => val.name === item.name);
    if (index) {
      selectTagList.value.splice(
        removeIndex, 1
      );
    }
  }
  item.checked = !item.checked;
};
const handleCompleteClick = () => {
  let detail = songListDetail.value as AnyObject;
  let tags = selectTagList.value.map((item: { name: any; }) => item.name);
  let params = {
    id: detail.id,
    tags: tags.join(';')
  };
  btnLoading.value = true;
  updatePlaylistTags(params).then(res => {
    if (res.data.code === 200) {
      window.$message.success('标签设置成功');
      (songListDetail.value as AnyObject).tags = tags;
      selectSongListTagRef.value?.close();
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
  router.push('/songList/edit/'+id);
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
        <div class="flex-1 ml-4">
          <div class="flex items-center">
            <n-tag type="primary">
              歌单
            </n-tag>
            <p class="ml-4 text-2xl font-bold">
              {{ songListDetail.name }}
            </p>
            <div class="ml-2" style="line-height:0" @click="toSongListEdit">
              <n-icon :size="20" :component="Edit" />
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
              <n-button size="medium" round :disabled="starButtonDisabled">
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
              <span class="cursor-pointer text-primary"> {{ songListDetail.tags.join(' / ') }} </span>
              <span v-if="isMySongList && !songListDetail.tags.length" class="cursor-pointer text-primary" @click="() => selectSongListTagRef?.show()"> 添加标签</span>
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
            <div v-if="isMySongList && !songListDetail.description" class="flex">
              <span>简介</span>
              <span class="px-1">:</span>
              <span v-if="isMySongList && !songListDetail.description" class="cursor-pointer text-primary" @click="toSongListEdit">添加简介</span>
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
        :handle-tag-click="handleTagClick"
        :btn-loading="btnLoading"
        :tag-list="tagList"
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
