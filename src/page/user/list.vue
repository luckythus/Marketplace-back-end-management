<template>
  <el-card shadow="hover" class="border-0">
    <Search @search="getData" @reset="resetSearch">
      <SearchItem label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="手机号/邮箱/用户昵称"
        />
      </SearchItem>
      <template #show>
        <SearchItem label="关键词">
          <el-select
            v-model="searchForm.user_level_id"
            placeholder="会员等级"
            clearable
          >
            <el-option
              v-for="item in user_level"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </SearchItem>
      </template>
    </Search>

    <!-- 新增|刷新 -->
    <ListHeader @create="openFromDrawer" @refresh="getData" />

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column label="会员">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :size="40" :src="row.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
            <div class="ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID:{{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员等级" align="center">
        <template #default="{ row }">
          {{ row.user_level?.name || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="登陆注册" align="center">
        <template #default="{ row }">
          <p>注册时间：{{ row.create_time }}</p>
          <p v-if="row.last_login_time">最后登录：{{ row.last_login_time }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatus($event, row)"
            :disabled="row.super == 1"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <small v-if="scope.row.super == 1" class="text-sm text-gray-500"
            >暂无操作</small
          >
          <div v-else>
            <el-button
              text
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              title="确定要删除该管理吗？"
              cancelButtonText="取消"
              confirmButtonText="确认"
              @confirm="handleDelete(scope.row.id)"
            >
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
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
    <FromDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form
        :model="form"
        ref="formRef"
        
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="密码" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <ChooseImage v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="会员等级" prop="user_level_id">
          <el-select v-model="form.user_level_id" placeholder="选择会员等级">
            <el-option
              v-for="item in user_level"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="content">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </FromDrawer>
  </el-card>
</template>

<script setup>
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import ListHeader from "../../components/ListHeader.vue";
import FromDrawer from "@/components/FromDrawer.vue";
import { ref } from "vue";
import ChooseImage from "@/components/ChooseImage.vue";
import {
  getUserList,
  updateUserStatus,
  createUser,
  updateUser,
  deleteUser,
} from "@/api/user";
import { useInitTable, useInitForm } from "@/composables/useCommon";
// 所属会员等级信息
const user_level = ref([]);
// 拿到初始化的管理表格数据
const {
  searchForm,
  resetSearch,
  currentPage,
  total,
  limit,
  getData,
  tableData,
  loading,
  handleDelete,
  handleStatus,
} = useInitTable({
  searchForm: {
    keyword: "",
    user_level_id: null,
  },
  getList: getUserList,
  delete: deleteUser,
  updateStatus: updateUserStatus,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    user_level.value = res.user_level;
  },
});
// 拿到初始化的表单的数据
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
  update: updateUser,
  create: createUser,
  form: {
    username: "",
    password: "",
    user_level_id: "",
    status: 1,
    avatar: "",
    nickname: "",
    phone: "",
    email: '',
  },
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
