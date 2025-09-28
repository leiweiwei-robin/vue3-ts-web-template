<script setup lang="ts">
  import type { MenuItem, ShadowMenuItem } from '@/interfaces/common/menus';
  import { getMenuRequest } from '@/apis/common';
  import { DASHBOARD_OPEN_MENU } from '@/constants/storage-keys';
  import { _DashBoardMenu } from '@/interfaces/common/menus';
  import { useMenuStore } from '@/stores/menu';
  import { useRefreshStore } from '@/stores/refresh';
  import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const refreshStore = useRefreshStore();
  const menuStore = useMenuStore();
  const menus = ref<MenuItem[]>([]);
  const openMenu = ref<ShadowMenuItem[]>([_DashBoardMenu]);
  const currentOpeningMenuIndexing = ref(0);
  const isDashboard = ref(false);
  // Watch for route changes
  watch(
    () => route,
    to => {
      if (to.meta.keepAlive !== false) {
        refreshStore.PUSH_KEEPLIST(to.name as string);
      }
      handleRouterChange(to);
    },
    { deep: true },
  );
  getMenu();

  const isReady = ref(false);
  function getMenu() {
    getMenuRequest().then(res => {
      setUserActions(res.data?.resources || []);
      menus.value = res.data?.resources || [];
      const hasSession = recoverOpenMenuFromSessionStorage();
      if (!hasSession && route.path === '/') {
        router.push('/dashboard');
      }
      handleRouterChange(route);
      isReady.value = true;
    });
  }
  function setUserActions(menu: MenuItem[]) {
    const userActions = new Map<string, string[]>();
    const _menus = new Map<string, string[]>();
    menu.forEach(sub => {
      sub.children.forEach(item => {
        const uaKey = item.path.substring(1);
        uaKey && userActions.set(uaKey, item.actions);
        uaKey && _menus.set(uaKey, item.payload?.content || []);
      });
    });
    menuStore.SET_ACTIONS(userActions);
    menuStore.SET_MENU(_menus);
  }

  function handleRouterChange(route: RouteLocationNormalizedLoadedGeneric) {
    const urls = route.path.split('/');
    if (urls[1] === 'dashboard') {
      isDashboard.value = true;
      currentOpeningMenuIndexing.value = 0;
      menus.value.forEach(sub => {
        sub.isCurrent = false;
        sub.children?.forEach(child => (child.isCurrent = false));
      });
    } else {
      isDashboard.value = false;
      menus.value.filter(sub => {
        sub.isCurrent = false;
        sub.children?.forEach(leaf => {
          leaf.isCurrent = false;
          const leafPaths = leaf.path.split('/');
          const isLeafPathMatch =
            leafPaths.slice(1, leafPaths.length).join('/') ===
            urls.slice(1, leafPaths.length > 3 ? 4 : 3).join('/');
          if (isLeafPathMatch) {
            sub.isCurrent = true;
            leaf.isCurrent = true;
            const lastPath = urls[urls.length - 1].trim().split(/\?\w+=\w+/)[0];
            const isNewMode = ['new', 'add'].includes(lastPath);
            const isDetailMode = isNewMode || !Number.isNaN(Number.parseInt(lastPath, 10));
            const url = route.fullPath.split(/\?\w+=\w+/)[0];
            const isSecondDetail = route.fullPath.includes('second-detail');
            if (isDetailMode) {
              const detailIndex = openMenu.value.findIndex(
                item =>
                  item.path === leaf.path &&
                  item.isDetailMode &&
                  item.isSecondDetail == isSecondDetail,
              );
              const title = isSecondDetail ? route.meta.title || '' : '';
              if (detailIndex > -1) {
                currentOpeningMenuIndexing.value = detailIndex;
                clearCachedRoute(openMenu.value[detailIndex]);
                openMenu.value[detailIndex].url = url;
                openMenu.value[detailIndex].name =
                  `${leaf.name}${title} - ${isNewMode ? '新建' : '详情'}`;
              } else {
                const detailMenu: ShadowMenuItem = {
                  ...leaf,
                  name: `${leaf.name}${title} - ${isNewMode ? '新建' : '详情'}`,
                  url: route.fullPath,
                  isDetailMode: true,
                  isSecondDetail: isSecondDetail,
                  vueSnapshot: {
                    query: route.query,
                    params: route.params,
                    name: route.name,
                    fullPath: route.fullPath,
                    path: route.path,
                  },
                  params: route.query,
                };
                openMenu.value.splice(currentOpeningMenuIndexing.value + 1, 0, detailMenu);
                currentOpeningMenuIndexing.value++;
              }
            } else {
              const index = openMenu.value.findIndex(
                item => item.path === leaf.path && !item.isDetailMode,
              );
              if (index > -1) {
                currentOpeningMenuIndexing.value = index;
              } else {
                openMenu.value.push({
                  ...leaf,
                  isDetailMode: false,
                  url: route.fullPath,
                  vueSnapshot: {
                    query: route.query,
                    params: route.params,
                    name: route.name,
                    fullPath: route.fullPath,
                    path: route.path,
                  },
                  params: route.query,
                });
                currentOpeningMenuIndexing.value = openMenu.value.length - 1;
              }
            }
          }
        });
      });
      saveOpenMenuToSessionStorage();
    }
  }

  function saveOpenMenuToSessionStorage() {
    const shadowItem: { currentIndex: number; menuList: ShadowMenuItem[] } = {
      currentIndex: currentOpeningMenuIndexing.value,
      menuList: openMenu.value.map(item => ({
        ...item,
        vueSnapshot: item.vueSnapshot ? { ...item.vueSnapshot } : {},
      })),
    };
    sessionStorage.setItem(DASHBOARD_OPEN_MENU, JSON.stringify(shadowItem));
  }

  function recoverOpenMenuFromSessionStorage() {
    const openMenuStr = sessionStorage.getItem(DASHBOARD_OPEN_MENU);
    if (openMenuStr) {
      const shadowItem: { currentIndex: number; menuList: ShadowMenuItem[] } =
        JSON.parse(openMenuStr);
      openMenu.value = shadowItem.menuList.map(item => ({ ...item }));
      currentOpeningMenuIndexing.value = shadowItem.currentIndex;
      refreshStore.keepList.push(
        shadowItem.menuList[shadowItem.currentIndex].vueSnapshot?.name as string,
      );
      return true;
    }
    return false;
  }

  function clearCachedRoute(item: ShadowMenuItem) {
    refreshStore.clearCache(item.vueSnapshot?.name as string);
  }
</script>

<template>
  <a-layout v-if="isReady" style="height: 100%">
    <a-layout>
      <a-layout-content :class="[isDashboard && 'ant-layout-content-dashboard']">
        <router-view v-slot="{ Component }">
          <keep-alive :include="refreshStore.keepList">
            <component
              :is="Component"
              v-if="refreshStore.keepList.includes(route.name as string)"
              :key="route.fullPath"
            />
          </keep-alive>
          <component :is="Component" v-if="!refreshStore.keepList.includes(route.name as string)" />
        </router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="scss" scoped>
  .g-fold-icon {
    position: absolute;
    bottom: 12px;
    right: -12px;
    width: 24px;
    height: 24px;
    background: #ffffff;
    border: 1px solid #e3e4e7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    color: #222b3c;

    &:hover {
      cursor: pointer;
      color: #40aaff;
    }
  }

  .collapsed {
    width: 31px;
    height: 24px;
    background: #007aff;
    border-radius: 0px 100px 100px 0px;
    right: -30px;
    color: #ffffff;
  }

  .not-collapsed {
    &:hover {
      border-color: #40aaff;
    }
  }
  .ant-layout {
    background-color: #f0f2f5;
  }
  .ant-layout-content {
    margin: 8px 8px;
    background-color: #f0f2f5;
    height: calc(100vh - 64px);
  }
  .ant-layout-content-dashboard {
    margin: 0;
    height: calc(100vh - 40px);
  }
</style>
