import axios from "@/axios";

// 获取文章列表
interface ArticlePage {
    current: number;
    size: number;
    title?: string,
    startData?: string | null,
    endData?: string | null

}

export function getArticlePageList(data : ArticlePage) {
    return axios.post("/article/list", data)
}

// 获取文章详情
export function getArticleDetail(articleId:number) {
    return axios.post("/article/detail", {articleId})
}




