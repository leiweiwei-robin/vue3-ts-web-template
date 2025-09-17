<script lang="ts" setup>
  import type { MenuItem } from '@/interfaces/common/menus';

  const props = withDefaults(
    defineProps<{
      menu?: MenuItem;
    }>(),
    {
      menu: undefined,
    },
  );
  const emits = defineEmits(['closeSubMenu', 'navigatePath']);

  const menuList = ref<{ groupName: string; children: MenuItem[] }[]>([]);

  updateMenuList(props.menu?.children);

  watch(
    () => props.menu,
    newVal => {
      updateMenuList(newVal?.children);
    },
  );

  const router = useRouter();
  function onNavigator(item: MenuItem) {
    if (isDashboardLink(item)) {
      window.open(item.path, '_blank');
      return;
    }
    emits('closeSubMenu');
    if (item.path.indexOf('legacy') !== -1) {
      window.location.href = item.path;
    } else {
      router.push(item.path);
    }
  }

  function isDashboardLink(item: MenuItem) {
    // 是否大屏菜单链接
    // 目前先写死standard-dashboard开头为大屏链接，后续需再菜单接口加字段区分
    return item.path.startsWith('/standard-dashboard');
  }

  function updateMenuList(menulist?: MenuItem[]) {
    const _menuList: { groupName: string; children: MenuItem[] }[] = [];
    const groupedMenu = new Map<string, MenuItem[]>();
    menulist?.forEach(menu => {
      if (menu.value) {
        const groupName = menu.groupName ?? '';
        const group = groupedMenu.get(groupName);
        if (group) {
          group.push(menu);
        } else {
          groupedMenu.set(groupName, [menu]);
        }
      }
    });
    groupedMenu.forEach((children, groupName) => {
      if (children.length > 0) {
        _menuList.push({ groupName, children });
      }
    });
    menuList.value = _menuList;
  }
</script>

<template>
  <div id="mainBoard">
    <div v-for="second in menuList" :key="second.groupName" class="secondMenu">
      <div class="secondMenuTitle">
        {{ second.groupName }}
      </div>
      <div class="thirdMenuWrapper">
        <template v-for="third in second.children" :key="third.id">
          <div
            v-if="third.value"
            class="thirdMenuLine"
            :class="{ selected: third.isCurrent }"
            @click="onNavigator(third)"
          >
            <fl-icon :name="third.icon" class="menuIcon" />
            {{ third.name }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  #mainBoard {
    width: 400px;
    height: 100%;
    // margin-top: 48px;
    background-color: white;
    display: flex;
    flex-direction: column;
    row-gap: 24px;
    padding: 24px 40px;
    overflow-x: auto;
    text-align: left;
  }

  .secondMenuTitle {
    font-weight: 500;
    font-size: 16px;
    color: #222b3c;
    margin-bottom: 16px;
    pointer-events: none;
  }

  .thirdMenuWrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 12px;
    row-gap: 4px;
  }

  .thirdMenuLine {
    cursor: pointer;
    padding: 10px;
    border-radius: 4px;
    font-size: 14px;
    width: 100%;
    height: 100%;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    &.selected,
    &:hover {
      background-color: #e7f3fe;
      color: #138aff;
    }
  }

  .menuIcon {
    width: 12px;
    height: 12px;
    margin-right: 6px;
  }
</style>
