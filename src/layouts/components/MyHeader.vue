
<template>
  <div class="my-header">
    <span class="my-logo">
      <el-icon class="mr-2 mt-1">
        <ElemeFilled />
      </el-icon>
      thus商城管理后台
    </span>
    <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">

      <Fold v-if="$store.state.asideWidth == '250px'" />
      <Expand v-else />
    </el-icon>

    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="icon-btn" @click="handleRefresh">
        <Refresh />
      </el-icon>
    </el-tooltip>

    <div class="ml-auto flex items-center">
      <el-tooltip effect="dark" content="显示全屏" placement="bottom">
        <el-icon class="icon-btn" @click="toggle">
          <FullScreen v-if="!isFullscreen" />
          <Aim v-else />
        </el-icon>
      </el-tooltip>

      <el-dropdown class="drowdown" @command="handleCommand">
        <span class="flex items-center justify-center text-light-50">
          <el-avatar :size="50" :src="$store.state.user.avatar" class="mr-1" />
          {{ $store.state.user.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <from-drawer
    ref="formDrawer"
    title="修改密码"
    size="40%"
    :close-on-click-modal="false"
    @submit="onSubmit"
  >
    <el-form ref="formRef" :rules="rules" :model="form">
      <el-form-item prop="oldpassword" label="旧密码" label-width="80px">
        <el-input v-model="form.oldpassword" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item prop="password" label="新密码" label-width="80px">
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入新密码"
        />
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码" label-width="80px">
        <el-input
          type="password"
          v-model="form.repassword"
          placeholder="确认新密码"
        />
      </el-form-item>
    </el-form>
  </from-drawer>
</template>

<script setup>
import FromDrawer from "@/components/FromDrawer.vue";
import { useFullscreen } from "@vueuse/core";
import { useRepassword, useLogout } from "@/composables/useManager";

const {
  // 是否全屏状态
  isFullscreen,
  // 切换全屏状态
  toggle,
} = useFullscreen();
// 封装好的修改密码功能
const { form, onSubmit, rules, formRef, formDrawer, openRepasswordForm } = useRepassword();
//  封装好的退出登录功能
const { handleLogout } = useLogout();
// 修改密码和退出登录的功能选项
const handleCommand = (n) => {
  switch (n) {
    case "logout":
      handleLogout();
      break;
    case "rePassword":
      openRepasswordForm();
      break;
  }
};
// 刷新图标功能
const handleRefresh = () => location.reload();
</script>

<style>
.my-header {
  @apply flex items-center fixed bg-indigo-700 text-light-50 top-0 left-0 right-0;
  height: 64px;
  z-index: 999;
}

.my-logo {
  width: 250px;
  @apply flex justify-center text-xl font-thin;
}

.icon-btn {
  @apply flex;
  width: 42px;
  height: 64px;
  cursor: pointer;
}

.icon-btn:hover {
  @apply bg-indigo-600;
}

.drowdown {
  height: 64px;
  cursor: pointer;
  @apply flex items-center justify-center mx-5;
}
</style>