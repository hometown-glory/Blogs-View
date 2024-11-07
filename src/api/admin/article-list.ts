import axios from "@/axios";

// 获取文章分页数据
interface ArticlePageQuery {
    current: number;
    size: number;
    startDate?: string | null;
    endDate?: string | null;
    title?: string;

}

export function getArticlePageList(data: ArticlePageQuery) {
    return axios.post("/admin/article/list", data);
}

// 删除文章
export function deleteArticle(id: number) {
    return axios.post("/admin/article/delete", {id})
}

// 获取分类 select 数据
export function getCategorySelectList() {
    return axios.get("/admin/category/select/list")
}

// 根据标签名模糊查询
export function searchTags(key: string) {
    return axios.post("/admin/tag/search", {key})
}

// 发布文章
interface ArticleData {
    id: number | null;
    title: string;
    content: string;
    cover: string;
    categoryId: number | null;
    tags: string[];
    summary: string;
}

export function publishArticle(data: ArticleData) {
    return axios.post("/admin/article/publish", data)
}

// 获取文章详情
export function getArticleDetail(id:number) {
    return axios.post("/admin/article/detail", {id})
}

// 获取标签 select 列表数据
export function getTagSelectList() {
    return axios.post("/admin/tag/select/list")
}

// 更新文章
interface UpdataArticleData {
    id: number |null;
    title: string;
    content: string;
    cover: string;
    categoryId: number | null;
    tags: string[];
    summary: string;
}
export function updateArticle(data: UpdataArticleData) {
    return axios.post("/admin/article/update", data)
}






