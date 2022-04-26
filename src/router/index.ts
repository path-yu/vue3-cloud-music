import { createRouter, createWebHashHistory, type NavigationGuardWithThis } from 'vue-router';
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/discovery'
    },
    {
      path: '/songList',
      name: 'songs',
      component: () => import('@/views/RecommendSongListView.vue')
    },
    {
      path: '/discovery',
      name: 'discovery',
      component: () => import('@/views/DiscoveryView.vue')
    },
    {
      path: '/latestMusic',
      name: 'latestMusic',
      component: () => import('@/views/LatestMusicView.vue')
    },
    {
      path: '/latestMv',
      name: 'latestMv',
      component: () => import('@/views/LatestMvView.vue')
    },
    {
      path: '/mv/:id',
      component: () => import('@/views/MvDetail.vue'),
      meta: { hidden: true }
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