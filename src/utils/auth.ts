import { useCookies } from '@vueuse/integrations/useCookies'

// 存储在 Cookie 中的 Token 的 key
const TOKEN_KEY = 'Authorization'
const cookie = useCookies()

// 获取 Token 值
export function getToken(): string | undefined {
    return cookie.get(TOKEN_KEY)
}

// 设置 Token 到 Cookie 中
export function setToken(token: string): void {
    return cookie.set(TOKEN_KEY, token)
}

// 删除 Token
export function removeToken(): void {
    return cookie.remove(TOKEN_KEY)
}
