import { computed, onUnmounted, reactive, ref } from 'vue';
import type { AxiosResponse } from 'axios';
import { cloneDeep } from 'lodash';
export const useMemorizeRequest = (
  requestFn:(params:any) => Promise<AxiosResponse<any, any>>, requestKey:string, cacheTime = 180000
) => {
  const cacheResponseMap = new Map();
  const requestLoadingMaps = ref({ [requestKey]: true });
  // 记录缓存时间 默认三分钟 1000 * 60 * 3 = 180000
  const cacheTimeMap = new Map();
  const requestLoading = computed(() => {
    return requestLoadingMaps.value[requestKey];
  });
  
  const wrapRequest = (params?:any) => {
    const cloneParams = cloneDeep(params || 'key');
    const key = requestKey + JSON.stringify(cloneParams);

    const request = () => {
      const requestData = requestFn(params);
      cacheResponseMap.set(
        key, requestData
      );
      requestLoadingMaps.value[requestKey] = true;
      cacheTimeMap.set(
        key, Date.now()
      );
      return requestData;
    };
    if (!cacheResponseMap.has(key)) {
      return request();
    } else {
      // 如果缓存时间超过了设置的时间 则重新请求
      if (Date.now() - cacheTimeMap.get(key) > cacheTime) {
        return request();
      } 
        
      return cacheResponseMap.get(key);
    }
  };
  
  const loadSuccess = () => {
    requestLoadingMaps.value[requestKey] = false;
  };
  onUnmounted(() => {
    cacheResponseMap.clear();
  });
  
  return {
    wrapRequest,
    loadSuccess,
    requestLoading
  };
};