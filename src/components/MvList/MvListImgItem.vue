<script setup lang="ts">
import { formateNumber } from '@/utils/index';
import { Play } from '@vicons/carbon';
import { useRouter } from 'vue-router';
const props = withDefaults(defineProps<{
  item:any;
  height?:string;
  isToDetail?:boolean;
  borderRadius?:string;
  className?:string;
}>(), {
  height: '9vw',
  isToDetail: true,
  borderRadius: '10px',
  className: ''
});
const emit = defineEmits(['handle-img-click']);
const router = useRouter();
const toDetail = (id:number) => {
  if (props.isToDetail) {
    router.push(`/mv/${id}`);
  }
  emit('handle-img-click', id);
};
const styleBorderRadius = { borderRadius: props.borderRadius };
</script>
<template>
  <div :style="styleBorderRadius" class="overflow-hidden relative flex-1"> 
    <load-img
      :loading-height="height"
      :src="item.picUrl || item.cover"
      :class-name="className"
      @click="toDetail(item.id)"
    />
    <div
      :style="styleBorderRadius"
      class="box-border flex absolute top-0 right-0 justify-end items-center p-1 w-full text-white rounded-t-md card-mask"
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
    <div :style="styleBorderRadius" class="absolute bottom-0 w-full text-right bg-linear-mask">
      <n-time
        class="mr-2 text-white"
        :time="item.duration"
        format="mm:ss"
      />
    </div>
  </div>
</template>
<style scoped>
.tips{
  @apply overflow-hidden absolute top-0 w-full h-0 
  group-hover:h-8 leading-8 text-center text-white
bg-black/50 transition-height
}
</style>