import { axios } from 'axios';
import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider';
/// <reference types="vite/client" />
// naive-ui组件库全局类型声明 给编辑器提供更好的类型提示
export * from 'naive-ui/volar';

type localValue = 'zh-cn' | 'en';

declare global {
  interface Window {
    $message: MessageApiInjection;
  }
}
declare module 'vue'{
  export interface Window {
    $message: MessageApiInjection;
  }
}
export {};