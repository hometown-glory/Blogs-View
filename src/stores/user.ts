import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getUserInfo } from '@/api/admin/user';
import { removeToken } from "@/utils/cookie";

interface UserInfo {
    username: string;
}

// 使用 defineStore 创建用户 store
export const useUserStore = defineStore('user', () => {
    // 用户信息，初始值为 null
    const userInfo = ref<UserInfo | null>(null);

    // 设置用户信息
    function setUserInfo() {
        // 调用后端获取用户信息接口
        getUserInfo().then((response) => {
            const res = response.data;
            if (res.success) {
                userInfo.value = res.data;
            }
        });
    }

    // 退出登录
    function logout() {
        removeToken();
        userInfo.value = null;
    }

    // 返回 store 的状态和方法
    return { userInfo, setUserInfo, logout };
}, {
    // 持久化
    persist: true
});
