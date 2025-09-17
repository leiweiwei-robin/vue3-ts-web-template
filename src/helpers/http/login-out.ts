import router from '@/router';
import { useMenuStore } from '@/stores/menu';
import { useStorageStore } from '@/stores/storage';

export function logout() {
  setTimeout(() => {
    clearAllInfo();
  }, 3000);
}

export function clearAllInfo() {
  // 用户信息，菜单信息，权限信息，token信息
  useStorageStore().clearAll();
  useMenuStore().CLEAR_ALL();
  router.push('/login');
}
