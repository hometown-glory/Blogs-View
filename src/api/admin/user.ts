import axios from "@/axios";

//登录接口
export const login = (username: string, password:string) => {
  return axios.post("/login", {username,password});
};
