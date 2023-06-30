import axios from "@/axios";
// 获取公告列表数据接口
export function getNoticeList(page) {
    return axios.get(`/admin/notice/${page}`);
}
// 新增公告的接口
export function createNoticeList(data) {
    return axios.post("/admin/notice", data);
}
// 修改公告接口
export function updateNoticeList(id, data) {
    return axios.post("/admin/notice/" + id, data);
}

// 删除公告接口
export async function deleteNoticeList(id) {
    return await axios.post(`/admin/notice/${id}/delete`);
}
