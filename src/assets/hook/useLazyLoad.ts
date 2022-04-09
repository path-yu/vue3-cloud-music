import { onMounted, ref } from 'vue';


export default function useLazyLoad(src:string) {
  const isShow = ref(false);

  const observer = new IntersectionObserver(callback);

  function callback(entries:IntersectionObserverEntry[]) {
    console.log(entries[0]);
  }
  const resultSrc = ref('');

  onMounted(() => {
    console.log(imageRef.value);
    
    // observer.observe(imageRef.value!);
  });

  return {
    resultSrc,
    imageRef
  };
}

/*
  const images = document.getElementsByTagName('img');
function callback(entries) {
  for (const i of entries) {
    if (i.isIntersecting) {
      const img = i.target;
      const trueSrc = img.getAttribute('data-src');
      img.setAttribute('src', trueSrc);
      observer.unobserve(img);
    }
  } 
}
const observer = new IntersectionObserver(callback);
for (const i of images) {
  observer.observe(i);
}
*/
