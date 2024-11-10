<script setup lang="ts">
import HeaderView from "@/views/fronted/components/HeaderView.vue";
import FooterView from "@/views/fronted/components/FooterView.vue";
import UserInfoCard from "@/views/fronted/components/UserInfoCard.vue";
import CategoryListCard from "@/views/fronted/components/CategoryListCard.vue";
import {ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import {getTagArticlePageList} from '@/api/fronted/tag'

const route = useRoute()

// 文章集合
const articles = ref([])
// 标签名称
const tagName = ref(route.query.name)
// 标签 ID
const tagId = ref(route.query.id)

// 监听路由
watch(route, (newRoute) => {
  tagName.value = newRoute.query.name
  tagId.value = newRoute.query.id
  getTagArticles(current.value)
})

// 当前页码
const current = ref(1)
// 每页显示的文章数
const size = ref(1)
// 总文章数
const total = ref(0)
// 总共多少页
const pages = ref(0)

function getTagArticles(currentNo: number) {
  // 上下页是否能点击判断，当要跳转上一页且页码小于 1 时，则不允许跳转；当要跳转下一页且页码大于总页数时，则不允许跳转
  if (currentNo < 1 || (pages.value > 0 && currentNo > pages.value)) return
  // 将tagId转换为数字,并处理可能的null值
  const validatedTagId = Number(tagId.value) ?? 0; // 转换，并在null时默认0
  const validatedCurrentNo = Number(currentNo) ?? 1; // 转换，并在null时默认1
  // 再次验证转换后的当前页码
  if (validatedCurrentNo < 1 || (pages.value > 0 && validatedCurrentNo > pages.value)) return;

  // 调用分页接口渲染数据
  getTagArticlePageList({
    current: validatedCurrentNo,
    size: size.value,
    id: validatedTagId
  }).then((res) => {
    if (res.data.success) {
      articles.value = res.data.data;
      current.value = res.data.current;
      size.value = res.data.size;
      total.value = res.data.total;
      pages.value = res.data.pages;
    }
  });
}

getTagArticles(current.value)
</script>

<template>
  <HeaderView/>
  <main class="container max-w-screen-xl mx-auto p-4 px-6">
    <!-- grid 表格布局，分为 4 列 -->
    <div class="grid grid-cols-4 gap-7">
      <!-- 左边栏，占用 3 列 -->
      <div class="col-span-4 md:col-span-3 mb-3">
        <!-- 标签文章列表 -->
        <div class="p-5 mb-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 class="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <!-- 标签图标 -->
           <img src="@/assets/tag.png" alt="" class="w-6 h-6 mr-2"/>
            {{ tagName }}
          </h1>
          <ol v-if="articles && articles.length > 0" class="mt-3 divide-y divider-gray-200 dark:divide-gray-700">
            <li v-for="(article, index) in articles" :key="index">
              <a href="#" class="items-center block p-3 sm:flex hover:bg-gray-100 dark:hover:bg-gray-700">
                <img class="w-24 h-12 mb-3 mr-3 rounded-lg sm:mb-0" :src="article.cover" alt=""/>
                <div class="text-gray-600 dark:text-gray-400">
                  <h2 class="text-base font-normal text-gray-900">
                    {{ article.title }}
                  </h2>
                  <span
                      class="inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                          <svg class="inline w-2.5 h-2.5 mr-2 text-gray-400 dark:text-white"
                               aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                               viewBox="0 0 20 20">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>
                          </svg>
                          {{ article.createDate }}
                      </span>
                </div>
              </a>
            </li>
          </ol>

          <!-- 该标签下没有文章提示，指定为 flex 布局，内容垂直水平居中，并纵向排列  -->
          <div v-else class="flex items-center justify-center flex-col">
            <img src="@/assets/no.png" alt="" class="w-24 h-24">
            <p class="mt-2 mb-16 text-gray-400">此标签下还未发布文章哟~</p>
          </div>
        </div>

        <!-- 分页 -->
        <nav aria-label="Page navigation example" class="mt-10 flex justify-center" v-if="pages > 1">
          <ul class="flex items-center -space-x-px h-10 text-base">
            <!-- 上一页 -->
            <li>
              <a @click="getTagArticles(current - 1)"
                 class="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                 :class="[current > 1 ? '' : 'cursor-not-allowed']">

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
              <a @click="getTagArticles(pageNo)"
                 class="flex items-center justify-center px-4 h-10 leading-tight border  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                 :class="[pageNo == current ? 'text-blue-600  bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-700']">
                {{ index + 1 }}
              </a>
            </li>
            <!-- 下一页 -->
            <li>
              <a @click="getTagArticles(current + 1)"
                 class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                 :class="[current < pages ? '' : 'cursor-not-allowed']">
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
      </div>

      <!-- 右边侧边栏，占用一列 -->
      <aside class="col-span-4 md:col-span-1">
        <!-- 博主信息 -->
        <UserInfoCard></UserInfoCard>

        <!-- 分类 -->
        <CategoryListCard></CategoryListCard>

        <!-- 标签 -->
        <TagArticleList></TagArticleList>
      </aside>
    </div>

  </main>
  <FooterView/>
</template>

<style scoped>

</style>
