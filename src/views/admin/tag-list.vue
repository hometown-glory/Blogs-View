<!--标签管理页面-->
<script setup lang="ts">
import { Delete, Plus, RefreshRight, Search } from "@element-plus/icons-vue";
import FormDialog from "@/components/FormDialog.vue";
import { ref, reactive, nextTick } from 'vue';
import moment from 'moment';
import { getTagPageList, addTag, deleteTag } from "@/api/admin/tag-list";
import { AxiosResponse } from "axios";
import { showMessage, showModel } from "@/utils/message";

// 定义接口以描述后端返回的数据结构
interface Tag {
  id: number;
  name: string;
}

interface PaginationResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  current: number;
  size: number;
  total: number;
}

interface AddCategoryResponse {
  success: boolean;
  message: string;
}

// 分页查询的标签名称
const searchTagName = ref<string>('');
// 日期
const pickDate = ref<DateRange | ''>('');

// 查询条件：开始结束时间
const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);

// 日期范围类型
type DateRange = [Date | string, Date | string];

const datepickerChange = (e: DateRange) => {
  startDate.value = moment(e[0]).format('YYYY-MM-DD');
  endDate.value = moment(e[1]).format('YYYY-MM-DD');
  console.log('开始时间：' + startDate.value + ', 结束时间：' + endDate.value);
};

const shortcuts = [
  {
    text: '最近一周',
    value: (): DateRange => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: '最近一个月',
    value: (): DateRange => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: '最近三个月',
    value: (): DateRange => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];

// 表格加载 Loading
const tableLoading = ref<boolean>(false);
// 表格数据
const tableData = ref<Tag[]>([]);
// 当前页码
const current = ref<number>(1);
// 总数据量
const total = ref<number>(0);
// 每页显示的数据量
const size = ref<number>(10);

// 获取分页数据
function getTableData() {
  tableLoading.value = true;
  getTagPageList({
    current: current.value,
    size: size.value,
    startDate: startDate.value,
    endDate: endDate.value,
    name: searchTagName.value
  })
      .then((response: AxiosResponse<PaginationResponse<Tag>>) => {
        const res = response.data;

        if (res.success) {
          console.log('成功获取数据:', res.data);
          tableData.value = res.data;
          current.value = res.current;
          size.value = res.size;
          total.value = res.total;
        } else {
          console.error('请求失败:', res.message || '未知错误');
        }
      })
      .catch((error) => {
        console.error('请求错误:', error);
      })
      .finally(() => tableLoading.value = false);
}
getTableData();

// 每页展示数量变更事件
const handleSizeChange = (chooseSize: number) => {
  console.log('选择的页码' + chooseSize);
  size.value = chooseSize;
  getTableData();
};

// 弹窗表单对象
const formDialogRef = ref<InstanceType<typeof FormDialog> | null>(null);

// 新增分类按钮点击事件
const addCategoryBtnClick = () => {
  formDialogRef.value?.open();
};

// 重置查询条件
const reset = () => {
  searchTagName.value = '';
  pickDate.value = '';
  startDate.value = null;
  endDate.value = null;
};

// 表单引用
const formRef = ref<{ validate: (callback: (valid: boolean) => void) => void } | null>(null);

// 修改用户密码表单对象
interface TagListForm {
  tags: string[]; // 假设 `tags` 是一个字符串数组
}

const form = reactive<TagListForm>({
  tags: []
});

const onSubmit = () => {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) {
      console.log('表单验证不通过');
      return;
    }
    formDialogRef.value?.showBtnLoading();
    form.tags = dynamicTags.value;
    addTag(form).then((res: AxiosResponse<AddCategoryResponse>) => {
      if (res.data.success) {
        showMessage('添加成功');
        form.tags = [];
        dynamicTags.value = [];
        formDialogRef.value?.close();
        getTableData();
      } else {
        showMessage(res.data.message, 'error');
      }
    }).finally(() => formDialogRef.value?.closeBtnLoading());
  });
};

// 删除分类
const deleteCategorySubmit = (row: Tag) => {
  console.log(row.id);
  showModel('是否确定要删除该分类？').then(() => {
    deleteTag(row.id).then((res: AxiosResponse<AddCategoryResponse>) => {
      if (res.data.success) {
        showMessage('删除成功');
        getTableData();
      } else {
        showMessage(res.data.message, 'error');
      }
    });
  }).catch(() => {
    console.log('取消了');
  });
};

// 标签输入框值
const inputValue = ref<string>('');
// 已输入的标签数组
const dynamicTags = ref<string[]>([]);
// 标签输入框是否显示
const inputVisible = ref<boolean>(false);
// 标签输入框的引用
const InputRef = ref<{ input: { focus: () => void } } | null>(null);

const handleClose = (tag: string) => {
  const index = dynamicTags.value.indexOf(tag);
  if (index > -1) {
    dynamicTags.value.splice(index, 1);
  }
};

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value?.input.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};
</script>

<template>
  <div>
    <!-- 表头标签查询条件， shadow="never" 指定 card 卡片组件没有阴影 -->
    <el-card shadow="never" class="mb-5">
      <!-- flex 布局，内容垂直居中 -->
      <div class="flex items-center">
        <el-text>标签名称</el-text>
        <div class="ml-3 w-52 mr-5">
          <el-input v-model="searchTagName" placeholder="请输入（模糊查询）"/>
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
      <!-- 新增按钮 -->
      <div class="mb-5">
        <el-button type="primary" @click="addCategoryBtnClick">
          <el-icon class="mr-1">
            <Plus/>
          </el-icon>
          新增
        </el-button>
      </div>

      <!-- 标签列表 -->
      <el-table :data="tableData" border stripe style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="name" label="标签名称" width="180">
          <template #default="scope">
            <el-tag class="ml-2" type="success">{{ scope.row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="分类名称" width="180"/>
        <el-table-column prop="createTime" label="创建时间" width="180"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
                type="danger"
                size="small"
                @click="deleteCategorySubmit(scope.row)"
            >
              <el-icon class="mr-1">
                <Delete/>
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 标签 -->
      <div class="mt-10 flex justify-center">
        <el-pagination v-model:current-page="current" v-model:page-size="size" :page-sizes="[10, 20, 50]"
                       :small="false" :background="true" layout="total, sizes, prev, pager, next, jumper"
                       :total="total" @size-change="handleSizeChange" @current-change="getTableData"/>
      </div>
    </el-card>
  </div>

  <!--添加标签-->
  <FormDialog ref="formDialogRef" title="添加文章标签" destroyOnClose @submit="onSubmit">
    <el-form ref="formRef" :model="form">
      <el-form-item prop="tags">
        <el-tag v-for="tag in dynamicTags" :key="tag" class="mx-1" closable :disable-transitions="false"
                @close="handleClose(tag)">
          {{ tag }}
        </el-tag>
        <span class="w-20">
      <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="ml-1 w-20" size="small"
                @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
      <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
        + 新增标签
      </el-button>
    </span>
      </el-form-item>
    </el-form>
  </FormDialog>
</template>

<style scoped>

</style>
