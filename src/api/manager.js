import axios from '@/axios'
import { queryParams } from '@/composables/util'

// 管理员登录接口
export function login(username,password) {
    return axios.post('/admin/login', { username, password })
}

// 获取管理员信息和权限菜单
export function getInfo() {
    return axios.post('/admin/getinfo')
}

// 退出登录接口
export function logout() {
    return axios.post('/admin/logout')
}

// 修改密码接口
export function updatePassword(data) {
    return axios.post('/admin/updatepassword',data)
}

// 获取管理员列表
export function getManagerList(page,query = {

}) {
    let data = queryParams(query)
    return axios.get(`/admin/manager/${page}${data}`)
}

// 修改管理员状态接口 
export function updateManagerStatus(id,status) {
    return axios.post(`/admin/manager/${id}/update_status`,{
        status
    })
}

// 新增管理员接口
export function createManager(data) {
    return axios.post('/admin/manager',data)
}
// 修改管理员接口
export function updateManager(id,data) {
    return axios.post(`/admin/manager/${id}`,data)
}
// 删除管理员接口
export function deleteManager(id) {
    return axios.post(`/admin/manager/${id}/delete`)
}