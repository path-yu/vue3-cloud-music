<script lang="tsx">
import useLazyLoad from '@/hook/useLazyLoad.ts';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  props: {
    src: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    previewDisabled: {
      type: Boolean,
      default: false
    },
    fallbackSrc: {
      type: String,
      default: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'
    },
    loadingHeight: {
      type: String,
      default: '12vw'
    },
    showMessage: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const isLoading = ref(true);
    
    const handleLoad = (e: any) => {
      isLoading.value = false;
    };
    
    const { imageRef } = useLazyLoad(props.src);
    
    return () => {
      return (
        <div ref={imageRef} class="group relative h-full" style={{ height: props.loadingHeight }}>
          <n-image
            {...props} 
            class={props.className + ' transition-all duration-700 w-full warpImg h-f'}
            on-load={handleLoad}
            style={{ opacity: isLoading.value ? 0 : 1 }} />
          {isLoading.value && <div
            class='flex absolute top-0 left-0 justify-center items-center w-full h-full'
          >
            <n-spin size="small" description={props.showMessage ? '努力加载图片中...' : ''} />
          </div>}
        </div>
      );
    };
  }
});
</script>

<style scoped>
:deep(.warpImg > img) {
  width: 100%;
  height: 100%;
}
</style>
