<template>
    <FromDrawer ref="formDrawerRef" title="设置商品规格" @submit="submit" destroy-on-close size="70%">
        <el-form :model="form">
            <el-form-item label="规格类型">
                <el-radio-group v-model="form.sku_type" @change="">
                    <el-radio :label="0">单规格</el-radio>
                    <el-radio :label="1">多规格</el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="form.sku_type === 0">
                <el-form-item label="市场价格">
                    <el-input v-model="form.sku_value.oprice" style="width: 35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售价格">
                    <el-input v-model="form.sku_value.pprice" style="width: 35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="成本价格">
                    <el-input v-model="form.sku_value.cprice" style="width: 35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.sku_value.weight" style="width: 35%">
                        <template #append>公斤</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品体积">
                    <el-input v-model="form.sku_value.volume" style="width: 50%">
                        <template #append>立方米</template>
                    </el-input>
                </el-form-item>
            </template>
            <template v-else>
                <SkuCard />
                <SkuTable />
            </template>
        </el-form>
    </FromDrawer>
</template>

<script setup>
import SkuTable from './components/SkuTable.vue';
import SkuCard from './components/SkuCard.vue';
import { ref, reactive } from 'vue'
import FromDrawer from '@/components/FromDrawer.vue'
import {
    readGoods,
    updateGoodsSkus
} from '@/api/goods'
import {
    goodsId,
    initSkuCardList,
    sku_list
} from '@/composables/useSku.js'
import { closeLoading, Loading, Message } from '@/composables/util';
// 设置抽屉商品轮播图的表单
const form = reactive({
    sku_type: 0,
    sku_value: {
        "oprice": 0,
        "pprice": 0,
        "cprice": 0,
        "weight": 0,
        "volume": 0
    }
})
// 获取抽屉组件的ref
const formDrawerRef = ref(null)
// 获取当前传过来的商品的id，然后查看对应商品id的规格
// 暴露一个方法来打开商品规格抽屉
const open = (row) => {
    goodsId.value = row.id
    row.skusLoading = true
    readGoods(goodsId.value).then(res => {
        // 将该商品里面的url数据传递给form组件，给它渲染到商品规格抽屉里面
        form.sku_type = res.sku_type
        form.sku_value = res.sku_value || {
            "oprice": 0,
            "pprice": 0,
            "cprice": 0,
            "weight": 0,
            "volume": 0
        }
        // 初始化当前规格选项列表
        initSkuCardList(res)
        formDrawerRef.value.open()
    }).finally(() => {
        row.skusLoading = false
    })
}
const emit = defineEmits(['reloadData'])
// 提交轮播图的方法
const submit = () => {
    Loading()
    // 声明一个data来替代form，判断是否为单规格或多规格的提交
    let data = {
        sku_type: form.sku_type,
        sku_value: form.sku_value
    }
    if (form.sku_type == 1) {
        data.goodsSkus = sku_list.value
    }
    console.log(sku_list.value);
    console.log(data);
    updateGoodsSkus(goodsId.value,data).then(res => {
        Message('设置商品规格成功！')
        formDrawerRef.value.close()
        emit('reloadData')
    }).finally(() => {
        closeLoading()
    })
}
defineExpose({
    open
})
</script>

<style></style>