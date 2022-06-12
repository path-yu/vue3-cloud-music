import { onMounted, onUnmounted, ref } from 'vue';


export default function useLazyLoad(src:string) {
  const imageRef = ref<HTMLElement | null >(null);
 
  let observer: null | IntersectionObserver = new IntersectionObserver(callback);

  function callback(entries:IntersectionObserverEntry[]) {
    if (entries[0].isIntersecting) {
      const img = new Image();
      img.src = src;
      observer?.disconnect();
    }
  }
  onMounted(() => {
    imageRef.value && observer?.observe(imageRef.value);
  });

  onUnmounted(() => {
    imageRef.value && observer?.unobserve(imageRef.value);
    observer?.disconnect();
    observer = null;
  });
  return { imageRef };
}