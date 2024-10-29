import { ElMessage } from "element-plus";
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
