import axios from "@/axios";

// 获取文章归档分页数据
interface ArchivePage {
    size: number;
    current: number;
}
export function getArchivePageList(data: ArchivePage) {
    return axios.post("/archive/list", data)
}
