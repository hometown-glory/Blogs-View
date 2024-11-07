import axios from "@/axios";
import {AxiosResponse} from "axios";

// 上传文件函数
export function uploadFile(form: FormData): Promise<AxiosResponse<{ success: boolean; message: string; data: { url: string } }>> {
    return axios.post("/admin/file/upload", form);
}
