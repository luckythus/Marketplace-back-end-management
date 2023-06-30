<template>
    <div>
        <el-card shadow="hover" class="border-0">
            <ListHeader @create="openFromDrawer" @refresh="getData" />

            <el-table :data="tableData" style="width: 100%" v-loading="loading">
                <el-table-column label="标题" width="350">
                    <template #default="{ row }">
                        <div class="border border-dashed py-2 px-4"
                            :class="row.statusText == '领取中' ? 'active' : 'inactive'">
                            <h5 class="font-bold">{{ row.name }}</h5>
                            <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="statusText" label="状态" />
                <el-table-column label="优惠" width="150">
                    <template #default="{ row }">
                        {{ row.type ? '满减' : '折扣' }} {{ row.type ? ('￥' + row.value) : (row.value + '折') }}
                    </template>
                </el-table-column>
                <el-table-column prop="total" label="数量" />
                <el-table-column prop="used" label="已使用" />
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button text size="small" v-if="scope.row.statusText == '未开始'" type="primary" @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm v-if="scope.row.statusText !== '领取中'" title="确定要删除该优惠卷吗？" cancel-button-text="取消"
                            confirm-button-text="确认" @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button text type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-popconfirm v-if="scope.row.statusText == '领取中'" title="确定要删除该优惠卷吗？" cancel-button-text="取消"
                            confirm-button-text="确认" @confirm="handleStatus(0,scope.row)">
                            <template #reference>
                                <el-button text type="danger" size="small">失效</el-button>
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
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="优惠券名称" prop="name">
                    <el-input v-model="form.name" placeholder="优惠券名称" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="0">满减</el-radio>
                        <el-radio :label="1">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面值" prop="value">
                    <el-input v-model="form.value" placeholder="面值">
                        <template #append>{{ form.type ? "折" : "元" }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="发行量" prop="total">
                    <el-input-number v-model="form.total" :min="0" :max="10000"></el-input-number>
                </el-form-item>
                <el-form-item label="最低使用价格" prop="min_price">
                    <el-input v-model="form.min_price" placeholder="最低使用价格" type="number"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-date-picker :editable="false" v-model="timerange" value-format="YYYY-MM-DD HH:mm:ss"
                        type="datetimerange" range-separator="To" start-placeholder="开始时间" end-placeholder="结束时间" />
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="描述" type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>
        </FromDrawer>
    </div>
</template>

<script setup>
import ListHeader from "../../components/ListHeader.vue";
import { computed } from "vue";
import FromDrawer from "@/components/FromDrawer.vue";
import {
    getCouponList,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    updateCouponStatus
} from "@/api/coupon";
import { useInitTable, useInitForm } from "@/composables/useCommon";

// 获取优惠卷列表数据
const {
    currentPage,
    total,
    limit,
    getData,
    tableData,
    loading,
    handleDelete,
    handleStatus
} = useInitTable({
    getList: getCouponList,
    onGetListSuccess: (res) => {
        tableData.value = res.list.map(o => {
            o.statusText = formatStatus(o)
            return o
        })
        total.value = res.totalCount
    },
    updateStatus: updateCouponStatus,
    delete: deleteCoupon,
});

// 获取优惠卷表单数据
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
    update: updateCoupon,
    create: createCoupon,
    delete: deleteCoupon,
    // // 定义表单数据
    form: {
        name: '',
        type: 0,
        value: 0,
        total: 100,
        min_price: 100,
        start_time: null,
        end_time: null,
        order: 1000,
        desc: ''
    },
    // 由于后端接收的时间数据是时间戳，毫秒数，所以要转成毫秒
    beforeSubmit: (f) => {
        if (typeof f.start_time != "number") {
            f.start_time = (new Date(f.start_time)).getTime()
        }
        if (typeof f.end_time != "number") {
            f.end_time = (new Date(f.end_time)).getTime()
        }
        return f
    }
});
// 定义判断优惠劵状态的方法
function formatStatus(row) {
    let s = '领取中'
    // 优惠卷开始的时间, 返回开始时间的总毫秒
    let start_time = (new Date(row.start_time)).getTime()
    // 拿到当前的时间总毫秒
    let now_time = (new Date()).getTime()
    // 优惠卷结束的时间，返回结束时间的总毫秒数
    let end_time = (new Date(row.end_time)).getTime()
    // 当前的时间与优惠卷开始和结束的时间进行判断
    if (start_time > now_time) {
        s = '未开始'
    } else if (now_time > end_time) {
        s = '已结束'
    } else if (row.status == 0) {
        s = '已失效'
    }
    return s
}
// 获取选择日期的时间
const timerange = computed({
    set(val) {
        form.start_time = val[0]
        form.end_time = val[1]
    },
    get() {
        return form.start_time && form.end_time ? [form.start_time, form.end_time] : []
    }
})
</script>

<style scoped>
.active {
    @apply border-red-200 bg-rose-50 text-red-400;
}

.inactive {
    @apply border-gray-200 bg-gray-50 text-gray-400;
}

.notice-header {
    @apply flex items-center justify-between mb-4;
}

.bottom {
    @apply flex items-center justify-center mt-5;
}
</style>