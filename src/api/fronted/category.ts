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
