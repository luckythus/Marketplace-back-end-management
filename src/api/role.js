import axios from "@/axios";

// 获取角色列表的接口
export function getRoleList(page) {
    return axios.get(`/admin/role/${page}`);
}

// 增加角色的接口
export function createRole(data) {
    return axios.post("/admin/role", data);
}

// 修改角色接口
export function updateRole(id, data) {
    return axios.post("/admin/role/" + id, data);
}

// 删除角色接口
export function deleteRole(id) {
    return axios.post(`/admin/role/${id}/delete`);
}
// 修改菜单权限状态接口 
export function updateRoleStatus(id,status) {
    return axios.post(`/admin/role/${id}/update_status`,{
        status
    })
}
// 配置权限接口           id是当前的角色，rule_ids是拥有的权限ID，一个一维数组
export function setRoleRules(id,rule_ids) {
    return axios.post('/admin/role/set_rules',{
        id,rule_ids
    })
}
