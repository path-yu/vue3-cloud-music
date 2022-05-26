<script setup lang="ts">
import useValidateVipSong from '@/hook/useValidateVipSong';
import { useMainStore } from '@/stores/main';
import { formateSongsAuthor, isEven } from '@/utils';
import { VolumeMuteFilled, VolumeUpFilled } from '@vicons/material';
import { debounce } from 'lodash';
import { useThemeVars } from 'naive-ui';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export interface PlayListExpose{
  show:() => void
}
const active = ref(false);
const mainStore = useMainStore();
const themeVars = useThemeVars();
const router = useRouter();
let isLoad = false;
const tagColor = computed(() => {
  return {
    textColor: themeVars.value.primaryColor,
    borderColor: themeVars.value.primaryColor
  };
});
const itemStyle = computed(() => {
  return (index:number) => {
    return {
      background: isEven(index)
        ? themeVars.value.tableColorStriped
        : themeVars.value.tableColor
    };
  };
});

defineExpose({
  show() {
    active.value = true;
  }
});
// 双击播放
const handleDoubleClick = async (index:number) => {
  const value = useValidateVipSong(mainStore.playList[index]);
  if (value) return;
  if (isLoad) return;
  isLoad= true;
  await mainStore.changePlayIndex(index);
  isLoad= false;
};
// 点击清空播放列表
const handleRestClick = () => {
  mainStore.resetPlayList();
};
</script>

<template>
  <n-drawer
    v-model:show="active"
    :width="450"
    placement="right"
    :trap-focus="false"
    :block-scroll="false"
  >
    <n-drawer-content>
      <template #header>
        <div class="flex justify-between odd:" style="width:400px"> 
          <span class="text-sm opacity-50">共 {{ mainStore.playListCount }} 首 </span>
          <n-button type="primary" text @click="handleRestClick">
            清空列表
          </n-button>
        </div>
      </template>
      <DynamicScroller
        class="scroller"
        :items="mainStore.playList"
        :min-item-size="45"
        key-field="id"
      >
        <template #default="{ item, index }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[
              item.message,
            ]"
            :data-index="index"
          >
            <div
              :style="itemStyle(index)"
              class="flex justify-between text-sm item"
              @dblclick="handleDoubleClick(index)"
            >
              <div class="flex-1 items-center pr-2 w-28 truncate">
                <n-icon
                  v-if="+mainStore.currentPlayIndex === index"
                  style="padding-right:5px"
                  :color="mainStore.playing
                    ? themeVars.primaryColor
                    : themeVars.textColor1" :component="mainStore.playing
                    ? VolumeUpFilled
                    :VolumeMuteFilled"
                />
                <span> {{ item.name }}</span>
                <n-tag
                  v-if="item.mv !== 0"
                  size="small" :color="tagColor" class="ml-2"
                  @click="router.push(`/mv/${item.mv}`)"
                >
                  MV
                </n-tag>
                <n-tag
                  v-if="item.fee === 1"
                  size="small" :color="tagColor" class="ml-2"
                >
                  VIP
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


:deep(.resize-observer){
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
.item{
  padding: 12px 20px;
  cursor: pointer;
}
:deep(.n-drawer-body-content-wrapper){
  padding: 0 !important;
  padding-bottom: 15px;
}

</style>
