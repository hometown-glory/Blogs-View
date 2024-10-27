import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: () => import( '@/views/fronted/indexView.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: 'weblog登录页面' },
    component: () => import( '@/views/admin/loginView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
