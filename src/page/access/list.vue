<template>
    <el-card shadow="never">
        <ListHeader @create="openFromDrawer" @refresh="getData" />
        <el-tree
            :data="tableData"
            :props="{ label: 'name', children: 'child' }"
            v-loading="loading"
            node-key="id"
            :default-expanded-keys="defaultExpandedKeys"
        >
            <template #default="{ data }">
                <div class="current-tree-node">
                    <el-tag :type="data.menu ? '' : 'info'" size="small">{{
                        data.menu ? "菜单" : "权限"
                    }}</el-tag>
                    <el-icon v-if="data.icon" :size="16" class="ml-2">
                        <component :is="data.icon"></component>
                    </el-icon>
                    <span>{{ data.name }}</span>
                    <div class="ml-auto">
                        <el-switch
                            :modelValue="data.status"
                            :active-value="1"
                            :inactive-value="0"
                            @change="handleStatus($event, data)"
                            @click.stop=""
                        />
                        <el-button
                            text
                            type="primary"
                            size="small"
                            @click.stop="handleEdit(data)"
                            >修改</el-button
                        >
                        <el-button
                            text
                            type="primary"
                            size="small"
                            @click.stop="addChild(data.id)"
                            >增加</el-button
                        >
                        <el-popconfirm
                            title="是否要删除该记录？"
                            confirmButtonText="确认"
                            cancelButtonText="取消"
                            @confirm="handleDelete(data.id)"
                        >
                            <template #reference>
                                <el-button text type="primary" size="small" @click.stop=""
                                    >删除</el-button
                                >
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </template>
        </el-tree>
        <FromDrawer
            ref="formDrawerRef"
            :title="drawerTitle"
            @submit="handleSubmit"
        >
            <el-form
                ref="formRef"
                :model="form"
                :inline="false"
                laber-widt="80px"
                :rules="rules"
            >
                <el-form-item label="上级菜单" prop="rule_id">
                    <el-cascader
                        v-model="form.rule_id"
                        :options="options"
                        :props="{
                            value: 'id',
                            label: 'name',
                            children: 'child',
                            checkStrictly: true,
                            emitPath: false,
                        }"
                        placeholder="请选择上级菜单"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="菜单/规则" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <el-radio :label="1" border>菜单</el-radio>
                        <el-radio :label="0" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input
                        v-model="form.name"
                        style="width: 30%"
                        placeholder="请输入名称"
                    />
                </el-form-item>
                <el-form-item
                    label="菜单图标"
                    prop="icon"
                    v-if="form.menu == 1"
                >
                    <IconSelect v-model="form.icon" />
                </el-form-item>
                <el-form-item
                    label="前端路由"
                    prop="frontpath"
                    v-if="form.menu == 1 && form.rule_id > 0"
                >
                    <el-input v-model="form.frontpath" />
                </el-form-item>
                <el-form-item
                    label="后端规则"
                    prop="condition"
                    v-if="form.menu == 0"
                >
                    <el-input v-model="form.condition" />
                </el-form-item>
                <el-form-item label="请求方式" prop="method">
                    <el-select
                        v-model="form.method"
                        placeholder="请选择请求方式"
                    >
                        <el-option
                            v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
                            :key="item"
                            :label="item"
                            :value="item"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number
                        v-model="form.order"
                        :min="0"
                        :max="1000"
                    />
                </el-form-item>
            </el-form>
        </FromDrawer>
    </el-card>
</template>

<script setup>
import FromDrawer from "@/components/FromDrawer.vue";
import IconSelect from "@/components/IconSelect.vue";
import { ref } from "vue";
import ListHeader from "@/components/ListHeader.vue";
import {
    getRuleList,
    updateRule,
    createRule,
    updateRuleStatus,
    deleteRule,
} from "@/api/rule.js";
import { useInitTable, useInitForm } from "@/composables/useCommon.js";
// 默认展开的值
const defaultExpandedKeys = ref([]);
// 拿到所有的菜单和权限,提供给表单选择
const options = ref([]);
// 获取菜单权限列表数据表格
const {
    loading,
    getData,

    tableData,
    handleStatus,
    handleDelete,
} = useInitTable({
    getList: getRuleList,
    delete: deleteRule,
    updateStatus: updateRuleStatus,
    onGetListSuccess: (res) => {
        options.value = res.rules;
        tableData.value = res.list;
        defaultExpandedKeys.value = res.list.map((o) => o.id);
    },
});

// 获取公告表单数据
const {
    formDrawerRef,
    formRef,
    form,
    rules,
    drawerTitle,
    openFromDrawer,
    handleSubmit,
    handleEdit,
} = useInitForm({
    getData,
    update: updateRule,
    create: createRule,
    // // 定义表单数据
    form: {
        rule_id: 0,
        menu: 0,
        name: "",
        condition: "",
        method: "GET",
        status: 1,
        order: 50,
        icon: "",
        frontpath: "",
    },
    // 定义表单校验规则
    rules: {},
});
// 增加子菜单权限功能
const addChild = (id) => {
    openFromDrawer();
    form.rule_id = id;
    form.status = 1;
};
</script>

<style>
.current-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 15px;
    padding-right: 8px;
}
.el-tree-node__content {
    padding: 20px 0;
}
</style>