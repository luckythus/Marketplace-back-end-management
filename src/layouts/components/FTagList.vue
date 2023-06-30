<template>
  <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="demo-tabs"
      style="min-width: 100px"
      @tab-change="changeTab"
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in tabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="item.path != '/'"
      >
      </el-tab-pane>
    </el-tabs>
    <span class="tag-btn">
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <el-icon class="el-icon--right mr-1">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="clearAll">关闭全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <div style="height: 44px"></div>
</template>
<script setup>
import { useTagList } from '@/composables/useTagList'
// 封装好的标签导航组件以及方法
const { 
  activeTab,
  tabList,
  changeTab,
  removeTab,
  handleClose
} = useTagList()
</script>
<style scoped>
.f-tag-list {
  @apply fixed flex items-center justify-center bg-gray-100 px-2;
  top: 64px;
  right: 0px;
  height: 44px;
  z-index: 100;
  border: 0px;
}
.tag-btn {
  @apply flex items-center justify-center ml-auto bg-white rounded;
  height: 32px;
  width: 32px;
}
:deep(.el-tabs__header) {
  border: 0!important;
  @apply mb-0;
}
:deep(.el-tabs__nav) {
  border: 0 !important;
}
:deep(.el-tabs__item) {
  border: 0 !important;
  height: 32px;
  line-height: 32px;
  @apply bg-white mx-1 mt-1 rounded;
}
:deep(.el-tabs__nav-next),:deep(.el-tabs__nav-prev){
    line-height: 32px;
    height: 32px;
}
:deep(.is-disabled) {
  cursor: not-allowed;
  @apply text-gray-300;
}
</style>
