import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

import importPlugin from 'eslint-plugin-import'; // 导入插件
// 检查那些导入却没有使用的模块（方法、变量等），可以帮我们自动删除
import unusedImports from 'eslint-plugin-unused-imports';

export default typescriptEslint.config(
  {
    ignores: [
      '*.d.ts',
      '**/coverage',
      '**/dist',
      'node_modules',
      'src/uni_modules',
      'components.d.ts',
      'container',
      'src/iconfont',
      'src/assets',
      '.*',
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },

    // 新增：让 ESLint 识别 Vue 文件的 script 块为 TS 代码
    settings: {
      vue: {
        script: {
          parser: '@typescript-eslint/parser', // 明确 Vue script 块用 TS 解析器
          parserOptions: {
            project: './tsconfig.json', // 关联你的 TS 配置（确保类型感知）
          },
        },
      },
    },

    rules: {
      // 关闭禁止使用 any 类型的检查（在快速开发或处理复杂类型时临时关闭）
      '@typescript-eslint/no-explicit-any': 'off',
      // 关闭未使用变量的检查（开发阶段可能存在临时变量，上线前建议开启）
      '@typescript-eslint/no-unused-vars': 'off',
      // 关闭 Vue 组件名必须为多单词的检查（允许单个单词组件名，如 Header、Footer）
      'vue/multi-word-component-names': 'off',
      // 强制 v-for 指令必须合法（如避免在非迭代场景使用，错误时抛出错误）
      'vue/valid-v-for': 'error',
      // 检查 Vue 单文件组件中块的顺序（要求 script → template → style，警告级别）
      'vue/block-order': ['warn', { order: ['script', 'template', 'style'] }],
      // 检查 Vue 标签中属性的顺序（按规范排序，提升可读性，警告级别）
      'vue/attributes-order': 'warn',
      // 关闭禁止使用 Object.prototype 内置方法的检查（如 obj.hasOwnProperty()）
      'no-prototype-builtins': 'off',
      // 要求 v-for 必须添加 key 属性
      'vue/require-v-for-key': 'warn',
      // 重复配置：检查 v-for 语法合法性
      'vue/valid-v-for': 'warn',
      // 禁止使用 debugger 语句（错误级别，防止上线后调试代码未移除）
      'no-debugger': 'error',
      // 关闭禁止使用 console 的检查（允许在代码中使用 console.log 等调试）
      'no-console': 'off',
      // 检查 Vue 组件定义名称的大小写（要求 kebab-case 短横线命名，警告级别）
      'vue/component-definition-name-casing': ['warn', 'kebab-case'],
      // 关闭强制 HTML 自闭合标签的检查（允许 <div></div> 而非强制 <div/>）
      'vue/html-self-closing': ['off'],
      // 检查未使用的 ref 引用（警告级别，提醒清理无用的 ref 定义）
      'vue/no-unused-refs': 'warn',
      // 关闭要求使用 === 而非 == 的检查
      'vue/eqeqeq': 'off',
      // 使用 const 声明不变的变量
      'prefer-const': 'error',
      // 检查未使用的表达式
      '@typescript-eslint/no-unused-expressions': 'warn',
      // 检查 Vue 组件中是否有重复的键名
      'vue/no-dupe-keys': 'warn',
      // 关闭强制属性换行的检查（允许属性在同一行或换行，不限制格式）
      'vue/first-attribute-linebreak': 'off',

      'spaced-comment': [
        'error', // 从 warn 改为 error 更严格（可选，按需求调整）
        'always', // 注释后必须有空格（如 // 注释，而非 //注释）
      ],

      // 禁止使用var
      'no-var': 'error',

      // 核心规则：强制类和接口使用大驼峰（PascalCase）
      '@typescript-eslint/naming-convention': [
        'error', // 错误级别：不符合规则时报错
        // 规则1：接口必须使用 PascalCase（大驼峰）
        {
          selector: 'interface', // 目标：接口
          format: ['PascalCase'], // 允许的格式：大驼峰（首字母大写，如 UserInfo）
          // 可选：禁止接口名前缀为 I（如 IUser，根据团队规范调整）
          // leadingUnderscore: 'allow', // 允许下划线开头（一般不推荐）
          // filter: { regex: '^I[A-Z]', match: false } // 禁止以 I 开头
        },
        // 规则2：类必须使用 PascalCase（大驼峰）
        {
          selector: 'class', // 目标：类
          format: ['PascalCase'], // 允许的格式：大驼峰（如 UserService）
          leadingUnderscore: 'allow', // 允许类名以下划线开头（如 _PrivateClass，可选）
        },
        // 可选：扩展其他标识符的命名规则（如类型别名、枚举等）
        {
          selector: 'typeAlias', // 类型别名（如 type User = { ... }）
          format: ['PascalCase'],
        },
        {
          selector: 'enum', // 枚举
          format: ['PascalCase', 'UPPER_CASE'],
        },
      ],

      // 文件最大行数为800行(不包含注释和空行) 如果确实存在(业务原因无法避免)，需要单独提出来
      'max-lines': ['error', { max: 800, skipBlankLines: true, skipComments: true }],

      // 无用的return禁用
      'no-useless-return': 'error',

      // 'no-useless-return': 'error',

      // 强制使用模板字符串
      'prefer-template': 'error',

      // 检查 async 函数中是否缺少 await
      'require-await': 'error',

      // 检查不必要的 async 声明
      'no-async-promise-executor': 'error',

      // 检查 await 是否在 async 函数中使用
      'no-await-in-loop': 'error',

      // 强制 import 语句位于顶部
      'import/first': 'error',
      // 确保在一组import语句的最后面有一个空行
      'import/newline-after-import': 'error',

      'import/order': [
        'error',
        {
          groups: [
            'builtin', // 内置模块（如 'fs', 'path'）
            'external', // 外部依赖（如 'react', 'lodash'）
            'internal', // 内部模块（如 '@/utils'）
            'parent', // 父级目录模块
            'sibling', // 同级目录模块
            'index', // 当前目录的 index 文件
            'object', // 对象导入（如 import { x } from 'y'）
            'type', // 类型导入（如 import type { x } from 'y'）
          ],
          pathGroups: [
            {
              pattern: 'vue', // 将 vue 单独分组
              group: 'external',
              position: 'before', // 确保 vue 在 external 组的最前面
            },
            {
              pattern: '@/**', // 匹配别名路径（如 @/utils）
              group: 'internal', // 明确归为 internal 组
            },
            {
              pattern: './**', // 匹配相对路径（如 ./permission）
              group: 'internal', // 必须归类到 internal
              position: 'after', // 确保在 external 之后
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'], // 排除 builtin 组
          'newlines-between': 'never', // 不同组之间用空行分隔
          alphabetize: {
            order: 'ignore', // 关闭按字母顺序排序
            caseInsensitive: true, // 忽略大小写
          },
          distinctGroup: false, // 将静态导入和动态导入分开处理
          warnOnUnassignedImports: true,
        },
      ],

      // 强制校验命名导出是否存在
      'import/named': 'error',
      // 错误的写法
      // import { ValueFormatterParams, ValueSetterParams } from 'ag-grid-enterprise';
      // 正确的写法
      // import type { ValueFormatterParams, ValueSetterParams } from 'ag-grid-enterprise';

      // 检测并禁止空函数实现
      'no-empty-function': [
        'error', // 错误级别：报错（可选 'warn' 仅警告）
        {
          // 可选：允许特定类型的空函数（根据需求调整）
          allow: [
            // 'functions'：允许普通空函数（不推荐）
            // 'arrowFunctions'：允许空箭头函数（不推荐）
            'constructors', // 允许空构造函数（如 class 中的 constructor() {}）
            'getters', // 允许空 getter
            'setters', // 允许空 setter
            'methods', // 允许空类方法
          ],
        },
      ],

      // 禁止文件中导入但未使用的方法、变量、模块等
      'unused-imports/no-unused-imports': 'error',

      // 注释后必须有空格（如 // 注释，而非 //注释）
      'spaced-comment': ['error', 'always'],

      // 函数参数最多两个 是否需要统计 参数 (this:void)
      'max-params': ['error', { max: 6, countVoidThis: false }],

      // 检测未使用的变量和函数
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          // 忽略以下划线开头的变量（如 _temp、_unused）
          varsIgnorePattern: '^_',
          // 忽略以下划线开头的参数（如 (_, b) => {}）
          argsIgnorePattern: '^_',
          // 检查函数参数是否未使用（包括 this 参数）
          args: 'all',
          // 允许声明后立即赋值给对象/数组的情况（如 const { a } = obj; 即使 a 未使用）
          destructuredArrayIgnorePattern: '^_',
        },
      ],

      // 禁止在 if 语句块中包含 return 后再使用 else 语句块，目的是简化代码结构，提高可读性
      'no-else-return': 'error',

      // uaKey && userActions.set(uaKey, item.actions);
      '@typescript-eslint/no-unused-expressions': [
        'warn',
        {
          allowShortCircuit: true, // 允许 a && b 形式的短路表达式
          allowTernary: true, // 允许 a ? b : c 形式的三元表达式
        },
      ],
    },
    plugins: {
      import: importPlugin, // 注册插件
      'unused-imports': unusedImports, // 注册插件
    },
  },
  eslintConfigPrettier,
);
