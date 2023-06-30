import axios from '@/axios'

            // 请求图库接口，要携带页码参数，还有最多几条，限制默认10条数据一页
export function getImageClassList(page) {
    return axios.get('/admin/image_class/'+page)
}
            // 新增图库接口，携带新增的对象内容数据
export function createImageClass(data) {
    return axios.post('/admin/image_class',data)
}
            // 修改图库的接口，携带当前项id和要修改后的数据
export function updateImageClass(id,data) {
    return axios.post('/admin/image_class/'+id,data)
}
            // 删除图库的接口，携带当前项的id
export function deleteImageClass(id) {
    return axios.post(`/admin/image_class/${id}/delete`)
}