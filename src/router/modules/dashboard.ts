import type { AppRouteRecordRaw } from '../type';

const dashboardPage: Array<AppRouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/dashboard.vue'),
  },
];

export default dashboardPage;
