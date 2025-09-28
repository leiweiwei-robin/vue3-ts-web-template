// / <reference types="vite/client" />
// src/env.d.ts

interface ImportMetaEnv {
  // 在这里声明你使用的环境变量类型
  readonly VITE_PUBLIC_PATH: string;
  // 可以添加其他环境变量
  // readonly VITE_API_URL: string;
}

interface ImportMeta {
  // 补充 Vite glob 方法的类型定义
  glob: (
    pattern: string | string[],
    options?: {
      eager?: boolean;
      import?: string;
      as?: 'raw' | 'url';
      assert?: Record<string, string>;
    },
  ) => Record<string, any>;

  // 可选：如果用到了 globEager，也可以补充
  globEager: (pattern: string | string[]) => Record<string, any>;
}
