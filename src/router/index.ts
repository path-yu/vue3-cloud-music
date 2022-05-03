import { createRouter, createWebHashHistory, type NavigationGuardWithThis } from 'vue-router';
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/discovery',
      meta: { auth: false }
    },
    {
      path: '/songList',
      name: 'songs',
      component: () => import('@/views/RecommendSongListView.vue'),
      meta: { auth: false }
    },
    {
      path: '/discovery',
      name: 'discovery',
      component: () => import('@/views/DiscoveryView.vue'),
      meta: { auth: false }
    },
    {
      path: '/latestMusic',
      name: 'latestMusic',
      component: () => import('@/views/LatestMusicView.vue'),
      meta: { auth: false }
    },
    {
      path: '/latestMv',
      name: 'latestMv',
      component: () => import('@/views/LatestMvView.vue'),
      meta: { auth: false }
    },
    {
      path: '/mv/:id',
      component: () => import('@/views/MvDetail.vue'),
      meta: { hidden: true, auth: false }
    },
    {
      path: '/userInfoEdit',
      name: 'userInfoEdit',
      component: () => import('@/views/user/UserInfoEdit.vue'),
      meta: { auth: true }
    }
  ]
});
export const registerRouteHook = (
  beforeEachFn: NavigationGuardWithThis<undefined>, beforeResolveFn: NavigationGuardWithThis<undefined>
) => {
  router.beforeEach(beforeEachFn);
  router.beforeResolve(beforeResolveFn);
};
export default router;