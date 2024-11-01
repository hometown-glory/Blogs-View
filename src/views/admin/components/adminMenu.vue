<!--左侧菜单栏-->
<script setup lang="ts">
import {Monitor, Document, FolderOpened, PriceTag, Setting} from "@element-plus/icons-vue";
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'

const route = useRoute()
const router = useRouter()

// 根据路由地址判断哪个菜单被选中
const defaultActive = ref(route.path)

// 菜单选择事件
const handleSelect = (path:string) => {
  router.push(path)
}
const menus = [
  {
    'name': '仪表盘',
    'icon': Monitor,
    'path': '/admin/index'
  },
  {
    'name': '文章管理',
    'icon': Document,
    'path': '/admin/article/list',
  },
  {
    'name': '分类管理',
    'icon': FolderOpened,
    'path': '/admin/category/list',
  },
  {
    'name': '标签管理',
    'icon': PriceTag,
    'path': '/admin/tag/list',
  },
  {
    'name': '博客设置',
    'icon': Setting,
    'path': '/admin/blog/setting',
  },
]

</script>

<template>
  <div class="bg-slate-800 h-screen text-white">
    <!-- 顶部 Logo, 指定高度为 64px, 和右边的 Header 头保持一样高 -->
    <div class="flex items-center justify-center h-[64px]">
      <img src="@/assets/weblog-logo.png" class="h-[60px]" alt="">
    </div>

    <!-- 下方菜单 -->
    <el-menu :default-active="defaultActive" @select="handleSelect">
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

