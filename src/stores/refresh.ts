import { defineStore } from 'pinia';

export const useRefreshStore = defineStore('refresh', {
  state: () => ({
    keepList: [] as string[],
  }),
  actions: {
    PUSH_KEEPLIST(componentName: string) {
      if (!this.keepList.includes(componentName)) {
        this.keepList.push(componentName);
      }
    },
    CLEAR_KEEPLIST() {
      this.keepList = [];
    },
    clearCache(componentName: string) {
      const index = this.keepList.indexOf(componentName);
      if (index !== -1) {
        this.keepList.splice(index, 1);
      }
    },
  },
});
