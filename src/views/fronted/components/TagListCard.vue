<script setup lang="ts">
import {getTagList} from '@/api/fronted/tag'
import {ref} from 'vue'
import {useRouter} from 'vue-router'


// 所有标签
const tags = ref([])

const requestParams = {
  current: 1, // 当前页码
  size: 10,   // 每页大小
}
getTagList(requestParams).then((res) => {
  if (res.data.success) {
    tags.value = res.data.data
  }
})
// 跳转标签文章列表页
const router = useRouter()
const goTagArticleListPage = (id: number, name: string) => {
  // 跳转时通过 query 携带参数（标签 ID、标签名称）
  router.push({path: '/tag/article/list', query: {id, name}})
  console.log("点击了")
}
</script>

<template>
  <div v-if="tags && tags.length > 0"
       class="w-full p-5 mb-3 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
    <!-- 标签标题 -->
    <h2 class="mb-2 font-bold text-gray-900 uppercase dark:text-white">标签</h2>
    <!-- 标签列表 -->
    <span v-for="(tag, index) in tags" :key="index" @click="goTagArticleListPage(tag.id, tag.name)"
          class="inline-block mb-1 cursor-pointer bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded hover:bg-green-200 hover:text-green-900 dark:bg-green-900 dark:text-green-300">
            {{ tag.name }}
        </span>
  </div>
</template>

<style scoped>

</style>
