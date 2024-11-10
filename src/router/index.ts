import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
//用户路由
import userRoutes from "@/router/admin/userRouter";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        meta:{title: 'weblog首页'},
        component: () => import( '@/views/fronted/indexView.vue')
    },
    {
        path:'/archive/list',
        name: 'archiveList',
        meta:{title:'Weblog归档'},
        component: () => import( '@/views/fronted/archive-list.vue')
    },{
        path: '/category/list',
        name: 'categoryList',
        meta:{title:'Weblog分类'},
        component: () => import( '@/views/fronted/category-list.vue')
    },{
        path: '/category/article/list', // 分类文章页
        name: 'articleDetail',
        meta:{title:'Weblog 分类文章页'},
        component: () => import( '@/views/fronted/category-article-list.vue')
    },{
        path: '/tag/list',
        name: 'tagList',
        meta:{title:'Weblog标签列表页'},
        component: () => import( '@/views/fronted/tag-list.vue')
    },{
        path: '/tag/article/list', // 标签列表页
        name:'tagArticleList',
        meta:{title:'标签文章列表页'},
        component: () => import( '@/views/fronted/tag-article-list.vue')
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
                meta:{title:'仪表盘'},
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
    },
    ...userRoutes
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
