import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menuStore', {
  state: () => ({
    menus: new Map() as Map<string, string[]>,
    userActions: new Map() as Map<string, string[]>,
  }),
  actions: {
    SET_MENU(menu: Map<string, string[]>) {
      this.menus = menu;
    },
    SET_ACTIONS(actions: Map<string, string[]>) {
      this.userActions = actions;
    },
    CLEAR_MENU() {
      this.menus = new Map() as Map<string, string[]>;
    },
    CLEAR_ACTIONS() {
      this.userActions = new Map() as Map<string, string[]>;
    },
    CLEAR_ALL() {
      this.CLEAR_MENU();
      this.CLEAR_ACTIONS();
    },
  },
});
