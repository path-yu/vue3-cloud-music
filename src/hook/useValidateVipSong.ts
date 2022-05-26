import { useMainStore } from '@/stores/main';

export default function useValidateVipSong(song: any) {
  const mainStore = useMainStore();
  // 如果为vip歌曲
  if (song.fee === 1) {
    // 未登录下, 不能进行播放
    if (!mainStore.isLogin) {
      return window.$message.warning('歌曲为vip专享,请先登录!');
    } else {
      // 非vip不能播放
      if (mainStore.userProfile?.profile?.vipType === 0) {
        return window.$message.warning('歌曲为会员专享');
      }
    }
  }
  return undefined;
}