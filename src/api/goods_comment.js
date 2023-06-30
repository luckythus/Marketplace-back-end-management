import axios from '@/axios'
import { queryParams } from '@/composables/util'

// 获取管理员列表
export function getGoodsCommentList(page,query = {

}) {
    let data = queryParams(query)
    return axios.get(`/admin/goods_comment/${page}${data}`)
}

// 修改管理员状态接口 
export function updateGoodsCommentStatus(id,status) {
    return axios.post(`/admin/goods_comment/${id}/update_status`,{
        status
    })
}

// 回复商品评价
export function reviewGoodsComment(id,data) {
    return axios.post(`/admin/goods_comment/review/${id}`,{data})
}
