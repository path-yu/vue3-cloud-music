<script setup lang="ts">
import type { SelectSongListTagModalExpose } from '@/components/SongsList/SelectSongListTagModal.vue';
import { updatePlayListCover, updatePlayListInfo } from '@/service';
import { getImgSize } from '@/utils';
import type { FormInst, FormRules } from 'naive-ui';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const query = route.query as {
  tags:string;
  songListName:string;
  desc:string;
  coverUrl:string;
};
const desc = ref(query.desc || '');
const selectSongListTagRef = ref<SelectSongListTagModalExpose>();
const formRef = ref<FormInst | null>();
const saveBtnLoading = ref(false);
const fileRef = ref<HTMLElement>();
const coverUrl = ref(query.coverUrl);
const modelRef = ref({ songListName: query.songListName });
const selectTags = ref(query.tags
  ? query.tags.split(',')
  : [] || []);

const rules:FormRules = {
  songListName: {
    required: true,
    message: '表单名不能为空',
    trigger: ['input', 'blur']
  }
};
const handleCompleteClick = (tags:any[]) => {
  if (tags.length === 0) {
    return window.$message.warning('请选择标签');
  }
  selectTags.value = tags.map(item => item.name);
  return selectSongListTagRef.value?.close();
};
const handleSaveClick = () => {
  let params = {
    id: route.params.id as string,
    name: modelRef.value.songListName,
    tags: selectTags.value.join(';'),
    desc: desc.value
  };
  formRef.value?.validate((errors) => {
    if (!errors) {
      saveBtnLoading.value = true;
      updatePlayListInfo(params).then(res => {
        if (res.data.code === 200) {
          window.$message.success('保存成功!');
          saveBtnLoading.value = false;
        }
      });
    } 
  });
};
const handleChangCoverClick = () => {
  fileRef.value?.click();
};
const handleFileChange = async (event:Event) => {
  let target = event.target as HTMLInputElement;
  if (target.files) {
    let file = target.files[0];
    window.$message.loading('封面上传中', { duration: 0 });
    let imgSize = await getImgSize(file);
    updatePlayListCover(
      file, imgSize.width, route.params.id as string
    ).then((res) => {
      if (res.data.code === 200) {
        window.$message.destroyAll();
        window.$message.success('更新封面成功!');
        coverUrl.value = res.data.data.url;
      }
    });
  }
};
</script>

<template>
  <div class="p-8">
    <h2>编辑歌单信息</h2>
    <div class="flex">
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
            <n-button
              :loading="saveBtnLoading" round size="medium"
              type="primary" @click="handleSaveClick"
            >
              保存
            </n-button>
            <n-button round size="medium" @click="router.back()">
              取消
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
      <div class="flex flex-col items-center ml-40">
        <n-image
          width="200"
          class="rounded-md"
          :src="coverUrl"
        />
        <n-button class="mt-8" @click="handleChangCoverClick">
          修改封面
        </n-button>
        <input
          id="file" ref="fileRef" class="opacity-0"
          type="file"
          @change="handleFileChange"
        >
      </div>
    </div>
  </div>
  <!-- 标签选择弹窗 -->
  <select-song-list-tag-modal
    ref="selectSongListTagRef"
    :handle-complete-click="handleCompleteClick" 
  />
</template>
<style scoped>
:deep(.submitFormItem>.n-form-item-label){
  opacity: 0;
}
</style>