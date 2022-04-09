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
      isLoading.value = false;

      if (firstImgHeight.value !== props.loadingHeight) {
        firstImgHeight.value = e.path[0].height + 'px';
      }
    };    
 
    img.onload = handleLoad;

    return () => {
      img.src = props.src;
      return !isLoading.value
        ? <n-image {...props} class={props.className} />
        : (
          <div
            class='flex justify-center items-center w-full h-full'
            style={{ height: firstImgHeight.value }} >
            <n-spin size="small" description={props.showMessage && '努力加载图片中...'} />
          </div>
        );
    };
  }
});
</script>

<style scoped>
</style>
