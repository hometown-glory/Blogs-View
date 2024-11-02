import { RouteRecordRaw } from 'vue-router';

const userRoutes: Array<RouteRecordRaw> = [
    {
        path: '/admin',
        name: 'admin',
        meta: { title: '后台管理' },
        component: () => import('@/views/admin/adminIndexView.vue')
    }

];

export default userRoutes;
