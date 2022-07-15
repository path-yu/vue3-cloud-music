import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export function userHistory() {
  const route = useRoute();
  const backPath = ref<string>(history.state.back);
  const forwardPath = ref<string>(history.state.forward);

  watch(() => route.path, () => {
    backPath.value = history.state.back;
    forwardPath.value = history.state.forward;
  });
  
  return {
    backPath,
    forwardPath
  };
}