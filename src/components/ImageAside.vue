<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <Aside
        :active="activeId == item.id"
        v-for="(item, index) in list"
        :key="index"
        @edit="handleEdit(item)"
        @delete="handleDelete(item.id)"
        @click="handleChangeActive(item.id)"
      >
        <!-- Aside里面slot插槽里面显示的内容 -->
        {{ item.name }}
      </Aside>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev,next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-aside>
  <FromDrawer ref="fromDrawerRef" @submit="handleSubmit" :title="drawerTitle">
    <el-form
      label-width="80px"
      :model="form"
      style="max-width: 460px"
      ref="formRef"
      :rules="rules"
    >
      <el-form-item label="相册名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.order" :min="0" :max="1000" />
      </el-form-item>
    </el-form>
  </FromDrawer>
</template>

<script setup>
import FromDrawer from "./FromDrawer.vue";
import { ref, reactive } from "vue";
import { computed } from "@vue/reactivity";
import Aside from "./Aside.vue";
import {
  getImageClassList,
  createImageClass,
  updateImageClass,
  deleteImageClass,
} from "@/api/image_class.js";
import { Message, Loading, closeLoading } from "@/composables/util";
// 使用加载动画v-loading指令来绑定loading，判断是否需要加载动画
const loading = ref(false);
// 定义一个数组来接收图库接口的数据，渲染到页面上
const list = ref([]);
// 定义一个activeId来显示当前选中状态,选中图库分类的id
const activeId = ref(0);
// 定义一个emit，当切换了分类后，通知父组件加载相对应的图片
const emit = defineEmits(['change'])
// 定义一个能切换分类id状态的方法
function handleChangeActive(id) {
  activeId.value = id;
  // 切换分类了，通知父组件，响应change事件，加载当前分类id的对应图片。
  emit('change',id)
}

// 分页
// 当前的页
const currentPage = ref(1);
// 数据总条数
const total = ref(0);
// 限制每页最多显示条数
const limit = ref(10);

// 获取图片分类数据
function getData(num = null) {
  // current-page事件响应后，执行getData，会传入当前一个页码数值回来，所以判断num是否是number即可
  if (typeof num == "number") {
    // 如果num是点击后的页码，则将请求点击页数据
    currentPage.value = num;
  }
  // 在接收数据前调用加载动画
  loading.value = true;
  // 调用图库列表接口时带上当前页码参数拉去对应数据
  getImageClassList(currentPage.value)
    .then((res) => {
      total.value = res.totalCount;
      list.value = res.list;
      let item = list.value[0];
      if (item) {
        handleChangeActive(item.id)
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();

// 定义当前编辑项的id，初始化为0
const editId = ref(0);

// 定义抽屉的名称，根据editId判断是新增还是修改图库，使用计算属性来动态修改title
const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));

// 拿到抽屉组件节点
const fromDrawerRef = ref(null);

// 定义抽屉里面的表单数据对象
const form = reactive({
  name: "",
  order: 50,
});

// 拿到表单组件的节点
const formRef = ref(null);
// 定义表单数据规则
const rules = {
  name: [
    {
      required: true,
      message: "相册名称不能为空！",
      trigger: "blur",
    },
  ],
};

// 定义响应了子组件submit事件，执行的handlSubmit回调函数,
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;
    Loading();
    const selectSubmit = editId.value
      ? updateImageClass(editId.value, form)
      : createImageClass(form);
    selectSubmit
      .then((res) => {
        Message(drawerTitle.value + "图片成功！");
        getData(editId.value ? currentPage.value : 1);
        fromDrawerRef.value.close();
      })
      .finally(() => {
        closeLoading();
      });
  });
};

// 编辑表单的内容
const handleEdit = (item) => {
  editId.value = item.id;
  form.name = item.name;
  form.order = item.order;
  fromDrawerRef.value.open();
};
// 抽屉节点拿到了，就能调用它里面打开抽屉的open方法
const handleOpen = () => {
  // 父组件点击新增，子组件响应方法，先清空表单的数据。再打开抽屉，新增的id为0
  editId.value = 0;
  form.name = "";
  form.order = 50;
  fromDrawerRef.value.open();
};
// 删除分类选项方法
const handleDelete = (id) => {
  loading.value = true;
  deleteImageClass(id)
    .then((res) => {
      Message("删除成功！");
      // 删除成功后，重新获取当前页面数据
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};
// 暴露方法，在其父组件中调用
defineExpose({
  handleOpen,
});
</script>

<style>
.image-aside {
  position: relative;
  border-right: 1px solid #eeeeee;
}

.image-aside .top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-aside .bottom {
  height: 50px;
  position: absolute;
  @apply flex items-center justify-center;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>