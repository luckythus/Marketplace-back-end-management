<template>
    <div v-if="modelValue">
        <el-image v-if="typeof modelValue == 'string'" :src="modelValue" fit="cover"
            class="w-[100px] h-[100px] rounded border mr-2"></el-image>
        <div v-else class="flex flex-wrap">
            <div class="relative mx-1 mb-2 w-[100px] h-[100px]" v-for="(url, index) in modelValue" :key="index">
                <el-icon class="absolute right-[5px] top-[5px] cursor-pointer rounded-full bg-white" style="z-index: 10;"
                    @click="removeImage(url)">
                    <CircleClose />
                </el-icon>
                <el-image :src="url" fit="cover" :lazy="true" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
            </div>
        </div>

    </div>
    <div v-if="preview" class="choose-image-btn" @click="open">
        <el-icon :size="25" class="text-gray-500">
            <Plus />
        </el-icon>
    </div>
    <el-dialog title="选择图片" v-model="dialogVisble" width="80%" :draggable="true">
        <!-- el-container容器布局 -->
        <el-container class="bg-white rounded" style="height: 70vh">
            <el-header class="image-header">
                <el-button type="primary" size="small" @click="handleCreateFromDrawer">新增分类</el-button>
                <el-button type="warning" size="small" @click="handleOpenUploadFile">上传图片</el-button>
            </el-header>
            <el-container>
                <!-- 抽离出类似布局封装成模块 -->
                <ImageAside ref="ImageAsideRef" @change="handleChangeImage" />
                <ImageMain :limit="limit" openChoose ref="ImageMainRef" @choose="handleChoose" />
            </el-container>
        </el-container>
        <template #footer>
            <span>
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="submit">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import ImageAside from "@/components/ImageAside.vue";
import ImageMain from "@/components/ImageMain.vue";
import { Message } from "@/composables/util";
const dialogVisble = ref(false);
// 定义一个回调函数，把它放到open里面,用它来获取到Editor组件里onAction传的回调函数
const callbackFunction = ref(null)
const open = (callback = null) => {
    // 获取到onAction里面的回调函数
    callbackFunction.value = callback
    dialogVisble.value = true
};
const close = () => (dialogVisble.value = false);

// 拿到ImageAside节点
const ImageAsideRef = ref(null);
// 点击该组件，响应子组件方法，打开抽屉
const handleCreateFromDrawer = () => ImageAsideRef.value.handleOpen();
// 拿到ImageMain的节点
const ImageMainRef = ref(null);
// 响应子组件的change事件，加载当前分类id的图片
const handleChangeImage = (image_class_id) => {
    ImageMainRef.value.loadData(image_class_id);
};
// 调用子组件提供的方法，打开上传图片的抽屉
const handleOpenUploadFile = () => ImageMainRef.value.openUploadFile();

// 定义该组件的只读属性props
const props = defineProps({
    // 绑定了该组件v-model的值
    modelValue: [String, Array],
    // 传递限制图片的数据
    limit: {
        type: Number,
        default: 1
    },
    preview: {
        type: Boolean,
        default: true
    }
});
// 定义事件来改变props属性的值,
const emit = defineEmits(["update:modelValue"]);
// 拿到图片的url数据
let urlData = [];
// 拿到子组件传回的选择图片数据
const handleChoose = (e) => {
    urlData = e.map((o) => o.url);
};
// 响应提交功能,将图片数据接着传回给抽屉父组件
const submit = () => {
    // 定义一个数组来存储图片
    let value = []
    if (props.limit == 1) {
        value = urlData[0]
    } else {
        value = props.preview ? [...props.modelValue, ...urlData] : [...urlData]
        if (value.length > props.limit) {
            let data = props.preview ? (props.limit - props.modelValue.length) : props.limit
            console.log(data);
            return Message("最多还能选择"+ data +"张图片", "warning")
        }
    }
    if (value && props.preview) {
        // 响应事件,向上回传数据
        emit("update:modelValue", value);
    }                        //记得调用value才能拿到函数
    if(!props.preview && typeof callbackFunction.value === 'function') {
        // 拿到Editor组件onAction传过来的回调函数，执行它
        callbackFunction.value(value)
    }
    close();
};
// 移除轮播图的图片
const removeImage = (url) => {
    emit('update:modelValue', props.modelValue.filter(u => u != url))
}
defineExpose({
    open,
    close
})
</script>

<style>
.choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex items-center justify-center cursor-pointer hover: (bg-gray-100);
}

.image-header {
    @apply flex items-center;
    border-bottom: 1px solid #eeeeee;
}
</style>