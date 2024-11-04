<template>
  <el-dialog v-model="dialogVisible" :title="title" :width="width"
             :destroy-on-close="destroyOnClose"
             :draggable="true" :close-on-click-modal="false"
             :close-on-press-escape="false">
    <!-- 插槽 -->
    <slot></slot>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">
          {{ computedConfirmText }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, defineExpose, computed } from 'vue';

// 为 props 定义类型接口
interface DialogProps {
  title: string;
  width: string;
  destroyOnClose: boolean;
  confirmText?: string; // 变为可选类型
}

// 使用类型定义 props
const props = defineProps<DialogProps>();

// 计算属性来提供默认值
const computedConfirmText = computed(() => props.confirmText ?? '提交');

// 定义对话框的可见性
const dialogVisible = ref(false);

// 定义 emit 方法和事件
const emit = defineEmits(['submit']);
const submit = () => emit('submit');

// 对外暴露 open 和 close 方法
const open = () => (dialogVisible.value = true);
const close = () => (dialogVisible.value = false);

// 确认按钮加载 loading
const btnLoading = ref(false)
// 显示 loading
const showBtnLoading = () => btnLoading.value = true
// 隐藏 loading
const closeBtnLoading = () => btnLoading.value = false

defineExpose({
  open,
  close,
  showBtnLoading,
  closeBtnLoading
});
</script>
