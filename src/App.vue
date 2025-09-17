<script setup lang="ts">
  import { ref } from 'vue';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';
  import dayjs from 'dayjs';
  import advancedFormat from 'dayjs/plugin/advancedFormat';
  import 'dayjs/locale/zh-cn';

  dayjs.locale('zhCN', {
    weekStart: 1, // 设置周一为每周第一天
  });
  dayjs.extend(advancedFormat);

  const theme = ref<any>({
    token: { colorPrimary: '#138aff', borderRadius: 2 },
  });
</script>

<template>
  <a-config-provider :theme="theme" :locale="zhCN">
    <a-app style="height: 100%">
      <router-view />
    </a-app>
  </a-config-provider>
</template>
