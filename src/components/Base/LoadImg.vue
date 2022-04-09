<script  lang="tsx">
import useLazyLoad from '@/assets/hook/useLazyLoad';
import { defineComponent, onMounted, ref } from 'vue';

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
    const imageRef = ref<null | HTMLElement>(null);
    
    onMounted(() => {
      console.log(imageRef.value);
      
    });
    // const { imageRef, resultSrc } = useLazyLoad(props.src);
    return () => {
      return <div class="group relative h-full" style={{ height: props.loadingHeight }}>
        <div ref="imageRef">
          <n-image
            {...props} class={props.className + ' transition-all duration-700'}
            on-load={handleLoad}
            style={{ opacity: isLoading.value ? 0 : 1 }} />
        </div>
        {isLoading.value && <div
          class='flex absolute top-0 left-0 justify-center items-center w-full h-full'
        >
          <n-spin size="small" description={props.showMessage ? '努力加载图片中...' : ''} />
        </div>}
      </div>;
    };
  }
});
</script>

<style scoped>
</style>
