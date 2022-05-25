<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { formateSongsAuthor, isEven } from '@/utils';
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
const tagColor = computed(() => {
  return {
    textColor: themeVars.value.primaryColor,
    borderColor: themeVars.value.primaryColor
  };
});

defineExpose({
  show() {
    active.value = true;
  }
});

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
          <n-button type="primary" text>
            清空列表
          </n-button>
        </div>
      </template>
      <RecycleScroller
        v-slot="{ item,index }"
        class="scroller"
        :items="mainStore.playList"
        :item-size="45"
        key-field="id"
      >
        <div :style="{background:isEven(index) ? themeVars.tableColorStriped : themeVars.tableColor}" class="flex justify-between text-sm item">
          <div class="flex-1 pr-2 w-28 truncate">
            {{ item.name }}
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
      </RecycleScroller>
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
