<script setup lang="ts">

import { getPlaylistAllDetail, getPlaylistDetail } from '@/service';
import type { AnyObject } from 'env';
import { ref, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadImg from '../../components/Base/LoadImg.vue';
const router = useRouter();
const route = useRoute();
const songListId = route.params.id as string;
const songListDetail = shallowRef<AnyObject>();
console.log(songListId);
const fetchSongListDetail = () => {
  getPlaylistDetail(songListId).then(res => {
    songListDetail.value = res.data.playlist;
  });
};
fetchSongListDetail();
</script>

<template>
  <div v-if="songListDetail" class="p-8">
    <div class="flex justify-between">
      <div>
        <load-img
          :has-hover-scale="false"
          loading-height="250px"
          :src="songListDetail.coverImgUrl "
        />
      </div>
      <div class="flex-1 ml-4 right">
        <div class="flex items-center">
          <n-tag type="primary">
            歌单
          </n-tag>
          <h2 class="ml-4">
            我喜欢的音乐
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
