import axios from '@/axios'
// 获取当前分类选项的图片数据内容
export function getImageList(id, page = 1) {
    return axios.get(`/admin/image_class/${id}/image/${page}`)
}
// 修改图片的接口,携带当前图片的id和当前修改完成的数据
export function updateImageList(id, name) {
    return axios.post(`/admin/image/${id}`, { name })
}
// 删除图片的接口,携带图片ID组成的一维数组
export function deleteImageList(ids) {
    return axios.post('/admin/image/delete_all', { ids })
}

// 定义上传接口地址
export const uploadImageAction = import.meta.env.VITE_APP_BASE_API + '/admin/image/upload'

