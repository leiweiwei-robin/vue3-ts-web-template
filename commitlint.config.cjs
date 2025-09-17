module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // bug修复
        'docs', // 文档更新
        'style', // 代码样式调整
        'refactor', // 代码重构
        'test', // 测试相关
        'chore', // 构建/工具变更
        'revert', // 回滚提交
        'build', // 编译相关
        'ci', // cicd相关
      ],
    ],
    'subject-case': [0], // 不限制subject大小写
  },
};
