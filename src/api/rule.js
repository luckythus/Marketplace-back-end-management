import axios from "@/axios";

// 获取权限菜单列表的接口
export function getRuleList(page) {
    return axios.get(`/admin/rule/${page}`);
}

// 增加权限菜单的接口
export function createRule(data) {
    return axios.post("/admin/rule", data);
}

// 修改权限菜单接口
export function updateRule(id, data) {
    return axios.post("/admin/rule/" + id, data);
}

// 删除权限菜单接口
export function deleteRule(id) {
    return axios.post(`/admin/rule/${id}/delete`);
}
// 修改菜单权限状态接口 
export function updateRuleStatus(id,status) {
    return axios.post(`/admin/rule/${id}/update_status`,{
        status
    })
}