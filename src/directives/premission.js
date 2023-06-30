import store from '@/store/index.js'
function hasPermission(el,value) {
    // 后台传入的权限数据中，value是个数组，所以进行判断是否是数组
    if(!Array.isArray(value)) {
        throw new Error('需要配置权限')
    }
    // 查找store数据中中是否能匹配到该权限，如果匹配不到，则说明该用户没有该权限，需要删除权限对应的节点
    const hasAuth = value.findIndex(v =>store.state.ruleNames.includes(v)) != -1
    // 如果当前有节点，并且匹配不到该权限，则移除该权限对应的节点
    if(el && !hasAuth) {
        el.parentNode && el.parentNode.removeChild(el)
    }
    return hasAuth
}

export default {
    // 拿到app实例
    install(app) {
        // 定义app的自定义指令permission
        app.directive('permission',{
            // el拿到渲染的节点，binding拿到值
            mounted(el,binding) {
                // 查看节点的bindingvalue数组中是否有该权限的参数
                hasPermission(el,binding.value)
            },
        })
    }
}