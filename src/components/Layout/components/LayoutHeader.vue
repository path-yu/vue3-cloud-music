<script setup lang="ts">
import { useMainStore } from '@/stores/main';
import { Moon, Search, SunnySharp } from '@vicons/ionicons5';
import { UserProfile } from '@vicons/carbon';
import { ArrowBackIosSharp, ArrowForwardIosRound, ExitToAppRound } from '@vicons/material';
import { useThemeVars } from 'naive-ui';
import { ref, watch } from 'vue';
import { userHistory } from '../hook/useHistoryRoutePath';
import { useElementHover, onClickOutside } from '@vueuse/core';
import { getUserDetail, getUserInfo, logout, signIn } from '@/service';
import type { AnyObject } from 'env';
import { useRouter } from 'vue-router';

let mainStore = useMainStore();
const themeVars = useThemeVars();
const router = useRouter();
const { backPath, forwardPath } = userHistory();
const backIconRef = ref();
const forwardIconRef = ref();
const popoverContainerRef = ref();
const active = ref(mainStore.isActiveDarkTheme);
const userDetail = ref<AnyObject>();
const showUserPopover = ref(false);
const backHover = useElementHover(backIconRef);
const forwardHover = useElementHover(forwardIconRef);
const signBtnLoading = ref(false);
watch(
  () => active.value, () => {
    mainStore.changeTheme();
  }
);
const arrowIconClass = (value: string) => {
  return value
    ? 'opacity-100 cursor-pointer'
    : 'opacity-50';
};
const handleArrowClick = (type: 'back' | 'forward') => {
  if (type === 'back' && backPath) {
    history.back();
  }
  if (type === 'forward' && forwardPath) {
    history.forward();
  }
};
watch(
  [backHover, forwardHover], (value: boolean[]) => {
    let [backIsHover, forwardIsHover] = value;
    let backIconEle = (backIconRef.value as HTMLSpanElement);
    let forwardIconEle = (forwardIconRef.value as HTMLSpanElement);

    if (backPath.value) {
      backIsHover
        ? backIconEle.style.color = themeVars.value.primaryColor
        : backIconEle.style.color = '';
    } else {
      backIconEle.style.color = '';
    }
    if (forwardPath.value) {
      forwardIsHover
        ? forwardIconEle.style.color = themeVars.value.primaryColor
        : forwardIconEle.style.color = '';
    } else {
      forwardIconEle.style.color = '';
    }
  }
);
// 监听登录状态 获取用户信息
watch(
  () => mainStore.isLogin, (val) => {
    if (val) {
      getUserProfile();
    }
  }
);
onClickOutside(
  popoverContainerRef, (event:MouseEvent) => {
    let target = event.target as HTMLElement;
    // 如果点击的不是不是触发弹出选择的元素
    if (!target.classList.contains('trigger')) {
      showUserPopover.value = false;
    } 
  }
);
// 获取用户账号数据
const getUserProfile = () => {
  // 如果已经设置过,则从store读取userId
  if (mainStore.userProfile) {
    getUserDetailInfo(mainStore.userProfile.profile.userId);
  } else {
    getUserInfo().then(res => {
      getUserDetailInfo(res.data.profile.userId);
    });
  }
 
};
// 获取用户详情数据
const getUserDetailInfo = (uid:string) => {
  getUserDetail(uid).then((res) => {
    mainStore.userProfile = res.data;
    localStorage.userProfile = JSON.stringify(res.data);
    userDetail.value = res.data;
  });
};
const handlePositiveClick = () => {
  window.$message.loading(
    '退出登录中...', { duration: 0 }
  );
  logout().then(res => {
    if (res.data.code === 200) {
      mainStore.isLogin = false;
      mainStore.userProfile = null;
      localStorage.isLogin = false;
      localStorage.clear();
      window.$message.destroyAll();
      window.$message.success('退出登录成功!');
    }
  });
};
const handleSignInClick = () => {
  signBtnLoading.value = true;
  signIn().then(() => {
    if (userDetail.value) {
      signBtnLoading.value = false;
      userDetail.value.pcSign = true;
      window.$message.success('签到成功!');
    }
  });
};
if (mainStore.isLogin) {
  getUserProfile();
}
</script>

<template>
  <n-layout-header bordered class="flex justify-between items-center px-4 h-14 sm:px-3">
    <div class="flex">
      <span class=" truncate">奇妙音乐屋！</span>
      <div class="flex items-center ml-8">
        <div ref="backIconRef" class="text-base" @click="handleArrowClick('back')">
          <n-icon :class="[arrowIconClass(backPath)]" :component="ArrowBackIosSharp" />
        </div>
        <div ref="forwardIconRef" class="ml-2 text-base" @click="handleArrowClick('forward')">
          <n-icon :class="[arrowIconClass(forwardPath)]" :component="ArrowForwardIosRound" />
        </div>
      </div>
      <div class="w-50">
        <n-input
          size="small" class="ml-5" placeholder="请输入"
          round
        >
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </div>
    </div>

    <div class="flex items-center">
      <!-- 用户信息入口 -->
      <div v-if="mainStore.isLogin">
        <div v-if="mainStore.userProfile" class="flex items-center mr-2">
          <n-avatar round :size="30" :src="mainStore.userProfile.profile.avatarUrl" />
          <n-popover
            :show="showUserPopover"
            trigger="click" style="padding:0"
            display-directive="show"
          >
            <template #trigger>
              <p
                class="pl-2 text-xs truncate opacity-80 hover:opacity-100 cursor-pointer w-30 trigger" 
                @click="() => (userDetail && (showUserPopover = !showUserPopover ))
                "
              >
                {{ mainStore.userProfile.profile.nickname }}
              </p>
            </template>
            <div ref="popoverContainerRef" style="width:300px">
              <div class="flex justify-evenly py-4">
                <div class="flex flex-col items-center">
                  <p class="text-lg font-bold">
                    {{ mainStore.userProfile.profile.eventCount }}
                  </p>
                  动态
                </div>
                <div>
                  <p class="text-lg font-bold">
                    {{ mainStore.userProfile.profile.follows }}
                  </p>
                  关注
                </div>
                <div>
                  <p class="text-lg font-bold">
                    {{ mainStore.userProfile.profile.followeds }}
                  </p>
                  粉丝
                </div>
              </div>
              <div class="flex justify-center">
                <n-button
                  :loading="signBtnLoading" :disabled="mainStore.userProfile.pcSign" round
                  @click="handleSignInClick"
                >
                  {{ mainStore.userProfile.pcSign ? '已签到' :' 签到' }}
                </n-button>
              </div>
              <div class="mt-3 hover:bg-neutral-200/20 border-0 border-b border-gray-200  dark:border-gray-200/20 border-solid">
                <!-- 个人信息设置 -->
                <div class="flex justify-between items-center py-2 px-4 cursor-pointer">
                  <div class="flex items-center text-base" @click="router.push('/userInfoEdit')">
                    <n-icon :size="20" :component="UserProfile" />
                    <span class="ml-2">个人信息设置</span>
                  </div>
                  <n-icon :component="ArrowForwardIosRound" />
                </div>
              </div>
              <div class="hover:bg-neutral-200/20 border-0 border-b border-gray-200  dark:border-gray-200/20 border-solid">
                <n-popconfirm
                  @positive-click="handlePositiveClick"
                >
                  <template #trigger>
                    <!-- 个人信息设置 -->
                    <div class="flex justify-between items-center py-2 px-4 cursor-pointer">
                      <div class="flex items-center text-base">
                        <n-icon :size="20" :component="ExitToAppRound" />
                        <span class="ml-2">退出登录</span>
                      </div>
                      <n-icon :component="ArrowForwardIosRound" />
                    </div>
                  </template>
                  确认退出登录吗?
                </n-popconfirm>
              </div>
            </div>
          </n-popover>
        </div>
        <!-- 用户详情加载骨架屏 -->
        <div v-else class="flex items-center mr-2">
          <n-skeleton width="30px" height="30px" round />
          <n-skeleton text style="width:100px;margin-left: 8px;" />
        </div>
      </div>
      <div class="flex items-center ml-2">
        <n-switch v-model:value="active" size="large">
          <template #checked-icon>
            <n-icon :component="Moon" />
          </template>
          <template #unchecked-icon>
            <n-icon :component="SunnySharp" />
          </template>
        </n-switch>
      </div>
    </div>
  </n-layout-header>
</template>
<style scoped>
:deep(.n-popover:not(.n-popover--raw):not(.n-popover--show-header)){
  padding: 0 !important;
}
</style>