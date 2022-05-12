<script setup lang="ts">
import type { SelectSongListTagModalExpose } from '@/components/SongsList/SelectSongListTagModal.vue';
import { getTopPlayListTags } from '@/service';
import { useAsyncState } from '@vueuse/core';
import type { FormRules } from 'naive-ui';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const query = route.query as {
  tags:string;
  songListName:string;
  desc:string;
};
const desc = ref(query.desc || '');
const selectSongListTagRef = ref<SelectSongListTagModalExpose>();
const { state: tagList } = useAsyncState(
  getTopPlayListTags().then((res) => {
    return res.data.tags.map((item: any) => {
      item.checked = false;
      return item;
    });
  }), []
);
const modelRef = ref({ songListName: query.songListName });
const selectTags = ref(query.tags.split(',') || []);

const rules:FormRules = {
  songListName: {
    required: true,
    message: '表单名不能为空',
    trigger: ['input', 'blur']
  }
};
const handleCompleteClick = () => {
  
};
const handleTagClick = () => {

};
</script>

<template>
  <div class="p-8">
    <h2>编辑歌单信息</h2>
    <n-form
      ref="formRef"
      :rules="rules"
      :model="modelRef"
      label-placement="left"
      label-width="auto"
      require-mark-placement="right-hanging"
      :style="{
        width: '640px'
      }"
    >
      <n-form-item label="歌单名：" path="songListName">
        <n-input v-model:value="modelRef.songListName" placeholder="请输入歌单名" />
      </n-form-item>
      <n-form-item label="标签：">
        <n-space>
          <n-tag
            v-for="(item,index) in selectTags" :key="index" round
            size="small"
          >
            {{ item }}
          </n-tag>
          <n-button text @click="selectSongListTagRef?.show()">
            添加标签
          </n-button>
        </n-space>
      </n-form-item>
      <n-form-item label="简介：">
        <n-input
          v-model:value="desc" maxlength="1000" type="textarea"
          :show-count="true"
          placeholder="请输入歌单简介"
        />
      </n-form-item>
      <n-form-item label="提交：" class="submitFormItem">
        <n-space>
          <n-button round size="medium" type="primary">
            保存
          </n-button>
          <n-button round size="medium">
            取消
          </n-button>
        </n-space>
      </n-form-item>
    </n-form>
    <!-- 标签选择弹窗 -->
    <select-song-list-tag-modal
      ref="selectSongListTagRef"
      :handle-complete-click="handleCompleteClick" 
      :handle-tag-click="handleTagClick"
      :tag-list="tagList"
    />
  </div>
</template>
<style scoped>
:deep(.submitFormItem>.n-form-item-label){
  opacity: 0;
}
</style>