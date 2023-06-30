import axios from '@/axios'
import { queryParams } from '@/composables/util'

// 获取用户列表
export function getUserList(page,query = {

}) {
    let data = queryParams(query)
    return axios.get(`/admin/user/${page}${data}`)
}

// 修改用户状态接口 
export function updateUserStatus(id,status) {
    return axios.post(`/admin/user/${id}/update_status`,{
        status
    })
}

// 新增用户接口
export function createUser(data) {
    return axios.post('/admin/user',data)
}
// 修改用户接口
export function updateUser(id,data) {
    return axios.post(`/admin/user/${id}`,data)
}
// 删除用户接口
export function deleteUser(id) {
    return axios.post(`/admin/user/${id}/delete`)
}