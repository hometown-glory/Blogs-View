import axios from "@/axios";

interface QueryParams {
    current: number;
    size: number;
    startDate?: string | null;
    endDate?: string | null;
    name?: string;
}

// 获取分类分页数据
export function getCategoryPageList(params: QueryParams) {
    return axios.post("/admin/category/list", params);
}

interface CategoryData {
    tags: string;
}
// 添加分类
export function addCategory(data:CategoryData) {
    return axios.post("/admin/category/add", data)
}


// 删除分类
export function deleteCategory(id:number) {
    return axios.post("/admin/category/delete", {id})
}
