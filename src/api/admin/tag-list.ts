import axios from "@/axios";

interface QueryParams {
    current: number;
    size: number;
    startDate?: string | null;
    endDate?: string | null;
    name?: string;
}

// 获取分类分页数据
export function getTagPageList(params: QueryParams) {
    return axios.post("/admin/tag/list", params);
}

interface TagListData {
    tags: string[];
}
// 添加分类
export function addTag(data:TagListData) {
    return axios.post("/admin/tag/add", data)
}


// 删除分类
export function deleteTag(id:number) {
    return axios.post("/admin/tag/delete", {id})
}

