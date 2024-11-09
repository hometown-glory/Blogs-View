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
