<template>
  <el-form-item label="规格选项" v-loading="bodyLoading">
    <el-card
      shadow="never"
      class="w-full mb-3"
      v-for="(item, index) in sku_card_list"
      :key="item.id"
      v-loading="item.loading"
    >
      <template #header>
        <div class="flex items-center">
          <el-input
            v-model="item.text"
            placeholder="规格名称"
            style="width: 200px"
            @change="handleUpdate(item)"
          >
            <template #append>
              <el-icon class="cursor-pointer" @click="handleChooseSku(item)">
                <more />
              </el-icon>
            </template>
          </el-input>
          <el-button
            :disabled="index == 0"
            class="ml-auto"
            size="small"
            @click="sortCard('up', index)"
            ><el-icon>
              <Top /> </el-icon
          ></el-button>
          <el-button
            :disabled="index === sku_card_list.length - 1"
            size="small"
            @click="sortCard('down', index)"
            ><el-icon>
              <Bottom /> </el-icon
          ></el-button>
          <el-popconfirm
            title="确定要删除该优惠卷吗？"
            cancel-button-text="取消"
            confirm-button-text="确认"
            @confirm="handleDelete(item)"
          >
            <template #reference>
              <el-button size="small"
                ><el-icon>
                  <Delete /> </el-icon
              ></el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <SkuCardItem :skuCardId="item.id" />
    </el-card>
    <el-button
      :loading="btnLoading"
      @click="addSkuCardEvent"
      type="success"
      size="small"
      >添加规格</el-button
    >
  </el-form-item>
  <ChooseSku ref="ChooseSkuRef"/>
</template>
<script setup>
import { ref } from "vue";
import ChooseSku from "@/components/ChooseSku.vue";
import SkuCardItem from "./SkuCardItem.vue";
import {
  sku_card_list,
  btnLoading,
  addSkuCardEvent,
  handleUpdate,
  handleDelete,
  sortCard,
  bodyLoading,
  handleChooseSetGoodsSkusCard
} from "@/composables/useSku";

// 拿到规格选项更多的组件
const ChooseSkuRef = ref(null)
// 打开规格选项的更多弹框组件
const handleChooseSku = (item) => {
    ChooseSkuRef.value.open((value) => {
        handleChooseSetGoodsSkusCard(item.id,{
            name: value.name,
            value: value.list
        })
    })
}
</script>
<style>
.el-card__header {
  @apply !p-2 bg-gray-50;
}
</style>
