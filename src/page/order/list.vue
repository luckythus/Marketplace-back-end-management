<template>
  <div>
    <el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="getData">
      <el-tab-pane
        :label="item.name"
        :name="item.key"
        v-for="(item, index) in tabBars"
        :key="index"
      />
    </el-tabs>
    <el-card shadow="hover" class="border-0">
      <Search :model="searchForm" @search="getData" @reset="resetSearch">
        <SearchItem label="订单编号">
          <el-input v-model="searchForm.no" placeholder="订单编号" />
        </SearchItem>
        <template #show>
          <SearchItem label="收货人">
            <el-input
              v-model="searchForm.name"
              placeholder="收货人姓名"
              clearable
            />
          </SearchItem>
          <SearchItem label="手机号">
            <el-input
              v-model="searchForm.phone"
              placeholder="手机号"
              clearable
            />
          </SearchItem>
          <SearchItem label="开始时间">
            <el-date-picker
              v-model="searchForm.starttime"
              type="date"
              placeholder="开始日期"
              style="width: 90%"
              value-format="YYYY-MM-DD"
            />
          </SearchItem>
          <SearchItem label="结束时间">
            <el-date-picker
              v-model="searchForm.endtime"
              type="date"
              placeholder="结束日期"
              style="width: 90%"
              value-format="YYYY-MM-DD"
            />
          </SearchItem>
        </template>
      </Search>
      <!-- <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
                  <el-row :gutter="20">
                      <el-col :span="8" :offset="0">
                          <el-form-item label="关键词">
                              <el-input v-model="searchForm.title" placeholder="商品名称" />
                          </el-form-item>
                      </el-col>
                      <el-col :span="8" :offset="0" v-if="showSearch">
                          <el-form-item label="商品分类">
                              <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
                                  <el-option v-for="item in category_list" :key="item.id" :label="item.name" :value="item.id">
                                  </el-option>
                              </el-select>
                          </el-form-item>
                      </el-col>
                      <el-col :span="8" :offset="showSearch ? 0 : 8">
                          <div class="flex items-center justify-end">
                              <el-button type="primary" @click="getData">搜索</el-button>
                              <el-button @click="resetSearch">重置</el-button>
                              <el-button @click="showSearch = !showSearch" text>
                                  {{ showSearch ? '收起' : '展开' }}
                                  <el-icon>
                                      <ArrowUp v-if="showSearch" />
                                      <ArrowDown v-else />
                                  </el-icon>
                              </el-button>
  
                          </div>
                      </el-col>
  
                  </el-row>
              </el-form> -->

      <!-- 新增|刷新 -->
      <ListHeader
        layout="refresh,download"
        @refresh="getData"
        @download="handleExportExcel"
      >
        <el-button
          type="danger"
          size="small"
          @click="handleMutiDelete"
          v-if="searchForm.tab != 'delete'"
          >批量删除</el-button
        >
      </ListHeader>

      <el-table
        ref="mutiSelectionRef"
        @selection-change="handleSelectionChange"
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品" width="300">
          <template #default="{ row }">
            <div class="flex items-center">
              <div class="flex-1">
                <p>订单号：</p>
                <small>
                  {{ row.no }}
                </small>
              </div>
              <div>
                <p>下单时间：</p>
                <small>{{ row.create_time }}</small>
              </div>
            </div>
            <div
              class="flex items-center py-2"
              v-for="(item, index) in row.order_items"
              :key="index"
            >
              <el-image
                :src="item.goods_item ? item.goods_item.cover : ''"
                fit="cover"
                :lazy="true"
                style="width: 50px; height: 50px"
              ></el-image>
              <p class="text-blue-400 ml-2">
                {{ item.goods_item ? item.goods_item.title : "商品已被删除" }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实际付款"
          width="100"
          prop="total_price"
          align="center"
        />
        <el-table-column label="买家" width="100">
          <template #default="{ row }">
            <p>
              {{ row.user.username || row.user.nickname }}
            </p>
            <small>(用户ID：{{ row.user.id }})</small>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" width="180">
          <template #default="{ row }">
            <div>
              付款状态：
              <el-tag
                v-if="row.payment_method == 'wechat'"
                type="success"
                size="small"
                >微信支付</el-tag
              >
              <el-tag
                v-else-if="row.payment_method == 'alipay'"
                type=""
                size="small"
                >支付宝支付</el-tag
              >
              <el-tag v-else type="info" size="small">未支付</el-tag>
            </div>
            <div>
              发货状态：
              <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">{{
                row.ship_data ? "已发货" : "未发货"
              }}</el-tag>
            </div>
            <div>
              收货状态：
              <el-tag
                :type="row.ship_status == 'received' ? 'success' : 'info'"
                size="small"
                >{{
                  row.ship_status == "received" ? "已收货" : "未收货"
                }}</el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button
              class="px-1"
              type="primary"
              size="small"
              text
              @click="openInfoModal(row)"
              >订单详情</el-button
            >
            <el-button
              class="px-1"
              type="primary"
              size="small"
              v-if="searchForm.tab === 'noship'"
              >订单发货</el-button
            >
            <el-button
              class="px-1"
              type="primary"
              size="small"
              v-if="searchForm.tab === 'refunding'"
              @click="handleRefund(row.id, 1)"
              >同意退款</el-button
            >
            <el-button
              class="px-1"
              type="danger"
              size="small"
              v-if="searchForm.tab === 'refunding'"
              @click="handleRefund(row.id, 0)"
              >拒绝退款</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="bottom">
        <el-pagination
          background
          layout="prev,pager,next"
          :total="total"
          :current-page="currentPage"
          :page-size="limit"
          @current-change="getData"
        />
      </div>
    </el-card>
    <ExportExcel :tabs="tabBars" ref="ExportExcelRef" />
    <InfoModal ref="InfoModalRef" :info="info" />
  </div>
</template>

<script setup>
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import ListHeader from "@/components/ListHeader.vue";
import { ref } from "vue";
import { getOrderList, deleteOrder, refundOrder } from "@/api/order";
import { useInitTable } from "@/composables/useCommon";
import ExportExcel from "./ExportExcel.vue";
import InfoModal from "./InfoModal.vue";
import { showMessage, showPrompt, Message } from "@/composables/util";
// 所属角色信息
const roles = ref([]);
// 拿到初始化的管理表格数据
const {
  searchForm,
  resetSearch,
  currentPage,
  total,
  limit,
  getData,
  tableData,
  loading,
  handleDelete,
  handleSelectionChange,
  handleMutiDelete,
  mutiSelectionRef,
  mutiSelectionIds,
} = useInitTable({
  searchForm: {
    no: "",
    tab: "all",
    starttime: "",
    endtime: "",
    name: "",
    phone: "",
  },
  getList: getOrderList,
  delete: deleteOrder,

  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.bannersLoading = false;
      o.contentLoading = false;
      o.skusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    roles.value = res.roles;
  },
});

// 订单类型：all全部，nopay待支付，noship待发货，shiped待收货，received已收货，
// finish已完成，closed已关闭，refunding退款中
const tabBars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "nopay",
    name: "待支付",
  },
  {
    key: "noship",
    name: "待发货",
  },
  {
    key: "shiped",
    name: "待收货",
  },
  {
    key: "received",
    name: "已收货",
  },
  {
    key: "finish",
    name: "已完成",
  },
  {
    key: "closed",
    name: "已关闭",
  },
  {
    key: "refunding",
    name: "退款中",
  },
];
// 拿到ExportExcel组件ref
const ExportExcelRef = ref(null);
// 定义点击导出下载的方法
const handleExportExcel = () => {
  ExportExcelRef.value.open();
};
const InfoModalRef = ref(null);
const info = ref(null);
const openInfoModal = (row) => {
  row.order_items = row.order_items.map((o) => {
    if (o.skus_type == 1 && o.goods_skus) {
      let str = [];
      for (const key in o.goods_skus.skus) {
        str.push(o.goods_skus.skus[key].value);
      }
      o.sku = str.join(",");
    }
    return o;
  });
  console.log(row);
  info.value = row;
  InfoModalRef.value.open();
};
// 定义拒绝或同意退款的方法
const handleRefund = (id, agree) => {
  (agree
    ? showMessage("是否同意该订单退款？")
    : showPrompt("请输入退款的理由")
  ).then((res) => {
    // 声明一个data对象，用于传入接口参数
    let data = { agree };
    if (!agree) {
      // 如果是拒绝，则将拒绝理由输入data参数中
      data.disagree_reason = res.value;
      refundOrder(id, data).then((res) => {
        getData();
        Message("拒绝成功！");
      });
    } else {
      refundOrder(id, data).then((res) => {
        getData();
        Message("退款成功！");
      });
    }
  });
};
</script>

<style>
.notice-header {
  @apply flex items-center justify-between mb-4;
}

.bottom {
  @apply flex items-center justify-center mt-5;
}
</style>
