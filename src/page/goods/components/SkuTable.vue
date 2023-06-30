<template>
    <div v-loading="loading">
        <el-form-item label="规格设置">
            <table>
                <thead>
                    <tr>
                        <th class="border" v-for="(th, index) in tableThs" :key="index" :rowspan="th.rowspan"
                            :colspan="th.colspan" :width="th.width">
                            {{ th.name }}
                        </th>
                    </tr>
                    <tr>
                        <th class="border" v-for="(th, index) in skuLabels" :key="index">
                            {{ th.name }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in sku_list" :key="index">
                        <td width="100" class="border text-center" v-for="(sku, skuI) in item.skus" :key="skuI">
                            {{ sku.value }}
                        </td>
                        <td class="border">
                            <el-input v-model="item.pprice" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.oprice" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.cprice" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.stock" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.volume" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.weight" size="small" type="number"></el-input>
                        </td>
                        <td class="border">
                            <el-input v-model="item.code" size="small"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-form-item>
    </div>
</template>

<script setup>
import {
    initSkuTable,
    initSkuCardItem
} from '@/composables/useSku'

const {
    skuLabels,
    sku_list,
    tableThs
} = initSkuTable()
const {
    loading
} = initSkuCardItem()
</script>

<style></style>