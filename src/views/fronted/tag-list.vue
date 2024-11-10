<script setup lang="ts">
import HeaderView from "@/views/fronted/components/HeaderView.vue";
import FooterView from "@/views/fronted/components/FooterView.vue";
import UserInfoCard from "@/views/fronted/components/UserInfoCard.vue";
import CategoryListCard from "@/views/fronted/components/CategoryListCard.vue";

import { getTagList } from '@/api/fronted/tag'
import { ref } from 'vue'

// 所有标签
const data = {
  current: 1,
  size: 10,
  startDate: null, // 或者你想要的开始日期
  endDate: null, // 或者你想要的结束日期
  name: "", // 可选：要查询的标签名称
};
const tags = ref([])
getTagList(data).then((res) => {
  if (res.data.success) {
    tags.value = res.data.data; // 假设返回的结构中有tags数组
  }
}).catch((error) => {
  console.error("获取标签列表失败", error);
});
</script>

<template>
  <HeaderView/>
  <!-- 主内容区域 -->
  <main class="container max-w-screen-xl mx-auto p-4 px-6">
    <!-- grid 表格布局，分为 4 列 -->
    <div class="grid grid-cols-4 gap-7">
      <!-- 左边栏，占用 3 列 -->
      <div class="col-span-4 md:col-span-3 mb-3">
        <!-- 标签 -->
        <div v-if="tags.length > 0"
             class="w-full p-5 mb-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <!-- 标签标题 -->
          <h2 class="mb-2 font-bold text-gray-900 uppercase dark:text-white">标签</h2>
          <!-- 标签列表 -->
          <span v-for="(tag, index) in tags" :key="index"
                class="inline-block mb-1 cursor-pointer bg-green-100 text-green-800 text-xs font-medium mr-2 px-3 py-1 rounded-full
                       hover:bg-green-200 hover:text-green-900 dark:bg-green-900 dark:text-green-300">
                        {{ tag.name }}
                    </span>
        </div>
      </div>

      <!-- 右边侧边栏，占用一列 -->
      <aside class="col-span-4 md:col-span-1">
        <!-- 博主信息 -->
        <UserInfoCard></UserInfoCard>

        <!-- 分类 -->
        <CategoryListCard></CategoryListCard>
      </aside>
    </div>

  </main>
  <FooterView/>
</template>
