<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="text-sm">订单统计</span>
        <div>
          <el-check-tag
            style="margin-right: 8px"
            v-for="(item, index) in option"
            :key="index"
            :checked="current == item.value"
            @click="handleChoose(item.value)"
          >
            {{ item.text }}
          </el-check-tag>
        </div>
      </div>
    </template>
    <div ref="el" id="chart" style="width: 100%; height: 300px"></div>
  </el-card>
</template>

<script setup>
// 导入Echarts可视化视图的方法
import * as echarts from "echarts";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getStatistics3 } from "@/api/index.js";
// vueUse提供使用调整大小的方法useResizeObserver
import { useResizeObserver } from "@vueuse/core";

// 可视化视图的当前选项，当作属性的时候，直接使用属性名，不用+.value，默认选中的近1周
const current = ref("week");
// 可视化视图的选项
const option = [
  {
    text: "近1个月",
    value: "month",
  },
  {
    text: "近1周",
    value: "week",
  },
  {
    text: "近24小时",
    value: "hour",
  },
];
// 根据current选中的不同选项，来切换不同的时间视图选项
const handleChoose = (type) => {
  current.value = type;
  // 实时更新根据当前的选项获取可视化视图数据
  getData();
};
// 定义一个null的全局变量
var myChart = null;
// 可视化视图一定要在页面渲染完后再运行！
onMounted(() => {
  // 拿到可视化视图的节点
  var chartDom = document.getElementById("chart"); 
  // 如果节点存在
  if (chartDom) {
    // 调用Echarts.init方法初始化该节点，然后赋给全局变量，变成一个可视化视图的实例。
    myChart = echarts.init(chartDom);
    // 获取该时间选项下的可视化视图的数据
    getData();
  }
});

// 获取可视化视图的函数
function getData() {
  var option;

  option = {
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };
  // 可视化视图的loading加载方法
  myChart.showLoading();
  // 发起后台数据接口，携带当前时间选项参数，来获取对应选项的数据
  getStatistics3(current.value)
    .then((res) => {
      // 将x，y赋值给可视化视图的x轴和y轴
      option.xAxis.data = res.x;
      option.series[0].data = res.y;
      // 构建可视化视图
      myChart.setOption(option);
    })
    .finally(() => {
      // 隐藏加载方法
      myChart.hideLoading();
    });
}

// 防止白屏，在容器组件销毁之前要调用echarts.dispose()销毁Echart实例,内存优化，防止内存泄漏
onBeforeUnmount(() => {
  if (myChart) echarts.dispose(myChart);
});

const el = ref(null);
// 监听页面大小的事件，监听大小变化时刻响应entries回调函数
useResizeObserver(el, (entries) => {
  // 页面大小一变化，响应的entries事件，
  // 然后使用可视化视图Echarts里的resize方法，动态等比例调整大小
      myChart.resize();
});
</script>

<style>
</style>