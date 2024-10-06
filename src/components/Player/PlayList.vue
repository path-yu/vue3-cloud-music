<script setup lang="ts">
import useThemeStyle from '@/hook/useThemeStyle';
import useValidateVipSong from '@/hook/useValidateVipSong';
import { useMainStore } from '@/stores/main';
import { formateSongsAuthor } from '@/utils';
import { VolumeMuteFilled, VolumeUpFilled } from '@vicons/material';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export interface PlayListExpose {
  show: () => void
}
const active = ref(false);
const mainStore = useMainStore();
const router = useRouter();
let isLoad = false;
const { stripedClass, themeVars, tagColor } = useThemeStyle();

defineExpose({
  show() {
    active.value = true;
  }
});
// 双击播放
const handleDoubleClick = async (index: number, item: any) => {
  const value = useValidateVipSong(mainStore.playList[index]);
  if (value) return;
  if (isLoad) return;
  isLoad = true;
  await mainStore.changePlayIndex(index, item);
  isLoad = false;
};
// 点击清空播放列表
const handleRestClick = () => {
  mainStore.resetPlayList();
};
const handleGoHemeClick = () => {
  router.push('/discovery');
  active.value = false;
};
</script>

<template>
  <n-drawer v-model:show="active" :width="450" placement="right" :trap-focus="false" :block-scroll="false">
    <n-drawer-content>
      <template #header>
        <div class="flex justify-between odd:" style="width:400px">
          <span class="text-sm opacity-50">共 {{ mainStore.playListCount }} 首 </span>
          <n-button type="primary" text @click="handleRestClick">
            清空列表
          </n-button>
        </div>
      </template>
      <!--  -->
      <n-empty v-if="mainStore.playList.length === 0" class="mt-20" description="您还未添加任何歌曲">
        <template #extra>
          <n-button size="small" text type="primary" @click="handleGoHemeClick">
            去首页发现音乐
          </n-button>
        </template>
      </n-empty>
      <DynamicScroller class="scroller" :items="mainStore.playList" :min-item-size="45" key-field="id">
        <template #default="{ item, index }">
          <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[
            item.message,
          ]" :data-index="index">
            <div :class="'flex justify-between text-sm item ' + stripedClass(index)"
              @dblclick="handleDoubleClick(index, item)">
              <div class="flex overflow-hidden flex-1 items-center pr-2">
                <n-icon v-if="+mainStore.currentPlayIndex === index" style="padding-right:5px" :color="mainStore.playing
                  ? themeVars.primaryColor
                  : themeVars.textColor1" :component="mainStore.playing
                    ? VolumeUpFilled
                    : VolumeMuteFilled" />
                <p class="truncate" style="max-width:'140px'">
                  {{ item.name }}
                </p>
                <n-tag v-if="item.mv !== 0" size="small" :color="tagColor" class="ml-2"
                  @click="router.push(`/mv/${item.mv}`)">
                  MV
                </n-tag>
                <n-tag v-if="item.fee === 1" size="small" :color="tagColor" class="ml-2">
                  VIP
                </n-tag>
                <n-tag v-if="item.fee === 0" size="small" class="ml-2">
                  无音源
                </n-tag>
              </div>
              <p class=" w-24 truncate">
                {{ formateSongsAuthor(item?.ar || []) }}
              </p>
              <n-time class="pl-4 opacity-40" format="mm:ss" :time="item?.dt" />
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
.scroller {
  height: 100%;
}

:deep(.resize-observer) {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  pointer-events: none;
  display: block;
  overflow: hidden;
  opacity: 0;
}

.item {
  padding: 12px 20px;
  cursor: pointer;
}

:deep(.n-drawer-body-content-wrapper) {
  padding: 0 !important;
  padding-bottom: 15px;
}
</style>
