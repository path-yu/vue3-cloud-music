<script setup lang="ts">

import { getPlaylistAllDetail, getPlaylistComment, getPlaylistDetail, sendComment, updatePlayListSubscribe, updatePlaylistTags } from '@/service';
import type { AnyObject } from 'env';
import { formateNumber, getArrLast } from '@/utils';
import { computed, reactive, ref, toRaw, watch, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadImg from '@/components/Base/LoadImg.vue';
import { Play, AddOutline, StarOutline, Star, ShareSocialOutline } from '@vicons/ionicons5';
import { Edit } from '@vicons/carbon';
import { useMainStore } from '@/stores/main';
import type { SelectSongListTagModalExpose } from '@/components/SongsList/SelectSongListTagModal.vue';
import { useDialog } from 'naive-ui';
import obverser from '@/utils/obverser';
import { userCheckLogin } from '@/hook/useCheckLogin';


let backTopEle:HTMLElement;
const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const songListDetail = ref<AnyObject>();
const tabsValue = ref('musicList');
const commentValue = ref('');
const songListComment = ref<AnyObject>({});
const pageParams = reactive({
  pageCount: 10,
  page: 1,
  pageSize: 50
});
const imageRef = ref();
const selectSongListTagRef = ref<SelectSongListTagModalExpose>();
const btnLoading = ref(false);
const isLoading = ref(true);
const commentLoading = ref(false);
const commentBtnLoading = ref(false);
const subscribeBtnLoading = ref(false);
const dialog = useDialog();
const songListId = ref(route.params.id as string);
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
// 获取歌单详情
const fetchSongListDetail = (id:string=route.params.id as string) => {
  isLoading.value = true;
  // fetchSongListComment();
  getPlaylistDetail(id).then(res => {
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
// 获取歌单评论
const fetchSongListComment = (id:string=route.params.id as string) => {
  let params:{
    id:string;limit:number;offset:number;before?:string;
  } = {
    id,
    limit: pageParams.pageSize,
    offset: ((pageParams.page) - 1) * pageParams.pageSize
  };
  if (songListComment.value.total > 5000) {
    params.before = songListComment.value.comments[getArrLast(songListComment.value.comments)];
  }
  commentLoading.value = true;
  getPlaylistComment(params).then(res => {
    pageParams.pageCount = Math.round(res.data.total / pageParams.pageSize) || 1;
    songListComment.value = res.data;
  })
    .finally(() => commentLoading.value = false);
};


watch(
  () => route.params, (val) => {
    let id = val.id as string;
    if (!route.path.includes('edit') && id) {
      songListId.value = id;
      fetchSongListDetail(id);
      fetchSongListComment();
    }
  }
);
fetchSongListDetail();
fetchSongListComment();
watch(
  pageParams, () => {
    backTopEle = document.querySelector('.n-back-top') as HTMLElement;
    backTopEle && backTopEle.click();
    fetchSongListComment();
  }
);
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
  if (!mainStore.isLogin) {
    return window.$message.error('请先登录');
  }
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
        subscribeBtnLoading.value = true;
        updatePlayListSubscribe(params).then((res) => {
          if (res.data.code === 200) {
            window.$message.success('取消收藏成功');
            (songListDetail.value as AnyObject).subscribed = false;
            (songListDetail.value as AnyObject).subscribedCount-=1;
            obverser.emit(
              'updateCollectPlayList', { subscribed: false, id: route.params.id }
            );
          } else {
            window.$message.error('取消收藏失败');
          }
        })
          .finally(() => subscribeBtnLoading.value = false);
      } 
    });
  } else {
    subscribeBtnLoading.value = true;
    updatePlayListSubscribe(params).then((res) => {
      if (res.data.code === 200) {
        window.$message.success('收藏成功!');
        (songListDetail.value as AnyObject).subscribed = true;
        (songListDetail.value as AnyObject).subscribedCount+=1;
        obverser.emit(
          'updateCollectPlayList', { subscribed: true, songListDetail: toRaw(songListDetail.value) }
        );
      } else {
        window.$message.error('收藏失败');
      }
    }) 
      .finally(() => subscribeBtnLoading.value = false);
  }
  return undefined;
};
// 点击完成设置标签
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
// 点击评论
const handleCommentClick = () => {
  userCheckLogin(() => {
    // 评论不能为空
    if (!commentValue.value) {
      return window.$message.error('评论不能为空!');
    }
    let params = {
      t: 1,
      content: commentValue.value,
      id: +songListId.value,
      type: 2
    };
    commentBtnLoading.value = true;
    return sendComment(params).then(res => {
      if (res.data.code === 200) {
        window.$message.success('评论成功');
        commentValue.value = '';
        res.data.comment.beReplied = [];
        updateCommentList(res.data.comment);
      }
    })
      .finally(() => {
        commentBtnLoading.value = false;
      }); 
  });
};
const updateCommentList = (value:any) => {
  songListComment.value.total += 1;
  songListComment.value.comments.unshift(value);
};
const updateCommentLiked = (
  data:{liked:boolean, index:number}, isHot:boolean
) => {
  let { index, liked } = data;
  if (isHot) {
    songListComment.value.hotComments[index].liked = liked;
    songListComment.value.hotComments[index].likedCount+=1;
  } else {
    songListComment.value.comments[index].liked = liked;
    songListComment.value.comments[index].likedCount-=1;
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
                :disabled="starButtonDisabled" :loading="subscribeBtnLoading"
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
      <div v-else style="height:200px" />
      <div :value="tabsValue" class="mt-10">
        <n-tabs type="line" :value="tabsValue">
          <n-tab name="musicList" @click="tabsValue = 'musicList'">
            歌曲列表
          </n-tab>
          <n-tab name="comment" @click="tabsValue = 'comment'">
            评论
          </n-tab>
        </n-tabs>
        <div v-show="tabsValue === 'musicList'">
          musicList
        </div>
        <div v-show="tabsValue === 'comment'" class="mt-8">
          <div>
            <n-input
              v-model:value="commentValue" type="textarea" :maxlength="140"
              :show-count="true"
            />
            <div class="flex justify-end mt-5">
              <n-button round :loading="commentBtnLoading" @click="handleCommentClick">
                评论
              </n-button>
            </div>
            <!-- 精彩评论 -->
            <comment-list
              :type="2"
              :resource-id="+songListId" title="精彩评论" :list="songListComment.hotComments || []"
              @update-comment-list="updateCommentList"
              @update-comment-liked="(data:any) => updateCommentLiked(data,true)"
            />
            <!-- 最新评论 -->
            <comment-list
              :resource-id="+songListId"
              :type="2"
              :comment-total-num="songListComment.total" title="最新评论" :list="songListComment.comments || []"
              @update-comment-list="updateCommentList"
              @update-comment-liked="(data:any) => updateCommentLiked(data,false)"
            />
            <p v-if="!songListComment.comments?.length" class="text-center opacity-50">
              还没有评论, 快来抢沙发~
            </p>
            <div v-if="pageParams.pageCount > 1" class="flex justify-end mt-6">
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
