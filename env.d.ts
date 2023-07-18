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

declare module 'rgbaster' {
  interface Opts {
    ignore?: string[];
    scale?: number;
    skipTransparentPixels?: boolean;
  }
  export default function (src: string, opts?: Opts): Promise<{
    color: string;
    count: number;
  }[]>;
  export { };
};