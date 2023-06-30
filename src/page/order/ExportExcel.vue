<template>
    <el-drawer title="导出" v-model="dialogVisable" width="50%">
        <el-form :model="form" label-width="80px">
            <el-form-item label="订单类型">
                <el-select v-model="form.tab" placeholder="请选择">
                    <el-option v-for="item in tabs" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期时间">
                <el-date-picker v-model="form.time" type="daterange" size="small" range-separator="至"
                    start-placeholder="开始时间" end-placeholder="结束日期" value-format="YYYY-MM-DD">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="onSubmit">导出</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue";
import { exportOrder } from '@/api/order'
import { Loading, Message, closeLoading } from "@/composables/util"
const dialogVisable = ref(false);
defineProps({
    tabs: Array,
});
// 定义表单的类型和时间
const form = reactive({
    tab: null,
    time: "",
});
const open = () => (dialogVisable.value = true);
const close = () => (dialogVisable.value = false);

const onSubmit = () => {
    // 判断是否输入订单类型
    if (!form.tab) return Message('订单类型不能为空！', 'error')
    // 选择提交后，日期选择器中的时间返回一个数组给form.time，开始和结束
    let startTime = null
    let endTime = null
    if (!form.time && Array.isArray(form.time)) {
        startTime = form.time[0]
        endTime = form.time[1]
    }
    Loading()
    exportOrder({
        tab: form.tab,
        startTime,
        endTime
    }).then(data => {
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let filename = (new Date()).getTime() + '.xlsx'
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
// 这段 JavaScript 代码用于创建一个下载链接，并触发下载。具体的步骤如下：           
// 使用 window.URL.createObjectURL 方法创建一个包含文件数据的 Blob 对象，并将其转换个 URL 字符串。这个 URL 字符串会被用作下载链接的地址。
// 使用 document.createElement 方法创建一个 a 标签元素，这个元素将被用作下载链接。
// 将 link 元素的 href 属性设置为步骤1中创建的 URL 字符串，这样点击这个链接时就会下载的文件。
// 设置 link 元素的 download 属性，指定文件名。在这个例子中，文件名为 123.xlsx。
// 将 link 元素添加到 document.body 中，这样下载链接就会出现在网页中。
// 触发下载操作，使用 link.click() 方法模拟用户点击下载链接的行为。
// 通过上述步骤，当这段 JavaScript 代码被执行时，就会在网页中创建一个下载链接击这个链接时
// 就会下载一个名为 123.xlsx 的空白文件。如果要下载具体的文件内容，需要建 Blob 对象时，将文件数据 
// 作为参数传递进去。
// 例如
// javascript  Copy code
// const data = new Uint8Array([/* some file data */]);
// const blob = new Blob([data], { type: 'application/vnopenxmlformats-officedocument.spreadsheetml.sheet' });
// const url = window.URL.createObjectURL(blob);
// const link = document.createElement('a');
// link.style.display = 'none';
// link.href = url;
// const filename = 'example.xlsx';
// link.setAttribute('download', filename);
// document.body.appendChild(link);
// link.click();
// 这段代码可以下载一个名为 example.xlsx 的 Excel 文件，其中的数据为 Uint8Array 类型进制数据。需要注意的是，在实际使用中，应该根据具体的文件类型和数据类型来设置 Blob 对象MIME 类型。
    }).finally(() => {
        closeLoading()
    })
}
defineExpose({
    open,
    close,
});
</script>

<style></style>
