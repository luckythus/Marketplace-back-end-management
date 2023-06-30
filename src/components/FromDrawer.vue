<template>
  <!-- 分离出来的抽屉模块，方便不同的组件进行使用 -->
  <el-drawer
    v-model="showDrawer"
    :title="title"
    :size="size"
    :close-on-click-modal="false"
    :desstroy-on-close="desstroyOnClose"
  >
    <div class="formDrawer">
      <div class="form-body">
        <slot></slot>
      </div>
      <div class="submit">
        <el-form-item>
          <el-button type="primary" @click="submit">{{ confirmText }}</el-button>
          <el-button type="default" @click="close()">取消</el-button>
        </el-form-item>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  // 抽屉标题
  title: String,
  // 抽屉区域
  size: {
    type: String,
    default: "45%",
  },
  // 控制是否在关闭 Drawer 之后将子元素全部销毁
  desstroyOnClose: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: '提交'
  }
});
// emit里面存宏定义的submit事件
const emit = defineEmits(["submit"]);
// 当click触发的submit后，则调用emit里面的submit事件，也就是父组件(MyHeader的submit事件，执行事件后的方法。
const submit = () => emit("submit");
// 拿到模块显示或隐藏的属性
const showDrawer = ref(null);
// 定义显示抽屉模块显示的方法，然后暴露出去提供父组件使用
const open = () => (showDrawer.value = true);
// 定义隐藏方法，暴露出去
const close = () => (showDrawer.value = false);
const loading = ref(false);
const showLoading = () => (loading.value = true);
const hideLoading = () => (loading.value = false);
// 暴露方法，提供其他组件使用
defineExpose({
  open,
  close,
  showLoading,
  hideLoading,
});
</script>

<style>
.formDrawer {
  width: 100%;
  height: 100%;
  position: relative;
  @apply flex flex-col;
}
.formDrawer .form-body {
  position: absolute;
  bottom: 50px;
  @apply flex-1 top-0 left-0 right-0 overflow-y-auto;
}
.submit {
  height: 50px;
  @apply mt-auto;
}
</style>
