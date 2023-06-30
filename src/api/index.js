import axios from '@/axios'

// 获取后台页面的数据内容
export function getStatisticsl() {
    return axios.get('/admin/statistics1')
}

// 获取后台提示数据内容
export function getStatistics2() {
    return axios.get('/admin/statistics2')
}

// 获取后台可视化视图Echarts数据的接口，需要携带token(在axios中已封装)和选中哪个（月，周，小时）选项的参数
export function getStatistics3(type) {
    return axios.get('/admin/statistics3?type='+type)
}