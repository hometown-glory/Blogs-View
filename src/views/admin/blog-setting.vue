<!--博客设置页面-->
<script setup lang="ts">
import {reactive, ref, onMounted} from 'vue'
import {getBlogSettingsDetail,updateBlogSettings} from '@/api/admin/blogsettings'
import {AxiosResponse} from 'axios'
import {Plus} from "@element-plus/icons-vue";
import { uploadFile } from '@/api/admin/file'
import { showMessage } from '@/utils/message'
const btnLoading = ref(false)

// LOGO 图片访问地址
// 是否开启 GitHub
const isGithubChecked = ref(false)
// 是否开启 Gitee
const isGiteeChecked = ref(false)
// 是否开启知乎
const isZhihuChecked = ref(false)
// 是否开启 CSDN
const isCSDNChecked = ref(false)

// 表单对象
const form = reactive({
  name: '',
  author: '',
  logo: '',
  avatar: '',
  introduction: '',
  githubHomepage: '',
  giteeHomepage: '',
  zhihuHomepage: '',
  csdnHomepage: '',
})
// 规则校验
const rules = {
  name: [{required: true, message: '请输入博客名称', trigger: 'blur'}],
  author: [{required: true, message: '请输入作者名', trigger: 'blur'}],
  logo: [{required: true, message: '请上传博客 LOGO', trigger: 'blur'}],
  avatar: [{required: true, message: '请上传作者头像', trigger: 'blur'}],
  introduction: [{required: true, message: '请输入介绍语', trigger: 'blur'}],
}
// 监听 Github Switch 改变事件
const githubSwitchChange = (checked: boolean) => {
  if (!checked) {
    form.githubHomepage = ''
  }
}

// 监听 Gitee Switch 改变事件
const giteeSwitchChange = (checked: boolean) => {
  if (!checked) {
    form.giteeHomepage = ''
  }
}

// 监听知乎 Switch 改变事件
const zhihuSwitchChange = (checked: boolean) => {
  if (!checked) {
    form.zhihuHomepage = ''
  }
}

// 监听 CSDN Switch 改变事件
const csdnSwitchChange = (checked: boolean) => {
  if (!checked) {
    form.csdnHomepage = ''
  }
}

interface BlogSettingsResponse {
  success: boolean;
  message: string | null;
  errorCode: string | null;
  data: BlogSettingsData;
}

interface BlogSettingsData {
  success: boolean;
  name: string;
  author: string;
  logo: string;
  avatar: string;
  introduction: string;
  githubHomepage?: string;
  giteeHomepage?: string;
  zhihuHomepage?: string;
  csdnHomepage?: string;
}

// 初始化博客设置数据，并渲染到页面上
function initBlogSettings() {
  // 请求后台接口
  getBlogSettingsDetail().then((res: AxiosResponse<BlogSettingsResponse>) => {
    console.log(res.data.data); // 输出嵌套的 data 对象
    if (res.data.success) { // 这里判断外层的 success
      const data = res.data.data; // 这个 data 是实际的数据对象
      form.name = data.name;
      form.author = data.author;
      form.logo = data.logo;
      form.avatar = data.avatar;
      form.introduction = data.introduction;

      if (data.githubHomepage) {
        isGithubChecked.value = true;
        form.githubHomepage = data.githubHomepage;
      }
      if (data.giteeHomepage) {
        isGiteeChecked.value = true;
        form.giteeHomepage = data.giteeHomepage;
      }
      if (data.zhihuHomepage) {
        isZhihuChecked.value = true;
        form.zhihuHomepage = data.zhihuHomepage;
      }
      if (data.csdnHomepage) {
        isCSDNChecked.value = true;
        form.csdnHomepage = data.csdnHomepage;
      }
    }
  });
}

// 使用 onMounted 来初始化博客设置数据
onMounted(() => {
  initBlogSettings();
});
// 表单对象类型
interface Form {
  logo: string; // 根据需要添加其他字段
  avatar:string;
}
// 处理文件更改的函数
const handleFileChange = (file: { raw: File }, form: Form) => {
  // 创建 FormData 对象
  const formData = new FormData();
  // 添加 file 字段，并将文件传入
  formData.append('file', file.raw);

  uploadFile(formData).then((response) => {
    const e = response.data;
    // 响应失败，提示错误消息
    if (!e.success) {
      const message = e.message;
      showMessage(message, 'error');
      return;
    }

    // 成功则设置文件 URL，并提示成功
    form.logo = e.data.url; // 如果需要用 URL 来表示文件位置
    showMessage('上传成功');
  }).catch((error) => {
    // 处理请求错误
    showMessage('上传失败，请重试', 'error');
    console.error(error);
  });
};
const handleAvatarChange = (file: { raw: File }, form: Form) => {
  const formData = new FormData();
  formData.append('file', file.raw);

  uploadFile(formData).then((response) => {
    const e = response.data;
    // 响应失败，提示错误消息
    if (!e.success) {
      const message = e.message;
      showMessage(message, 'error');
      return;
    }

    // 成功则设置文件 URL，并提示成功
    form.avatar = e.data.url; // 如果需要用 URL 来表示文件位置
    showMessage('上传成功');
  }).catch((error) => {
    // 处理请求错误
    showMessage('上传失败，请重试', 'error');
    console.error(error);
  });
}
// 表单引用
const formRef = ref()
// 保存当前博客设置
const onSubmit = () => {
  // 先验证 form 表单字段
  formRef.value.validate((valid:boolean) => {
    if (!valid) {
      console.log('表单验证不通过')
      return false
    }

    // 显示保存按钮 loading
    btnLoading.value = true
    updateBlogSettings(form).then((res: AxiosResponse<{ success: boolean, message: string }>) => {
      const data = res.data;
      if (!data.success) {
        let message = data.message;
        showMessage(message, 'error');
        return;
      }
      initBlogSettings();
      showMessage('保存成功');
    }).finally(() => btnLoading.value = false);
  })
}
</script>

<template>
  <el-card shadow="never">
    <el-form ref="formRef" :model="form" label-width="160px" :rules="rules">
      <el-form-item label="博客名称" prop="name">
        <el-input v-model="form.name" clearable/>
      </el-form-item>
      <el-form-item label="作者名" prop="author">
        <el-input v-model="form.author" clearable/>
      </el-form-item>
      <el-form-item label="博客 LOGO" prop="logo">
        <el-upload class="avatar-uploader" action="#"
                   :show-file-list="false" :on-change="handleFileChange" :before-upload="false">
          <img v-if="form.logo" :src="form.logo" class="avatar" alt=""/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="作者头像" prop="avatar">
        <el-upload class="avatar-uploader" action="#"
                   :show-file-list="false" :on-change="handleAvatarChange" :before-upload="false">
          <img v-if="form.avatar" :src="form.avatar" class="avatar" alt=""/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="介绍语" prop="introduction">
        <el-input v-model="form.introduction" type="textarea"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onSubmit">保存</el-button>
      </el-form-item>
      <!-- 开启 Github 访问 -->
      <el-form-item label="开启 GihHub 访问">
        <el-switch v-model="isGithubChecked" inline-prompt :active-icon="Check" :inactive-icon="Close"
                   @change="githubSwitchChange"/>
      </el-form-item>
      <el-form-item label="GitHub 主页访问地址" v-if="isGithubChecked">
        <el-input v-model="form.githubHomepage" clearable placeholder="请输入 GitHub 主页访问的 URL"/>
      </el-form-item>

      <!-- 开启 Gitee 访问 -->
      <el-form-item label="开启 Gitee 访问">
        <el-switch v-model="isGiteeChecked" inline-prompt :active-icon="Check" :inactive-icon="Close"
                   @change="giteeSwitchChange"/>
      </el-form-item>
      <el-form-item label="Gitee 主页访问地址" v-if="isGiteeChecked">
        <el-input v-model="form.giteeHomepage" clearable placeholder="请输入 Gitee 主页访问的 URL"/>
      </el-form-item>

      <!-- 开启知乎访问 -->
      <el-form-item label="开启知乎访问">
        <el-switch v-model="isZhihuChecked" inline-prompt :active-icon="Check" :inactive-icon="Close"
                   @change="zhihuSwitchChange"/>
      </el-form-item>
      <el-form-item label="知乎主页访问地址" v-if="isZhihuChecked">
        <el-input v-model="form.zhihuHomepage" clearable placeholder="请输入知乎主页访问的 URL"/>
      </el-form-item>

      <!-- 开启 CSDN 访问 -->
      <el-form-item label="开启 CSDN 访问">
        <el-switch v-model="isCSDNChecked" inline-prompt :active-icon="Check" :inactive-icon="Close"
                   @change="csdnSwitchChange"/>
      </el-form-item>
      <el-form-item label="CSDN 主页访问地址" v-if="isCSDNChecked">
        <el-input v-model="form.csdnHomepage" clearable placeholder="请输入 CSDN 主页访问的 URL"/>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
/* 解决 textarea :focus 状态下，边框消失的问题 */
.el-textarea__inner:focus {
  outline: 0 !important;
  box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset !important;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  width: 140px; /* 确保宽度足够大以显示边框 */
  height: 140px; /* 可根据需要调整高度 */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  object-fit: cover;
}
</style>
