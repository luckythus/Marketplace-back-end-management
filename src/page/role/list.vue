<template>
    <div>
        <el-card shadow="hover" class="border-0">
            <ListHeader @create="openFromDrawer" @refresh="getData" />

            <el-table :data="tableData" style="width: 100%" v-loading="loading">
                <el-table-column prop="name" label="角色名称" />
                <el-table-column prop="desc" label="角色描述" width="380" />
                <el-table-column label="状态" width="120">
                    <template #default="{ row }">
                        <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                            @change="handleStatus($event, row)" :disabled="row.super == 1" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="210" align="center">
                    <template #default="scope">
                        <el-button text size="small" type="primary" @click="openSetFromDrawer(scope.row)">配置权限</el-button>
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="角色名称" />
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.desc" type="textarea" :rows="5" placeholder="角色描述" />
                </el-form-item>
                <el-form-item label="状态" prop="status" class="mr-5">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FromDrawer>
        <FromDrawer ref="setFromDrawerRef" title="权限配置" @submit="handleSetRuleSubmit">
            <el-tree-v2 ref="elTreeRef" :data="ruleList" :props="{ label: 'name', children: 'child' }" show-checkbox
                :height="treeHeight" node-keys="id" :default-expanded-keys="defaultExpandedKeys" @check="handleTreeChecked" :checkStrictly="checkStrictly">
                <template #default="{ data }">
                    <div class="flex items-center">
                        <el-tag :type="data.menu ? '' : 'info'" size="small">
                            {{ data.menu ? "菜单" : "权限" }}
                        </el-tag>
                        <span class="ml-2 text-sm">{{ data.name }}</span>
                    </div>
                </template>
            </el-tree-v2>
        </FromDrawer>
    </div>
</template>

<script setup>
import ListHeader from "@/components/ListHeader.vue";
import FromDrawer from "@/components/FromDrawer.vue";
import { reactive, ref } from "vue";
import {
    getRoleList,
    createRole,
    updateRole,
    deleteRole,
    updateRoleStatus,
    setRoleRules
} from "@/api/role";
import { useInitTable, useInitForm } from "@/composables/useCommon";
import { getRuleList } from "@/api/rule";
import { Message,Loading,closeLoading } from '@/composables/util'
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
} = useInitTable({
    getList: getRoleList,
    updateStatus: updateRoleStatus,
    delete: deleteRole,
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
    update: updateRole,
    create: createRole,
    // // 定义表单数据
    form: {
        name: "",
        desc: "",
        status: 1,
    },
    // 定义表单校验规则
    rules: {
        name: [
            {
                required: true,
                message: "角色名称不能为空！",
                trigger: "blur",
            },
        ],
        desc: [
            {
                required: true,
                message: "角色描述不能为空! ",
                trigger: "blur",
            },
        ],
    },
});
// 针对全选关联和不关联，设置一个值来处理
const checkStrictly = ref(false)
// 获取树形控件的节点
const elTreeRef = ref(null);
// 获取当前角色拥有的权限ID
const ruleIds = ref([]);
// 获取抽屉中默认展开的权限ID
const defaultExpandedKeys = ref([]);
// 获取权限菜单列表
const ruleList = ref([]);
// 获取权限表单节点
const setFromDrawerRef = ref(null);
// 获取当前角色的id
const roleId = ref(0);
// 定义权限表单节点的高度
const treeHeight = ref(0);
const openSetFromDrawer = (row) => {
    roleId.value = row.id;
    checkStrictly.value = true
    treeHeight.value = window.innerHeight - 170;
    getRuleList(1).then((res) => {
        // 此时的res.list是权限菜单
        ruleList.value = res.list;
        defaultExpandedKeys.value = ruleList.value.map((o) => o.id);
        // 先获取数据，再打开表单
        setFromDrawerRef.value.open();
        // 获取当前角色拥有的权限ID的操作
        ruleIds.value = row.rules.map((o) => o.id);
        // 然后调用树形控件的setCheckedKeys方法，来匹配当前角色拥有的权限ID，匹配上则勾选节点
        setTimeout(() => {
            elTreeRef.value.setCheckedKeys(ruleIds.value);
            // 已经匹配完毕，将全选父子互不关联功能关闭，这样才能勾选权限时有全选效果
            checkStrictly.value = false
        }, 150);
    });
};
const handleTreeChecked = (...e) => {
    // 在e[1]数组存放check信息，里面checkedKeys是选中的id节点
    // halfCheckedKeys是父亲全选节点没全选时候存放的地方，当没全选的时候，父亲的节点不会选中，因此在checkedKeys里面，该父亲id存在里面halfCheckedKeys里面，因此要拿到选中的节点和没有全选(里面有孩子选中)的父亲节点
    // 需要将两个展开出来放到一个一维数组里面
    //   console.log(e);
    // 将两个属性里面的值从e[1]的数组里面拿出来,拿到了一个对象，对象里面存放了两个一维数组
    const { checkedKeys,halfCheckedKeys } = e[1]
    // 将它们的数组展开，也就是将用户选中的id重新赋值给ruleIds，也就是角色即将拥有的权限ID，也是一个一维数组
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]

};
const handleSetRuleSubmit = () => { 
    Loading()
    setRoleRules(roleId.value,ruleIds.value).then(res => {
        Message('配置权限成功！')
        getData()
        setFromDrawerRef.value.close()
    }).finally(() => {
        closeLoading()
    })
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
