import axios from '@/axios'
import { queryParams } from '@/composables/util'

// 获取订单列表
export function getOrderList(page, query = {}) {
    // 使用query转化url参数的方法
    let data = queryParams(query)
    return axios.get(`/admin/order/${page}${data}`)
}

// 删除订单接口
export function deleteOrder(ids) {
    return axios.post(`/admin/order/delete_all`, {
        ids
    })
}

// 导出订单的接口列表
export function exportOrder(query = {}) {
    // 使用query转化url参数的方法
    let data = queryParams(query)
    return axios.post(`/admin/order/excelexport${data}`,{},{
        responseType: 'blob'
    })
}

// 获取订单列表
export function getShipInfo(id) {
    return axios.get(`/admin/order/${id}/get_ship_info`)
}

// 拒绝或同意退款接口
export function refundOrder(id,data) {
    return axios.post(`/admin/order/${id}/handle_refund`,data)
}