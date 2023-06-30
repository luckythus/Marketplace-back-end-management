<template>
    <div>
        <el-card shadow="hover" class="border-0">
            <ListHeader @create="openFromDrawer" @refresh="getData" />

            <el-table :data="tableData" style="width: 100%" v-loading="loading">
                <el-table-column prop="title" label="标题" />
                <el-table-column prop="create_time" label="创建事件" width="380" />
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button text size="small" type="primary" @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm title="确定要删除该公告吗？" cancel-button-text="取消" confirm-button-text="确认"
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
        <FromDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form ref="formRef" :model="form" :inline="false" laber-widt="80px" :rules="rules">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="公告标题" />
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="form.content" type="textarea" :rows="5" placeholder="公告内容" />
                </el-form-item>
            </el-form>
        </FromDrawer>
    </div>
</template>

<script setup>
import ListHeader from "../../components/ListHeader.vue";
import FromDrawer from "@/components/FromDrawer.vue";
import { reactive, ref } from "vue";
import {
    getNoticeList,
    createNoticeList,
    updateNoticeList,
    deleteNoticeList,
} from "@/api/notice";
import { useInitTable, useInitForm } from "@/composables/useCommon";

// 获取公告列表数据
const {
    currentPage,
    total,
    limit,
    getData,
    tableData,
    loading,
    handleDelete
} = useInitTable({
    getList: getNoticeList,
    delete: deleteNoticeList,
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
    update: updateNoticeList,
    create: createNoticeList,

    // // 定义表单数据
    form: {
        title: "",
        content: "",
    },
    // 定义表单校验规则
    rules: {
        title: [
            {
                required: true,
                message: "新增公告标题不能为空！",
                trigger: "blur",
            },
        ],
        content: [
            {
                required: true,
                message: "公告内容不能为空！",
                trigger: "blur",
            },
        ],
    },
});
// 获取抽屉节点
// const formDrawerRef = ref(null);
// // 获取抽屉里的表单节点
// const formRef = ref(null);
// // 定义表单数据
// const form = reactive({
//   title: "",
//   content: "",
// });
// 定义表单校验规则
// const rules = {
//   title: [
//     {
//       required: true,
//       message: "新增公告标题不能为空！",
//       trigger: "blur",
//     },
//   ],
//   content: [
//     {
//       required: true,
//       message: "公告内容不能为空！",
//       trigger: "blur",
//     },
//   ],
// };
// 判断是否是新增还是编辑修改
// const editId = ref(0);
// const drawerTitle = computed(() => (editId.value ? "修改公告" : "新增公告"));
// 重置表单，新增没内容，修改显示当前内容
// function resetform(row = false) {
//   if (formRef.value) {
//     // 先清除校验规则留下了的警示
//     formRef.value.clearValidate();
//   }
//   if (row) {
//     for (const key in form) {
//       form[key] = row[key];
//     }
//   }
// }
// 点击新增按钮打开抽屉
// const openFromDrawer = () => {
//   editId.value = 0;
//   resetform({
//     title: "",
//     content: "",
//   });
//   formDrawerRef.value.open();
// };
// 抽屉点击提交按钮，响应子组件传来的提交事件进行回调
// const handleSubmit = () => {
//   formRef.value.validate((valid) => {
//     if (!valid) return Message("提交失败！", "error");
//     // 如果表单校验通过，则调用增加公告接口
//     Loading();
//     const selectSubmit = editId.value
//       ? updateNoticeList(editId.value,form)
//       : createNoticeList(form);
//     selectSubmit
//       .then((res) => {
//         Message(drawerTitle+'成功！')
//         getData(1);
//       })
//       .finally(() => {
//         closeLoading();
//       });
//   });
// };

// 修改公告
// const handleEdit = (row) => {
//   editId.value = row.id;
//   resetform(row);
//   formDrawerRef.value.open();
// };
// // 删除当前行的数据
// const handleDelete = (id) => {
//   // v-loading=loading的加载动画
//   loading.value = true;
//   deleteNoticeList(id)
//     .then((res) => {
//       Message("删除成功！");
//       getData();
//     })
//     .finally(() => {
//       loading.value = false;
//     });
// };
</script>

<style>
.notice-header {
    @apply flex items-center justify-between mb-4;
}

.bottom {
    @apply flex items-center justify-center mt-5;
}
</style>