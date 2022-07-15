import { ref } from 'vue';
import { nanoid } from 'nanoid';
export function useNanoid() {
  const idMaps = new Map();
  const currentId = ref('');
  return {
    set(key:any) {
      if (!idMaps.has(key)) {
        const id = nanoid();
        currentId.value = id;
        idMaps.set(key, id);
      } else {
        currentId.value = idMaps.get(key);
      }
    },
    currentId
  }; 
}