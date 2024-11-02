import { ElMessage, ElMessageBox } from "element-plus";
import type { EpPropMergeType } from 'element-plus/es/utils';

// 定义类型
type MessageType = EpPropMergeType<StringConstructor, 'success' | 'warning' | 'info' | 'error', unknown>;

export function showMessage(message = '提示内容', type: MessageType = 'success', customClass = '') {
    return ElMessage({
        type: type,
        message,
        customClass,
    });
}

// 弹出确认框
export function showModel(content = '提示内容', type: MessageType = 'warning', title = '') {
    return ElMessageBox.confirm(
        content,  // 确保这是一个字符串
        title,    // 确保这是一个字符串
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type, // 确保这是 'success'|'warning'|'info'|'error'
        }
    );
}
