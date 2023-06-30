<template>
    <el-tag v-for="tag in dynamicTags" :key="tag" class="mx-1" closable :disable-transitions="false"
        @close="handleClose(tag)">
        {{ tag }}
    </el-tag>
    <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
        @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
        + 新标签
    </el-button>
</template>
  
<script setup>
import { nextTick, ref } from 'vue'
// 该组件创建的标签，在关闭其父组件的抽屉后一定要调用抽屉destroy-on-close方法将子元素全部销毁，不然会遗留上一个抽屉的组件创建的标签！！！
const props = defineProps({
    modelValue: String
})
const emit = defineEmits(['update:modelValue'])
const inputValue = ref('')
const dynamicTags = ref(props.modelValue ? props.modelValue.split(',') : [])
const inputVisible = ref(false)
const InputRef = ref(null)

const handleClose = (tag) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
    emit('update:modelValue', dynamicTags.value.join(','))
}

const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
        InputRef.value.input.focus()
    })
}

const handleInputConfirm = () => {
    if (inputValue.value) {
        dynamicTags.value.push(inputValue.value)
        emit('update:modelValue', dynamicTags.value.join(','))

    }
    inputVisible.value = false
    inputValue.value = ''
}
</script>
  