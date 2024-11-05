import axios from "@/axios";

// 获取博客设置详情

export function getBlogSettingsDetail() {
    return axios.post("/admin/blog/settings/detail")
}


// 更新博客设置

// 定义数据接口
interface BlogSettings {
    logo: string;
    name: string;
    author: string;
    introduction: string;
    avatar: string;
    githubHomepage: string;
    csdnHomepage: string;
}
export function updateBlogSettings(data:BlogSettings) {
    return axios.post("/admin/blog/settings/update", data)
}

