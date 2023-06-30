<template>
    <el-dialog title="规格选项选择" v-model="dialogVisable" width="80%" top="5vh">
        <el-container style="height: 65vh">
            <el-aside class="image-aside">
                <div class="top">
                    <div class="sku_list" :class="{ 'active': (activeId == item.id) }" v-for="(item, index) in tableData"
                        :key="index" @click="handleChangeActiveId(item.id)">
                        {{ item.name }}
                    </div>
                </div>
                <div class="bottom">
                    <el-pagination background layout="prev,next" :total="total" :current-page="currentPage"
                        :page-size="limit" @current-change="getData" />
                </div>
            </el-aside>
            <el-main>
                <el-checkbox-group v-model="form.list">
                    <el-checkbox v-for="item in list" :key="item" :label="item" border>
                        {{ item }}
                    </el-checkbox>
                </el-checkbox-group>

            </el-main>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="dialogVisable = false">Cancel</el-button>
                <el-button type="primary" @click="submit">OK</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { getSkusList } from "@/api/skus";
import { useInitTable } from "@/composables/useCommon";
import { reactive, ref } from "vue";
// 定义列表数据
const {
    loading,
    currentPage,
    limit,
    total,
    tableData,
    getData
} = useInitTable(
    {
        getList: getSkusList,
        onGetListSuccess: (res) => {
            tableData.value = res.list;
            total.value = res.totalCount;
            if(tableData.value.length > 0) {
                handleChangeActiveId(tableData.value[0].id)
            }
        }
    }
);

// 定义列表内容数据
const form = reactive({
    name: '',
    list: []
})
// 定义一个回调
const callbackFunction = ref(null)
// 定义打开方法
const open = (callback = null) => {
    // 拿到父组件的回调函数，在当前组件submit中去执行，因此用当前组件函数先拿到父组件的回调
    callbackFunction.value = callback
    dialogVisable.value = true;
    getData(1);
};
const dialogVisable = ref(false);
// 定义一个激活状态
const activeId = ref(0)
// 定义一个对应列表的内容数据数组
const list = ref([])
// 激活状态
function handleChangeActiveId(id) {
    activeId.value = id
    list.value = []
    let item = tableData.value.find(o => o.id == id)
    if (item) {
        // 将对应列表的内容值赋给list渲染出来
        list.value = item.default.split(',') 
        form.name = item.name
    }
}
const submit = () => { 
    // 判断当前组件的callbackFunction是否拿到父组件的回调函数
    if(typeof callbackFunction.value === 'function') {
        callbackFunction.value(form)
    }
    dialogVisable.value = false
};
defineExpose({
    open,
});
</script>

<style>
.image-aside {
    position: relative;
    border-right: 1px solid #eeeeee;
}

.image-aside .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y: auto;
}

.image-aside .bottom {
    height: 50px;
    position: absolute;
    @apply flex items-center justify-center;
    bottom: 0;
    left: 0;
    right: 0;
}

.sku_list {
    border-bottom: 1px solid #f4f4f4;
    @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}

.sku_list:hover,
.active {
    @apply bg-blue-50;
}
</style>
