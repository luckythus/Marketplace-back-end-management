<template>
  <div>
    <el-row :gutter="20">
      <!-- 占位插槽，当没渲染完成时显示的以及获取不到数据时显示的 -->
      <template v-if="panels.length == 0">
        <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
          <el-skeleton style="width: 240px" animated loading>
            <template #template>
              <el-card shadow="hover">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <!-- card body -->
                <span class="text-3xl text-gray-500 font-bold">
                  <el-skeleton-item variant="h3" style="width: 80%" />
                </span>
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>

      <!-- 真实内容数据 -->
      <el-col
        :span="6"
        :offset="0"
        v-for="(item, index) in panels"
        :key="index"
      >
        <el-card shadow="hover">
          <template #header>
            <div class="flex justify-between">
              <span class="text-sm">{{ item.title }}</span>
              <el-tag :type="item.unitColor" effect="plain">
                {{ item.unit }}
              </el-tag>
            </div>
          </template>
          <!-- card body -->
          <span class="text-3xl text-gray-500 font-bold">
            <CountTo :value="item.value" />
          </span>
          <el-divider />
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <IndexNavs />
    <el-row :gutter="20" class="mt-5">
      <el-col :span="12" :offset="0">
        <IndexChart v-permission="['getStatistics3,GET']" />
      </el-col>
      <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
        <IndexCard title="店铺及评价" tip="提示" :btns="goods" class="mb-3" />
        <IndexCard
          title="交易提示"
          tip="需要立即处理的交易订单"
          :btns="orders"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import IndexCard from "../components/IndexCard.vue";
import IndexChart from "../components/IndexChart.vue";
import IndexNavs from "@/components/IndexNavs.vue";
import CountTo from "@/components/CountTo.vue";
import { getStatisticsl, getStatistics2 } from "@/api/index.js";
import { ref } from "vue";
// 定义一个接收数据的空数组
const panels = ref([]);
// 获取数据，将数据渲染到页面上
getStatisticsl().then((res) => {
  panels.value = res.panels;
});
// 获取数据提示,使用数组将数据存储起来，用数组将数据传递给子组件
const goods = ref([]);
const orders = ref([]);
getStatistics2().then((res) => {
  goods.value = res.goods;
  orders.value = res.order;
});
</script>

<style>
</style>