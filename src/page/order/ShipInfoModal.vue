<template>
  <el-drawer title="物流信息" v-model="dialogVisible" size="40%">
    <el-card shadow="never" class="border-0 mb-3">
      <div class="flex items-center">
        <el-image
          :src="info.logo"
          fit="fill"
          :lazy="true"
          style="width: 60px; height: 60px"
        ></el-image>
        <div>
          <p class="text-l ml-3">物流公司：{{ info.typename }}</p>
          <p class="text-l ml-3">物流单号：{{ info.number }}</p>
        </div>
      </div>
    </el-card>
    <el-card shadow="never" class="border-0 mb-3">
        <!-- 时间线组件 -->
      <el-timeline class="ml-[-40px]">
        <el-timeline-item
          v-for="(item, index) in info.list"
          :key="index"
          :timestamp="item.time"
          placement="top"
        >
          {{ item.status }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </el-drawer>
</template>

<script setup>
import { ref } from "vue";
import { getShipInfo } from "@/api/order";
import { Message } from "@/composables/util";
const dialogVisible = ref(false);
// 定义一个数据来保存查看物流接口返回来的信息
const info = ref({});
// open方法返回的是一个Promise，在父组件中可以链式调用then和finally
const open = (id) => {
  return getShipInfo(id).then((res) => {
    console.log(res);
    // 根据返回来的数据判断订单号是否已失效
    if (res.status != 0) {
      return Message(res.msg, "error");
    }
    // 使用info保存返回的信息，用它来渲染在页面上
    info.value = res.result;
    console.log(res.result);
    dialogVisible.value = true;
  });
};
defineExpose({
  open,
});
</script>
<style></style>
