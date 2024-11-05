<!-- 左侧菜单栏 -->
<script setup lang="ts">
import {Monitor, Document, FolderOpened, PriceTag, Setting} from "@element-plus/icons-vue";
import {useRouter, useRoute} from 'vue-router';
import {ref, computed} from 'vue';
import {useMenuStore} from '@/stores/menu';

// 引入菜单状态管理
const menuStore = useMenuStore();
// 是否折叠
const isCollapse = computed(() => !(menuStore.menuWidth == '250px'))

// 获取当前路由对象和路由器实例
const route = useRoute();
const router = useRouter();

// 当前激活菜单的路径
const defaultActive = ref(route.path);

// 菜单选择事件处理函数，负责路由跳转
const handleSelect = (path: string) => {
  router.push(path);
};

// 菜单项定义
const menus = [
  {
    name: '仪表盘',
    icon: Monitor,
    path: '/admin/index',
  },
  {
    name: '文章管理',
    icon: Document,
    path: '/admin/article/list',
  },
  {
    name: '分类管理',
    icon: FolderOpened,
    path: '/admin/category/list',
  },
  {
    name: '标签管理',
    icon: PriceTag,
    path: '/admin/tag/list',
  },
  {
    name: '博客设置',
    icon: Setting,
    path: '/admin/blog/setting',
  },
];
</script>

<template>
    <!-- 顶部 Logo, 指定高度为 64px, 和右边的 Header 头保持一样高 -->
    <div class="fixed overflow-auto bg-slate-800 h-screen text-white menu-container transition-all"
         :style="{width:menuStore.menuWidth}">
      <div class="flex items-center justify-center h-[64px]">
        <img v-if="menuStore.menuWidth == '250px'" src="@/assets/weblog-logo.png" class="h-[60px]" alt="">
        <img v-else src="@/assets/weblog-logo-mini.png" class="h-[60px]" alt="">
      </div>

      <!-- 下方菜单 -->
      <el-menu :default-active="defaultActive" @select="handleSelect" :collapse="isCollapse"
               :collapse-transition="false">
        <template v-for="(item, index) in menus" :key="index">
          <el-menu-item :index="item.path" class="hover:bg-white hover:bg-opacity-30">
            <el-icon>
              <!-- 动态图标 -->
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
</template>

<style scoped>
.el-menu {
  background-color: rgb(30 41 59 / 1);
  border-right: 0;
}

.el-sub-menu__title,
.el-menu-item {
  color: #ffffff;
  transition: background-color 0.3s; /* 添加平滑过渡效果 */
}

.el-menu-item.is-active span {
  color: #0080ff; /* 激活菜单项文字颜色 */
}

.el-menu-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 5px;
  background-color: #0080ff; /* 激活菜单项左侧的竖条 */
}

.hover\:bg-opacity-30:hover {
  background-color: rgba(255, 255, 255, 0.3); /* 悬停时背景色透明度为 0.3 */
}

</style>

