<template>
  <div>
    <el-card shadow="hover" class="border-0">
      <ListHeader @create="openFromDrawer" @refresh="getData" />

      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="name" label="会员名称" />
        <el-table-column prop="discount" label="折扣率" align="center" />
        <el-table-column prop="level" label="等级序号" align="center" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatus($event, row)"
              :disabled="row.super == 1"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210" align="center">
          <template #default="scope">
            <el-button
              text
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              title="确定要删除该记录吗？"
              cancel-button-text="取消"
              confirm-button-text="确认"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <el-pagination
          background
          layout="prev,pager,next"
          :total="total"
          :current-page="currentPage"
          :page-size="limit"
          @current-change="getData"
        />
      </div>
    </el-card>
    <FromDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form
        ref="formRef"
        :model="form"
        :inline="false"
        laber-widt="80px"
        :rules="rules"
      >
        <el-form-item label="会员名称" prop="name">
          <el-input v-model="form.name" placeholder="会员名称" />
        </el-form-item>
        <el-form-item label="等级权重" prop="level">
          <el-input v-model="form.level" type="number" placeholder="等级权重" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status" class="mr-5">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="升级条件">
          <div>
            <small class="text-xs mr-2">累计消费满</small>
            <el-input
              type="number"
              v-model="form.max_price"
              placeholder="累计消费"
              style="width: 50%"
            >
              <template #append>元</template>
            </el-input>
            <small class="text-gray-400 flex"
              >设置会员等级所需要的累计消费必须大于等于0，单位：元</small
            >
          </div>
          <div>
            <small class="text-xs mr-2">累计次数满</small>
            <el-input
              type="number"
              v-model="form.max_times"
              placeholder="累计次数"
              style="width: 50%"
            >
              <template #append>%</template>
            </el-input>
            <small class="text-gray-400 flex"
              >设置会员等级所需要的购买量必须大于等于0，单位：笔</small
            >
          </div>
        </el-form-item>
        <el-form-item label="折扣率%" prop="discount">
          <el-input
            type="number"
            v-model="form.discount"
            placeholder="折扣率(%)"
            style="width: 50%"
          >
            <template #append>%</template>
          </el-input>
          <small class="text-gray-400 flex"
            >折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买</small
          >
        </el-form-item>
      </el-form>
    </FromDrawer>
  </div>
</template>

<script setup>
import ListHeader from "@/components/ListHeader.vue";
import FromDrawer from "@/components/FromDrawer.vue";
import { ref } from "vue";
import {
  getUserLevelList,
  createUserLevel,
  updateUserLevel,
  deleteUserLevel,
  updateUserLevelStatus,
} from "@/api/level";
import { useInitTable, useInitForm } from "@/composables/useCommon";
// 获取公告列表数据
const {
  currentPage,
  total,
  limit,
  getData,
  tableData,
  loading,
  handleDelete,
  handleStatus,
} = useInitTable({
  getList: getUserLevelList,
  updateStatus: updateUserLevelStatus,
  delete: deleteUserLevel,
});
// 获取公告表单数据
const {
  formDrawerRef,
  formRef,
  form,
  rules,
  editId,
  drawerTitle,
  resetForm,
  openFromDrawer,
  handleSubmit,
  handleEdit,
} = useInitForm({
  getData,
  update: updateUserLevel,
  create: createUserLevel,
  // // 定义表单数据
  form: {
    name: "",
    level: 0,
    status: 1,
    discount: 0,
    max_price: 0,
    max_times: 0,
  },
  // 定义表单校验规则
  //   rules: {
  //     name: [
  //       {
  //         required: true,
  //         message: "会员名称不能为空！",
  //         trigger: "blur",
  //       },
  //     ],
  //   },
});
</script>

<style>
.notice-header {
  @apply flex items-center justify-between mb-4;
}

.bottom {
  @apply flex items-center justify-center mt-5;
}
</style>
