<template>
    <div class="mark"></div>
    <div class="tip">
        <el-card shadow="hover" class="card">
            <template #header>
                <div class="flex justify-between items-center">
                    <span>账号：admin，密码：admin</span>
                    <button class="close-btn" @click="closeModal"> X </button>
                </div>
            </template>
            <div>
                <span>如遇一些排在前面的数据无法操作，多试下后面的数据。</span>
                <span>有些数据权限被后端接口给禁止了。</span>
            </div>
        </el-card>
    </div>
    <el-row class="login-container">
        <el-col :lg="16" :md="12" class="left">
            <div>
                <div class="title">欢迎光临</div>
                <div class="title-introduce">
                    这里是luckythus的Shop管理后台
                </div>
            </div>
        </el-col>
        <el-col :lg="8" :md="12" class="right">
            <div class="welcome">
                <h2>欢迎回来</h2>
            </div>
            <div class="decorate">
                <span class="line"></span>
                <span>账号密码登录</span>
                <span class="line"></span>
            </div>

            <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="w-[250px]" color="#626aef" round @click="onSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Loading, closeLoading, Message } from "@/composables/util";
const store = useStore();
const router = useRouter();

window.addEventListener('load', function () {
    const closeBtn = document.querySelector('.close-btn')
    closeBtn.addEventListener('click', function () {
        const mark = document.querySelector('#mark')
        const tip = document.querySelector('#Tip')
        mark.remove()
        tip.remove()
    })
})
const form = reactive({
    username: "",
    password: "",
});
const rules = {
    username: [
        {
            required: true,
            message: "用户名不能为空",
            trigger: "blur",
        },
        {
            required: true,
            min: 2,
            max: 10,
            message: "用户名必须在2~10字符之间!",
            trigger: "blur",
        },
    ],
    password: [
        {
            required: true,
            message: "密码不能为空!",
            trigger: "blur",
        },
    ],
};

const formRef = ref(null);

const onSubmit = () => {
    // 响应表单验证事件validate，验证表单
    formRef.value.validate((valid) => {
        // 验证失败
        if (!valid) {
            return ElMessage.error("用户名或密码错误！");
        }
        // 成功后执行下列代码
        // 加载中
        Loading();
        // 管理员验证
        store
            .dispatch("Login", form)
            .then((res) => {
                // 响应登录成功结果
                Message("登录后台管理页面成功！", "success");
                // 跳转到后台页面
                router.push("/");
            })
            .finally(() => {
                // 加载完毕
                closeLoading();
            });
    });
};
const closeModal = () => {
    const closeBtn = document.querySelector('.tip')
    const mark = document.querySelector('.mark')
    mark.remove()
    closeBtn.remove()
}
</script>

<style>
.mark {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    background-color:  rgba(0,0,0,.5);
    z-index: 999;
}
.tip {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    /* width: 400px;
    height: 400px; */
    z-index: 1000;
}
.tip:hover {
    
}
.login-container {
    @apply min-h-screen bg-blue-500;
    position: relative
}

.login-container .left,
.login-container .right {
    @apply flex justify-center items-center;
}

.login-container .right {
    @apply flex-col bg-light-50;
}

.login-container .left .title {
    @apply font-bold text-light-50 text-5xl mb-4;
}

.login-container .left .title-introduce {
    @apply text-gray-100 text-sm;
}

.login-container .right .welcome {
    @apply font-bold text-3xl text-gray-900;
}

.login-container .right .decorate {
    @apply flex items-center justify-center my-5 text-gray-300 space-x-3;
}

.login-container .right .line {
    @apply h-[1px] w-16 bg-gray-200;
}
</style>
