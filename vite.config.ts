import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 8081,
    open: 'http://localhost:8081',
  },
  css: {
    preprocessorOptions: {
      less: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
        lessOptions: {
          modifyVars: {
            dark: true, // 开启暗黑模式
          },
          javascriptEnabled: true,
        }
      },
    }
  }
});
