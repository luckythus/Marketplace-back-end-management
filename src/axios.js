import axios from 'axios'
import { Message } from './composables/util';
import { getToken } from './composables/auth';
import store from './store';
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API
})

service.interceptors.request.use(function(config) {
    console.log(config)
    const token = getToken()
    if(token) {
        config.headers["token"] = token
    }
    return config
},function(error) {
    return Promise.reject(error)
})

service.interceptors.response.use(function(response) {
    return response.request.responseType == 'blob' ? response.data : response.data.data
}, function(err) {
    let msg = err.response.data.msg || '后端权限限制，无法操作当前数据，请多试下其他的或者新增数据去操作'
    if(msg == '非法token，请先登录！') {
        store.dispatch('logout').finally(() => location.reload())
    }
    if(err.response.data.errorCode === 40000) {
        msg = '当前数据被后端权限限制，无法操作当前数据，请多试下其他的或者新增数据去操作'
    }
    Message(msg,'error')
    return Promise.reject(err)
})

export default service