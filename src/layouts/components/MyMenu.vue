<template>
  <div class="my-menu" :style="{ width: $store.state.asideWidth }">
    <el-menu
      :default-active="defaultActive"
      class="border-0"
      @select="handleSelect"
      :collapse="isCollapse"
      unique-opened
      :collapse-transition="false"
    >
      <template v-for="(item, index) in asideMenu" :key="index">
        <el-sub-menu
          v-if="item.child && item.child.length > 0"
          :index="item.name"
        >
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="(items, index2) in item.child"
            :key="index2"
            :index="items.frontpath"
          >
            <el-icon>
              <component :is="items.icon"></component>
            </el-icon>
            <span>{{ items.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.frontpath">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.usename }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute, onBeforeRouteUpdate } from "vue-router";
const router = useRouter();
const store = useStore();
const route = useRoute();

// 默认激活显示的路由页面
const defaultActive = ref(route.path);
// 侧边栏监听标签导航栏路由变化，根据标签导航栏路由来动态响应匹配与之对应的路由
onBeforeRouteUpdate((to,from) => {
  defaultActive.value = to.path
})
// 判断是否展开或收缩菜单侧边栏模块
const isCollapse = computed(() => !(store.state.asideWidth == "250px"));

// 获取用户菜单列表，包括路径以及路由请求类型
const asideMenu = computed(() => store.state.menus);

// 根据选择菜单列表路径，main页面跳转到对应的路由
const handleSelect = (e) => {
  // 打印当前菜单路径，跳转到符合菜单路径的路由
  // console.log(e)
  // 跳转
  router.push(e);
};
</script>

<style>
.my-menu {
  transition: all 0.2s;
  overflow-y: auto;
  overflow-x: hidden;
  top: 64px;
  bottom: 0px;
  left: 0px;
  @apply shadow-md fixed bg-light-50;
}
/* 设置滚动条的宽度为0px，消失效果 */
.my-menu::-webkit-scrollbar {
  width: 0px;
}
</style>