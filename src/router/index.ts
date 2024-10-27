import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: () => import(/* webpackChunkName: "about" */ '@/views/fronted/indexView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
