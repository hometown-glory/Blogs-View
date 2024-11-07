<!--文章列表-->
<script setup lang="ts">
import {Delete, Edit, EditPen, Plus, Promotion, RefreshRight, Search} from "@element-plus/icons-vue";
import {
  getArticlePageList,
  deleteArticle,
  getCategorySelectList,
  searchTags,
  publishArticle,
  getArticleDetail,
  getTagSelectList,
  updateArticle
} from '@/api/admin/article-list'
import {ref, reactive, onMounted} from 'vue';
import moment from 'moment'
import {showMessage, showModel} from "@/utils/message";
import {MdEditor} from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import {uploadFile} from "@/api/admin/file";
import {AxiosResponse} from "axios";
import type {FormInstance} from 'element-plus';

const tableLoading = ref(false)

// 分页查询的分类名称
const searchArticleTitle = ref('')
// 日期
const pickDate = ref('')
// 查询条件：开始结束时间
const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);

type DateRange = [Date | string, Date | string];

const datepickerChange = (e: DateRange) => {
  startDate.value = moment(e[0]).format('YYYY-MM-DD');
  endDate.value = moment(e[1]).format('YYYY-MM-DD');

  console.log('开始时间：' + startDate.value + ', 结束时间：' + endDate.value);
}

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

// 重置
const reset = () => {
  pickDate.value = ''
  startDate.value = null
  endDate.value = null
  searchArticleTitle.value = ''
}

// 当前页码，给了一个默认值 1
const current = ref(1)
// 总数据量，给了个默认值 0
const total = ref(0)
// 每页显示的数据量，给了个默认值 10
const size = ref(10)

const tableData = ref([])

// 获取分页数据
function getTableData() {
  // 显示表格 loading
  tableLoading.value = true
  // 调用后台分页接口，并传入所需参数
  getArticlePageList({
    current: current.value,
    size: size.value,
    startDate: startDate.value,
    endDate: endDate.value,
    title: searchArticleTitle.value
  })
      .then((res) => {
        console.log(res)
        if (res.data.success) {
          tableData.value = res.data.data
          current.value = res.data.current
          size.value = res.data.size
          total.value = res.data.total
        }
      })
      .finally(() => tableLoading.value = false) // 隐藏表格 loading
}

getTableData()

// 删除文章
interface ArticleRow {
  id: number
}

const deleteCategorySubmit = (row: ArticleRow) => {
  console.log('文章id' + row.id)
  showModel('确定删除该分类吗？', 'warning', '删除分类').then(() => {
    deleteArticle(row.id).then((res) => {
      if (res.data.success) {
        showMessage('删除成功', 'success')
        getTableData()
      } else {
        showMessage(res.data.message, 'error')
      }
    })
  })
}


// 是否显示文章发布对话框
const isArticlePublishEditorShow = ref(false)
// 发布文章表单引用
const publishArticleFormRef = ref<FormInstance | null>(null);

// 表单对象
const form = reactive({
  id: null,
  title: '',
  content: '请输入内容',
  cover: '',
  categoryId: null,
  tags: [],
  summary: ""
})

// 表单校验规则
const rules = {
  title: [
    {required: true, message: '请输入文章标题', trigger: 'blur'},
    {min: 1, max: 40, message: '文章标题要求大于1个字符，小于40个字符', trigger: 'blur'},
  ],
  content: [{required: true}],
  cover: [{required: true}],
  categoryId: [{required: true, message: '请选择文章分类', trigger: 'blur'}],
  tags: [{required: true, message: '请选择文章标签', trigger: 'blur'}],
}

// 处理封面更改的函数
const handleCoverChange = async (file: { raw: File }): Promise<void> => {
  try {
    // 创建 FormData 对象
    const formData = new FormData();
    formData.append('file', file.raw);

    // 调用上传文件的函数
    const response: AxiosResponse = await uploadFile(formData);

    // 检查响应是否成功
    if (response.data.success) {
      form.cover = response.data.data.url; // 直接更新响应式form对象的cover字段
      console.log('封面上传成功', form.cover);
      showMessage('上传成功');
    } else {
      const message = response.data.message || '上传失败，请重试。';
      showMessage(message, 'error');
    }
  } catch (error) {
    // 处理请求错误
    console.error('上传过程中出现错误:', error);
    showMessage('上传失败，请重试。', 'error');
  }
};

// 编辑器图片上传
const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  await Promise.all(
      files.map((file) => {
        return new Promise<void>((resolve, reject) => {
          console.log('==> 编辑器开始上传文件...');
          let formData = new FormData();
          formData.append("file", file);

          uploadFile(formData).then((response) => {
            // response.data 是实际的响应体
            const resData = response.data;
            if (resData.success && resData.data.url) {
              console.log('访问路径：' + resData.data.url);
              callback([resData.data.url]); // 使用 resData.data.url
              resolve();
            } else {
              console.error('上传失败：' + resData.message);
              reject(new Error('上传失败：' + resData.message));
            }
          }).catch((error) => {
            console.error('上传错误:', error);
            reject(error);
          });
        });
      })
  );
};

//文章分类
const categories = ref([]);

onMounted(() => {
  getCategorySelectList()
      .then((response) => {
        console.log('获取分类数据', response.data);
        if (response.data.success) {
          categories.value = response.data.data;
        } else {
          console.error('获取分类数据失败:', response.data.message);
        }
      })
      .catch((error) => {
        console.error('请求失败:', error);
      });
});

// 标签 select Loading 状态，默认不显示
const tagSelectLoading = ref(false)
// 文章标签
const tags = ref([])
// 渲染标签数据
getTagSelectList().then(res => {
  tags.value = res.data.data
})
// 根据用户输入的标签名称，远程模糊查询
const remoteMethod = (query: string) => {
  console.log('远程搜索：' + tags.value)
  // 如果用户的查询关键词不为空
  if (query) {
    // 显示 loading
    tagSelectLoading.value = true
    // 调用标签模糊查询接口
    searchTags(query)
        .then((e) => {
          if (e.data.success && Array.isArray(e.data.data)) {
            tags.value = e.data.data;
          } else {
            tags.value = [];
            console.error('无法获取标签列表');
          }
        })
        .catch((error) => {
          tags.value = [];
          console.error('请求失败:', error);
        })
        .finally(() => {
          tagSelectLoading.value = false;
        });

  }
}

// 发布文章
const publishArticleSubmit = () => {
  console.log('提交 md 内容：' + form.content)
  // 校验表单
  publishArticleFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      showMessage('表单验证失败，请检查输入项。', 'error');
      return;
    }

    publishArticle(form).then((res) => {
      if (!res.data.success) {
        // 获取服务端返回的错误消息
        let message = res.data.message
        // 提示错误消息
        showMessage(message, 'error')
        return
      }

      showMessage('发布成功')
      // 隐藏发布文章对话框
      isArticlePublishEditorShow.value = false
      // 将 form 表单字段置空
      form.title = ''
      form.content = ''
      form.cover = ''
      form.summary = ''
      form.categoryId = null
      form.tags = []
      // 重新请求分页接口，渲染列表数据
      getTableData()
    })
  })
}

//文章编辑
// 是否显示编辑文章对话框
const isArticleUpdateEditorShow = ref(false)
// 编辑文章表单引用
const updateArticleFormRef = ref<FormInstance | null>(null);

// 修改文章表单对象
const updateArticleForm = reactive({
  id: null,
  title: '',
  content: '请输入内容',
  cover: '',
  categoryId: null,
  tags: [],
  summary: ""
})
// 编辑文章：上传文章封面图片
const handleUpdateCoverChange = async (file: { raw: File }): Promise<void> => {
  try {
    // 表单对象
    let formData = new FormData()
    // 添加 file 字段，并将文件传入
    formData.append('file', file.raw)
    const res: AxiosResponse = await uploadFile(formData);

    //检查响应是否成功
    if (res.data.success) {
      updateArticleForm.cover = res.data.data.url
      console.log(updateArticleForm.cover)
      showMessage('上传成功')
    } else {
      const message = res.data.message
      showMessage(message, 'error')
    }
  } catch (error) {
    //处理错误请求
    console.log('上传过程中错误', error)
    showMessage('上传失败，请重试', 'error')
  }
}

interface ArticleDetail {
  id: number
}

//编辑博客内容
const showArticleUpdateEditor = (row: ArticleDetail) => {
  // 显示编辑文章对话框
  isArticleUpdateEditorShow.value = true
  // 拿到文章 ID
  let articleId = row.id
  getArticleDetail(articleId).then((res) => {
    if (res.data.success) {
      // 设置表单数据
      updateArticleForm.id = res.data.data.id
      updateArticleForm.title = res.data.data.title
      updateArticleForm.cover = res.data.data.cover
      updateArticleForm.content = res.data.data.content
      updateArticleForm.categoryId = res.data.data.categoryId
      updateArticleForm.tags = res.data.data.tagIds
      updateArticleForm.summary = res.data.data.summary
    }
  })
}

// 保存文章
const updateSubmit = () => {
  updateArticleFormRef.value?.validate((valid :boolean) => {
    // 校验表单
    if (!valid) {
      return
    }
    // 请求更新文章接口
    updateArticle(updateArticleForm).then((res) => {
      if (!res.data.success) {
        // 获取服务端返回的错误消息
        let message = res.data.message
        // 提示错误消息
        showMessage(message, 'error')
        return
      }

      showMessage('保存成功')
      // 隐藏编辑框
      isArticleUpdateEditorShow.value = false
      // 重新请求分页接口，渲染列表数据
      getTableData()
    })
  })
}

// 每页展示数量变更事件
const handleSizeChange = (chooseSize: number) => {
  console.log('选择的页码' + chooseSize)
  size.value = chooseSize
  getTableData()
}
</script>

<template>
  <div>
    <el-card shadow="never" class="mb-5">
      <!-- flex 布局，内容垂直居中 -->
      <div class="flex items-center">
        <el-text>分类名称</el-text>
        <div class="ml-3 w-52 mr-5">
          <el-input v-model="searchCategoryName" placeholder="请输入（模糊查询）"/>
        </div>

        <el-text>创建日期</el-text>
        <div class="ml-3 w-30 mr-5">
          <!-- 日期选择组件（区间选择） -->
          <el-date-picker v-model="pickDate" type="daterange" range-separator="至" start-placeholder="开始时间"
                          end-placeholder="结束时间" :shortcuts="shortcuts" size="default" @change="datepickerChange"/>
        </div>

        <el-button type="primary" class="ml-3" :icon="Search" @click="getTableData">查询</el-button>
        <el-button class="ml-3" :icon="RefreshRight" @click="reset">重置</el-button>
      </div>
    </el-card>

    <el-card shadow="never">
      <!-- 写文章按钮 -->
      <div class="mb-5">
        <el-button type="primary" @click="isArticlePublishEditorShow = true">
          <el-icon class="mr-1">
            <EditPen/>
          </el-icon>
          写文章
        </el-button>
      </div>

      <!-- 分页列表 -->
      <el-table :data="tableData" border stripe style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="title" label="标题" width="180"/>
        <el-table-column prop="cover" label="封面" width="180">
          <template #default="scope">
            <el-image style="width: 50px;" :src="scope.row.cover"/>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="发布时间" width="180"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="showArticleUpdateEditor(scope.row)">
              <el-icon class="mr-1">
                <Edit/>
              </el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteCategorySubmit(scope.row)">
              <el-icon class="mr-1">
                <Delete/>
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="mt-10 flex justify-center">
        <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="[10, 20, 50]"
                       :small="false" :background="true" layout="total, sizes, prev, pager, next, jumper"
                       :total="total" @size-change="handleSizeChange" @current-change="getTableData"/>
      </div>
    </el-card>
  </div>

  <!-- 写博客 -->
  <el-dialog v-model="isArticlePublishEditorShow" :fullscreen="true" :show-close="false">
    <template #header="{ close, titleId, titleClass }">
      <!-- 固钉组件，固钉到顶部 -->
      <el-affix :offset="0" style="width: 100%;">
        <!-- 指定 flex 布局， 高度为 10， 背景色为白色 -->
        <div class="flex h-10 bg-white">
          <!-- 字体加粗 -->
          <h4 :id="titleId" :class="[titleClass, 'font-bold']">写文章</h4>
          <!-- 靠右对齐 -->
          <div class="ml-auto flex">
            <el-button @click="isArticlePublishEditorShow = false">取消</el-button>
            <el-button type="primary" @click="publishArticleSubmit (close)">
              <el-icon class="mr-1">
                <Promotion/>
              </el-icon>
              发布
            </el-button>
          </div>
        </div>
      </el-affix>
    </template>
    <!-- label-position="top" 用于指定 label 元素在上面 -->
    <el-form :model="form" ref="publishArticleFormRef" label-position="top" size="large" :rules="rules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" autocomplete="off" size="large" maxlength="40" show-word-limit
                  clearable/>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <!-- Markdown 编辑器 -->
        <MdEditor v-model="form.content" @onUploadImg="onUploadImg" editorId="publishArticleEditor"/>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-upload class="avatar-uploader" action="#" :on-change="handleCoverChange" :auto-upload="false"
                   :show-file-list="false">
          <img v-if="form.cover" :src="form.cover" class="avatar" alt=""/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="摘要" prop="summary">
        <!-- :rows="3" 指定 textarea 默认显示 3 行 -->
        <el-input v-model="form.summary" :rows="3" type="textarea" placeholder="请输入文章摘要"/>
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="form.categoryId" clearable placeholder="---请选择---" size="large">
          <el-option
              v-for="item in categories"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <!-- 标签选择 -->
        <el-select v-model="form.tags" multiple filterable remote reserve-keyword placeholder="请输入文章标签"
                   remote-show-suffix allow-create default-first-option :remote-method="remoteMethod"
                   :loading="tagSelectLoading"
                   size="large">
          <el-option v-for="item in tags" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      2
    </el-form>
  </el-dialog>

  <!-- 编辑博客 -->
  <el-dialog v-model="isArticleUpdateEditorShow" :fullscreen="true" :show-close="false"
             :close-on-press-escape="false">
    <template #header="{ close, titleId, titleClass }">
      <!-- 固钉组件，固钉到顶部 -->
      <el-affix :offset="20" style="width: 100%;">
        <!-- 指定 flex 布局， 高度为 10， 背景色为白色 -->
        <div class="flex h-10 bg-white">
          <!-- 字体加粗 -->
          <h4 :id="titleId" :class="[titleClass, 'font-bold']">编辑文章</h4>
          <!-- 靠右对齐 -->
          <div class="ml-auto flex">
            <el-button @click="isArticleUpdateEditorShow = false">取消</el-button>
            <el-button type="primary" @click="updateSubmit(close)">
              <el-icon class="mr-1">
                <Promotion/>
              </el-icon>
              保存
            </el-button>
          </div>
        </div>
      </el-affix>
    </template>
    <!-- label-position="top" 用于指定 label 元素在上面 -->
    <el-form :model="updateArticleForm" ref="updateArticleFormRef" label-position="top" size="large" :rules="rules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="updateArticleForm.title" autocomplete="off" size="large" maxlength="40"
                  show-word-limit clearable/>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <!-- Markdown 编辑器 -->
        <MdEditor v-model="updateArticleForm.content" @onUploadImg="onUploadImg"
                  editorId="updateArticleEditor"/>
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-upload class="avatar-uploader" action="#" :on-change="handleUpdateCoverChange" :auto-upload="false"
                   :show-file-list="false">
          <img v-if="updateArticleForm.cover" :src="updateArticleForm.cover" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="摘要" prop="summary">
        <!-- :rows="3" 指定 textarea 默认显示 3 行 -->
        <el-input v-model="updateArticleForm.summary" :rows="3" type="textarea" placeholder="请输入文章摘要"/>
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="updateArticleForm.categoryId" clearable placeholder="---请选择---" size="large">
          <el-option v-for="item in categories" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
                    <span class="w-60">
                        <!-- 标签选择 -->
                        <el-select v-model="updateArticleForm.tags" multiple filterable remote reserve-keyword
                                   placeholder="请输入文章标签" remote-show-suffix allow-create default-first-option
                                   :remote-method="remoteMethod" :loading="tagSelectLoading" size="large">
                            <el-option v-for="item in tags" :key="item.value" :label="item.label" :value="item.value"/>
                        </el-select>
                    </span>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
/* 封面图片样式 */
.avatar-uploader {
  width: 150px;
  height: 150px;
  border: 1px solid #8f8f8f;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 15px;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 50px;
  color: #999;
}

.md-editor-footer {
  height: 40px;
}
</style>
