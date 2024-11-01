import { useCookies } from '@vueuse/integrations/useCookies';

const cookie = useCookies(); // 只声明一次

// ============================== Token 令牌 ==============================
// 存储在 Cookie 中的 Token 的 key
const TOKEN_KEY = 'Authorization';

// 获取 Token 值
export function getToken(): string | undefined {
    return cookie.get(TOKEN_KEY);
}

// 设置 Token 到 Cookie 中
export function setToken(token: string): void {
    return cookie.set(TOKEN_KEY, token);
}

// 删除 Token
export function removeToken(): void {
    return cookie.remove(TOKEN_KEY);
}

// ==============================  标签页  ==============================
// 存储在 Cookie 中的标签页数据的 key
const TAB_LIST_KEY = 'tabList';

// 定义 Tab 接口
export interface Tab {
    path: string;
    title: string;
}

// 获取 TabList
export function getTabList(): Tab[] {
    const tabs = cookie.get(TAB_LIST_KEY);
    // 确保返回类型为 Tab[]
    return Array.isArray(tabs) ? tabs : [];
}

// 存储 TabList 到 Cookie 中
export function setTabList(tabList: Tab[]): void {
    // 将 tabList 转换为字符串并存储
    cookie.set(TAB_LIST_KEY, JSON.stringify(tabList));
}
