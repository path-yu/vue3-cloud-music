import { onMounted, onUnmounted, ref } from 'vue';


export default function useLazyLoad(src:string) {
  const imageRef = ref<HTMLElement | null >(null);
 
  let observer: null | IntersectionObserver = new IntersectionObserver(callback);

  function callback(entries:IntersectionObserverEntry[]) {
    if (entries[0].isIntersecting) {
      const img = new Image();
      img.src = src;
      observer?.unobserve(imageRef.value!);
      observer?.disconnect();
      observer = null;
      imageRef.value = null;
    }
  }

  onMounted(() => {
    imageRef.value && observer?.observe(imageRef.value);
  });

  onUnmounted(() => {
    imageRef.value && observer?.unobserve(imageRef.value);
    observer = null;
  });
  return { imageRef };
}