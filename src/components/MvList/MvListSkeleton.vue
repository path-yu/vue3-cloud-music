<script setup lang="ts">
withDefaults(defineProps<{
  count?:number;
}>(), { count: 0 });
</script>

<template>
  <n-grid
    cols="4"
    responsive="screen"
    x-gap="20"
    y-gap="20"
  >
    <n-grid-item
      v-for="(item,index) in count"
      :key="index"
    >
      <n-skeleton
        height="10vw"
        width="100%"
        :sharp="false"
      />
      <n-skeleton
        text
        :repeat="2"
        :sharp="false"
      />
    </n-grid-item>
  </n-grid>
</template>