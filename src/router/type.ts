import type { defineComponent } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

export interface RouteMeta {
  title?: string;
  unNeedLogin?: boolean;
  keepAlive?: boolean;
  icon?: string;
  hidden?: boolean;
  activeMenu?: string;
  componentName?: string;
}

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

declare type Recordable<T = any> = Record<string, T>;
// @ts-expect-error: Unreachable code error
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string;
  meta?: RouteMeta;
  component?: Component | string;
  components?: Component;
  children?: AppRouteRecordRaw[];
  props?: Recordable;
  fullPath?: string;
}

export interface FileType {
  [k: string]: Component;
}
