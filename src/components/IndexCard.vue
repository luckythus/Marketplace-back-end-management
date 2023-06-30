<template>
  <!-- 主控台的卡片区域 -->
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">{{ title }}</span>
        <el-tag effect="plain">
          {{ tip }}
        </el-tag>
      </div>
    </template>
    <el-row :gutter="20">
        <el-col :span="6" :offset="0" v-for="(item,index) in btns" :key="index">
            <el-card shadow="never" class="border-0 bg-light-400">
                <div class="flex flex-col items-center justify-center">
                    <span class="text-xl mb-2">{{ item.value }}</span>
                    <span class="text-xs text-gray-500">{{ item.label }}</span>
                </div>
            </el-card>    
        </el-col>
    </el-row>
    
  </el-card>
</template>

<script setup>
// 接收父组件传过来的数据赋值给子组件的自定义属性，然后渲染到页面上。
defineProps({
    title: String,
    tip: String,
    btns: Array
})
</script>

<style>
</style>