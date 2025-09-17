<!--
 使用例子：<fl-icon name="icon-chimashanchu"></fl-icon>
  -->

<script setup>
  defineProps({
    name: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '1em',
    },
    color: {
      type: String,
      default: 'inherit', // tips: 如果svg本身带有颜色, color属性无效
    },
  });
</script>

<template>
  <svg
    class="iconfont fl-icon"
    aria-hidden="true"
    :style="{ fontSize: size, color, width: size, height: size }"
  >
    <use :xlink:href="`#${name}`" />
  </svg>
</template>

<style lang="scss">
  .iconfont {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    outline: none;
  }
</style>
