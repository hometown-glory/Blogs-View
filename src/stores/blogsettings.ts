import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getBlogSettingsDetail } from "@/api/fronted/blogsettings";

export const useBlogSettingsStore = defineStore('blogsettings', () => {
    // 博客设置信息
    interface BlogSettingsData {
        author: string;
        avatar: string;
        csdnHomepage: string;
        giteeHomepage: string;
        githubHomepage: string;
        introduction: string;
        logo: string;
        name: string;
        zhihuHomepage: string;
    }

    interface BlogSettingsResponse {
        success: boolean;
        message: string | null;
        errorCode: string | null;
        data: BlogSettingsData;
    }

    const blogSettings = ref<BlogSettingsResponse | null>(null)

    // 获取博客设置信息
    function getBlogSettings() {
        console.log('获取博客设置信息')
        getBlogSettingsDetail().then(res => {
            if (res.data.success) {
                blogSettings.value = res.data
            }
        })
    }

    return { blogSettings, getBlogSettings }
})
