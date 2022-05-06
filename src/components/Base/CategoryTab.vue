<script setup lang="ts">
import { ref } from 'vue';

export interface MvListItemProps {
  name: string;
  list: string[];
  modelValue?:string;
}
const props = defineProps<MvListItemProps>();
const emit = defineEmits(['update:modelValue']);
let activeIndex = ref(0);
let categoryValue = ref(props.list[0]);

const handleClick = (
  item:string, index:number
) => {
  activeIndex.value = index;
  categoryValue.value = item;
  emit(
    'update:modelValue', item
  );
};
</script>

<template>
  <div class="flex items-center">
    <span> {{ name }}： </span>
    <div class="w-3/5">
      <div class="flex">
        <div
          v-for="(item, index) in list"
          :key="index"
          style="flex: 0.1666;"
          class="flex relative justify-center  items-center text-center cursor-pointer"
          @click="handleClick(item, index)"
        >
          <n-tag
            round checkable
            :checked="index === activeIndex" 
          >
            {{ item }}
          </n-tag>
          <div v-if="index !== list.length - 1" class="after-border" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.after-border::after{
  content: '';
  position: absolute;
  right: 0;
  transition: opacity .3s;
  @apply w-px h-3 bg-gray-400/30;
}
</style>
