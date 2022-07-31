# cloud-music

这是一个主要基于Vue3+TypeScript+Vite构建的高仿网易云pc端的音乐流媒体网站.

### 前言

    为了探索最前沿的前端技术栈, 一切为了好玩, 肝代码不易,觉得喜欢的可以点个star,本项目仅供参考学习.

## 主要技术栈如下

1. Vue3:  用于快速构建web用户界面的框架.

2. naive-ui: 基于Vue3的组件库,可自定义主题,支持夜间模式.

3. Vite: 下一代的前端构建工具,支持HRM,TypeScript,JSX,开箱即用.

4. axios: 是用于浏览器和node.js的基于Promise的http库,用于请求Api.

5. dayjs: 轻量级,用于处理时间相关格式化问题的库.

6. color.js: 用于不可变颜色的转换和操作的JavaScript库.

7. eslint: 基于AST模式的JavaScript代码风格检查工具.

8. lodash: 实用JavaScript工具函数库,提供了类似防抖节流,深拷贝开箱即用的函数.

9. nanoid: 小型的安全的,用于生成唯一字符串id的JavaScript库.

10. normalize.css: 一个用于现代化的重置css的库,用于磨平各个浏览器之间不同样式的兼容问题.

11. pinia: 基于Proxy使用TypeScript编写的灵活的且类型安全的下一代Vue状态管理库.

12. qs: 安全的用于字符串序列化的库,通常用于处理请求参数.

13. rgbaster: 基于Promise的JavaScript库,用于从图像中提取主色.

14. vue-router4: 基于Vue3路由管理库

15. vue-virtual-scroller: 基于Vue的虚拟滚动JavaScript库.

16. xgplayer: 西瓜播放器(HTML5),带解析器,能节省流量 提供开箱即用的HTML5视频播放器库

17. tailwindcss: 基于原子化css的实用程序优先的css框架,用于快速构建自定义用户界面.

     

## 功能亮点如下

1. 基于图片主色混入的canvas渐变背景

2. 歌曲随机,顺序,单曲循环播放.切换播放上一首,下一首.

3. 自定义封装歌曲进度条,可点击拖拽切换到指定播放时间, 添加buffer加载进度显示.

4. 歌词自动同步滚动高亮,滚动选择歌词切换播放时间.

5. 歌词底部头部基于当前所在滚动位置背景色添加虚化渐变遮罩.

6. 歌曲播放或暂停时cd旋转或停止旋转.

7. 兼容夜间模式,骨架屏加载显示.

8. 歌单内部搜索歌曲,收藏歌单,编辑歌单,新建歌单.

9. 添加喜欢的音乐,获取我创建的歌单和收藏的歌单.

10. 歌单列表下拉加载.

11. 自定义图片懒加载,缓冲loading显示.

12. 扫码登录,编辑用户信息,签到.退出登录.

13. 记忆当前滚动位置.刷新页面时更新滚动位置.

14. 搜索歌曲或歌单,提供搜索建议.搜索历史记录缓存.

15. mv列表,播放mv

16. 评论列表,点击评论,回复评论,添加评论.发表评论



## 项目预览

![loading-ag-609](https://upload-images.jianshu.io/upload_images/20032554-2b49a2c31e6ceda6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](C:\Users\19746\AppData\Roaming\marktext\images\2022-07-04-13-27-27-image.png)

![](https://upload-images.jianshu.io/upload_images/20032554-f94a8e8f127d22bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/20032554-9b426704d03585ec.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/20032554-89d3aae105f66885.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/20032554-e5898c2b509dabea.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 项目运行

推荐使用pnpm安装依赖,推荐node版本14.18+, 16+.
建议使用nvm管理不同node版本
### nvm仓库
https://github.com/coreybutler/nvm-windows
### pnpm 安装
```shell
npm i pnpm -g
```
### 依赖安装
```shell
pnpm i
```

### 运行

```shell
pnpm dev
```

### 构建

```shell
pnpm build
```

### 预览

```shell
pnpm preview
```
