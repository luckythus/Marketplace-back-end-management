<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="160px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="注册与访问" name="first">
          <el-form-item label="是否允许注册会员">
            <el-radio-group v-model="form.open_reg">
              <el-radio :label="1" border> 是 </el-radio>
              <el-radio :label="0" border> 否 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="注册类型">
            <el-radio-group v-model="form.reg_method">
              <el-radio label="username" border> 普通注册 </el-radio>
              <el-radio label="phone" border> 手机注册 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码最小长度">
            <el-input
              v-model="form.password_min"
              placeholder="请输入密码"
              type="number"
              style="width: 30%"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码复杂度">
            <el-checkbox-group v-model="form.password_encrypt">
              <el-checkbox label="0" border> 数字 </el-checkbox>
              <el-checkbox label="1" border> 小写字母 </el-checkbox>
              <el-checkbox label="2" border> 大写字母 </el-checkbox>
              <el-checkbox label="3" border> 符号 </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="上传与设置" name="second">
          <el-form-item label="默认上传方式">
            <el-radio-group v-model="form.upload_method">
              <el-radio label="阿里oss" border>阿里oss</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input
              v-model="form.upload_config.Bucket"
              placeholder="Bucket"
              style="width: 30%"
            />
          </el-form-item>
          <el-form-item label="ACCESS_KEY">
            <el-input
              v-model="form.upload_config.ACCESS_KEY"
              placeholder="ACCESS_KEY"
              style="width: 30%"
            />
          </el-form-item>
          <el-form-item label="SECRET_KEY">
            <el-input
              v-model="form.upload_config.SECRET_KEY"
              placeholder="SECRET_KEY"
              style="width: 30%"
            />
          </el-form-item>
          <el-form-item label="空间域名">
            <el-input
              v-model="form.upload_config.http"
              placeholder="空间域名"
              style="width: 30%"
            />
            <small class="text-gray-400 ml-2">请补全http://或https://</small>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="API安全" name="third">
          <el-form-item label="是否开启API安全">
            <el-radio-group v-model="form.api_safe">
              <el-radio :label="1" border> 是 </el-radio>
              <el-radio :label="0" border> 否 </el-radio>
            </el-radio-group>
            <small class="text-gray-400 ml-2">
              api安全功能开启之后调用前端api需要传输签名串
            </small>
          </el-form-item>
          <el-form-item label="秘匙">
            <el-input
              v-model="form.api_secret"
              placeholder="秘匙"
              style="width: 30%"
            />
            <small class="text-gray-400 ml-2"
              >秘匙设置关系系统中api调用传输签名串的编码规则，以及会员token解析，请慎重设置，注意设置之后对应会员要求重新登录获取token</small
            >
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button type="primary" size="default" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { getSysconfig, setSysconfig } from "@/api/sysconfig";
import { Message } from '@/composables/util'
// 定义修改设置的表单数据
const form = reactive({
  open_reg: 1, //开启注册，0关闭1开启
  reg_method: "username", //注册方式，username普通phone手机
  password_min: 6, //密码最小长度
  //由于密码复杂度可以多选，先用数组来接收视图选择的值，然后在传回给后端时再转为字符串0,1,2格式
  password_encrypt: [], //密码复杂度，0数字、1小写字母、2大写字母、3符号；例如0,1,2
  upload_method: "oss", //上传方式 oss对象存储
  upload_config: {
    Bucket: "",
    ACCESS_KEY: "",
    SECRET_KEY: "",
    http: "",
  }, //上传配置 { Bucket:"", ACCESS_KEY:"", SECRET_KEY:"", http:""}
  api_safe: 1, //api安全，0关闭1开启
  api_secret: "", //秘钥
});
// 定义表单标签导航的初始展示页面
const activeName = ref("first");
// 定义点击加载的loading效果
const loading = ref(false);
// 获取基础设置
function getSysData() {
  loading.value = true;
  getSysconfig()
    .then((res) => {
      console.log(res);
    //将res获取到的系统设置同步到表单form中
    for(const key in res) {
        form[key] = res[key]
    }
    form.password_encrypt = form.password_encrypt.split(',')
    })
    .finally(() => {
      loading.value = false;
    });
}
const submit = () => {
    loading.value = true
    form.password_encrypt = form.password_encrypt.join(',') 
    setSysconfig(form).then(res => {
        Message('修改设置成功！') 
        getSysData()
    }).finally(() => {
        loading.value = false
    })
}
getSysData();
</script>

<style></style>
