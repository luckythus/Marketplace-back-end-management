<template>
  <el-card shadow="hover" class="border-0">
    <Search @search="getData" @reset="resetSearch">
      <SearchItem label="关键词">
        <el-input v-model="searchForm.title" placeholder="商品标题" />
      </SearchItem>
    </Search>

    <el-table default-expand-all :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flex pl-18">
            <el-avatar
              :size="50"
              shape="circle"
              :src="row.user.avatar"
              fit="fill"
              class="mr-3"
            ></el-avatar>
            <div class="flex-1">
              <h6 class="flex items-center">
                {{ row.user.nickName || row.user.username }}
                <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                <el-button
                  type="primary"
                  size="small"
                  class="ml-auto mr-15"
                  @click="openTextarea(row)"
                  v-if="!row.textarea && !row.extra"
                  >回复</el-button
                >
              </h6>
              {{ row.review.data }}
              <div class="py-2">
                <el-image
                  v-for="(item, index) in row.review.image"
                  :key="index"
                  :src="item"
                  fit="cover"
                  :lazy="true"
                  style="width: 100px; height: 100px"
                ></el-image>
              </div>
              <div v-if="row.textareaEdit">
                <el-input
                  v-model="textareaContent"
                  placeholder="请输入回复内容"
                  :rows="2"
                  type="textarea"
                />
                <div class="py-2">
                  <el-button
                    type="primary"
                    size="small"
                    @click="reviewComment(row)"
                    >回复</el-button
                  >
                  <el-button
                    type="default"
                    size="small"
                    @click="row.textareaEdit = false"
                    >取消</el-button
                  >
                </div>
              </div>
              <template v-else>
                <div
                  class="mt-2 bg-gray-100 rounded p-3"
                  v-for="(item, index) in row.extra"
                  :key="index"
                >
                  <h6 class="flex items-center font-bold">
                    客服
                    <el-button
                      type="info"
                      size="small"
                      class="ml-auto mr-15"
                      @click="openTextarea(row, item.data)"
                      >修改</el-button
                    >
                  </h6>
                  <p>
                    {{ item.data }}
                  </p>
                </div>
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" width="70" />
      <el-table-column label="商品名称">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image
              :src="row.goods_item.cover"
              fit="fill"
              :lazy="true"
              style="width: 50px; height: 50px"
            ></el-image>
            <div class="ml-3">
              <h6>{{ row.goods_item?.title ?? "商品已被删除" }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价信息" align="center">
        <template #default="{ row }">
          <div>
            <p>用户：{{ row.user.nickName || row.user.username }}</p>
            <p>
              <el-rate
                v-model="row.rating"
                disabled
                show-score
                text-color="#ff9900"
              />
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价时间" prop="review_time" align="center" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatus($event, row)"
            :disabled="row.super == 1"
          />
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
</template>
<script setup>
import Search from "@/components/Search.vue";
import SearchItem from "@/components/SearchItem.vue";
import { ref } from "vue";
import { Message } from "@/composables/util";
import {
  getGoodsCommentList,
  updateGoodsCommentStatus,
  reviewGoodsComment,
} from "@/api/goods_comment";
import { useInitTable } from "@/composables/useCommon";
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
  handleStatus,
} = useInitTable({
  searchForm: {
    title: "",
  },
  getList: getGoodsCommentList,
  updateStatus: updateGoodsCommentStatus,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      o.textareaEdit = false;
      return o;
    });
    total.value = res.totalCount;
  },
});
// 定义客服回复的文本内容，将数据回传给后端用来显示
const textareaContent = ref("");
// 点击回复评论，显示客服文本框
const openTextarea = (row, data = "") => {
  textareaContent.value = data;
  row.textareaEdit = true;
};
// 定义客服输入回复内容，点击回复后的函数操作
const reviewComment = (row) => {
  if (textareaContent.value == "") {
    return Message("回复内容不能为空！", "error");
  }
  reviewGoodsComment(row.id, textareaContent.value).then((res) => {
    row.textareaEdit = false;
    Message("回复成功！");
    getData()
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
