import { logout, updatePassword } from "@/api/manager";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { showLoad, doneLoad,Loading,closeLoading,showMessage,Message } from "@/composables/util";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
// 修改密码的方法
export function useRepassword() {
  // 拿到store实例
  const store = useStore();
  // 拿到router实例
  const router = useRouter();

  // 获取修改密码选项弹出框所暴露的事件和方法
  const formDrawer = ref(null);
  // 显示抽屉模块的方法
  const openRepasswordForm = () => formDrawer.value.open()
  // 修改密码的参数表单
  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });
// 获取表单formRef所代表的元素方法和事件
  const formRef = ref(null);
  // 修改密码规则
  const rules = {
    oldpassword: [
      {
        required: true,
        message: "新密码不能为空!",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: "新密码不能为空!",
        trigger: "blur",
      },
    ],
    repassword: [
      {
        required: true,
        message: "确认密码不能为空！",
        trigger: "blur",
      },
    ],
  };
  // 提交功能按钮
  const onSubmit = () => {
    // 响应表单验证事件validate，验证修改密码表单
    formRef.value.validate((valid) => {
      // 验证失败
      if (!valid) {
        return ElMessage.error("密码错误！");
      }
      // 成功后执行下列代码
      // 最上方加载进度条
      showLoad();
      // 全屏显示加载
      Loading();
      // 发送请求到修改密码接口，请求修改密码
      updatePassword(form)
        .then((res) => {
          Message("修改密码成功，请重新登录！");
          store.dispatch("logout");
          router.push("/login");
        })
        .finally(() => {
          doneLoad();
          closeLoading();
        });
    });
  };
  // 暴露方法
  return {
    form,
    formRef,
    formDrawer,
    rules,
    onSubmit,
    openRepasswordForm
  }
}
// 退出登录的方法
export function useLogout() {
  const store = useStore();
  const router = useRouter();
  const handleLogout = () => {
    showMessage("是否要退出登录？").then(() => {
      showLoad();
      logout().finally(() => {
        // 移除cookie和管理员信息
        store.dispatch("logout");
        // 跳转登录页面路由
        router.push('/login')
        // 提示退出登录成功
        Message("退出登录成功！");
        doneLoad();
      });
    });
  }
  return {
    handleLogout
  }
}
