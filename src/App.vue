<template>
    <router-view></router-view>
</template>
<script setup>
</script>



<style>
body{
  @apply bg-gray-100 !important;
}
#nprogress .bar {
  background-color: #f4f4f4!important;
  height: 3px;
}
/* 全局设置滚动条样式 */
/* 滚动条的宽高 */
::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}
/* 滚动条的边角部分，当同时有垂直滚动条和水平滚动条时交汇的部分. */
::-webkit-scrollbar-corner {
  display: block;
}
/* 滚动条的滚动滑块部分 */
::-webkit-scrollbar-thumb {
  /* 边边小圆角 */
  border-radius: 8px;
  background-color: rgba(0,0,0,.2);
}
/* 滚动条的轨道 */
::-webkit-scrollbar-track
{
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0,0,0,.1);
}
</style>
