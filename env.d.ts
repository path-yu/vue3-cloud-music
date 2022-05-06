import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider';
/// <reference types="vite/client" />
// naive-ui组件库全局类型声明 给编辑器提供更好的类型提示
export * from 'naive-ui/volar';
export { };

type localValue = 'zh-cn' | 'en';
declare global {
  interface Window {
    $message: MessageApiInjection;
  }
  interface ImportMeta {
    env: Record<string, string>
  }
}
declare module 'vue' {
  export interface Window {
    $message: MessageApiInjection;
  }
}
// 任意键值对对象类型
export type AnyObject = {
  [key: string]: any;
};
export interface TopAlbumParams {
  limit?: number;
  offset?: number;
  area?: '全部' | '华语' | '欧美' | '韩国' | '日本';
  type?: '全部' | '热门',
  year?: number;
  month?: number;
}