<!--管理首页-->
<script setup lang="ts">
import AdminMenu from "@/views/admin/components/adminMenu.vue";
import AdminHeater from "@/views/admin/components/adminHeader.vue";
import AdminFooter from "@/views/admin/components/adminFooter.vue";
import AdminTagList from "@/views/admin/components/adminTagList.vue";

import { useMenuStore } from "@/stores/menu";
const menuStore = useMenuStore();
</script>
<template>
  <!-- 外层容器 -->
  <el-container>
    <!-- 左边侧边栏 -->
    <el-aside :width='menuStore.menuWidth' class="transition-all">
      <admin-menu></admin-menu>
    </el-aside>

    <!-- 右边主内容区域 -->
    <el-container>

      <!-- 顶栏容器 -->
      <el-header>
        <admin-heater></admin-heater>
      </el-header>

      <!-- 主内容（根据路由动态展示不同页面） -->
      <el-main>

        <!--标签导航栏-->
        <admin-tag-list></admin-tag-list>
        <router-view></router-view>

      </el-main>

      <!-- 底栏容器 -->
      <el-footer>
        <admin-footer></admin-footer>
      </el-footer>

    </el-container>
  </el-container>
</template>


<style scoped>
.el-header {
  padding: 0 !important;
}

.el-main {
  padding: 0 !important;
}

.el-footer {
  padding: 0 !important;
}
</style>

