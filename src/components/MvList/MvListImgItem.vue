<script setup lang="ts">
import { formateNumber } from '@/utils/index';
import { Play } from '@vicons/carbon';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
const props = withDefaults(
  defineProps<{
  item:any;
  height?:string;
  isToDetail?:boolean;
}>(), {
    height: '9vw',
    isToDetail: true
  }
);
const emit = defineEmits(['handle-img-click']);
const router = useRouter();
const toDetail = (id:number) => {
  if (props.isToDetail) {
    router.push(`/mv/${id}`);
  }
  emit(
    'handle-img-click', id
  );
};
</script>
<template>
  <div class="overflow-hidden relative rounded-md"> 
    <load-img
      :loading-height="height"
      class-name="w-full rounded-md"
      :src="item.picUrl || item.cover"
      @click="toDetail(item.id)"
    />
    <div
      class="flex absolute top-0 right-0 justify-end  items-center p-1 w-full text-white rounded-t-md card-mask"
    >
      <n-icon :component="Play" />
      <span class="pl-1">{{ formateNumber(item.playCount) }}</span>
    </div>
    <play-icon
      class="cursor-pointer position-center"
      style="width: 40px;height: 40px;"
    />
    <p v-if="item.copywriter" class="tips">
      {{ item.copywriter }}
    </p>
    <div class="absolute bottom-0 w-full text-right rounded-b-md bg-linear-mask">
      <n-time
        class="mr-2 text-white"
        :time="item.duration"
        format="mm:ss"
      />
    </div>
  </div>
</template>