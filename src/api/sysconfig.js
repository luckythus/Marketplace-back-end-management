import axios from '@/axios'

// 获取原有系统设置
export function getSysconfig() {
    return axios.get(`/admin/sysconfig`)
}

// 修改系统设置
export function setSysconfig(data) {
    return axios.post(`/admin/sysconfig`,data)
}