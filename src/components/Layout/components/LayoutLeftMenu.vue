<script setup lang="tsx">
import router, { registerRouteHook } from '@/router';
import { getUserPlaylist } from '@/service';
import { useMainStore } from '@/stores/main';
import { BackToTop, Music, User } from '@vicons/carbon';
import { List, SparklesOutline, VideocamOutline, StarOutline } from '@vicons/ionicons5';
import { NIcon, useLoadingBar } from 'naive-ui';
import { onMounted, ref, shallowRef, watch, watchEffect, type VNodeChild } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import LoginModal, { type LoginModalExpose } from './LoginModal.vue';

const mainStore = useMainStore();
type MySongsList = { myCreatePlayList: any[], collectPlayList: any[] };
type MenuOptionItem = {
  label: (() => VNodeChild) | string,
  key: string,
  icon?: () => VNodeChild,
  children?:MenuOptionItem[]
}
const noLoginOption = {
  label: () => <div class="flex items-center" onClick={handleOpenLoginModalClick}> 
    <p >未登录</p>
  </div>,
  key: 'login',
  icon: () => <NIcon class="mr-2" size={20} component={User} />
};

const menuOptions = [
  {
    label: () => <RouterLink to='/discovery'>发现音乐</RouterLink>,
    key: '/discovery',
    icon: () => <NIcon component={SparklesOutline} />
  },
  {
    label: () => <RouterLink to='/songList'>推荐歌单</RouterLink>,
    key: '/songList',
    icon: () => <NIcon component={List} />
  },
  {
    label: () => <RouterLink to='/latestMusic'>最新音乐</RouterLink>,
    key: '/latestMusic',
    icon: () => <NIcon component={Music} />
  },
  {
    label: () => <RouterLink to='/latestMv'>最新MV</RouterLink>,
    key: '/latestMv',
    icon: () => <NIcon component={VideocamOutline} />
  }

];

const route = useRoute();
const loadingBar = useLoadingBar();

let collapsed = ref(false);
let scrollContainer:HTMLElement|null;
let activeKey = ref<string | null>('');
let hiddenLeftMenu = ref(false);
const myMenuOptions = ref<MenuOptionItem[]>(menuOptions);
const loginModalRef = ref<LoginModalExpose>();

const changeMenuOption = (
  myCreatePlayList:any[]=[], collectPlayList:any[]=[]
) => {
  if (!mainStore.isLogin) {
    myMenuOptions.value.unshift(noLoginOption);
  } else {
    myMenuOptions.value.unshift(
      {
        label: '我创建的歌单',
        key: 'create',
        icon: () => <NIcon class="mr-2" size={20} component={User} />,
        children: myCreatePlayList.map((item:any) => {
          return {
            label: () => <span onClick={() => handlePlayListItemClick(item)}>{item.name}</span>,
            key: item.name
          };
        })
      },
      {
        label: '收藏的歌单',
        key: 'collect',
        icon: () => <NIcon component={StarOutline} />,
        children: collectPlayList.map((item:any) => {
          return {
            label: () => <span onClick={() => handlePlayListItemClick(item)}>{item.name}</span>,
            key: item.name
          };
        })
      }
    );
  }
};
const handleOpenLoginModalClick = () => {
  loginModalRef.value?.show();
};
const handlePlayListItemClick = (item:any) => {
  let id = item.id;
  // router.push(`/playlist/id`)
};
watch(
  () => route.path, (newVal) => {
    activeKey.value = newVal;
    if (route.meta.hidden) {
      hiddenLeftMenu.value = true;
    } else {
      hiddenLeftMenu.value = false;
    }
  }
);
watch(
  () => mainStore.userProfile, (val) => {
    console.log('change');
    
    if (val) {
      fetchUserPlaylist();
    } else {
      changeMenuOption();
    }
  }
);
watch(
  () => mainStore.isLogin, (val) => {
    if (val) {
      myMenuOptions.value.shift();
    } else {
      myMenuOptions.value.shift();
      myMenuOptions.value.shift();
    }
  }
);
if (!mainStore.isLogin) {
  changeMenuOption();
}

const fetchUserPlaylist = () => {
  let userId = mainStore.userProfile.profile.userId;
  getUserPlaylist(userId).then((res) => {
    // 将歌单分类
    if (res.data.code === 200) {
      let { collectPlayList, myCreatePlayList } = classifySongsList(
        userId, res.data.playlist
      );
      changeMenuOption(
        myCreatePlayList, collectPlayList
      );
      
    }
  });
};

const classifySongsList = (
  userId:number, playList:any[]
) => {
  return playList.reduce(
    (
      prev, currentValue, index
    ) => {
      if (index === 0) currentValue.name = '我喜欢的音乐';
      if (currentValue.creator.userId === userId) {
        prev.myCreatePlayList.push(currentValue);
      } else {
        prev.collectPlayList.push(currentValue);
      }
      return prev;
    }, { myCreatePlayList: [], collectPlayList: [] }
  ) as MySongsList;
};
registerRouteHook(
  (to) => {
    scrollContainer?.scrollTo({
      behavior: 'smooth',
      top: 0
    });
    if (to.meta.auth && !mainStore.isLogin) {
      window.$message.error('请先登录');
      return false;
    } else {
      loadingBar.start();
      return true;
    }
  
  }, () => {
    loadingBar.finish();
  }
);
onMounted(() => {
  scrollContainer = document.querySelector('.rightMain>.n-layout-scroll-container');
});
</script>
<template>
  <n-layout
    has-sider
  >
    <n-layout-sider
      v-show="!hiddenLeftMenu"
      bordered
      collapse-mode="width"
      class="h-main"
      :collapsed-width="64"
      :width="192"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <n-menu
        v-model:value="activeKey"
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="myMenuOptions"
        :default-expand-all="true"
      />
    </n-layout-sider>
    <n-layout class="h-main rightMain">
      <router-view v-slot="{ Component }">
        <transition
          name="fade-transform"
          mode="out-in"
        >
          <div>
            <login-modal ref="loginModalRef" />
            <n-back-top :right="mainStore.backTopLeft" :bottom="220" :visibility-height="800">
              <n-icon :component="BackToTop" />
            </n-back-top>
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </n-layout>
  </n-layout>
</template>

<style lang="less" scoped>
.n-layout-sider {
  transition: color 0.3s var(--n-bezier), border-color 0.3s var(--n-bezier),
    min-width 0.3s var(--n-bezier), max-width 0.3s var(--n-bezier) ,width 0.3s var(--n-bezier),
    transform 0.3s var(--n-bezier), background-color 0.3s var(--n-bezier);
}
:deep(.n-submenu-children > .n-menu-item > .n-menu-item-content){
  padding-left: 40px !important; 
}
</style>
