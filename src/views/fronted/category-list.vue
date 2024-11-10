<script setup lang="ts">
import HeaderView from "@/views/fronted/components/HeaderView.vue";
import UserInfoCard from "@/views/fronted/components/UserInfoCard.vue";
import TagListCard from "@/views/fronted/components/TagListCard.vue";
import FooterView from "@/views/fronted/components/FooterView.vue";
import CategoryListCard from "@/views/fronted/components/CategoryListCard.vue";
</script>

<template>
  <HeaderView/>
  <!-- 主内容区域 -->
  <main class="container max-w-screen-xl mx-auto p-4 px-6">
    <!-- grid 表格布局，分为 4 列 -->
    <div class="grid grid-cols-4 gap-7">
      <!-- 左边栏，占用 3 列 -->
      <div class="col-span-4 md:col-span-3 mb-3">
        <!-- 分类列表 -->
       <CategoryListCard/>
      </div>

      <!-- 右边侧边栏，占用一列 -->
      <aside class="col-span-4 md:col-span-1">
        <!-- 博主信息 -->
        <UserInfoCard/>

        <!-- 标签 -->
        <TagListCard/>
      </aside>
    </div>
  </main>
  <FooterView/>
</template>

