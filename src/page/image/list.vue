<template>
  <!-- el-container容器布局 -->
    <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
    <el-header class="image-header">
      <el-button type="primary" size="small" @click="handleCreateFromDrawer">新增分类</el-button>
      <el-button type="warning" size="small" @click="handleOpenUploadFile">上传图片</el-button>
    </el-header>
    <el-container>
      <!-- 抽离出类似布局封装成模块 -->
      <ImageAside ref="ImageAsideRef" @change="handleChangeImage"/>
      <ImageMain ref="ImageMainRef"/>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import ImageAside from '@/components/ImageAside.vue'
import ImageMain from '@/components/ImageMain.vue'
const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40;
// 拿到ImageAside节点
const ImageAsideRef = ref(null)
// 点击该组件，响应子组件方法，打开抽屉
const handleCreateFromDrawer = () => ImageAsideRef.value.handleOpen()
// 拿到ImageMain的节点
const ImageMainRef = ref(null)
// 响应子组件的change事件，加载当前分类id的图片
const handleChangeImage = (image_class_id) => {
  ImageMainRef.value.loadData(image_class_id)
}
// 调用子组件提供的方法，打开上传图片的抽屉
const handleOpenUploadFile = () => ImageMainRef.value.openUploadFile()
</script>

<style>
.image-header {
  @apply flex items-center;
  border-bottom: 1px solid #eeeeee;
}
</style>