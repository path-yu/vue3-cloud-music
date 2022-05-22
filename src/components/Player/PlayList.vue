<script setup lang="ts">
import { ref } from 'vue';

export interface PlayListExpose{
  show:() => void
}
const active = ref(false);

defineExpose({
  show() {
    active.value = true;
  }
});

</script>

<template>
  <n-drawer
    v-model:show="active"
    :width="200"
    :height="200"
    placement="right"
    :trap-focus="false"
    :block-scroll="false"
  >
    <n-drawer-content title="斯通纳">
      《斯通纳》是美国作家约翰·威廉姆斯在 1965 年出版的小说。
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>

</style>
