import type { RouteLocationNormalizedLoaded } from 'vue-router';

export interface MenuItem {
  id: number;
  index: number;
  name: string;
  path: string;
  icon: string;
  code: string;
  actions: string[];
  isCurrent?: boolean;
  value?: boolean;
  groupName?: string;
  children: MenuItem[];
  payload: {
    content: string[];
  };
}

export interface ShadowMenuItem extends MenuItem {
  snapshot?: Partial<RouteLocationNormalizedLoaded> | null;
  vueSnapshot: Partial<RouteLocationNormalizedLoaded> | null;
  params?: object;
  isDetailMode: boolean;
  isSecondDetail?: boolean;
  url: string;
}

export const _DashBoardMenu: ShadowMenuItem = {
  id: 0,
  icon: '',
  payload: {
    content: [],
  },
  name: '首页',
  url: '/dashboard',
  path: '/dashboard',
  index: 0,
  actions: [],
  code: 'dashboard',
  children: [],
  value: true,
  isDetailMode: false,
  snapshot: {
    name: 'dashboard',
  },
  vueSnapshot: {
    name: 'dashboard',
  },
};
