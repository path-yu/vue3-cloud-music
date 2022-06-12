<template>
  <n-grid cols="5" :x-gap="12" :y-gap="8">
    <n-grid-item v-for="(item, index) in 15" :key="index" class="group cursor-pointer">
      <n-skeleton height="15vw" width="100%" :sharp="false" />
      <n-skeleton text :sharp="false" />
    </n-grid-item>
  </n-grid>
</template>

<style scoped>
</style>
