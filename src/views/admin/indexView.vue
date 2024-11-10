<!--后台首页-->
<script setup lang="ts">
import { ref } from 'vue'
import {getBaseStatisticsInfo,getPublishArticleStatisticsInfo,getArticlePVStatisticsInfo} from '@/api/admin/dashboard'
import CountTo from "@/components/CountTo.vue";
import ArticlePublishCalendar from "@/views/admin/components/ArticlePublishCalendar.vue";
import ArticlePVLineChat from "@/views/admin/components/ArticlePVLineChat.vue";


// 文章总数，默认值为 0
const articleTotalCount = ref(0)
// 分类总数
const categoryTotalCount = ref(0)
// 标签总数
const tagTotalCount = ref(0)
// PV 总访问量
const pvTotalCount= ref(0)

getBaseStatisticsInfo().then(res => {
  if (res.data.success) {
    articleTotalCount.value = res.data.data.articleTotalCount
    categoryTotalCount.value = res.data.data.categoryTotalCount
    tagTotalCount.value = res.data.data.tagTotalCount
    pvTotalCount.value = res.data.data.pvTotalCount
  }
})
// 按日统计文章发布数据
const articlePublishInfo = ref({})
getPublishArticleStatisticsInfo().then((res) => {
  if (res.data.success) {
    articlePublishInfo.value = res.data.data
  }
})

// 近一周文章 PV 数据
const articlePVInfo = ref({})
getArticlePVStatisticsInfo().then((res) => {
  if (res.data.success) {
    articlePVInfo.value = res.data.data
  }
})
</script>

<template>
  <main class="container p-4">
    <!-- grid 表格布局，分为 4 列 -->
    <div class="grid grid-cols-4 gap-7">
      <!-- 文章数 -->
      <div class="col-span-4 md:col-span-1">
        <!-- 卡片 -->
        <div class="flex items-center w-full px-5 py-7 mb-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <img class="w-16 h-16 mr-5" src="@/assets/文章.png" alt="">
          <div class="ml-5">
            <h2 class="mb-1">文章</h2>
            <CountTo :value="articleTotalCount"></CountTo>
          </div>
        </div>
      </div>

      <!-- 分类数 -->
      <div class="col-span-4 md:col-span-1 ">
        <!-- 卡片 -->
        <div class="flex items-center w-full px-5 py-7 mb-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <img class="w-16 h-16 mr-5" src="@/assets/分类.png" alt="">
         <div class="ml-5">
            <h2 class="mb-1">分类数</h2>
           <CountTo :value="categoryTotalCount"></CountTo>
          </div>
        </div>
      </div>

      <!-- 标签数 -->
      <div class="col-span-4 md:col-span-1 ">
        <!-- 卡片 -->
        <div class="flex items-center w-full px-5 py-7 mb-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <img class="w-16 h-16 mr-5" src="@/assets/标签.png" alt="">
         <div class="ml-5">
            <h2 class="mb-1">标签数</h2>
           <CountTo :value="pvTotalCount"></CountTo>
          </div>
        </div>
      </div>

      <!-- 总浏览量 -->
      <div class="col-span-4 md:col-span-1 ">
        <!-- 卡片 -->
        <div class="flex items-center w-full px-5 py-7 mb-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <img class="w-16 h-16 mr-5" src="@/assets/浏览数.png" alt="">
          <div class="ml-5">
            <h2 class="mb-1">总浏览量</h2>
            <div class="font-bold text-2xl">{{ pvTotalCount }}</div>
          </div>
        </div>
      </div>

      <!-- 文章发布热点图 -->
      <div class="col-span-4 md:col-span-2 ">
        <!-- 卡片 -->
        <div
            class="w-full h-full px-5 py-7 mb-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <h2 class="flex items-center mb-2 font-bold text-gray-900 uppercase dark:text-white">
            <!-- 日历图标 -->
            <svg t="1699867752559" class="icon w-5 h-5 mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="43935" width="200" height="200"><path d="M897.9 369.2H205c-33.8 0-61.4-27.6-61.4-61.4s27.6-61.4 61.4-61.4h692.9c33.8 0 61.4 27.6 61.4 61.4s-27.6 61.4-61.4 61.4z" fill="#FFB89A" p-id="43936"></path><path d="M807 171H703.3c-16.6 0-30 13.4-30 30s13.4 30 30 30H807c31.6 0 57.4 24 57.4 53.4v42.3H125.2v-42.3c0-29.5 25.7-53.4 57.4-53.4H293c16.6 0 30-13.4 30-30s-13.4-30-30-30H182.5c-64.7 0-117.4 50.9-117.4 113.4v527.7c0 62.5 52.7 113.4 117.4 113.4H807c64.7 0 117.4-50.9 117.4-113.4V284.5c0-62.6-52.7-113.5-117.4-113.5z m0 694.6H182.5c-31.6 0-57.4-24-57.4-53.4V386.8h739.2v425.4c0.1 29.5-25.7 53.4-57.3 53.4z" fill="#45484C" p-id="43937"></path><path d="M447.6 217.1c-12.4-6.1-27-2.8-35.7 7.1-2.2-6.7-4-16.2-4-28.1 0-13 2.2-23 4.6-29.8 9.5 8.1 23.5 9.6 34.9 2.8 14.2-8.5 18.8-27 10.3-41.2-15.5-25.9-35.9-29.7-46.6-29.7-36.6 0-63.1 41.2-63.1 97.8s26.4 98 63 98c20.6 0 39-13.4 50.4-36.7 7.3-14.9 1.1-32.9-13.8-40.2zM635.9 218.5c-12.4-6.1-27-2.8-35.7 7.1-2.2-6.7-4-16.2-4-28.1 0-13 2.2-23 4.6-29.8 9.5 8.1 23.5 9.6 34.9 2.8 14.2-8.5 18.8-27 10.3-41.2-15.5-25.9-35.9-29.7-46.6-29.7-36.6 0-63.1 41.2-63.1 97.8s26.5 97.8 63.1 97.8c20.6 0 39-13.4 50.4-36.7 7.1-14.7 0.9-32.7-13.9-40z" fill="#45484C" p-id="43938"></path><path d="M700.2 514.5H200.5c-16.6 0-30 13.4-30 30s13.4 30 30 30h499.7c16.6 0 30-13.4 30-30s-13.5-30-30-30zM668.4 689.8h-74c-16.6 0-30 13.4-30 30s13.4 30 30 30h74c16.6 0 30-13.4 30-30s-13.4-30-30-30zM479.3 689.8H200.5c-16.6 0-30 13.4-30 30s13.4 30 30 30h278.8c16.6 0 30-13.4 30-30s-13.4-30-30-30z" fill="#33CC99" p-id="43939"></path></svg>
            近半年文章发布热点图
          </h2>
          <ArticlePublishCalendar :value="articlePublishInfo"/>
        </div>
      </div>

      <!-- 文章日 PV 访问量折线图 -->
      <div class="col-span-4 md:col-span-2 ">
        <!-- 卡片 -->
        <div
            class="w-full h-full px-5 py-7 mb-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <h2 class="flex items-center mb-2 font-bold text-gray-600 uppercase dark:text-white">
            <!-- 折线图标 -->
            <svg t="1699872552774" class="icon w-5 h-5 mr-2" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="58226" width="200" height="200"><path d="M629.892 323.414c-6.226-11.274-18.33-18.156-31.126-17.914-12.796 0.242-24.554 7.608-30.086 19.124l-143.52 286.87-63.29-115.164c-6.224-11.032-17.982-17.914-30.432-17.914h-60.52c-19.022 0-34.584 15.494-34.584 34.584 0 19.09 15.56 34.584 34.582 34.584h40.118l85.074 155c6.226 11.276 18.33 18.158 31.126 17.916 12.796-0.242 24.554-7.608 30.086-19.124l143.52-286.87 63.29 115.164c6.224 11.032 17.982 17.914 30.432 17.914h60.52c19.022 0 34.584-15.494 34.584-34.584 0-19.09-15.56-34.584-34.582-34.584h-40.118l-85.074-155z" fill="#767BFA" p-id="58227"></path><path d="M513 98C854.684 98 928 171.248 928 513S854.684 928 513 928C171.316 928 98 854.752 98 513S171.316 98 513 98z m0 69.166c-83.692 0-146.634 4.6-194.012 15.148-46.688 10.376-74.354 25.592-92.684 43.92-18.33 18.364-33.546 46.032-43.92 92.754-10.72 47.482-15.218 110.148-15.218 194.012s4.496 146.53 15.218 194.012c10.374 46.722 25.59 74.39 43.92 92.754 18.33 18.328 45.996 33.544 92.684 43.92 47.38 10.548 110.32 15.148 194.012 15.148 83.692 0 146.634-4.6 194.012-15.148 46.688-10.376 74.354-25.592 92.684-43.92 18.328-18.364 33.546-46.032 43.92-92.754 10.72-47.482 15.218-110.148 15.218-194.012s-4.496-146.53-15.218-194.012c-10.374-46.722-25.592-74.39-43.92-92.752-18.33-18.33-45.996-33.546-92.684-43.92-47.38-10.55-110.32-15.15-194.012-15.15z" fill="#ABAFD1" p-id="58228"></path></svg>
            近一周 PV 访问量
          </h2>
         <ArticlePVLineChat :value="articlePVInfo"/>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>

</style>
