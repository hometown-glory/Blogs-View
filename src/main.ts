import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import  pinia  from '@/stores'

// 导入全局路由守卫
import '@/permission'
import 'nprogress/nprogress.css'

import '@/assets/main.css'
import 'animate.css'

// 引入 element-plus 模块
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 图片点击放大
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

const app = createApp(App) // 使用 createApp 创建应用实例

app.use(pinia)

// 使用 ElementPlus
app.use(ElementPlus)

// 使用 store 和 router
app.use(store)
app.use(router)

// 使用 v-viewer
app.use(VueViewer)

// 注册所有 ElementPlus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 挂载应用
app.mount('#app') // 将应用实例挂载到 DOM 元素上
