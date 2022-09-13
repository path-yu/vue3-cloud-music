import { ref, type Ref } from 'vue';

export function useAudioLoadProgress(audio:Ref<HTMLAudioElement | undefined>, duration:number) {
  const progressValue = ref(0);
 
  const updateBuffer = () => {
    if (!audio.value) return;
    const buffered = audio.value!.buffered;
    if (buffered!.length && audio.value?.duration) {
      progressValue.value = Math.round(100 * (buffered.end(buffered.length - 1) / audio.value.duration));
    }
  };
  return { updateBuffer, progressValue };
}