<template>
    <el-dialog title="商品选择" v-model="dialogVisable" width="80%" destroy-on-close>
        <el-table ref="mutiSelectionRef" @selection-change="handleSelectionChange" :data="tableData" stripe
            style="width: 100%; height: 300px" v-loading="loading">
            <el-table-column type="selection" width="55" />
            <el-table-column label="商品">
                <template #default="{ row }">
                    <div class="flex">
                        <el-image class="mr-3 rounded" :src="row.cover" fit="cover" :lazy="true"
                            style="width: 50px; height: 50px"></el-image>
                        <div class="flex-1">
                            <p>{{ row.title }}</p>
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
            <el-table-column label="总库存" width="90" prop="stock" align="center" />
            <el-table-column label="商品价格（￥）" width="150" prop="stock" align="center">
                <template #default="{ row }">
                    <span class="text-rose-500">￥{{ row.min_price }}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span class="text-gray-400">￥{{ row.min_oprice }}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottom">
            <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage" :page-size="limit"
                @current-change="getData" />
        </div>
        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">选择</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { getGoodsList } from "@/api/goods";
import { useInitTable } from "@/composables/useCommon";
const {
    searchForm,
    resetSearch,
    currentPage,
    total,
    limit,
    getData,
    tableData,
    loading,
    handleSelectionChange,
    mutiSelectionRef,
    mutiSelectionIds,
} = useInitTable({
    searchForm: {
        title: "",
        tab: "all",
        category_id: null,
    },
    getList: getGoodsList,
    onGetListSuccess: (res) => {
        tableData.value = res.list;
        total.value = res.totalCount;
    },
});

const dialogVisable = ref(false);
const close = () => {
    dialogVisable.value = false;
};
const callbackFunction = ref(null);
const open = (callback = null) => {
    callbackFunction.value = callback;
    dialogVisable.value = true;
};
const submit = () => {
    if (typeof callbackFunction.value === "function") {
        callbackFunction.value(mutiSelectionIds.value);
    }
    close();``
};
defineExpose({
    open,
});
</script>

<style>
.bottom {
    @apply flex items-center justify-center mt-5;
}
</style>
