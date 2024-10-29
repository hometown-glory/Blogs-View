<template>
  <div class="grid grid-cols-2 h-screen">
    <div
        class="col-span-2 order-2 p-10 md:col-span-1 md:order-1 bg-black animate__animated animate__bounceInRight animate__fast">
      <div class="flex justify-center items-center h-full flex-col">
        <h2 class="font-bold text-4xl mb-7 text-white">Weblog 博客登录</h2>
        <p class="text-white">一款由 Spring Boot + Mybatis Plus + Vue 3.2 + Vite 4 开发的前后端分离博客。</p>
        <br>
        <img src="@/assets/developer.png" alt="" class="w-1/2">
      </div>
    </div>
    <div
        class="col-span-2 order-1 md:col-span-1 md:order-2 bg-white animate__animated animate__bounceInRight animate__fast">
      <div class="flex justify-center items-center h-full flex-col">
        <h1 class="font-bold text-4xl mb-5">欢迎回来</h1>
        <div class="flex items-center justify-center mb-7 text-gray-400 space-x-2">
          <span class="h-[1px] w-16 bg-gray-200"></span>
          <span>账号密码登录</span>
          <span class="h-[1px] w-16 bg-gray-200"></span>
        </div>
        <el-form class="w-5/6 md:w-2/5">
          <el-form-item>
            <el-input size="large" v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" clearable/>
          </el-form-item>
          <el-form-item>
            <el-input size="large" v-model="form.password" placeholder="请输入密码" :prefix-icon="Lock" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button class="w-full" size="large" type="primary" @click="onSubmit" :loading="loading">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Lock, User} from "@element-plus/icons-vue";
import {login} from '@/api/admin/user';
import {reactive, onMounted, onBeforeUnmount, ref} from 'vue';
import {useRouter} from 'vue-router';
import {showMessage} from "@/utils/message";
import {setToken} from '@/utils/auth'
import { AxiosResponse } from 'axios'

// login 函数返回的响应类型
interface LoginResponse {
  success: boolean;
  data: {
    token: string;
  };
  message: string;
}

// 获取路由实例
const router = useRouter();

// 登录按钮加载
const loading = ref(false)
const form = reactive({
  username: '',
  password: ''
});

// 登录
const onSubmit = () => {
  console.log('登录');
  // 开始加载
  loading.value = true
  login(form.username, form.password).then((res:AxiosResponse<LoginResponse>) => {
    if (res.data.success) {
      console.log(res.data.success)
      // 提示登录成功
      showMessage('登录成功', 'success')

      // 存储 Token 到 Cookie 中
      const token = res.data.data.token
      setToken(token)

      // 跳转到后台首页
      router.push('/admin');
    } else {
      // 获取服务端返回的错误消息
      const message = res.data.message
      // 提示消息
      showMessage(message, 'error')
    }
  }).catch((error) => {
    // 处理登录接口的异常情况
    const message = error.response?.data?.message || '登录失败'
    showMessage(message, 'error')
  }).finally(() => {
    // 结束加载
    loading.value = false
  });
}

// 按回车键后，执行登录事件
function onKeyUp(e: KeyboardEvent) {
  console.log(e);
  if (e.key === 'Enter') {
    onSubmit();
  }
}

// 添加键盘监听
onMounted(() => {
  console.log('添加键盘监听')
  document.addEventListener('keyup', onKeyUp)
})

// 移除键盘监听
onBeforeUnmount(() => {
  document.removeEventListener('keyup', onKeyUp)
})
</script>
