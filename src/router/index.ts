import { createRouter, createWebHistory } from 'vue-router';
import { useStorageStore } from '@/stores/storage';
import type { AppRouteRecordRaw, FileType } from './type';
import type { RouteRecordRaw } from 'vue-router';

// import module router
const files: Record<string, FileType> = import.meta.glob('./modules/*.ts', { eager: true });
let routerModule: Array<AppRouteRecordRaw> = [];
Object.keys(files).forEach((key: string) => {
  routerModule = routerModule.concat(files[key].default);
});
const routes: Array<AppRouteRecordRaw> = [
  {
    path: '',
    name: 'main',
    component: () => import('@/pages/main/main.vue'),
    children: [
      ...routerModule,
      {
        path: '',
        name: 'blank',
        redirect: { name: 'dashboard' },
      },
    ],
  },
  {
    path: '/notFound',
    name: 'notFound',
    component: () => import('@/pages/not-found/index.vue'),
    meta: { unNeedLogin: true, keepAlive: false },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/login.vue'),
    meta: { unNeedLogin: true, keepAlive: false },
  },
  {
    path: '/:path(.*)',
    name: '404',
    redirect: { name: 'notFound' },
  },
  {
    path: '/',
    name: '/',
    redirect: { name: 'login' }, // 重定向到命名路由
  },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes: routes as unknown as RouteRecordRaw[],
});

router.beforeEach((to, _from, next) => {
  const storageStore = useStorageStore();
  if (!to.meta.unNeedLogin && !storageStore.getAccessToken) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
