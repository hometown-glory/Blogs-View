import axios from "@/axios";

//登录接口
export const login = (username: string, password:string) => {
  return axios.post("/login", {username,password});
};
// 获取登录用户信息
export function getUserInfo() {
  return axios.post("/admin/user/info")
}

interface UpdatePasswordData {
  username: string;
  password: string;

}

interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}
// 修改用户密码
export async function updateAdminPassword(data: UpdatePasswordData): Promise<UpdatePasswordResponse> {
  try {
    const response = await axios.post<UpdatePasswordResponse>("/admin/password/update", data);
    return response.data;
  } catch (error) {
    // 处理错误
    console.error("Error updating password:", error);
    throw error; // 抛出错误，调用者可以自行处理
  }
}



