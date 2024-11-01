import router from '@/router/index'
import {getToken} from '@/utils/cookie'
import {showMessage} from '@/utils/message'
import {hidePageLoading, showPageLoading} from '@/utils/nprogressUtils'

// 全局路由前置守卫
router.beforeEach((to, _from, next) => {
    console.log('==> 全局路由前置守卫')
    // 展示页面加载 Loading
    showPageLoading()
    // 未登录，则强制跳转登录页
    const token = getToken()
    if (token && to.path === '/login') {
        showMessage('您已登录，无需再次登录', 'info');
        next({path: '/admin'}); // 根据需求可以跳转到不同页面
    } else if (!token && to.path.startsWith('/admin')) {
        showMessage('请先登录', 'warning')
        next({path: '/login'})
    } else {
        next()
    }
})


// 全局路由后置守卫
router.afterEach((to) => {
    console.log('==> 全局路由后置守卫')
    // 动态设置页面 Title
    document.title = (to.meta.title ? to.meta.title : '') + ' - Weblog';
    // 隐藏页面加载 Loading
    hidePageLoading()
});

