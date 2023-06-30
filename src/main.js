import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import 'virtual:windi.css'
import { router } from './router/index'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import store from '@/store/index'
const app = createApp(App)

app.use(store)
app.use(router)

app.use(ElementPlus)
// 导入elementicon的方法
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

import './premission.js'

import 'nprogress/nprogress.css'

// 导入封装好的自定义指令方法，然后app.use这个方法
import permission from '@/directives/premission.js'
app.use(permission)
app.mount('#app')