import { onUnmounted, ref } from 'vue';
import type { AxiosResponse } from 'axios';
import { cloneDeep } from 'lodash';
export const useMemorizeRequest = (requestFn:(params:any) => Promise<AxiosResponse<any, any>>) => {
  const cacheResponseMap = new Map();
  const isRepeat = ref(false);
  const wrapRequest = (params?:any) => {
    const cloneParams = cloneDeep(params || 'key');
    const key = JSON.stringify(cloneParams);

    if (!cacheResponseMap.has(key)) {
      const requestData = requestFn(params);
      cacheResponseMap.set(
        key, requestData
      );
      isRepeat.value = false;
      return requestData;
    } else {
      isRepeat.value = true;
      return cacheResponseMap.get(key);
    }
  };

  onUnmounted(() => {
    cacheResponseMap.clear();
  });

  return {
    wrapRequest,
    isRepeat 
  };
};