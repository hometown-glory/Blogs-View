import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        meta:{title: 'weblog首页'},
        component: () => import( '@/views/fronted/indexView.vue')
    },
    {
        path: '/login',
        name: 'login',
        meta: {title: 'weblog登录页面'},
        component: () => import( '@/views/admin/loginView.vue')
    },
    {
        path: '/admin',
        name: 'admin',
        meta: {title: 'weblog后台管理'},
        component: () => import( '@/views/admin/adminIndexView.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
