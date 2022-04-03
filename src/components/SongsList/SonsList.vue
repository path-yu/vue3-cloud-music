<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
  songs: {
    type: <any>[],
  }
});

</script>

<template>
  <div class="pb-6">
    <n-grid cols="2 s:3 m:5 l:5 xl:5 2xl:7" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item v-for="(item, index) in songs" :key="index">
        <n-card  footer-style="padding: 0 10px 5px" class="songsItem" size="small">
          <template #cover>
            <n-image class="w-full h-full" :src="item.picUrl" />
          </template>
          <template #footer>
            <n-ellipsis style="max-width: 240px">
              {{item.name}}
            </n-ellipsis>
          </template>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>

</style>
