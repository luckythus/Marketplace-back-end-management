<template>
  <div>
    <el-tabs v-model="searchForm.tab" class="demo-tabs" @tab-change="getData()">
      <el-tab-pane
        :label="item.name"
        :name="item.key"
        v-for="(item, index) in tabBars"
        :key="index"
      />
    </el-tabs>
    <el-card shadow="hover" class="border-0">
      <Search :model="searchForm" @search="getData" @reset="resetSearch">
        <SearchItem label="关键词">
          <el-input v-model="searchForm.title" placeholder="商品名称" />
        </SearchItem>
        <template #show>
          <SearchItem label="商品分类">
            <el-select
              v-model="searchForm.category_id"
              placeholder="请选择商品分类"
              clearable
            >
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
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
        layout="create,refresh"
        @create="openFromDrawer"
        @refresh="getData"
      >
        <el-button
          type="danger"
          size="small"
          @click="handleMutiDelete"
          v-if="searchForm.tab != 'delete'"
          >批量删除</el-button
        >
        <el-button
          type="warning"
          size="small"
          @click="handleRestoreGoods"
          v-else
          >恢复商品</el-button
        >
        <el-popconfirm
          v-if="searchForm.tab == 'delete'"
          title="确定要删除该商品吗？"
          cancelButtonText="取消"
          confirmButtonText="确认"
          @confirm="handleDesroyGoods"
        >
          <template #reference>
            <el-button type="danger" size="small">彻底删除</el-button>
          </template>
        </el-popconfirm>

        <el-button
          v-if="searchForm.tab == 'all' || searchForm.tab == 'off'"
          size="small"
          @click="hadnleMutiStatusChange(1)"
          >上架</el-button
        >
        <el-button
          v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'"
          size="small"
          @click="hadnleMutiStatusChange(0)"
          >下架</el-button
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
            <div class="flex">
              <el-image
                class="mr-3 rounded"
                :src="row.cover"
                fit="cover"
                :lazy="true"
                style="width: 50px; height: 50px"
              ></el-image>
              <div class="flex-1">
                <p>{{ row.title }}</p>
                <div>
                  <span class="text-rose-500 text-xs"
                    >￥{{ row.min_price }}</span
                  >
                  <el-divider direction="vertical" />
                  <span class="text-gray-500 text-xs"
                    >￥{{ row.min_oprice }}</span
                  >
                </div>
                <p class="text-gray-400 text-xs mb-1">
                  分类：{{ row.category ? row.category.name : "未分类" }}
                </p>
                <p class="text-gray-400 text-xs">
                  创建时间：{{ row.create_time }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实际销量"
          width="100"
          prop="sale_count"
          align="center"
        />
        <el-table-column label="商品状态" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status ? 'success' : 'danger'"
              size="small"
              effect="dark"
            >
              {{ row.status ? "上架中" : "仓库中" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          width="100"
          v-if="searchForm.tab != 'delete'"
        >
          <template #default="{ row }">
            <div v-if="row.ischeck == 0">
              <el-button type="success" size="small" @click=""
                >审核通过</el-button
              >
              <el-button class="mt-2 !ml-0" type="danger" size="small" @click=""
                >审核拒绝</el-button
              >
            </div>
            <span v-else class="px-2">{{
              row.ischeck == 1 ? "审核通过" : "审核拒绝"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="总库存"
          width="80"
          prop="stock"
          align="center"
        />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div v-if="searchForm.tab != 'delete'">
              <el-button
                class="px-1"
                text
                size="small"
                type="primary"
                @click="handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                class="px-1"
                :type="
                  (scope.row.sku_type == 0 && !scope.row.sku_value) ||
                  (scope.row.sku_type == 1 && !scope.row.goods_skus.length)
                    ? 'danger'
                    : 'primary'
                "
                size="small"
                text
                :loading="scope.row.skusLoading"
                @click="handleSetGoodsSkus(scope.row)"
                >商品规格</el-button
              >
              <el-button
                class="px-1"
                text
                size="small"
                :type="
                  scope.row.goods_banner.length == 0 ? 'danger' : 'primary'
                "
                @click="handleSetGoodsBanners(scope.row)"
                :loading="scope.row.bannersLoading"
                >设置轮播图</el-button
              >
              <el-button
                class="px-1"
                text
                size="small"
                :type="!scope.row.content ? 'danger' : 'primary'"
                @click="handleSetGoodsContent(scope.row)"
                :loading="scope.row.contentLoading"
                >商品详情</el-button
              >

              <el-popconfirm
                title="确定要删除该商品吗？"
                cancelButtonText="取消"
                confirmButtonText="确认"
                @confirm="handleDelete([scope.row.id])"
              >
                <template #reference>
                  <el-button text type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
            <span v-else class="text-gray-400">暂无操作</span>
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
      <FromDrawer
        ref="formDrawerRef"
        :title="drawerTitle"
        @submit="handleSubmit"
      >
        <el-form
          :model="form"
          ref="formRef"
          :rules="rules"
          label-width="80px"
          :inline="false"
        >
          <el-form-item label="商品名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <ChooseImage v-model="form.cover" />
          </el-form-item>
          <el-form-item label="商品分类" prop="category_id">
            <el-select
              v-model="form.category_id"
              placeholder="选择所属商品分类"
            >
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品描述" prop="desc">
            <el-input
              type="textarea"
              v-model="form.desc"
              placeholder="选填，商品卖点"
            />
          </el-form-item>
          <el-form-item label="单位" prop="unit">
            <el-input
              v-model="form.unit"
              placeholder="请输入单位"
              style="width: 50%"
            >
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="总库存" prop="stock">
            <el-input v-model="form.stock">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警" prop="min_stock">
            <el-input v-model="form.min_stock">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低销售价" prop="min_price">
            <el-input v-model="form.min_price">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价" prop="min_oprice">
            <el-input v-model="form.min_oprice">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="form.stock_display">
              <el-radio :label="0">隐藏</el-radio>
              <el-radio :label="1">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">放入仓库</el-radio>
              <el-radio :label="1">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </FromDrawer>
    </el-card>
    <banner ref="bannersRef" @reloadData="getData" />
    <content ref="contentRef" @reload-data="getData" />
    <skus ref="skusRef" @reloadData="getData" />
  </div>
</template>

<script setup>
import content from "./content.vue";
import banner from "./banner.vue";
import skus from "./skus.vue";
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import ListHeader from "@/components/ListHeader.vue";
import FromDrawer from "@/components/FromDrawer.vue";
import { ref } from "vue";
import { Message } from "@/composables/util";
import ChooseImage from "@/components/ChooseImage.vue";
import {
  getGoodsList,
  updateGoodsStatus,
  createGoods,
  updateGoods,
  deleteGoods,
  restoreGoods,
  destroyGoods,
} from "@/api/goods";
import { getCategoryList } from "@/api/category";
import { useInitTable, useInitForm } from "@/composables/useCommon";
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
  hadnleMutiStatusChange,
  mutiSelectionRef,
  mutiSelectionIds,
} = useInitTable({
  searchForm: {
    title: "",
    tab: "all",
    category_id: null,
  },
  getList: getGoodsList,
  delete: deleteGoods,
  updateStatus: updateGoodsStatus,
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
// 拿到初始化的表单的数据
const {
  formDrawerRef,
  formRef,
  form,
  rules,
  editId,
  drawerTitle,
  resetForm,
  openFromDrawer,
  handleSubmit,
  handleEdit,
} = useInitForm({
  getData,
  update: updateGoods,
  create: createGoods,
  form: {
    title: null, //商品名称
    category_id: null, //商品分类
    cover: null, //商品封面
    desc: null, //商品描述
    unit: "件", //商品单位
    stock: 100, //总库存
    min_stock: 10, //库存预警
    status: 1, //是否上架 0仓库1上架
    stock_display: 1, //库存显示 0隐藏1显示
    min_price: 0, //最低销售价
    min_oprice: 100, //最低原价
  },
});
// 订单类型：all全部，checking审核中，saling出售中，off已下架，min_stock库存预警，delete回c
const tabBars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "checking",
    name: "审核中",
  },
  {
    key: "saling",
    name: "出售中",
  },
  {
    key: "off",
    name: "已下架",
  },
  {
    key: "min_stock",
    name: "库存预警",
  },
  {
    key: "delete",
    name: "回收站",
  },
];
// 获取商品分类列表的数组
const category_list = ref([]);
getCategoryList().then((res) => (category_list.value = res));
// 获取商品分类搜索框的ref
const showSearch = ref(false);
// 获取商品轮播图设置抽屉的ref
const bannersRef = ref(null);
// 点击设置轮播图时，调用banners组件打开商品轮播图抽屉，将该行的商品数据传进去
const handleSetGoodsBanners = (row) => {
  bannersRef.value.open(row);
};
// 拿到商品详情的组件
const contentRef = ref(null);
// 点击商品详情时，调用文本编辑器组件
const handleSetGoodsContent = (row) => {
  contentRef.value.open(row);
};
// 拿到商品规格的组件
const skusRef = ref(null);
// 点击商品详情时，调用文本编辑器组件
const handleSetGoodsSkus = (row) => {
  skusRef.value.open(row);
};

// 恢复商品
const handleRestoreGoods = () => handleGoods(restoreGoods, "恢复商品");

const handleDesroyGoods = () => handleGoods(destroyGoods, "彻底删除");

function handleGoods(func, msg) {
  loading.value = true;
  console.log(mutiSelectionIds.value);
  func(mutiSelectionIds.value)
    .then((res) => {
      Message(msg + "成功！");
      if (mutiSelectionRef.value) {
        mutiSelectionRef.value.clearSelection();
      }
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<style>
.notice-header {
  @apply flex items-center justify-between mb-4;
}

.bottom {
  @apply flex items-center justify-center mt-5;
}
</style>
