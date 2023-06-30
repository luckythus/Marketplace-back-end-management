import { ref, reactive, computed } from "vue";
import { Message, Loading, closeLoading } from "@/composables/util";

// 管理员组件 的 搜索、分页、修改状态、删除功能  opt={}拿到复用组件传过来的对象数据
export function useInitTable(opt = {}) {
    // 搜索框 先默认null，根据opt对象有无来判断，再传值
    let searchForm = null;
    // 重置搜索框也是
    let resetSearch = null;
    // 判断
    if (opt.searchForm) {
        searchForm = reactive({
            // 拿到传进来的搜索数据
            ...opt.searchForm,
        });
    }
    //重置搜索框
    resetSearch = () => {
        for (const key in opt.searchForm) {
            searchForm[key] = opt.searchForm[key];
        }
        getData();
    };
    // 获取管理列表数据的数组
    const tableData = ref([]);
    // 使用加载动画v-loading指令来绑定loading，判断是否需要加载动画
    const loading = ref(false);
    // 搜索框的内容

    // 分页
    // 当前的页
    const currentPage = ref(1);
    // 数据总条数
    const total = ref(0);
    // 限制每页最多显示条数
    const limit = ref(10);
    // 获取管理数据
    function getData(num = null) {
        if (typeof num == "number") {
            // 如果num是点击后的页码，则将请求点击页数据
            currentPage.value = num;
        }
        // 在接收数据前调用加载动画
        loading.value = true;
        // 调用图库列表接口时带上当前页码参数拉去对应数据
        opt
            .getList(currentPage.value, searchForm)
            .then((res) => {
                // 判断是否是获取管理员列表，如果是，则返回res，在父组件中完成赋值
                if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
                    opt.onGetListSuccess(res);
                } else {
                    tableData.value = res.list;
                    total.value = res.totalCount;
                }
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                loading.value = false;
            });
    }
    getData();

    // 删除当前行的数据
    const handleDelete = (id) => {
        // v-loading=loading的加载动画
        loading.value = true;
        opt
            .delete(id)
            .then((res) => {
                Message("删除成功！");
                console.log(res);
                getData();
            })
            .finally(() => {
                loading.value = false;
            });
    };

    // 修改管理员状态
    const handleStatus = (status, row) => {
        opt.updateStatus(row.id, status).then((res) => {
            Message("修改状态成功！");
            row.status = status;
        });
    };

    // 拿到全选按钮组件的ref
    const mutiSelectionRef = ref(null)
    // 多选框拿到选中规格名称的id
    const mutiSelectionIds = ref([])
    const handleSelectionChange = (e) => {
        mutiSelectionIds.value = e.map(o => o.id)
    }
    // 删除多选框的数据
    const handleMutiDelete = () => {
        opt.delete(mutiSelectionIds.value)
            .then(res => {
                Loading()
                Message('删除成功！')
                if (mutiSelectionRef.value) {
                    mutiSelectionRef.value.clearSelection()
                }
                getData()
            })
            .finally(() => {
                closeLoading()
            })
    }
    // 批量修改状态
    const hadnleMutiStatusChange = (status) => {
        Loading()
        opt.updateStatus(mutiSelectionIds.value, status).
            then(res => {
                Message('修改状态成功！')
                if (mutiSelectionRef.value) {
                    mutiSelectionRef.value.clearSelection()
                }
            }).finally(() => {
                getData()
                closeLoading()
            })
    }
    return {
        searchForm,
        resetSearch,
        currentPage,
        total,
        limit,
        getData,
        tableData,
        loading,
        handleDelete,
        handleStatus,
        handleSelectionChange,
        mutiSelectionRef,
        handleMutiDelete,
        hadnleMutiStatusChange,
        mutiSelectionIds
    };
}

// 新增，修改
export function useInitForm(opt = {}) {
    // 获取抽屉节点
    const formDrawerRef = ref(null);
    // 获取抽屉里的表单节点
    const formRef = ref(null);
    // 定义一个表单默认值
    const defaultForm = opt.form;
    // 定义新增的表单数据
    const form = reactive({});
    // 定义表单校验规则
    const rules = opt.rules || {};
    // 判断是否是新增还是编辑修改
    const editId = ref(0);
    const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));
    // 重置表单，新增没内容，修改显示当前内容
    function resetForm(row = false) {
        if (formRef.value) {
            // 先清除校验规则留下了的警示
            formRef.value.clearValidate();
        }
        for (const key in defaultForm) {
            form[key] = row[key];
        }
    }

    // 点击新增按钮打开抽屉
    const openFromDrawer = () => {
        editId.value = 0;
        resetForm(defaultForm);
        formDrawerRef.value.open();
    };

    // 修改管理
    const handleEdit = (row) => {
        editId.value = row.id;
        resetForm(row);
        formDrawerRef.value.open();
    };
    // 抽屉点击提交按钮，响应子组件传来的提交事件进行回调
    const handleSubmit = () => {
        formRef.value.validate((valid) => {
            if (!valid) return Message("提交失败！", "error");
            // 如果表单校验通过，则调用增加管理接口
            Loading();
            // 在日期时间里面拿到日期时间的表单数据，转化为后端接口数据毫秒数
            let data = {}
            if (opt.beforeSubmit && typeof opt.beforeSubmit == 'function') {
                // 调用拦截器，在提交之前展开form表单值，将里面时间转化，再赋给data，用data替代form
                let startTime = (new Date(form.start_time)).getTime()
                console.log(startTime);
                data = opt.beforeSubmit({ ...form })
            } else {
                data = form
            }
            const selectSubmit = editId.value
                ? opt.update(editId.value, data)
                : opt.create(data);
            selectSubmit
                .then((res) => {
                    Message(drawerTitle.value + "成功！");
                    // 如果是修改则刷新当前页，如果是新增则加载到第一页
                    opt.getData(editId.value ? false : 1);
                })
                .finally(() => {
                    formDrawerRef.value.close();
                    closeLoading();
                });
        });
    };


    return {
        formDrawerRef,
        formRef,
        form,
        rules,
        editId,
        drawerTitle,
        resetForm,
        openFromDrawer,
        handleSubmit,
        handleEdit,
    };
}
