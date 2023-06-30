<template>
      <el-result
        icon="warning"
        title="404 Not Found"
        sub-title="找不到页面"
      >
        <template #extra>
          <el-button type="primary" @click="$router.push('/')">回到首页</el-button>
        </template>
      </el-result>
</template>

<script>
export default {
    name: 'Not Found'
}
</script>

<style>

</style>