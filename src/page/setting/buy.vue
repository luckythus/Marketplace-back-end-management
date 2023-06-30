<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form">
      <el-tabs v-model="activeName">
        <el-tab-pane label="支付设置" name="first">
          <el-table :data="tableData" border stripe>
            <el-table-column label="支付方式" class="p-6">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-image
                    :src="row.src"
                    fit="fill"
                    :lazy="true"
                    style="width: 40px; height: 40px"
                  ></el-image>
                  <div class="ml-2">
                    <h6>{{ row.name }}</h6>
                    <small class="text-gray-400 mt-1">{{ row.desc }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
              <template #default="{ row }">
                <div>
                  <el-button type="primary" text @click="open(row.key)">配置</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="购物设置" name="second"> </el-tab-pane>
      </el-tabs>
    </el-form>
    <FromDrawer ref="FromDrawerRef" title="配置" @submit="">
        <el-form v-if="drawType=='alipay'" :model="form" label-width="80px">
            <el-form-item label="app_id">
                <el-input v-model="form.alipay.app_id" placeholder="app_id"></el-input>
            </el-form-item>
            <el-form-item label="ali_public_key">
                <el-input v-model="form.alipay.ali_public_key" placeholder="ali_public_key"></el-input>
            </el-form-item>
            <el-form-item label="private_key">
                <el-input v-model="form.alipay.private_key" placeholder="private_key"></el-input>
            </el-form-item>
        </el-form>
        <el-form v-else :model="form" ref="form" :rules="rules" label-width="80px" :inline="false" size="normal">
            <el-form-item label="">
               
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
        
    </FromDrawer>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import FromDrawer from "@/components/FromDrawer.vue";
import { getSysconfig, setSysconfig } from "@/api/sysconfig";
const loading = ref(false);
const activeName = ref("first");
const tableData = [
  {
    name: "支付宝支付",
    desc: "该系统支持即时到账接口",
    src: "/alipay.png",
    key: "alipay",
  },
  {
    name: "微信支付",
    desc: "该系统支持微信网页支付和扫码支付",
    src: "/wepay.png",
    key: "wxpay",
  },
];
const form = reactive({
  close_order_minute: 30,
  auto_received_day: 7,
  after_sale_day: 23,
  alipay: {
    app_id: "****已配置****",
    ali_public_key: "****已配置****",
    private_key: "****已配置****",
  },
  wxpay: {
    app_id: "****已配置****",
    miniapp_id: "****已配置****",
    secret: "****已配置****",
    appid: "****已配置****",
    mch_id: "****已配置****",
    key: "****已配置****",
    cert_client: "****已配置****.pem",
    cert_key: "****已配置****.pem",
  },
});
function getSysData() {
  loading.value = true;
  getSysconfig().then((res) => {
    for (const key in res) {
      form[key] = res[key];
    }
  });
}
// 定义配置支付方式的类型
const drawType = ref(null)
const FromDrawerRef = ref(null)
const open = (key) => {
    drawType.value = key
    FromDrawerRef.value.open()
}
</script>

<style></style>
