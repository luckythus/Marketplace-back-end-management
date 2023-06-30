import axios from "@/axios";

// 获取商品规格列表的接口
export function getSkusList(page) {
    return axios.get(`/admin/skus/${page}`);
}

// 增加商品规格的接口
export function createSkus(data) {
    return axios.post("/admin/skus", data);
}

// 修改商品规格接口
export function updateSkus(id, data) {
    return axios.post("/admin/skus/" + id, data);
}

// 删除商品规格接口
export function deleteSkus(ids) {
    ids = !Array.isArray(ids) ? [ids] : ids
    return axios.post(`/admin/skus/delete_all`,{ ids });
}
// 修改商品规格状态接口 
export function updateSkusStatus(id,status) {
    return axios.post(`/admin/skus/${id}/update_status`,{
        status
    })
}
