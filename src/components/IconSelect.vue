<template>
    <div class="flex items-center justify-center">
        <el-icon v-if="modelValue" class="mr-2">
            <component :is="modelValue"></component>
        </el-icon>
        <el-select
            :modelValue="modelValue"
            placeholder="请选择图标"
            filterable
            @change="handleChange"
        >
            <el-option
                v-for="item in icons"
                :key="item"
                :label="item"
                :value="item"
            >
            <!-- 使用el-option的默认插槽来渲染图标和图标名称 -->
            <div class="flex items-center justify-between">
                <el-icon>
                    <component :is="item"></component>
                </el-icon>
                <span class="text-gray-500">{{ item }}</span>
            </div>
            </el-option>
        </el-select>
    </div>
</template>

<script setup>
import { ref } from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
defineProps({
    modelValue: String,
});
// 打印ElementPlus的所有图标的名称，也就是对应的key值
// console.log(Object.keys(ElementPlusIconsVue));

const icons = ref(Object.keys(ElementPlusIconsVue));
const emits = defineEmits(['update:modelValue'])
const handleChange = (item) => {
    console.log(item);
    emits('update:modelValue',item)
}
</script>

<style>
</style>