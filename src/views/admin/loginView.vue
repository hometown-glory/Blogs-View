<template>
  <div class="grid grid-cols-2 h-screen">
    <div
        class="col-span-2 order-2 p-10 md:col-span-1 md:order-1 bg-black animate__animated animate__bounceInRight animate__fast">
      <div class="flex justify-center items-center h-full flex-col">
        <h2 class="font-bold text-4xl mb-7 text-white">Weblog 博客登录</h2>
        <p class="text-white">一款由 Spring Boot + Mybatis Plus + Vue 3.2 + Vite 4 开发的前后端分离博客。</p>
        <br>
        <img src="@/assets/developer.png" class="w-1/2">
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
        <el-form :model="form" :rules="rules" ref="formRef" class="w-5/6 md:w-2/5">
          <el-form-item prop="username">
            <!-- 输入框组件 -->
            <el-input size="large" v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" clearable/>
          </el-form-item>
          <el-form-item prop="password">
            <!-- 密码框组件 -->
            <el-input size="large" type="password" v-model="form.password" placeholder="请输入密码"
                      :prefix-icon="Lock" clearable/>
          </el-form-item>
          <el-form-item>
            <!-- 登录按钮，宽度设置为 100% -->
            <el-button class="w-full mt-2" size="large" type="primary" @click="onSubmit">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Lock, User} from "@element-plus/icons-vue";
import {login} from '@/api/admin/user';
import {reactive, ref} from 'vue'
import {useRouter} from 'vue-router';
import type { FormInstance } from 'element-plus'; // 确保导入正确的类型

// 创建表单引用
const formRef = ref<FormInstance | null>(null);

const router = useRouter(); // 获取路由实例
const form = reactive({
  username: '',
  password: ''
});

// 校验规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^[^\s]+$/, message: '用户名不能包含空格', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^[^\s]+$/, message: '密码不能包含空格', trigger: 'blur' }
  ]
};


// 登录
const onSubmit = () => {
  if (formRef.value) {
    formRef.value.validate((valid: boolean) => {
      if (valid) {
        console.log('登录');
        login(form.username.trim(), form.password.trim()).then((res) => {
          console.log(res);
          if (res.data.success == true) {
            router.push('/admin');
          }
        });
      } else {
        console.log('校验失败');
        return false;
      }
    });
  }
};
</script>
