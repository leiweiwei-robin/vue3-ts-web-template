import { defineStore } from 'pinia';
import type { UserInfo } from '@/interfaces/common/storage';
import {
  ACCESS_TOKEN,
  DASHBOARD_OPEN_MENU,
  REFRESH_TOKEN,
  USER_INFO,
} from '@/constants/storage-keys';

export const useStorageStore = defineStore('storage', {
  state: () => ({
    userInfo: {} as UserInfo,
  }),
  getters: {
    getAccessToken(): string {
      return localStorage.getItem(ACCESS_TOKEN) || '';
    },
    getRefreshToken() {
      return localStorage.getItem(REFRESH_TOKEN);
    },
    getUser() {
      const user = localStorage.getItem(USER_INFO);
      if (user) {
        return JSON.parse(user);
      }
      return {} as UserInfo;
    },
  },
  actions: {
    saveAccessToken(token: string) {
      localStorage.setItem(ACCESS_TOKEN, token);
    },
    saveRefreshToken(token: string) {
      localStorage.setItem(REFRESH_TOKEN, token);
    },
    saveUser(userInfo: UserInfo) {
      this.userInfo = userInfo;
      localStorage.setItem(USER_INFO, JSON.stringify(userInfo));
    },
    clearAll() {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      localStorage.removeItem(USER_INFO);
      localStorage.removeItem(DASHBOARD_OPEN_MENU);
      this.userInfo = {} as UserInfo;
    },
  },
});
