<script setup>
import MyHeader from "./components/MyHeader.vue";
import MyMenu from "./components/MyMenu.vue";
import FTagList from "./components/FTagList.vue";
</script>

<template>
  <el-container>
    <el-header>
      <my-header />
    </el-header>
    <el-container>
      <el-aside :width="$store.state.asideWidth">
        <my-menu />
      </el-aside>
      <el-main>
        <f-tag-list />
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <keep-alive :max="10">
              <component :is="Component"></component>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style>
.el-aside {
  transition: all 0.2s;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-active {
  transition-delay: 0.3s;
}
</style>
