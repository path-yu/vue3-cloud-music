<script setup lang="ts">
import { getPlaylistAllDetail, getPlaylistComment, getPlaylistDetail, sendComment, updatePlayListSubscribe, updatePlaylistTags } from '@/service';
import type { AnyObject } from 'env';
import { formateNumber, getArrLast } from '@/utils';
import { computed, reactive, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadImg from '@/components/Base/LoadImg.vue';
import { StarOutline, Star, ShareSocialOutline, Search } from '@vicons/ionicons5';
import { Edit } from '@vicons/carbon';
import { useMainStore } from '@/stores/main';
import type { SelectSongListTagModalExpose } from '@/components/SongsList/SelectSongListTagModal.vue';
import { useDialog, useThemeVars } from 'naive-ui';
import obverser from '@/utils/obverser';
import { userCheckLogin } from '@/hook/useCheckLogin';
import { useMemorizeRequest } from '@/hook/useMemorizeRequest';
import { cloneDeep } from 'lodash';
import { markSearchKeyword } from '@/utils/markSearhKeyword';

let backTopEle: HTMLElement;
let songListIndexMap = new Map();
const router = useRouter();
const route = useRoute();
const mainStore = useMainStore();
const songListDetail = ref<AnyObject>();
const songList = ref<any[]>([]);
const rawSongList = ref<any[]>([]);
const tabsValue = ref('musicList');
const commentValue = ref('');
const songListComment = ref<AnyObject>({});
const hasLoadAllSongsFished = ref(false);
const pageParams = reactive({
  pageCount: 10,
  page: 1,
  pageSize: 50
});

const imageRef = ref();
const themeVars = useThemeVars();
const selectSongListTagRef = ref<SelectSongListTagModalExpose>();
const btnLoading = ref(false);
const commentBtnLoading = ref(false);
const subscribeBtnLoading = ref(false);
const searchKeyword = ref('');
const dialog = useDialog();
const songListId = ref(route.params.id as string);
const isMySongList = computed(() => {
  return songListDetail.value
    && mainStore.userProfile
    && songListDetail.value?.userId === mainStore.userProfile?.profile?.userId;
});
const starButtonDisabled = computed(() => {
  return songListDetail.value
    && mainStore.userProfile
    && songListDetail.value?.userId === mainStore.userProfile?.profile?.userId;
});
const { wrapRequest: wrapFetchPlayList, requestLoading: isLoading, loadSuccess: loadPlayListSuccess, removeCache } = useMemorizeRequest(getPlaylistDetail, 'getPlaylistDetail');

// 获取歌单详情
const fetchSongListDetail = (id: string = route.params.id as string) => {
  wrapFetchPlayList(id).then((res: { data: { playlist: AnyObject }; }) => {
    let creator = res.data.playlist.creator;
    if (res.data.playlist.name === (creator?.nickname + '喜欢的音乐') && creator.userId === mainStore.userProfile?.profile.userId) {
      res.data.playlist.isMyLike = true;
      res.data.playlist.name = '我喜欢的音乐';
    } else {
      res.data.playlist.isMyLike = false;
    }
    songListDetail.value = res.data.playlist;
    fetchMusicList();
  }).finally(() => loadPlayListSuccess())
};
const { wrapRequest: wrapFetchPlayListComment, requestLoading: isCommentLoading, loadSuccess: loadPlayListCommentSuccess } = useMemorizeRequest(getPlaylistComment, 'getPlaylistComment');
// 获取歌单评论
const fetchSongListComment = (id: string = route.params.id as string) => {
  let params: {
    id: string; limit: number; offset: number; before?: string;
  } = {
    id,
    limit: pageParams.pageSize,
    offset: ((pageParams.page) - 1) * pageParams.pageSize
  };
  if (songListComment.value.total > 5000) {
    params.before = songListComment.value.comments[getArrLast(songListComment.value.comments)];
  }
  wrapFetchPlayListComment(params).then((res: { data: { [x: string]: any; total?: any; }; }) => {
    pageParams.pageCount = Math.round(res.data?.total || 1 / pageParams.pageSize) || 1;
    songListComment.value = res.data;
  }).finally(() => { loadPlayListCommentSuccess() })
};
const { wrapRequest, requestLoading, loadSuccess } = useMemorizeRequest(getPlaylistAllDetail, 'getPlaylistAllDetail');

const getMoreMusicList = async () => {
  let trackCount = songListDetail.value!.trackCount;
  let requestCount = Math.round((trackCount - 300) / 300);
  let requestList = [];
  for (let i = 1; i <= requestCount; i++) {
    let offset = 300 * i;
    requestList.push(getPlaylistAllDetail({ id: songListDetail.value!.id, offset: offset }));
  }
  Promise.allSettled(requestList).then((results: any[]) => {
    let allData = results.reduce((total: any[], item: { status: string; value: { data: { songs: any; }; }; }) => {
      if (item.status === 'fulfilled') {
        total = [...total, ...item.value.data.songs]
      }
      return total;
    }, [])
    let data = mainStore.mapSongListAddLike(allData);
    songList.value = songList.value.concat(data).map((item, index
    ) => ({ ...item, rawIndex: index }));
    rawSongList.value = cloneDeep(toRaw(songList).value);
    rawSongList.value.forEach((item: any, index: number) => {
      songListIndexMap.set(item.id, index);
    });
    // mainStore.updatePlayList(toRaw(songList.value))
    hasLoadAllSongsFished.value = true;
  });
}
const fetchMusicList = (id: string = route.params.id as string) => {
  wrapRequest({ id }).then((res: { data: { code: number; songs: any[]; }; }) => {
    if (res?.data?.code === 200) {
      let data = mainStore.mapSongListAddLike(res.data.songs);
      songList.value = data.map((item, index
      ) => ({ ...item, rawIndex: index }));
      rawSongList.value = cloneDeep(toRaw(songList).value);
      rawSongList.value.forEach((item: any, index: number) => {
        songListIndexMap.set(item.id, index);
      });
      if (songListDetail.value!.trackCount > 100) {
        getMoreMusicList();
      } else {
        hasLoadAllSongsFished.value = true;
      }
    }
  }).finally(() => loadSuccess());
};
const searchSongList = (keyword: string) => {
  if (!keyword) {
    songList.value = toRaw(rawSongList.value);
  } else {
    let result = rawSongList.value.filter((item: any) => {
      return item.name.includes(keyword)
        || item.ar.some((ar: any) => ar.name.includes(keyword))
        || item.al.name.includes(keyword);
    }).map(item => {
      return { ...item, isSearch: true, index: songListIndexMap.get(item.id) };
    });
    songList.value = markSearchKeyword(
      result, ['name', 'formatAuthor', ['al', 'name']], keyword, themeVars.value.primaryColor
    );
  }

};
watch(() => route.params, (val) => {
  let id = val.id as string;
  if (!route.path.includes('edit') && id && route.path.includes('songList')) {
    songListId.value = id;
    fetchSongListDetail(id);
    fetchSongListComment();
  }
});
watch(pageParams, () => {
  backTopEle = document.querySelector('.n-back-top') as HTMLElement;
  backTopEle && backTopEle.click();
  fetchSongListComment();
});
watch(() => mainStore.likeSongs, (val, oldVal) => {
  if (val.length !== oldVal.length) {
    removeCache();
  }
});
watch(searchKeyword, (val) => {
  searchSongList(val);
});
fetchSongListDetail();
fetchSongListComment();
const toSongListEdit = () => {
  let id = route.params.id;
  if (songListDetail.value) {
    router.push({
      path: '/songList/edit/' + id,
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
const handleSubscribeClick = (subscribed: boolean) => {
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
            (songListDetail.value as AnyObject).subscribedCount -= 1;
            obverser.emit('updateCollectPlayList', { subscribed: false, id: route.params.id });
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
        (songListDetail.value as AnyObject).subscribedCount += 1;
        obverser.emit('updateCollectPlayList', { subscribed: true, songListDetail: toRaw(songListDetail.value) });
      } else {
        window.$message.error('收藏失败');
      }
    })
      .finally(() => subscribeBtnLoading.value = false);
  }
  return undefined;
};
// 点击完成设置标签
const handleCompleteClick = (selectTagList: any[]) => {
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
const handleShareClick = () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    window.$message.success('链接复制成功');
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
const updateCommentList = (value: any) => {
  songListComment.value.total += 1;
  songListComment.value.comments.unshift(value);
};
const updateCommentLiked = (data: { liked: boolean, index: number }, isHot: boolean) => {
  let { index, liked } = data;
  if (isHot) {
    songListComment.value.hotComments[index].liked = liked;
    liked
      ? songListComment.value.hotComments[index].likedCount += 1
      : songListComment.value.hotComments[index].likedCount -= 1;
  } else {
    songListComment.value.comments[index].liked = liked;
    liked
      ? songListComment.value.comments[index].likedCount += 1
      : songListComment.value.comments[index].likedCount -= 1;
  }
};
const handleUpdateMusicListLike = (like: boolean, index: number) => {
  let target = songList.value[index];
  // 更新元数据
  if (target.isSearch) {
    rawSongList.value[target.index].like = like;
  }
  songList.value[index].like = like;
};
</script>
<template>
  <div class="p-8 pb-2">
    <n-spin :show="isLoading">
      <div v-if="songListDetail" class="flex justify-between">
        <load-img ref="imageRef" :has-hover-scale="false" class-name="w-52 h-52" :src="songListDetail?.coverImgUrl" />
        <div class="flex-1 ml-8">
          <div class="flex items-center">
            <n-tag type="primary">
              歌单
            </n-tag>
            <p class="ml-4 text-2xl font-bold ">
              {{ songListDetail.name }}
            </p>
            <div class="ml-2" style="line-height:0" @click="toSongListEdit">
              <n-icon v-if="isMySongList" :size="20" :component="Edit" />
            </div>
          </div>
          <div class="mt-3 text-sm flex-items-center">
            <n-avatar :img-props="{ crossorigin: 'anonymous' }" round :size="30"
              :src="songListDetail.creator.avatarUrl" />
            <span class="pl-4 text-primary">{{ songListDetail.creator.nickname }}</span>
            <div class="ml-3 text-gray-600">
              <n-time :time="songListDetail.createTime" type="date" />
              <span>创建</span>
            </div>
          </div>
          <div class="mt-3">
            <n-space>
              <play-all-button :song-list="rawSongList" :song-list-id="songListId" />
              <n-button size="medium" round :disabled="starButtonDisabled" :loading="subscribeBtnLoading"
                @click="handleSubscribeClick(songListDetail!.subscribed)">
                <template #icon>
                  <n-icon :component="songListDetail.subscribed ? Star : StarOutline" />
                </template>
                {{ songListDetail.subscribed ? '已收藏' : ' 收藏' }}
                ({{ formateNumber(songListDetail.subscribedCount) }})
              </n-button>
              <n-button size="medium" round @click="handleShareClick">
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
              <span v-if="isMySongList && !songListDetail.tags.length" class="cursor-pointer text-primary"
                @click="() => selectSongListTagRef?.show()"> 添加标签</span>
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
              <n-ellipsis expand-trigger="click" line-clamp="1" :tooltip="false">
                <span>简介</span>
                <span class="px-1">:</span>
                {{ songListDetail.description }}
              </n-ellipsis>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="height:200px" />
      <div :value="tabsValue" class="mt-5">
        <div class="flex justify-between sticky top-0 z-[999] pt-2">
          <n-tabs type="line" :value="tabsValue">
            <n-tab name="musicList" @click="tabsValue = 'musicList'">
              歌曲列表
            </n-tab>
            <n-tab name="comment" @click="tabsValue = 'comment'">
              评论 <span class="pl-1 text-sm">({{ songListComment?.total }})</span>
            </n-tab>
          </n-tabs>
          <div class="w-60" v-if="hasLoadAllSongsFished">
            <n-input v-model:value="searchKeyword" clearable size="small" placeholder="搜索歌单歌曲" round>
              <template #prefix>
                <n-icon class="cursor-pointer" :component="Search" />
              </template>
            </n-input>
          </div>
        </div>

        <div v-show="tabsValue === 'musicList'" class="mt-5">
          <music-list :song-list="songList" :raw-song-list="rawSongList" :loading="requestLoading"
            :play-list-id="songListId" @update-music-list-like="handleUpdateMusicListLike" />
        </div>
        <div v-show="tabsValue === 'comment'" class="mt-8">
          <div>
            <n-input v-model:value="commentValue" type="textarea" :maxlength="140" :show-count="true" />
            <div class="flex justify-end mt-5">
              <n-button round :loading="commentBtnLoading" @click="handleCommentClick">
                评论
              </n-button>
            </div>
            <!-- 精彩评论 -->
            <n-spin :show="isCommentLoading">
              <comment-list :type="2" :resource-id="+songListId" title="精彩评论" :list="songListComment.hotComments || []"
                @update-comment-list="updateCommentList"
                @update-comment-liked="(data: any) => updateCommentLiked(data, true)" />
              <!-- 最新评论 -->
              <comment-list :resource-id="+songListId" :type="2" :comment-total-num="songListComment.total" title="最新评论"
                :list="songListComment.comments || []" @update-comment-list="updateCommentList"
                @update-comment-liked="(data: any) => updateCommentLiked(data, false)" />
            </n-spin>
            <p v-if="!songListComment.comments?.length" class="text-center opacity-50">
              还没有评论, 快来抢沙发~
            </p>
            <div v-if="pageParams.pageCount > 1" class="flex justify-end mt-6">
              <n-pagination v-model:page="pageParams.page" v-model:page-size="pageParams.pageSize"
                :page-count="pageParams.pageCount" show-size-picker :page-sizes="[10, 20, 30, 40, 50]" />
            </div>
          </div>
        </div>
      </div>
      <!-- 标签选择弹窗 -->
      <select-song-list-tag-modal ref="selectSongListTagRef" :handle-complete-click="handleCompleteClick"
        :btn-loading="btnLoading" />
    </n-spin>
  </div>
</template>
<style scoped>
:deep(.n-card-header__main) {
  text-align: center;
}

:deep(.n-tabs .n-tabs-nav.n-tabs-nav--line-type .n-tabs-nav-scroll-content) {
  border: none;
}

.tag:hover {
  color: var(--n-color-target);
}
</style>
