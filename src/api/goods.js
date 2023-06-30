import axios from '@/axios'
import { queryParams } from '@/composables/util'

// 获取商品列表
export function getGoodsList(page, query = {}) {
    // 使用query转化url参数的方法
    let data = queryParams(query)
    return axios.get(`/admin/goods/${page}${data}`)
}

// 批量上架/下架商品的接口，也就是修改商品状态意思 
export function updateGoodsStatus(ids, status) {
    return axios.post(`/admin/goods/changestatus`, {
        ids,
        status
    })
}

// 新增商品接口
export function createGoods(data) {
    return axios.post('/admin/goods', data)
}

// 修改商品接口
export function updateGoods(id, data) {
    return axios.post(`/admin/goods/${id}`, data)
}

// 删除商品接口
export function deleteGoods(ids) {
    return axios.post(`/admin/goods/delete_all`, {
        ids
    })
}

// 恢复商品接口
export function restoreGoods(ids) {
    return axios.post(`/admin/goods/restore`, {
        ids
    })
}

// 彻底删除商品接口
export function destroyGoods(ids) {
    return axios.post(`/admin/goods/destroy`, {
        ids
    })
}

// 查看商品的资料
export function readGoods(id) {
    return axios.get(`/admin/goods/read/${id}`)
}

// 设置商品的轮播图
export function setGoodsBanners(id, data) {
    return axios.post(`/admin/goods/banners/${id}`, data)
}

// 更新商品规格接口
export function updateGoodsSkus(id, data) {
    return axios.post(`/admin/goods/updateskus/${id}`, data)
}

// 添加商品规格选项
export function createGoodsSkuCard(data) {
    return axios.post(`/admin/goods_skus_card`,data)
}

// 修改商品规格选项接口
export function updateGoodsSkusCard(id, data) {
    return axios.post(`/admin/goods_skus_card/${id}`, data)
}

// 删除商品规格选项接口
export function deleteGoodsSkuCard(id) {
    return axios.post(`/admin/goods_skus_card/${id}/delete`)
}
// 排序商品规格选项接口
export function sortGoodsSkuCard(data) {
    return axios.post(`/admin/goods_skus_card/sort`,data)
}

// 添加商品规格选项的值
export function createGoodsSkuCardValue(data) {
    return axios.post(`/admin/goods_skus_card_value`,data)
}

// 修改商品规格选项的值
export function updateGoodsSkuCardValue(id,data) {
    return axios.post(`/admin/goods_skus_card_value/${id}`,data)
}

// 删除商品规格选项的值接口
export function deleteGoodsSkuCardValue(id) {
    return axios.post(`/admin/goods_skus_card_value/${id}/delete`)
}

// 选择设置商品规格选项和值接口
export function chooseAndSetGoodsSkuCard(id,data) {
    return axios.post(`/admin/goods_skus_card/${id}/set`,data)
}