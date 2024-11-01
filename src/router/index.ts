import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
//文章分类路由

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
        path: '/admin/adminIndex',
        name: 'adminIndex',
        meta: {title: 'weblog后台管理'},
        component: () => import( '@/views/admin/adminIndexView.vue'),
        children:[
            {
                path:'/admin/index',
                name:'indexView',
                meta:{title:'后台首页'},
                component:()=>import('@/views/admin/indexView.vue')
            },
            {
                path:'/admin/article/list',
                name:'articleList',
                meta:{title:'文章列表'},
                component:()=>import('@/views/admin/article-list.vue')
            },
            {
                path:'/admin/category/list',
                name:'category-list',
                meta:{title:'分类管理列表'},
                component:()=>import('@/views/admin/category-list.vue')
            },
            {
                path:'/admin/tag/list',
                name:'tag-list',
                meta:{title:'标签管理列表'},
                component:()=>import('@/views/admin/tag-list.vue')
            },
            {
                path: "/admin/blog/setting",
                name:'blog-setting',
                meta:{title:'博客设置'},
                component:()=>import('@/views/admin/blog-setting.vue')
            },

        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
