<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top p-3">
      <el-row :gutter="10">
        <el-col
          :span="6"
          :offset="0"
          v-for="(item, index) in list"
          :key="index"
        >
          <el-card
            shadow="hover"
            :body-style="{ padding: '0px' }"
            class="mb-3 relative"
            :class="{ 'border-blue-500': item.checked }"
          >
            <el-image
              :src="item.url"
              fit="cover"
              class="w-full h-[150px]"
              :preview-src-list="[item.url]"
              :initial-index="0"
            ></el-image>
            <div class="image-title">
              {{ item.name }}
            </div>
            <div class="flex items-center justify-center p-2">
              <el-checkbox
                v-if="openChoose"
                v-model="item.checked"
                @change="handleChooseChange(item)"
              />
              <el-button
                class="!m-0"
                type="primary"
                text
                size="small"
                @click="handleEdit(item)"
              >
                重命名
              </el-button>
              <el-popconfirm
                title="确定要删除该分类吗？"
                cancel-button-text="取消"
                confirm-button-text="确认"
                @confirm="handleDelete(item.id)"
              >
                <template #reference>
                  <el-button class="!m-0" type="primary" text size="small">
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev,pager,next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-main>
  <el-drawer v-model="drawer" title="上传图片" :with-header="false">
    <UploadFile :data="{ image_class_id }" />
  </el-drawer>
</template>

<script setup>
import UploadFile from "./UploadFile.vue";
import { computed, ref } from "vue";
import { getImageList, updateImageList, deleteImageList } from "@/api/image";
import { showPrompt, Message } from "@/composables/util";
// 分页
// 当前分类的id
const image_class_id = ref(0);
// 当前的页
const currentPage = ref(1);
// 数据总条数
const total = ref(0);
// 限制每页最多显示条数
const limit = ref(10);
// 定义list数组接收数据内容
const list = ref([]);
// 加载动画
const loading = ref(false);

// 定义自定义属性
const props = defineProps({
  // 是否出现选择框
  openChoose: {
    type: Boolean,
    default: false,
  },
  // 限制选择的图片的数量
  limit: {
    type: Number,
    default: 1,
  },
});
// 获取图片数据
function getData(num = null) {
  // current-page事件响应后，执行getData，会传入当前一个页码数值回来，所以判断num是否是number即可
  if (typeof num == "number") {
    // 如果num是点击后的页码，则将请求点击页数据
    currentPage.value = num;
  }
  // 在接收数据前调用加载动画
  loading.value = true;
  // 调用图库列表接口时带上当前页码参数拉去对应数据
  getImageList(image_class_id.value, currentPage.value)
    .then((res) => {
      total.value = res.totalCount;
      list.value = res.list.map((o) => {
        o.checked = false;
        return o;
      });
    })
    .finally(() => {
      loading.value = false;
    });
}
// 根据分类id来动态加载Main里面的图片
const loadData = (id) => {
  currentPage.value = 1;
  image_class_id.value = id;
  getData();
};
// 重命名图片方法
const handleEdit = (item) => {
  showPrompt("重命名", item.name).then(({ value }) => {
    loading.value = true;
    updateImageList(item.id, value)
      .then((res) => {
        Message("修改成功");
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  });
};
// 删除选中的图片
const handleDelete = (id) => {
  loading.value = true;
  deleteImageList([id])
    .then((res) => {
      Message("删除成功！");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};

// 定义上传图片的方法
const drawer = ref(false);
const openUploadFile = () => (drawer.value = true);

// 将图片数据传回给父组件
const emit = defineEmits(["choose"]);
// 选中的图片数量
const chooseImage = computed(() => list.value.filter((o) => o.checked));
// 判断选择图片
const handleChooseChange = (item) => {
  // 计算属性和ref也是要先.value才能拿到里面的值
  if (item.checked && chooseImage.value.length > props.limit) {
    item.checked = false;
    return Message(`最多只能选择${limit}张图片`, "error");
  }
  // 如果选择为true,并且chooseImage只有一个,将该数据传回给父组件
  emit("choose", chooseImage.value);
};
// 向父组件暴露这个方法
defineExpose({
  openUploadFile,
  loadData,
});
</script>

<style>
.image-main {
  position: relative;
}

.image-main .top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}

.image-main .bottom {
  height: 50px;
  position: absolute;
  @apply flex items-center justify-center;
  bottom: 0;
  left: 0;
  right: 0;
}

.image-title {
  position: absolute;
  top: 122px;
  left: -1px;
  right: -1px;
  @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>
