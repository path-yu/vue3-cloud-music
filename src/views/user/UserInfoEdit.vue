<template>
  <div class=" px-10 pt-2">
    <h2>编辑个人信息</h2>

    <div class="flex">
      <n-form ref="formRef" :model="model" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging" :style="{
          width: '640px'
        }">
        <n-form-item label="昵称：" required path="nickname">
          <n-input v-model:value="model.nickname" placeholder="请输入昵称" />
        </n-form-item>
        <n-form-item label="介绍：" path="textareaValue">
          <n-input v-model:value="model.signature" type="textarea" :autosize="{
            minRows: 3,
            maxRows: 5
          }" />
        </n-form-item>

        <n-form-item label="性别：" path="radioGroupValue">
          <n-radio-group v-model:value="model.gender" name="radiogroup1">
            <n-space>
              <n-radio :value="0">
                保密
              </n-radio>
              <n-radio :value="1">
                男
              </n-radio>
              <n-radio :value="2">
                女
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item label="生日：" path="selectValue">
          <n-select v-model:value="birthday.year" :options="yearOption" />
          <div class="ml-4 w-full">
            <n-select v-model:value="birthday.month" :options="monthOption" />
          </div>
          <div class="ml-4 w-full">
            <n-select v-model:value="birthday.day" :options="dayOption" />
          </div>
        </n-form-item>
        <n-form-item label="地区：" path="selectValue">
          <div class="flex" style="width:66%">
            <n-select v-model:value="model.province" :options="provinceOption" />
            <div class="ml-4 w-full">
              <n-select v-model:value="model.city" :options="cityOption" />
            </div>
          </div>
        </n-form-item>
        <n-form-item label="提交：" class="submitFormItem">
          <div style="display: flex; justify-content: flex-end">
            <n-button size="large" round type="primary" :loading="btnSaveLoading" :disabled="btnSaveDisabled"
              @click="handleValidateButtonClick">
              保存
            </n-button>
            <n-button size="large" class="ml-4" round @click="router.back()">
              取消
            </n-button>
          </div>
        </n-form-item>
      </n-form>
      <div class="flex flex-col items-center ml-40">
        <img width="200" crossorigin="anonymous" class="rounded-md" :src="avatarUrl" />
        <n-button :loading="updateAvatarLoading" class="mt-8" @click="handleAvatarButtonClick">
          修改头像
        </n-button>
        <input id="file" ref="fileRef" class="opacity-0" type="file" @change="handleFileChange">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw, watch } from 'vue';
import { compareObject, generalTimeOptions, getDayOptions, getImgSize } from '@/utils';
import type { FormInst } from 'naive-ui';
import { useRouter } from 'vue-router';
import regionList from '@/assets/js/region.json';
import { useMainStore } from '@/stores/main';
import { updateUserAvatar, updateUserInfo } from '@/service';
import type { AnyObject } from 'env';

const rules = {
  nickname: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入昵称'

  }
};
const indexMap = new Map();
const initProvinceIndex = () => {
  regionList.forEach((val, index) => {
    if (val.provinceList) {
      val.provinceList.forEach((item) => {
        indexMap.set(Object.values(item)[0], index);
      });
    }
    indexMap.set(val.value, index);
  });
};

initProvinceIndex();

let nowYear = new Date().getFullYear();
const yearOption = generalTimeOptions(
  1920, nowYear, '年'
);
const monthOption = generalTimeOptions(
  1, 12, '月'
);
let isInit = false;
const formRef = ref<FormInst | null>(null);
const mainStore = useMainStore();
const btnSaveLoading = ref(false);
const btnSaveDisabled = ref(true);
const updateAvatarLoading = ref(false);
const fileRef = ref<HTMLElement>();
const profile = mainStore.userProfile?.profile;
const avatarUrl = ref(profile?.avatarUrl);

const model = ref<{
  nickname: string,
  signature: string,
  gender: number;
  birthday: number | string,
  province: number | string,
  city: number | string,
}>({
  nickname: profile.nickname,
  signature: profile.signature,
  gender: profile.gender,
  birthday: '',
  province: '',
  city: ''
});
let rawModel: { nickname: string; signature: string; gender: number; birthday: string | number; province: string | number; city: string | number; };

const birthday = ref<{
  year: string | number,
  month: string | number,
  day: string | number
}>({
  year: '',
  month: '',
  day: ''
});
const dayOption = ref(getDayOptions(2));
const provinceOption = ref(regionList);
const cityOption = ref(regionList[0].cityList);
const router = useRouter();

watch(() => model.value.province, (val) => {
  let index = indexMap.get(val);
  let target = regionList[index];
  cityOption.value = target.cityList;
  model.value.city = target.cityList[0].value;
});
watch(() => birthday.value.year, (val) => {
  if (isInit) return;
  birthday.value.month = 1;
  dayOption.value = getDayOptions(1, +val);
  birthday.value.day = 1;
  changeModelBirthday();
});
watch(() => birthday.value.month, (val) => {
  if (isInit) return;
  dayOption.value = getDayOptions(+val);
  birthday.value.day = 1;
  changeModelBirthday();
});
watch(
  model, (val) => {
    // 对比是否发生了变化
    if (rawModel) {
      btnSaveDisabled.value = compareObject(toRaw(val), rawModel);
    }
  }, { deep: true }
);
const initData = () => {
  let date = new Date(profile.birthday);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  isInit = true;
  birthday.value = {
    year,
    month,
    day
  };
  model.value.birthday = profile.birthday;
  let province = regionList[indexMap.get(profile.province)];

  model.value.province = province.value;
  cityOption.value = province.cityList;

  model.value.city = profile.city;
  rawModel = JSON.parse(JSON.stringify(toRaw(model.value)));
  isInit = false;
};
const changeModelBirthday = () => {
  // 将日期转为时间戳
  let date = new Date(
    +birthday.value.year,
    +birthday.value.month - 1,
    +birthday.value.day
  );
  let timestamp = date.getTime();
  model.value.birthday = timestamp;
};
initData();

const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault();
  formRef.value?.validate((errors: any) => {
    if (!errors) {
      let params = { ...toRaw(model.value) };
      // 如果为直辖市或者特别行政区
      if (params.province === 1 || params.province === 2) {
        let target = regionList[indexMap.get(params.province)];
        let provinceList = target.provinceList as [];
        let cityName = target.cityList.find(item => item.value === params.city)?.label as string;
        let provinceId = provinceList.find(item => item[cityName]) as unknown as AnyObject;
        params.province = Object.values(provinceId)[0];
      }
      btnSaveLoading.value = true;
      updateUserInfo(params).then((res) => {
        if (res.data.code === 200) {
          window.$message.success('修改个人资料成功!');
          // 保存成功更新原始数据
          rawModel = JSON.parse(JSON.stringify(toRaw(model.value)));
          mainStore.userProfile!.profile = {
            ...mainStore.userProfile!.profile,
            ...params
          };
          localStorage.userProfile = JSON.stringify(toRaw(mainStore.userProfile));
          btnSaveDisabled.value = true;
          btnSaveLoading.value = false;
        }
      });

    } else {
      window.$message.error('验证失败');
    }
  });
};
// 点击修改头像
const handleAvatarButtonClick = () => {
  fileRef.value?.click();
};
// 选择文件回调
const handleFileChange = async (event: Event) => {
  let target = event.target as HTMLInputElement;
  if (target.files) {
    let file = target.files[0];
    updateAvatarLoading.value = true;
    let imgSize = await getImgSize(file);
    updateUserAvatar(file, imgSize.width).then((res) => {
      if (res.data.code === 200) {
        window.$message.success('修改头像成功!');
        updateAvatarLoading.value = false;
        avatarUrl.value = res.data.data.url;
        mainStore.userProfile!.profile.avatarUrl = res.data.data.url;
        localStorage.userProfile = JSON.stringify(toRaw(mainStore.userProfile));
      }
    });
  }
};
</script>
<style scoped>
:deep(.submitFormItem>.n-form-item-label) {
  opacity: 0;
}
</style>