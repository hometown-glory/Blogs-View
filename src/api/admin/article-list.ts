import axios from "@/axios";

// 获取文章分页数据
interface ArticlePageQuery {
    current: number;
    size: number;
    startDate?: string | null;
    endDate?: string | null;
    title?: string;

}

interface Article {
    id: number;
    title: string;
    cover: string;
    createTime: string;
}

interface ArticlePageResponse {
    success: boolean;
    message: string | null;
    errorCode: string | null;
    data: Article[];
    total: number;
    size: number;
    current: number;
    pages: number;
}

export function getArticlePageList(data: ArticlePageQuery) {
    return axios.post("/admin/article/list", data);
}

// 删除文章
export function deleteArticle(id:number) {
    return axios.post("/admin/article/delete", {id})
}

