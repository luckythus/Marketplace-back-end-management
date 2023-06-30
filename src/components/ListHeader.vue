<template>
  <div class="notice-header">
    <div>
      <el-button
        v-if="btns.includes('create')"
        size="small"
        type="primary"
        @click="$emit('create')"
        >新增</el-button
      >
      <el-popconfirm
        v-if="btns.includes('delete')"
        title="确定要删除该记录吗？"
        cancel-button-text="取消"
        confirm-button-text="确认"
        @confirm="$emit('delete')"
      >
        <template #reference>
          <el-button v-if="btns.includes('delete')" type="danger" size="small"
            >批量删除</el-button
          >
        </template>
      </el-popconfirm>
      <slot />
    </div>
    <div>
      <el-tooltip
        v-if="btns.includes('refresh')"
        effect="dark"
        content="刷新列表"
        placement="top"
      >
        <el-button text @click="$emit('refresh')">
          <el-icon :size="20">
            <Refresh />
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-tooltip
        v-if="btns.includes('download')"
        effect="dark"
        content="导出列表"
        placement="top"
      >
        <el-button text @click="$emit('download')">
          <el-icon :size="20">
            <Download />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  layout: {
    type: String,
    default: "create,refresh",
  },
});
const btns = computed(() => props.layout.split(","));
defineEmits(["create", "refresh", "delete", "download"]);
</script>

<style></style>
