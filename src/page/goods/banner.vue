<template>
    <el-drawer title="设置轮播图" v-model="dislogVisible" size="50%" destroy-on-close>
        <el-form :model="form" label-width="80px" :inline="false" size="default">
            <el-form-item label="轮播图">
                <ChooseImage :limit="9" v-model="form.banners" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">提交</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ChooseImage from '@/components/ChooseImage.vue'
import {
    readGoods,
    setGoodsBanners
} from '@/api/goods'
import { closeLoading, Loading, Message } from '@/composables/util';
const dislogVisible = ref(false)
// 设置抽屉商品轮播图的表单
const form = reactive({
    banners: []
})
// 获取当前传过来的商品的id，然后查看对应商品id的轮播图
const goodsId = ref(0)
// 暴露一个方法来打开商品轮播图抽屉
const open = (row) => {
    goodsId.value = row.id
    row.bannersLoading = true
    readGoods(goodsId.value).then(res => {
        // 将该商品里面的url数据传递给form组件，给它渲染到轮播图里面
        form.banners = res.goodsBanner.map(o => o.url)
        dislogVisible.value = true
    }).finally(() => {
        row.bannersLoading = false
    })
}
// 定义方法，来让父组件更新
const emit = defineEmits(['reloadData '])
// 提交轮播图的方法
const submit = () => {
    Loading()
    setGoodsBanners(goodsId.value,form)
    .then(res => {
        Message('设置轮播图成功！')
        dislogVisible.value = false
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