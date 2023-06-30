import { useCookies } from "@vueuse/integrations/useCookies";
// VueUse里面的cookie方法，能方便把token存到cookie里面，还有set，get等方法方便处理token
const cookie = useCookies();
// 定义token的Key
const TokenKey = "admin-token";
// 调用cookie的set方法，存储token
export function setToken(token) {
    return cookie.set(TokenKey, token);
}
// 调用get方法，获取对应key的token
export function getToken() {
    return cookie.get(TokenKey);
}
// 调用remove删除对应key的token
export function removeToken() {
    return cookie.remove(TokenKey);
}
