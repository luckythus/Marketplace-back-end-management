<template>
  <el-card shadow="never">
    <ListHeader @create="openFromDrawer" @refresh="getData" />
    <el-tree
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
      v-loading="loading"
      node-key="id"
    >
      <template #default="{ data }">
        <div class="current-tree-node">
          <span>{{ data.name }}</span>

          <div class="ml-auto">
            <el-button
              text
              type="primary"
              size="small"
              @click="openGoodsDrawer(data)"
              :loading="data.goodsDrawerLoading"
              >推荐商品</el-button
            >
            <el-switch
              :modelValue="data.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatus($event, data)"
              @click.stop=""
            />
            <el-button
              text
              type="primary"
              size="small"
              @click.stop="handleEdit(data)"
              >修改</el-button
            >

            <el-popconfirm
              title="是否要删除该记录？"
              confirmButtonText="确认"
              cancelButtonText="取消"
              @confirm="handleDelete(data.id)"
            >
              <template #reference>
                <el-button text type="primary" size="small" @click.stop=""
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>
    <FromDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form
        ref="formRef"
        :model="form"
        :inline="false"
        laber-widt="80px"
        :rules="rules"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
      </el-form>
    </FromDrawer>
    <GoodsDrawer ref="goodsDrawerRef"></GoodsDrawer>
  </el-card>
</template>

<script setup>
import FromDrawer from "@/components/FromDrawer.vue";
import GoodsDrawer from "./components/GoodsDrawer.vue";
import { ref } from "vue";
import ListHeader from "@/components/ListHeader.vue";
import {
  getCategoryList,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} from "@/api/category.js";
import { useInitTable, useInitForm } from "@/composables/useCommon.js";

// 获取分类权限列表数据表格
const { 
    loading, 
    getData, 
    tableData, 
    handleStatus, 
    handleDelete 
} = useInitTable({
    getList: getCategoryList,
    delete: deleteCategory,
    updateStatus: updateCategoryStatus,
    onGetListSuccess: (res) => {
      tableData.value = res.map(o => {
        o.goodsDrawerLoading = false
        return o
      })
    },
  });

// 获取公告表单数据
const {
  formDrawerRef,
  formRef,
  form,
  rules,
  drawerTitle,
  openFromDrawer,
  handleSubmit,
  handleEdit,
} = useInitForm({
  getData,
  update: updateCategory,
  create: createCategory,
  // // 定义表单数据
  form: {
    name: "",
  },
  // 定义表单校验规则
  rules: {},
});
// 定义关联商品抽屉的ref
const goodsDrawerRef = ref(null);
// 打开关联商品的抽屉
const openGoodsDrawer = (data) => goodsDrawerRef.value.open(data);
</script>

<style>
.current-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 15px;
  padding-right: 8px;
}
.el-tree-node__content {
  padding: 20px 0;
}
</style>
