<script lang="ts">
import { defineComponent, reactive, watch } from 'vue';
import gsap from 'gsap';

export default defineComponent({
  props: {
    value: { // 定义属性
      type: Number,
      default: 0
    }
  },
  setup(props) {
    // 响应式对象
    const d = reactive({
      num: 0
    });

    // 动画函数
    function animateToValue() {
      gsap.to(d, {
        duration: 0.5,
        num: props.value
      });
    }

    // 初始动画
    animateToValue();

    // 监听 props.value 的变化
    watch(() => props.value, animateToValue);

    return {
      d
    };
  }
});
</script>

<template>
  <!-- 显示 d.num 属性的四舍五入值 -->
  <div class="font-bold text-2xl">{{ d.num.toFixed(0) }}</div>
</template>

<style scoped>
/* 添加一些基本样式 */
</style>
