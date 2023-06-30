import axios from '@/axios'

// 获取商品分类列表
export function getCategoryList() {
    return axios.get('/admin/category')
}
// 增加商品分类的接口
export function createCategory(data) {
    return axios.post("/admin/category", data);
}

// 修改商品分类接口
export function updateCategory(id, data) {
    return axios.post("/admin/category/" + id, data);
}
 
// 删除商品分类接口
export function deleteCategory(id) {
    return axios.post(`/admin/category/${id}/delete`);
}
// 修改商品分类状态接口 
export function updateCategoryStatus(id,status) {
    return axios.post(`/admin/category/${id}/update_status`,{
        status
    })
}
// 分类关联商品列表
export function getCategoryGoods(id) {
    return axios.get(`/admin/app_category_item/list?category_id=${id}`)
}

// 删除关联分类商品接口
export function deleteCategoryGoods(id) {
    return axios.post(`/admin/app_category_item/${id}/delete`);
}
export function connectCategoryGoods(data) {
    return axios.post(`/admin/app_category_item`,data)
}