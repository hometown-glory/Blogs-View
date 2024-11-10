import axios from "@/axios";

// 获取标签列表
interface TagList {
    current: number;
    size: number;
    startDate?: string | null;
    endDate?: string | null;
    name?: string;
}

export function getTagList(data: TagList) {
    return axios.post("/tag/list", data)
}

// 获取标签下文章列表
interface TagArticleList {
    current: number;
    size: number;
    id: number
}

export function getTagArticlePageList(data: TagArticleList) {
    return axios.post("/tag/article/list", data)
}
