import axios from "@/axios";

// 获取分类列表
interface CategoryList {
    current: number;
    size: number;
    startDate?: string | null;
    endDate?: string | null;
    name?: string;
}
export function getCategoryList(data: CategoryList) {
    return axios.post("/category/list", data)
}

// 获取分类-文章列表
interface CategoryArticleList {
    current: number;
    size: number;
    categoryId: number;
    id?: number | null;
}
export function getCategoryArticlePageList(data:CategoryArticleList) {
    return axios.post("/category/article/list", data)
}
