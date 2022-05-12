<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { computed, ref } from 'vue';
export interface SelectSongListTagModalExpose{
  show:() => void
  close:() => void
}
withDefaults(
  defineProps<{
  tagList:any[]
  handleTagClick:(item:any, index:number) => {}
  handleCompleteClick:() => void
  btnLoading?:boolean;
}>(), { btnLoading: false }
);

defineExpose({
  show() {
    showSelectTagModal.value = true;
  },
  close() {
    showSelectTagModal.value = false;
  }
});

const showSelectTagModal = ref(false);
const themeVars = useThemeVars();
const primaryColor = computed(() => themeVars.value.primaryColor);
</script>

<template>
  <!-- 标签选择弹窗 -->
  <n-modal v-model:show="showSelectTagModal" transform-origin="center">
    <n-card
      style="width: 600px"
      title="添加标签"
      :bordered="false"
      size="medium"
      role="dialog"
      aria-modal="true"
    >
      <span>
        <span class="opacity-60"> 选择合适的标签, 最多可选</span>
        <span :style="{color:primaryColor}" class="px-1 text-base">3</span>
        <span class="opacity-60">个</span>
      </span>
      <div class="flex flex-wrap mt-3">
        <n-space size="large">
          <n-tag
            v-for="(item,index) in tagList" :key="item.id" round
            checkable :checked="item.checked"
            @click="handleTagClick(item,index)"
          >
            {{ item.name }}
          </n-tag>
        </n-space>
        <div class="flex justify-center items-center mt-4 w-full">
          <n-button
            :loading="btnLoading" size="medium" type="primary"
            @click="handleCompleteClick"
          >
            完成
          </n-button>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>

<style scoped>

</style>
