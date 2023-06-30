import axios from "@/axios";

// 获取角色列表的接口
export function getUserLevelList(page) {
    return axios.get(`/admin/user_level/${page}`);
}

// 增加角色的接口
export function createUserLevel(data) {
    return axios.post("/admin/user_level", data);
}

// 修改角色接口
export function updateUserLevel(id, data) {
    return axios.post("/admin/user_level/" + id, data);
}

// 删除角色接口
export function deleteUserLevel(id) {
    return axios.post(`/admin/user_level/${id}/delete`);
}
// 修改菜单权限状态接口 
export function updateUserLevelStatus(id,status) {
    return axios.post(`/admin/user_level/${id}/update_status`,{
        status
    })
}
