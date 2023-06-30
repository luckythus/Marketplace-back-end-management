<template>
    <div class="aside-list" :class="{ active: active }">
        <span class="truncate">
            <slot />
        </span>
        <el-button text type="primary" size="small" class="px-1 ml-auto" @click.stop="$emit('edit')">
            <el-icon :size="12">
                <Edit />
            </el-icon>
        </el-button>

        <!-- 阻止冒泡事件触发 -->
        <span @click.stop="() => { }">
            <el-popconfirm title="确定要删除该分类吗？" cancel-button-text="取消" confirm-button-text="确认" @confirm="$emit('delete')">
                <template #reference>
                    <el-button text type="primary" size="small" class="px-1">
                        <el-icon :size="12">
                            <Close />
                        </el-icon>
                    </el-button>
                </template>
            </el-popconfirm>
        </span>
    </div>
</template>

<script setup>
// 自定义属性
defineProps({
    active: {
        type: Boolean,
        default: false,
    },
});
// 自定义事件
defineEmits(["edit", "delete"]);
</script>

<style>
.aside-list {
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center text-sm text-gray-600 p-3;
}

.aside-list:hover,
.active {
    @apply bg-blue-50;
}
</style>