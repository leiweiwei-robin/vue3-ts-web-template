<script setup lang="ts">
  import { debounce } from 'lodash';
  import type { MenuItem } from '@/interfaces/common/menus';
  import subMenu from '../sub-menu/index.vue';

  withDefaults(
    defineProps<{
      menu?: MenuItem[];
    }>(),
    {
      menu: () => [],
    },
  );

  const showModalFn = debounce((fn: () => void) => {
    fn();
  }, 200);

  const router = useRouter();
  const showSubmenu = ref(false);
  const currentMenu = ref<MenuItem | null>(null);

  function enterMenu(menu?: MenuItem) {
    showModalFn(() => {
      showSubmenu.value = true;
      if (!menu) return;
      currentMenu.value = menu;
    });
  }
  function leaveMenu() {
    showModalFn(() => {
      showSubmenu.value = false;
      currentMenu.value = null;
    });
  }

  function toDashboard() {
    router.push('/dashboard');
  }
</script>

<template>
  <div class="left-container">
    <div class="logo image" @click="toDashboard()" @mouseenter="leaveMenu()" />
    <ul id="newMenu">
      <template v-for="first of menu" :key="first.id">
        <li
          v-if="first.value"
          class="firstLevelMenu"
          :class="{ selected: first.isCurrent }"
          @mouseenter="enterMenu(first)"
          @mouseleave="leaveMenu()"
        >
          <div class="menuWrapper">
            <span class="menuIcon"><fl-icon :name="first.icon" /></span>
            <div>{{ first.name }}</div>
          </div>
        </li>
      </template>
    </ul>
    <div
      class="menu-container"
      :style="{ width: showSubmenu ? '400px' : '0' }"
      @mouseenter="enterMenu()"
      @mouseleave="leaveMenu()"
    >
      <subMenu v-if="currentMenu" :menu="currentMenu" @close-sub-menu="leaveMenu" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .left-container {
    position: relative;
    height: calc(100vh);
    z-index: 1000;
  }

  .logo {
    height: 64px;
    &.image {
      padding: 4px;
      background-color: white;
      background-image: url(/image/elan_logo.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      background-origin: content-box;
    }
  }

  #newMenu {
    list-style: none;
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    padding: 0;
    margin: 0;
    height: calc(100% - 64px);
    &::-webkit-scrollbar {
      display: none;
    }
    .firstLevelMenu {
      padding: 8px;
      text-align: center;
      color: #515665;
      font-size: 14px;
      height: 100%;
      flex: 0 0 80px;
      cursor: pointer;
      .menuIcon {
        font-size: 22px;
      }
      .menuWrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.15s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .menuNameEn {
        font-size: 12px;
        word-wrap: break-word;
        white-space: normal;
        width: 100%;
      }
      &.selected,
      &:hover {
        .menuWrapper {
          background-color: #e7f3fe;
          color: #138aff;
        }
      }
    }
  }

  .menu-container {
    position: absolute;
    top: 48px;
    left: 80px;
    width: 400px;
    height: calc(100vh - 48px);
    overflow: hidden;
    transition: all 0.25s;
    background-color: #fff;
    box-shadow:
      4px 0px 8px 0px rgba(0, 0, 0, 0.04),
      inset 1px -2px 0px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0px 4px 4px 0px;
  }
</style>
