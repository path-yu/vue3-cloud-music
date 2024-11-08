# cloud-music

这是一个主要基于Vue3+TypeScript+Vite构建的高仿网易云pc端的音乐流媒体网站.

### 前言

为了探索最前沿的前端技术栈, 一切为了好玩, 肝代码不易,觉得喜欢的可以点个star,本项目仅供参考学习.
谢谢大家star.

### 项目部署

本项目预览地址采用vercel部署, 推荐大家使用vercel部署, 部署步骤非常简单, fork本仓库,在vercel中导入该仓库,按照提示点击部署即可.

### 主要技术栈如下

1. [Vue3](https://vuejs.org/):  用于快速构建web用户界面的框架.

2. [naive-ui](https://www.naiveui.com/zh-CN/light): 基于Vue3的组件库,可自定义主题,支持夜间模式.

3. [Vite](https://vitejs.dev/): 下一代的前端构建工具,支持HRM,TypeScript,JSX,开箱即用.

4. [axios](https://axios-http.com/): 是用于浏览器和node.js的基于Promise的http库,用于请求Api.

5. [dayjs](https://day.js.org/): 轻量级,用于处理时间相关格式化问题的库.

6. [color.js](https://www.npmjs.com/package/color.js): 用于不可变颜色的转换和操作的JavaScript库.

7. [eslint](https://eslint.org/): 基于AST模式的JavaScript代码风格检查工具.

8. [lodash](https://lodash.com/docs/): 实用JavaScript工具函数库,提供了类似防抖节流,深拷贝开箱即用的函数.

9. [nanoid](https://github.com/ai/nanoid/blob/main/README.zh-CN.md): 小型的安全的,用于生成唯一字符串id的JavaScript库.

10. [normalize.css](https://github.com/necolas/normalize.css): 一个用于现代化的重置css的库,用于磨平各个浏览器之间不同样式的兼容问题.

11. [pinia](https://pinia.vuejs.org/): 基于Proxy使用TypeScript编写的灵活的且类型安全的下一代Vue状态管理库.

12. [qs](https://www.npmjs.com/package/qs): 安全的用于字符串序列化的库,通常用于处理请求参数.

13. [rgbaster](https://www.npmjs.com/package/rgbaster): 基于Promise的JavaScript库,用于从图像中提取主色.

14. [vue-router4](https://router.vuejs.org/zh/introduction.html): 基于Vue3路由管理库

15. [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller): 基于Vue的虚拟滚动JavaScript库.

16. [xgplayer](https://v2.h5player.bytedance.com/): 西瓜播放器(HTML5),带解析器,能节省流量 提供开箱即用的HTML5视频播放器库

17. [tailwindcss](https://tailwindcss.com/): 基于原子化css的实用程序优先的css框架,用于快速构建自定义用户界面.
    
    ## 功能亮点如下

18. 基于图片主色混入的canvas渐变背景

19. 歌曲随机,顺序,单曲循环播放.切换播放上一首,下一首.

20. 自定义封装歌曲进度条,可点击拖拽切换到指定播放时间, 添加buffer加载进度显示.

21. 歌词自动同步滚动高亮,滚动选择歌词切换播放时间.

22. 歌词底部头部基于当前所在滚动位置背景色添加虚化渐变遮罩.

23. 歌曲播放或暂停时cd旋转或停止旋转.

24. 兼容夜间模式,骨架屏加载显示.

25. 歌单内部搜索歌曲,收藏歌单,编辑歌单,新建歌单.

26. 添加喜欢的音乐,获取我创建的歌单和收藏的歌单.

27. 歌单列表下拉加载.

28. 自定义图片懒加载,缓冲loading显示.

29. 扫码登录,编辑用户信息,签到.退出登录.

30. 记忆当前滚动位置.刷新页面时更新滚动位置.

31. 搜索歌曲或歌单,提供搜索建议.搜索历史记录缓存.

32. mv列表,播放mv

33. 评论列表,点击评论,回复评论,添加评论.发表评论

## 项目预览

![loading-ag-609](https://upload-images.jianshu.io/upload_images/24914540-33da12dc895b574a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![loading-ag-609](https://upload-images.jianshu.io/upload_images/24914540-282aa2c065314f7a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![loading-ag-609](https://upload-images.jianshu.io/upload_images/24914540-6e666b06fa902d43.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/20032554-f94a8e8f127d22bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/20032554-9b426704d03585ec.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/20032554-89d3aae105f66885.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/20032554-e5898c2b509dabea.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 项目运行

推荐使用pnpm安装依赖，推荐node版本14.18+, 16+。
建议使用nvm管理不同node版本，nvm安装前建议卸载当前已经安装的node。

### nvm仓库

在首页点击Releases进入版本页面，下载最新版本即可
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
