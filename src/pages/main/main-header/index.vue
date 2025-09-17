<script lang="ts" setup>
  import {
    CaretDownOutlined,
    ClearOutlined,
    CloseOutlined,
    SearchOutlined,
  } from '@ant-design/icons-vue';
  import QrcodeVue from 'qrcode.vue';
  import type { MenuItem, ShadowMenuItem } from '@/interfaces/common/menus';
  import { clearAllInfo } from '@/helpers/http/login-out';
  import { useStorageStore } from '@/stores/storage';
  import { UserInfo } from '@/interfaces/common/storage';

  const props = withDefaults(
    defineProps<{
      openMenu?: ShadowMenuItem[];
      menus: MenuItem[];
      currentOpeningMenuIndexing?: number;
    }>(),
    {
      openMenu: () => [],
      currentOpeningMenuIndexing: 0,
    },
  );

  const emits = defineEmits(['closeTab', 'closeAllTab']);

  const router = useRouter();

  const localMenuIndex = ref(props.currentOpeningMenuIndexing);

  watch(
    () => props.currentOpeningMenuIndexing,
    val => {
      localMenuIndex.value = val;
      handleSearchData();
    },
  );

  const storageStore = useStorageStore();
  const userInfo: UserInfo = storageStore.getUser;
  const h5QrCodeUrl = ref(`${window.location.protocol}//${window.location.hostname}/h5`);

  function confirmClear() {
    emits('closeAllTab');
  }

  function logout() {
    emits('closeAllTab');
    clearAllInfo();
  }

  function onChangeTab(item: ShadowMenuItem) {
    if (item.url.indexOf('legacy') !== -1) {
      window.location.href = item.url;
      return;
    }
    if (!item.vueSnapshot) {
      router.push({
        path: item.path,
      });
      return;
    }
    router.push({
      name: item.vueSnapshot?.name,
      query: item.vueSnapshot?.query,
      params: item.vueSnapshot?.params,
    });
  }

  function onCloseTab(e: Event, item: ShadowMenuItem) {
    e.stopPropagation();
    emits('closeTab', item);
  }

  const searchValue = ref('');
  const flattedMenu = ref<{ value: string; label: string }[]>([]);
  const searchedMenu = ref<{ value: string; label: string }[]>([]);

  function handleSearchData() {
    flattedMenu.value = [];
    props.menus?.forEach(itemMenu => {
      handleSingleMenuItem(itemMenu);
    });
    searchedMenu.value = [...flattedMenu.value];
  }

  function handleSingleMenuItem(item: MenuItem) {
    if (item.children && item.children.length) {
      item.children.forEach(child => {
        handleSingleMenuItem(child);
      });
    } else {
      if (item.value) {
        flattedMenu.value.push({ value: item.path, label: item.name });
      }
    }
  }
  const autoCompleteRef = ref<any>(null);

  watch(
    () => props.menus,
    () => {
      flattedMenu.value = [];
      handleSearchData();
    },
    { immediate: true },
  );
  const show = ref(false);
  const isOpen = ref(false);
  function onOpenChange(isOpen: boolean) {
    if (isOpen) {
      show.value = false;
      setTimeout(() => {
        show.value = true;
        setTimeout(() => {
          autoCompleteRef.value?.focus();
        }, 100);
      }, 100);
    }
  }

  const filterOption = (input: string, option: any) => {
    return option.label.indexOf(input) >= 0;
  };

  const onSelectMenu = (val: any) => {
    if (val.indexOf('legacy') !== -1) {
      window.location.href = val;
      return;
    }
    router.push({
      path: val,
    });

    isOpen.value = false;
  };
</script>

<template>
  <div class="main-header">
    <a-tooltip
      v-model:open="isOpen"
      trigger="click"
      placement="bottomLeft"
      :destroy-tooltip-on-hide="true"
      color="rgba(0, 0, 0, 0.467)"
      @open-change="onOpenChange($event)"
    >
      <a-button type="text" class="search-icon">
        <SearchOutlined />
      </a-button>
      <template #title>
        <div style="width: 200px">
          <a-select
            v-if="show"
            ref="autoCompleteRef"
            v-model:value="searchValue"
            show-search
            style="width: 200px"
            :dropdown-style="{ width: '200px', 'z-index': 10000 }"
            :autofocus="true"
            :default-open="true"
            :options="searchedMenu"
            :filter-option="filterOption"
            @change="onSelectMenu"
          ></a-select>
        </div>
      </template>
    </a-tooltip>

    <!-- 菜单 -->
    <div class="menu-tabs">
      <div
        v-for="(item, index) in openMenu"
        :key="item.id"
        class="menu-tab"
        :class="{ active: index === localMenuIndex }"
        @click="onChangeTab(item)"
      >
        <span>{{ item.name }}</span>
        <CloseOutlined v-if="index !== 0" class="close-icon" @click="onCloseTab($event, item)" />
      </div>
    </div>

    <div class="right-btns">
      <a-popconfirm
        title="确认清除所有标签页吗?"
        ok-text="确定"
        cancel-text="取消"
        @confirm="confirmClear"
      >
        <ClearOutlined class="icon" />
      </a-popconfirm>

      <a-dropdown :trigger="['click']" placement="bottom">
        <a class="ant-dropdown-link" @click.prevent>
          <fl-icon name="icon-shouji" class="icon" style="margin-left: 8px" />
        </a>
        <template #overlay>
          <div class="qrcode-box">
            <QrcodeVue :value="h5QrCodeUrl" :size="80" />
            <div class="qrcode-tip-info">扫码体验手机端</div>
          </div>
        </template>
      </a-dropdown>

      <a-divider type="vertical" />
      <span>{{ userInfo.name }}</span>
      <a-divider type="vertical" />
      <span v-if="userInfo?.employee_name">{{ userInfo?.employee_name }}</span>

      <a-tooltip
        v-if="userInfo?.roles"
        class="role-tooltip"
        :title="userInfo.roles.map(item => item.role_name).join('、')"
      >
        <template v-for="(item, index) in userInfo.roles" :key="item.role_id">
          <span v-if="index < 3" class="role-item">{{ item.role_name }}</span>
        </template>
        <span v-if="userInfo.roles.length > 3" class="role-item">···</span>
      </a-tooltip>

      <a-dropdown :trigger="['click']" placement="bottom">
        <a class="ant-dropdown-link" @click.prevent>
          <CaretDownOutlined class="icon" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0" @click="logout()"> 退出 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .main-header {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 28px 0 12px;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .search-icon {
      min-width: 40px;
      height: 40px;
      padding: 4.9px 0;
      font-size: 18px;
      border-radius: 2px;
      align-self: flex-end;
    }
    .right-btns {
      display: flex;
      align-items: center;
      color: #515665;
      gap: 8px;
      min-width: 262px;
      padding-left: 12px;
      .icon {
        font-size: 18px;
        cursor: pointer;
      }
      .ant-divider {
        margin: 0 6px;
      }

      .role-item {
        border-radius: 8px;
        font-size: 10px;
        font-weight: 500;
        color: #54607c;
        padding: 0 6px;
        background-color: #ebecf0;
      }
    }
  }

  .qrcode-box {
    width: 104px;
    min-height: 120px;
    padding-top: 10px;
    background: #ffffff;
    box-shadow: 0 5px 32px #0000000f;
    border-radius: 2px;
    text-align: center;
    .qrcode-tip-info {
      font-size: 12px;
      font-weight: 400;
      color: #515665;
      line-height: 16px;
    }
  }

  .ant-dropdown-link {
    color: #515665;
  }

  .menu-tabs {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    flex: 1;
    height: 41px;
    margin-top: 6px;
    overflow-x: scroll;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .menu-tab {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      min-width: 60px;
      border-radius: 2px 2px 0 0;
      border: 1px solid #f0f0f0;
      border-bottom-color: #fff;
      cursor: pointer;
      color: #54607c;
      flex-shrink: 0;
      &.active {
        background-color: #f0f2f5;
        font-weight: 500;
        color: #222b3c;
      }

      .close-icon {
        padding: 1px 6px;
        color: #b5b8bf;
        font-size: 12px;
      }

      span {
        white-space: nowrap;
      }
    }
  }

  :deep(.role-tooltip) {
    display: flex;
    line-height: 16px;
    gap: 8px;
  }
</style>
