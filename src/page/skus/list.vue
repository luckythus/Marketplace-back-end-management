<template>
    <div>
        <el-card shadow="hover" class="border-0">
            <ListHeader layout="create,refresh,delete" @create="openFromDrawer" @refresh="getData"
                @delete="handleMutiDelete" />

            <el-table ref="mutiSelectionRef" @selection-change="handleSelectionChange" :data="tableData" style="width: 100%"
                v-loading="loading">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="规格名称" />
                <el-table-column prop="default" label="规格值" />
                <el-table-column label="状态">
                    <template #default="{ row }">
                        <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                            @change="handleStatus($event, row)" :disabled="row.super == 1" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="210" align="center">
                    <template #default="scope">
                        <el-button text size="small" type="primary" @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm title="确定要删除该规格吗？" cancel-button-text="取消" confirm-button-text="确认"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button text type="primary" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bottom">
                <el-pagination background layout="prev,pager,next" :total="total" :current-page="currentPage"
                    :page-size="limit" @current-change="getData" />
            </div>
        </el-card>
        <FromDrawer :destroyOnClose="true" ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form ref="formRef" :model="form" :inline="false" laber-widt="80px" :rules="rules">
                <el-form-item label="规格名称" prop="name">
                    <el-input v-model="form.name" placeholder="规格名称" />
                </el-form-item>
                <el-form-item label="排序" prop="order" class="ml-7" :min="1" :max="1000">
                    <el-input-number v-model="form.order" size="small" :min="1" :max="1000">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="规格描述" prop="default">
                    <TagInput v-model="form.default" />
                </el-form-item>
                <el-form-item label="规格状态" prop="status" class="ml-3">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FromDrawer>
    </div>
</template>

<script setup>
import TagInput from '@/components/TagInput.vue'
import ListHeader from "@/components/ListHeader.vue";
import FromDrawer from "@/components/FromDrawer.vue";
import { reactive, ref } from "vue";
import {
    getSkusList,
    createSkus,
    updateSkus,
    deleteSkus,
    updateSkusStatus,
} from "@/api/skus";
import { useInitTable, useInitForm } from "@/composables/useCommon";
import { Message, Loading, closeLoading } from '@/composables/util'
// 获取公告列表数据
const {
    currentPage,
    total,
    limit,
    getData,
    
    tableData,
    loading,
    handleDelete,
    handleStatus,
    handleSelectionChange,
    mutiSelectionRef,
    handleMutiDelete
} = useInitTable({
    getList: getSkusList,
    updateStatus: updateSkusStatus,
    delete: deleteSkus,
});
// 获取公告表单数据
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
    update: updateSkus,
    create: createSkus,
    // // 定义表单数据
    form: {
        status: 1,
        name: "",
        order: 50,
        default: ''
    },
    // 定义表单校验规则
    rules: {
        name: [
            {
                required: true,
                message: "规格名称不能为空！",
                trigger: "blur",
            },
        ],
        default: [
            {
                required: true,
                message: "规格值不能为空！",
                trigger: "blur",
            },
        ],
    },
});

</script>

<style>
.notice-header {
    @apply flex items-center justify-between mb-4;
}

.bottom {
    @apply flex items-center justify-center mt-5;
}
</style>
