<template>
  {{ Data.num.toFixed(0) }}
</template>

<script setup>
import { reactive,watch } from 'vue';

// 导入第三方包 滚动动画的包
import gsap from 'gsap'

// 子组件的自定义属性，接收从父组件传过来的数据，从而实时更新
const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})
const Data = reactive({
    num: 0
})
function AnimateData() {
    gsap.to(Data,{
        // 滚动动画时长：s
        duration: .8,
        // 等于从父组件传过来给子组件自定义属性的值
        num: props.value
    })
}
AnimateData()

// 监听自定义属性value的值，如果从父组件传过来的value发生变化，则需重新执行滚动数据动画来保持一致
watch(() => props.value,() => AnimateData())
</script>

<style>

</style>