import { createStore } from "vuex";
import { login,getInfo } from '@/api/manager'
import { setToken,removeToken } from '@/composables/auth'

const store = createStore({
    state () {
      return {
        // 用户信息
        user: {},
        // 侧边栏的宽度
        asideWidth: '250px',
        // 设置用户菜单
        menus: [],
        // 
        ruleNames:[]
      }
    },
    mutations: {
        // 记录用户信息
        SET_USERINFO(state,user) {
            state.user = user
        },
        // 是否展开侧边栏
        handleAsideWidth(state) {
          state.asideWidth = state.asideWidth == '250px' ? '64px' : '250px'
        },

        SET_MENUS(state,data) {
          state.menus = data
        },

        SET_RULENAMES(state,ruleNames){
          state.ruleNames = ruleNames
      }
    },
    actions: {
      // 用户登录验证
      Login( { commit },{ username,password }) {
        return new Promise((resolve,reject) => {
          login(username,password)
          .then((res) => {
            // 登录成功
            // 存储token到cookie里面
            setToken(res.token)
            resolve(res)
          })
          .catch(err => reject(err))
        })
      },
      // 获取当前用户登录信息
      GetInfo( { commit }) {
        return new Promise((resolve,reject) => {
          getInfo().then((res) => {
            commit('SET_USERINFO',res)
            commit('SET_MENUS',res.menus)
            commit("SET_RULENAMES",res.ruleNames)
            resolve(res)
          }).catch(err => reject(err))
        })
      },
      // 清除管理信息
      logout( { commit }) {
        // 清除cookie
        removeToken()
        // 删除vuex的store里面的管理员信息状态
        commit('SET_USERINFO',{})
      }
    }
})

export default store