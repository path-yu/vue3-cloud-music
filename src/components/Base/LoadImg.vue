/* eslint-disable vue/require-default-prop */
<script  lang="tsx">
import { defineComponent, ref } from 'vue';
import type { ImageProps } from 'naive-ui';
type status = 'pending' | 'success' | 'fail';

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
    onLoad: {
      type: Function,
      default: () => {}
    },
    showMessage: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const isLoading = ref(true);
    let img = new Image();
    
    const firstImgHeight = ref(props.loadingHeight);
    const handleLoad = (e:any) => {
      setTimeout(() => {
        isLoading.value = false;
      }, 5000);
    };    
 
    img.onload = handleLoad;
    
    return () => {
      img.src = props.src;
      return <div class="relative">
        <n-image {...props} 
          class={props.className+'transition-opacity duration-700'}
          style={{ opacity: isLoading.value ? 0 : 1 }} />
        {isLoading.value && <div
          class='flex absolute top-0 left-0 justify-center items-center w-full h-full'
          style={{ height: firstImgHeight.value }} >
          <n-spin size="small" description={props.showMessage && '努力加载图片中...'} />
        </div>}
      </div>;
    };
  }
});
</script>

<style scoped>
</style>
