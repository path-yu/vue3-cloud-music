<script setup lang="ts">
import { getMvList } from '@/service';
import {
  nextTick,
  reactive, ref, toRaw, watch 
} from 'vue';

const areaList = [
  '全部', '内地', '港台', '欧美', '日本', '韩国'
];
const typeList = [
  '全部', '官方版', '现场版', '原生', '网易出品'
];
const orderList = ['最热', '最新', '上升最快'];


const params = reactive({
  area: areaList[0],
  type: typeList[0],
  order: orderList[0]
});
const listIsLoading = ref(true);
const list = ref([]);
const firstFetchDataSuccess = ref(false);

const pageParams = reactive({
  pageCount: 10,
  page: 1,
  pageSize: 50
});
const fetchList = (setPageCount = true) => {
  listIsLoading.value = true;
  let data = getParams();
  console.log(data);
  
  list.value = [];
  getMvList(data).then((res: { data: { data: never[]; count: number; }; }) => {
    listIsLoading.value = false;
    list.value = res.data.data;

    if (!firstFetchDataSuccess.value) {
      firstFetchDataSuccess.value = true;
    }
    if (setPageCount) {
      if (res.data.count) {
        pageParams.pageCount = Math.round(res.data.count / pageParams.pageSize);
      } else {
        pageParams.pageCount = 50;
      }
    }

  });
};

const getParams = () => {
  return {
    ...toRaw(params),
    limit: pageParams.pageSize,
    offset: ((pageParams.page) - 1) * pageParams.pageSize
  };
};

fetchList();

watch(
  params, () => {
    fetchList();
  }
);

watch(
  [() => pageParams.page, () => pageParams.pageSize], async () => {
    fetchList(false);
    // 回到顶部
    await nextTick();
    (document.querySelector('.n-back-top') as HTMLElement).click();
  }
);

</script>

<template>
  <div class="p-6">
    <n-space vertical :size="20">
      <category-tab v-model="params.area" name="地区" :list="areaList" />
      <category-tab v-model="params.type" name="类型" :list="typeList" />
      <category-tab v-model="params.order" name="排序" :list="orderList" />
    </n-space>
    <div class="py-4">
      <MvListSkeleton v-show="listIsLoading" :count="pageParams.pageSize" />
      <mv-list v-show="!listIsLoading" :list="list" />
      <div v-if="firstFetchDataSuccess" class="flex justify-end mt-4">
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
</template>