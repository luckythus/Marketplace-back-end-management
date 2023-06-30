<template>
    <el-form :model="modelValue" label-width="80px" class="mb-3" size="small">
        <el-row :gutter="20">
            <slot />
            <template v-if="showSearch">
                <slot name="show" />
            </template>
            <el-col :span="8" :offset="showSearch ? 0 : 8">
                <div class="flex items-center justify-end">
                    <el-button type="primary" @click="$emit('search')">搜索</el-button>
                    <el-button @click="$emit('reset')">重置</el-button>
                    <el-button @click="showSearch = !showSearch" text v-if="hasShowSearch">
                        {{ showSearch ? '收起' : '展开' }}
                        <el-icon>
                            <ArrowUp v-if="showSearch" />
                            <ArrowDown v-else />
                        </el-icon>
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup>
import { ref, useSlots } from 'vue';
defineProps({
    modelValue: Object
})
defineEmits(['search', 'reset'])
const showSearch = ref(false)
// 使用Vue提供的方法useSlots，拿到插槽的全部对象
const slots = useSlots()
// 拿到插槽的名称,          两次感叹号直接转化成布尔值
const hasShowSearch = ref(!!slots.show)
</script>

<style></style>