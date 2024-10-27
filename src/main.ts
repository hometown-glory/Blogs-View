import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/main.css'
//引入element-plus模块
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//use方法使用ElementPlus
createApp(App).use(store).use(router).use(ElementPlus).mount('#app');

