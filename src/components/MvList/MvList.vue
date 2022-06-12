<script setup lang="ts">
import MvListImgItem from './MvListImgItem.vue';
defineProps<{
  list?: any[]
  cols?: number;
}>();
</script>

<template>
  <div v-if="list && list.length !== 0">
    <n-grid
      cols="2 s:3 m:4 l:4 xl:4 2xl:4"
      responsive="screen"
      x-gap="20"
      y-gap="20"
    >
      <n-grid-item
        v-for="item in list"
        :key="item.id"
        class="group"
      > 
        <mv-list-img-item :item="item" />
        <div>
          <p class="mt-1 text-base">
            <n-ellipsis> {{ item.name }}</n-ellipsis>
          </p>
          <p class="mt-2 w-full text-sm opacity-60">
            <n-ellipsis> {{ item.artistName }}</n-ellipsis>
          </p>
        </div>
      </n-grid-item>
    </n-grid>
  </div>
  <div v-else> 
    <n-empty description="暂无数据" />
  </div>
</template>

<style scoped>
.light-green {
  height: 150px;
  background-color: rgba(0, 128, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
