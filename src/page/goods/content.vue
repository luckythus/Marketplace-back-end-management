<template>
    <FromDrawer ref="formDrawerRef" title="设置商品详情" @submit="submit" destroy-on-close>
        <el-form :model="form" >
            <el-form-item>
                <Editor v-model="form.content"/>
            </el-form-item>
        </el-form>
    </FromDrawer>
</template>

<script setup>
import Editor from '@/components/Editor.vue';
import { ref, reactive } from 'vue'
import FromDrawer from '@/components/FromDrawer.vue'
import {
    readGoods,
    updateGoods
} from '@/api/goods'
import { closeLoading, Loading, Message } from '@/composables/util';
// 设置抽屉商品轮播图的表单
const form = reactive({
    content: '',
})
// 获取抽屉组件的ref
const formDrawerRef = ref(null)
// 获取当前传过来的商品的id，然后查看对应商品id的轮播图
const goodsId = ref(0)
// 暴露一个方法来打开商品轮播图抽屉
const open = (row) => {
    goodsId.value = row.id
    row.contentLoading = true
    readGoods(goodsId.value).then(res => {
        // 将该商品里面的url数据传递给form组件，给它渲染到轮播图里面
        form.content = res.content
        formDrawerRef.value.open()
    }).finally(() => {
        row.contentLoading = false
    })
}
const emit = defineEmits(['reloadData'])
// 提交轮播图的方法
const submit = () => {
    Loading()
    updateGoods(goodsId.value, form).then(res => {
        Message('设置轮播图成功！')
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