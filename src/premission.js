import { router,addRoute } from '@/router/index'
import { getToken } from '@/composables/auth'
import { showLoad,doneLoad } from '@/composables/util'
import store from '@/store/index'
    
// 定义是否请求
let hasGetInfo = false
router.beforeEach(async(to, from, next) => {
    // 获取token
    const token = getToken()
    showLoad()
    // 验证是否存在登录过，没有登录过则强制跳转到登录页面
    if(!token && to.path != '/login') {
        // Message("请先登录","error")
        return next({ path: "/login"} )
    }    

    // 已经登录过的，禁止再进入登录页面
    if(token && to.path == "/login") {
        return next( {path: from.path} )
    }
    // 是否添加新路由
    let hasNewRoute = false
    // 如果用户登录了，自动获取用户信息，并存储在vuex中,并且判断是否是第一次请求，
    if(token && !hasGetInfo) {
        let { menus } = await store.dispatch('GetInfo')
        hasGetInfo = true
        hasNewRoute = addRoute(menus)
    }
    let tilte = to.meta.title
    document.title = tilte + '-thus商城管理后台'

    // 如果有新添加，则to.fullPath，没有的话则直接next()
    hasNewRoute ? next(to.fullPath) : next()
})

// 全局后置守卫
router.afterEach((to, from) => { doneLoad()})