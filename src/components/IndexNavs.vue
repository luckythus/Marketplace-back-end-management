<template>
  <el-row :gutter="20" class="mt-5">
    <el-col
      :span="3"
      :offset="0"
      v-for="(item, index) in iconData"
      :key="index"
    >                         <!-- 标签封装模块，点击对应的标签跳转对应的路由-->                          
      <el-card shadow="hover" @click="$router.push(item.path)">
        <div class="flex flex-col justify-center items-center cursor-pointer">
          <el-icon :size="16" :class="item.color">
            <component :is="item.icon"></component>
          </el-icon>
          <span class="text-sm mt-2">
            {{ item.title }}
          </span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
const iconData = [
  {
    icon: "user",
    color: "text-light-blue-500",
    title: "用户",
    // 点击可$router.push()跳转相对应的路由
    path: "/user/list",
  },
  {
    icon: "shopping-cart",
    color: "text-violet-500",
    title: "商品",
    path: "/goods/list",
  },
  {
    icon: "tickets",
    color: "text-fuchsia-500",
    title: "订单",
    path: "/order/list",
  },
  {
    icon: "chat-dot-square",
    color: "text-teal-500",
    title: "评价",
    path: "/comment/list",
  },
  {
    icon: "picture",
    color: "text-rose-500",
    title: "图库",
    path: "/image/list",
  },
  {
    icon: "bell",
    color: "text-green-500",
    title: "公告",
    path: "/notice/list",
  },
  {
    icon: "set-up",
    color: "text-grey-500",
    title: "配置",
    path: "/setting/base",
  },
  {
    icon: "files",
    color: "text-yellow-500",
    title: "优惠券",
    path: "/coupon/list",
  },
];
</script>

<style>
</style>