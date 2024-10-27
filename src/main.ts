import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/main.css'
import 'animate.css'
//引入element-plus模块
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'



//use方法使用ElementPlus
createApp(App).use(store).use(router).use(ElementPlus).mount('#app');

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    App.component(key, component)
}



