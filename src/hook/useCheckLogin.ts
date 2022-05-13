import { useMainStore } from './../stores/main';
export function userCheckLogin(
  callback:() => void, message='请先登录'
) {
  const mainStore = useMainStore();
  if (!mainStore.isLogin) {
    window.$message.error(message);
  } else {
    callback();
  }
}