<script lang="ts">
import { defineComponent, watch } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  props: {
    value: { // 属性值名称
      type: Object, // 类型为对象
      default: null // 默认为 null
    }
  },
  setup(props) {
    // 初始化折线图
    function initLineChat() {
      var chartDom = document.getElementById('lineChat');
      if (!chartDom) return; // 确保元素存在
      var myChart = echarts.init(chartDom);

      // 从 props.value 中获取日期集合和 pv 访问量集合
      const pvDates = props.value.pvDates;
      const pvCounts = props.value.pvCounts;

      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params:any) => {
            const dataIndex = params[0].dataIndex;
            const date = pvDates[dataIndex];
            const count = pvCounts[dataIndex];
            return `Date: ${date}<br>Count: ${count}`;
          }
        },
        xAxis: {
          type: 'category',
          data: pvDates // x 轴数据
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: pvCounts, // 设置 pv 访问量
            type: 'line'
          }
        ]
      };

      myChart.setOption(option);
    }

    // 侦听属性, 监听 props.value 的变化，一旦 props.value 发生变化，就调用 initLineChat 初始化折线图
    watch(() => props.value, () => initLineChat());

    return {};
  }
});
</script>



<template>
  <!-- PV 折线图容器 -->
  <div id="lineChat" class="overflow-x-auto w-full h-60"></div>
</template>

<style scoped>

</style>
