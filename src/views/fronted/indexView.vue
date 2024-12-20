<template>
  <HeaderView></HeaderView>

  <!-- 主内容区域 -->
  <main class="container max-w-screen-xl mx-auto p-4">
    <!-- grid 表格布局，分为 4 列 -->
    <div class="grid grid-cols-4 gap-7">
      <!-- 左边栏，占用 3 列 -->
      <div class="col-span-4 md:col-span-3 mb-3">
        <!-- 文章列表，grid 表格布局，分为 2 列 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2 md:col-span-1" v-for="(article, index) in articles" :key="index">
            <div
                class="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
              <!-- 文章封面 -->
              <a @click="goArticleDetailPage(article.id)" class="cursor-pointer">
                <img class="rounded-t-lg h-48 w-full"
                     :src="article.cover"
                     alt=""/>
              </a>
              <div class="p-5">
                <!-- 标签 -->
                <div class="mb-3">
                  <span v-for="(tag, tagIndex) in article.tags" :key="tagIndex"
                        class="cursor-pointer bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded hover:bg-green-200
                      hover:text-green-900 dark:bg-green-900 dark:text-green-300">{{ tag.name }}</span>
                </div>

                <!-- 文章标题 -->
                <a @click="goArticleDetailPage(article.id)" class="cursor-pointer">
                  <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {{ articles.title }}
                  </h2>
                </a>
                <!-- 文章摘要 -->
                <p v-if="article.summary" class="mb-3 font-normal text-gray-500 dark:text-gray-400">{{
                    article.summary
                  }}</p>
                <!-- 文章发布时间、所属分类 -->
                <p class="flex items-center font-normal text-gray-400 text-sm dark:text-gray-400">
                  <!-- 发布时间 -->
                  <svg class="inline w-3 h-3 mr-2 text-gray-400 dark:text-white" aria-hidden="true"
                       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>
                  </svg>
                  {{ article.createTime }}

                  <!-- 所属分类 -->
                  <svg class="inline w-3 h-3 ml-5 mr-2 text-gray-400 dark:text-white" aria-hidden="true"
                       xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H1Zm0 0V2a1 1 0 0 1 1-1h5.443a1 1 0 0 1 .8.4l2.7 3.6H1Z"/>
                  </svg>
                  <a href="#" class="text-gray-400 hover:underline">{{ article.category.name }}</a>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右边侧边栏，占用一列 -->
      <aside class="col-span-4 md:col-span-1">
        <!-- 博主信息 -->
        <UserInfoCard/>
        <!-- 分类 -->
        <CategoryListCard/>
        <!-- 标签 -->
        <TagListCard/>
      </aside>
    </div>
    <!-- 分页 -->

    <nav aria-label="Page navigation example" class="mt-10 flex justify-center" v-if="pages > 1">
      <ul class="flex items-center -space-x-px h-10 text-base">
        <!-- 上一页 -->
        <li>
          <a @click="getArticles(current - 1)"
             class="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
             :class="[current > 1 ? '' : 'cursor-not-allowed']"
          >

            <span class="sr-only">上一页</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
          </a>
        </li>
        <!-- 页码 -->
        <li v-for="(pageNo, index) in pages" :key="index">
          <a @click="getArticles(pageNo)"
             class="flex items-center justify-center px-4 h-10 leading-tight border  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
             :class="[pageNo == current ? 'text-blue-600  bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-700']"
          >
            {{ index + 1 }}
          </a>
        </li>
        <!-- 下一页 -->
        <li>
          <a @click="getArticles(current + 1)"
             class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
             :class="[current < pages ? '' : 'cursor-not-allowed']"
          >
            <span class="sr-only">下一页</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  </main>

  <FooterView></FooterView>
</template>


<script setup lang="ts">
import HeaderView from "@/views/fronted/components/HeaderView.vue";
import FooterView from "@/views/fronted/components/FooterView.vue";
import {initTooltips} from 'flowbite'
import {onMounted, ref} from 'vue'
import {getArticlePageList} from "@/api/fronted/article"
import UserInfoCard from "@/views/fronted/components/UserInfoCard.vue";
import CategoryListCard from "@/views/fronted/components/CategoryListCard.vue";
import TagListCard from "@/views/fronted/components/TagListCard.vue";
import router from "@/router";


onMounted(() => {
  initTooltips();
})

// 文章集合
const articles = ref([])
// 当前页码
const current = ref(1)
// 每页显示的文章数
const size = ref(2)
// 文章总数
const total = ref(0)
// 总页数
const pages = ref(0)

// 获取指定页的文章数据
function getArticles(currentNo: number) {
  if (currentNo < 1 || (pages.value > 0 && currentNo > pages.value)) return
  // 调用分页接口渲染数据
  getArticlePageList({current: currentNo, size: size.value}).then((res) => {
    if (res.data.success) {
      articles.value = res.data.data
      current.value = res.data.current
      size.value = res.data.size
      total.value = res.data.total
      pages.value = res.data.pages
    }
  })
}

getArticles(current.value)

// 跳转文章详情页
const goArticleDetailPage = (articleId: number) => {
  router.push('/article/' + articleId)
}
</script>
