<script setup lang="ts">
import HeaderView from "@/views/fronted/components/HeaderView.vue";
import FooterView from "@/views/fronted/components/FooterView.vue";
import UserInfoCard from "@/views/fronted/components/UserInfoCard.vue";
import CategoryListCard from "@/views/fronted/components/CategoryListCard.vue";
import TagListCard from "@/views/fronted/components/TagListCard.vue";
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getCategoryArticlePageList } from "@/api/fronted/category";

// 获取路由
const route = useRoute()

// 文章集合
const articles = ref([])

// 分类名称和 ID
const categoryName = ref<string | null>(null)
const categoryId = ref<number | null>(null)
const isLoading = ref(true) // 加载状态
const errorMessage = ref<string | null>(null) // 错误消息

// 从 route.query 读取分类名称和 ID
const routeCategoryName = route.query.name as string | undefined;
const routeCategoryId = route.query.id as string | undefined;

categoryName.value = routeCategoryName || null;

// 转换 ID 为数字
categoryId.value = routeCategoryId ? Number(routeCategoryId) : null;

// 监听路由变化
watch(route, (newRoute) => {
  categoryName.value = newRoute.query.name as string | undefined || null;
  categoryId.value = newRoute.query.id ? Number(newRoute.query.id) : null;  // 数字转换
  getCategoryArticles(current.value); // 重新获取文章
});

// 当前页码
const current = ref(1)
// 每页显示的文章数
const size = ref(1)
// 总文章数
const total = ref(0)
// 总共多少页
const pages = ref(0)

function getCategoryArticles(currentNo: number) {
  // 上下页是否能点击判断
  if (currentNo < 1 || (pages.value > 0 && currentNo > pages.value)) return;

  // 确保 categoryId 是有效的数字
  if (categoryId.value !== null) {
    isLoading.value = true; // 开始加载
    errorMessage.value = null; // 清除错误信息
    // 调用分页接口渲染数据
    getCategoryArticlePageList({
      current: currentNo,
      size: size.value,
      categoryId: categoryId.value, // 必须传入 categoryId
    }).then((res) => {
      if (res.data.success) {
        articles.value = res.data.data;
        current.value = res.data.current;
        size.value = res.data.size;
        total.value = res.data.total;
        pages.value = res.data.pages;
        console.log('数据', articles.value);
      } else {
        errorMessage.value = res.data.message || "获取文章失败";
      }
    }).catch(error => {
      console.error("请求错误", error);
      errorMessage.value = "请求失败，请稍后重试";
    }).finally(() => {
      isLoading.value = false; // 结束加载
    });
  } else {
    console.error("分类 ID 不能为空");
  }
}

// 初始化获取文章
onMounted(() => {
  getCategoryArticles(current.value);
});
</script>

<template>
  <HeaderView/>
  <!-- 主内容区域 -->
  <main class="container max-w-screen-xl mx-auto p-4 px-6">
    <div class="grid grid-cols-4 gap-7">
      <div class="col-span-4 md:col-span-3 mb-3">
        <div class="p-5 mb-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700">
          <h1 class="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <svg class="inline w-4 h-4 mr-2 dark:text-white" aria-hidden="true"
                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 18">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.539 17h12.476l4-9H5m-2.461 9a1 1 0 0 1-.914-1.406L5 8m-2.461 9H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.443a1 1 0 0 1 .8.4l2.7 3.6H16a1 1 0 0 1 1 1v2H5"/>
            </svg>
            {{ categoryName }}
          </h1>
          <div v-if="isLoading" class="text-center">
            <p class="text-gray-500">加载中...</p>
          </div>
          <ol v-if="!isLoading && articles.length > 0" class="mt-3 divide-y divider-gray-200 dark:divide-gray-700">
            <li  v-for="(article, index) in articles" :key="index">
              <a href="#" class="items-center block p-3 sm:flex hover:bg-gray-100 dark:hover:bg-gray-700">
                <img class="w-24 h-12 mb-3 mr-3 rounded-lg sm:mb-0"
                     :src="article.cover" alt=""/>
                <div class="text-gray-600 dark:text-gray-400">
                  <h2 class="text-base font-normal text-gray-900">
                    {{ article.title }}
                  </h2>
                  <span class="inline-flex items-center text-xs font-normal text-gray-500 dark:text-gray-400">
                    <svg class="inline w-2.5 h-2.5 mr-2 text-gray-400 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 1v3m5-3v3m5-3v3M1 7h18M5 11h10M2 3h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>
                    </svg>
                    {{ article.createDate }}
                  </span>
                </div>
              </a>
            </li>
          </ol>
          <div v-else-if="!isLoading" class="flex items-center justify-center flex-col">
            <img class="w-24 h-24 mb-3" src="@/assets/no.png" alt=""/>
            <p class="mt-2 mb-16 text-gray-400">此分类下还未发布文章哟~</p>
          </div>
          <div v-if="errorMessage" class="text-red-500 mt-2">
            {{ errorMessage }}
          </div>
        </div>
        <nav v-if="articles.length > 0" aria-label="Page navigation example" class="mt-10 flex justify-center">
          <ul class="flex items-center -space-x-px h-10 text-base">
            <li>
              <a
                  class="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <span class="sr-only">上一页</span>
                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 6 10">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2" d="M5 1 1 5l4 4"/>
                </svg>
              </a>
            </li>
            <li>
              <a
                  class="text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700 flex items-center justify-center px-4 h-10 leading-tight border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                1
              </a>
            </li>
            <li>
              <a
                  class="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
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

      <aside class="col-span-4 md:col-span-1">
        <UserInfoCard></UserInfoCard>
        <CategoryListCard></CategoryListCard>
        <TagListCard></TagListCard>
      </aside>
    </div>
  </main>
  <FooterView/>
</template>
