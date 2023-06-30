<template>
  <el-drawer title="订单详情" v-model="dialogVisible" size="50%">
    <el-card shadow="hover" class="mb-3">
      <template #header>
        <b class="text-sm">订单详情</b>
      </template>
      <el-form label-width="80px">
        <el-form-item label="订单号:">
          {{ info.no }}
        </el-form-item>
        <el-form-item label="付款方式:">
          {{ info.payment_method }}
        </el-form-item>
        <el-form-item label="付款时间:">
          {{ info.paid_time }}
        </el-form-item>
        <el-form-item label="创建时间:">
          {{ info.create_time }}
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover" class="mb-3" v-if="info.refund_status != 'pending'">
      <template #header>
        <b class="text-sm">退货信息</b>
        <el-button text disabled style="float: right">{{
          refund_status
        }}</el-button>
      </template>
      <el-form label-width="80px">
        <el-form-item label="退款理由:">
          {{ info.extra.refund_reason }}
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover" class="mb-3" v-if="info.ship_data">
      <template #header>
        <b class="text-sm">发货信息</b>
      </template>
      <el-form label-width="80px">
        <el-form-item label="物流公司:">
          {{ info.ship_data.express_company }}
        </el-form-item>
        <el-form-item label="运单号:">
          {{ info.ship_data.express_no }}
          <el-button
            text
            class="ml-3"
            type="primary"
            size="small"
            @click="openShipInfoModal(info.id)"
            :loading="loading"
          >查看物流</el-button>
        </el-form-item>
        <el-form-item label="发货时间:">
          {{ ship_time }}
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover" class="mb-3">
      <template #header>
        <b class="text-sm">商品信息</b>
      </template>
      <div class="flex" v-for="(item, index) in info.order_items" :key="index">
        <el-image
          :src="item.goods_item?.cover ?? ''"
          style="width: 60px; height: 60px"
          class="mb-1"
          fit="fill"
          :lazy="true"
        ></el-image>
        <div class="ml-2 text-sm">
          <p>{{ item.goods_item?.title ?? "商品已被删除" }}</p>
          <p v-if="item.sku">
            <el-tag type="info" size="small" effect="dark">
              {{ item.sku }}
            </el-tag>
          </p>
          <p>
            <b class="text-rose-500 mr-1">￥{{ item.price }}</b>
            <span class="text-xs text-gray-500">x{{ item.num }}</span>
          </p>
        </div>
      </div>
      <el-form label-width="80px">
        <el-form-item label="成交价:">
          <span class="text-rose-500 font-bold">￥{{ info.total_price }}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover" v-if="info.address" class="mb-3">
      <template #header>
        <b class="text-sm">收货信息</b>
      </template>
      <el-form label-width="80px">
        <el-form-item label="收货人:">
          {{ info.address.name }}
        </el-form-item>
        <el-form-item label="联系方式:">
          {{ info.address.phone }}
        </el-form-item>
        <el-form-item label="收货地址:">
          {{
            info.address.province +
            info.address.city +
            info.address.district +
            info.address.address
          }}
        </el-form-item>
      </el-form>
    </el-card>
  </el-drawer>
  <ShipInfoModal ref="ShipInfoModalRef" />
</template>

<script setup>
import ShipInfoModal from "./ShipInfoModal.vue";
import { ref, computed } from "vue";
import { useDateFormat } from "@vueuse/core"; //useDateFormat()方法参数👇
// 由于后端接口数据的发货时间是十位数的时间戳，所以需要使用计算属性 * 1000来转换为十三位的时间戳，结合VueUse提供的时间转换方法useDateFormat转换为YYYY-MM-DD HH:mm:ss格式
const ship_time = computed(() => {
  // 如果有发货时间才进行useDateFormat转换
  if (props.info.ship_data) {
    const result = useDateFormat(
      props.info.ship_data.express_time * 1000,
      "YYYY-MM-DD HH:mm:ss"
    );
    return result.value;
  }
  // 没有的话则返回空字符串
  return "";
});
// 定义退款提示，使用计算属性来动态计算当前退款提示
const refund_status = computed(() => {
  const opt = {
    pending: "未退款",
    applied: "已申请，等待审核",
    processing: "退款中",
    success: "退款成功",
    failed: "退款失败",
  };
  return props.info.refund_status ? opt[props.info.refund_status] : "";
});
// 自定义属性
const props = defineProps({
  info: Object,
});
const dialogVisible = ref(false);
const open = () => (dialogVisible.value = true);
// 定义一个加载的loading
const loading = ref(false)
// 拿到物流信息组件
const ShipInfoModalRef = ref(null);
// 定义查看物流的方法
const openShipInfoModal = (id) => {
    loading.value = true
    ShipInfoModalRef.value.open(id).finally(() => {
        loading.value = false
    })
}
defineExpose({
  open,
});
</script>

<style></style>
