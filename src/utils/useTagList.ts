import { ref } from 'vue';
import { useMenuStore } from '@/stores/menu';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { setTabList, getTabList, Tab } from '@/utils/cookie'; // 导入 Tab 接口

export function useTabList() {
    const menuStore = useMenuStore();
    const route = useRoute();
    const router = useRouter();

    // 当前被选中的 tab
    const activeTab = ref(route.path);
    // 导航栏 tab 数组
    const tabList = ref<Tab[]>([
        {
            title: '仪表盘',
            path: "/admin/index"
        },
    ]);

    // 添加 Tab 标签页
    function addTab(tab: Tab) {
        const isTabNotExisted = tabList.value.findIndex(item => item.path === tab.path) === -1;
        if (isTabNotExisted) {
            tabList.value.push(tab);
        }
        // 存储 tabList 到 cookie 中
        setTabList(tabList.value);
    }

    // 初始化标签导航栏
    function initTabList() {
        const tabs = getTabList();
        if (Array.isArray(tabs)) {
            tabList.value = tabs;
        }
    }
    initTabList();

    // 在路由切换前被调用
    onBeforeRouteUpdate((to) => {
        activeTab.value = to.path;
        addTab({
            title: (to.meta.title as string), // 使用类型断言
            path: to.path
        });
    });

    // 标签页切换事件
    const tabChange = (path: string) => {
        activeTab.value = path;
        router.push(path);
    };

    // 删除 Tab 标签
    const removeTab = (path: string) => {
        const tabs = tabList.value;
        let actTab = activeTab.value;

        if (actTab === path) {
            tabs.forEach((tab, index) => {
                if (tab.path === path) {
                    const nextTab = tabs[index + 1] || tabs[index - 1];
                    if (nextTab) {
                        actTab = nextTab.path;
                    }
                }
            });
        }

        activeTab.value = actTab;
        tabList.value = tabList.value.filter((tab) => tab.path !== path);
        setTabList(tabList.value);
        tabChange(activeTab.value);
    };

    // 处理关闭标签菜单事件
    const handleCloseTab = (command: string) => {
        const indexPath = '/admin/index';
        if (command === 'closeOthers') {
            tabList.value = tabList.value.filter((tab) => tab.path === indexPath || tab.path === activeTab.value);
        } else if (command === 'closeAll') {
            activeTab.value = indexPath;
            tabList.value = tabList.value.filter((tab) => tab.path === indexPath);
            tabChange(activeTab.value);
        }

        setTabList(tabList.value);
    };

    return {
        menuStore,
        activeTab,
        tabList,
        tabChange,
        removeTab,
        handleCloseTab
    };
}
