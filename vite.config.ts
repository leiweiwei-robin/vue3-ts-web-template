// / <reference types="vitest/config" />

import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';

// Configuring Vite: https://cn.vite.dev/config
export default defineConfig(({ mode }) => {
  const { VITE_PUBLIC_PATH } = loadEnv(mode, process.cwd(), '') as ImportMetaEnv;
  return {
    // 开发或打包构建时用到的公共基础路径
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        // @ 符号指向 src 目录
        '@': resolve(__dirname, 'src'),
        'fl-components': resolve(__dirname, 'fl-components'),
      },
    },
    // 开发环境服务器配置
    server: {
      // 是否监听所有地址
      host: true,
      // 端口号
      port: 3333,
      // 端口被占用时，是否直接退出
      strictPort: false,
      // 是否自动打开浏览器
      open: true,
      // 反向代理
      proxy: {
        '^(/elan|/service|/mall)': {
          target: 'https://scm.s.t3.flkj.pub/',
          changeOrigin: true,
          secure: false,
          headers: {
            sourceType: 'TEST3',
            'X-Auth-Type': 'SCM',
          },
        },
        // '^(/elan|/service|/mall)': {
        //   target: 'https://scm.s.t2.flkj.pub/',
        //   changeOrigin: true,
        //   secure: false,
        //   headers: {
        //     sourceType: 'TEST2',
        //     'X-Auth-Type': 'TEST2'
        //   }
        // }
      },
      // 是否允许跨域
      cors: true,
      // 预热常用文件，提高初始页面加载速度
      warmup: {
        clientFiles: ['./src/layouts/**/*.*', './src/pinia/**/*.*', './src/router/**/*.*'],
      },
    },
    // 构建配置
    build: {
      // 自定义底层的 Rollup 打包配置
      rollupOptions: {
        output: {
          /**
           * @name 分块策略
           * @description 1. 注意这些包名必须存在，否则打包会报错
           * @description 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
           */
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            // 将大型第三方库单独打包
            'ant-design-vue': ['ant-design-vue'],
            'ali-oss': ['ali-oss'],
            sortablejs: ['sortablejs', 'vuedraggable'],
            'ag-grid': ['ag-grid-enterprise', 'ag-grid-vue3'],
            'ag-grid-charts': ['ag-charts-enterprise'],
          },
        },
      },
      // 是否开启 gzip 压缩大小报告，禁用时能略微提高构建性能
      reportCompressedSize: false,
      // 单个 chunk 文件的大小超过 2048kB 时发出警告
      chunkSizeWarningLimit: 2048,
    },
    // 混淆器
    esbuild:
      mode === 'development'
        ? undefined
        : {
            // 打包构建时移除 console.log
            pure: ['console.log'],
            // 打包构建时移除 debugger
            drop: ['debugger'],
            // 打包构建时移除所有注释
            legalComments: 'none',
          },
    // 依赖预构建
    optimizeDeps: {},
    // CSS 相关配置
    css: {
      // 线程中运行 CSS 预处理器
      preprocessorMaxWorkers: true,
      // css预处理器配置
      preprocessorOptions: {
        // 定义全局scss变量
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `,
        },
      },
    },
    // 插件配置
    plugins: [
      vue(),
      // 自动生成 SvgIcon 组件和 SVG 雪碧图
      // 自动按需导入 API
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'types/auto/auto-imports.d.ts',
      }),
      Components({
        dirs: ['fl-components', '!fl-components/**/_*'],
        dts: true,
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
        ],
        deep: true, // 是否搜索子目录
        include: [/\.vue$/, /\.vue\?vue/], // 匹配规则
        excludeNames: [/^_+/], // 排除以_为前缀的.vue文件
        extensions: ['vue'], // 文件扩展名
      }),
      visualizer(),
    ],
  };
});
