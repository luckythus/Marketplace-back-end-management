<template>
  <FromDrawer ref="fromDrawerRef" @submit="handleConnect" confirmText="关联">
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="goods_id" label="商品ID" width="69" />
      <el-table-column label="商品封面" width="180">
        <template #default="{ row }">
          <el-image :src="row.cover" fit="fill" :lazy="true"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="150" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-popconfirm
            title="是否要删除该选项？"
            confirmButtonText="确认"
            cancelButtonText="取消"
            @confirm="handleDelete(row)"
          >
            <template #reference>
              <el-button text type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </FromDrawer>
  <ChooseGoods ref="ChooseGoodsRef" confirmText="选择" />
</template>

<script setup>
import { ref } from "vue";
import FromDrawer from "@/components/FromDrawer.vue";
import {
  getCategoryGoods,
  deleteCategoryGoods,
  connectCategoryGoods,
} from "@/api/category.js";
import ChooseGoods from "@/components/ChooseGoods.vue";
import { Message, Loading, closeLoading } from "@/composables/util";

const fromDrawerRef = ref(null);
// 定义一个数据拿到选中父组件的当前项的data里面的id
const category_id = ref(0);
// 定义一个tableData来获取当前推荐商品列表里面的关联商品的数据
const tableData = ref([]);
const open = (data) => {
  category_id.value = data.id;
  data.goodsDrawerLoading = true;
  getCategoryGoodsData()
    .then((res) => fromDrawerRef.value.open())
    .finally(() => {
      data.goodsDrawerLoading = false;
    });
};
// 定义一个获取推荐商品里面的关联商品的列表函数
function getCategoryGoodsData() {
  return getCategoryGoods(category_id.value).then((res) => {
    tableData.value = res.map((o) => {
      o.loading = false;
      return o;
    });
  });
}
// 定义删除关联商品的方法
const handleDelete = (row) => {
  row.loading = true;
  deleteCategoryGoods(row.id).then((res) => {
    Message("删除成功！");
    getCategoryGoodsData();
  });
};
// 拿到商品选择的组件的ref
const ChooseGoodsRef = ref(null);
const handleConnect = () => {
  ChooseGoodsRef.value.open((goods_ids) => {
    fromDrawerRef.value.showLoading()
    connectCategoryGoods({
      category_id: category_id.value,
      goods_ids,
    })
      .then((res) => {
        getCategoryGoodsData();
        Message("关联商品成功！");
      })
      .finally(() => {
        fromDrawerRef.value.hideLoading()
      });
  });
};

defineExpose({
  open,
});
</script>

<style></style>
