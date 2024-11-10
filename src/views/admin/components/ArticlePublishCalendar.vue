<script lang="ts">
import { defineComponent, watch } from 'vue'
import * as echarts from 'echarts'
import { format, subMonths } from 'date-fns'

export default defineComponent({
  props: {
    value: { // 属性值名称
      type: Object, // 类型为对象
      default: null // 默认为 null
    }
  },
  setup(props) {
    // 当前日期
    const currentDate = new Date();
    // 半年前
    const sixMonthsAgo = subMonths(currentDate, 6)

    // 格式化后的开始、结束日期
    const startDate = format(sixMonthsAgo, 'yyyy-MM-dd')
    const endDate = format(currentDate, 'yyyy-MM-dd')

    // 日历热点数据
    const myData: [string, number][] = []

    // 初始化日历热点图
    function initCalendar() {
      // 将传入的数据设置到 myData 数组中
      let map = props.value
      for (let key in map) {
        myData.push([
          key,
          (map as Record<string, number>)[key] // 明确声明类型
        ]);
      }

      var chartDom = document.getElementById('calendar');
      if (!chartDom) return; // 确保元素存在
      var myChart = echarts.init(chartDom);

      const option = {
        visualMap: {
          show: false,
          min: 0,
          max: 10
        },
        calendar: { // 日历显示的范围：开始日期 - 结束日期
          range: [startDate, endDate],
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: myData
        },
        gradientColor: [ // 自定义热点颜色，参考了 GitHub 代码提交的颜色
          '#fff',
          '#40c463',
          '#30a14e',
          '#216e39',
        ]
      };

      myChart.setOption(option);
    }

    // 侦听属性, 监听 props.value 的变化，一旦 props.value 发生变化，就调用 initCalendar 初始化日历热点图
    watch(() => props.value, () => initCalendar());

    return {};
  }
});
</script>


<template>
  <!-- 日历热点图容器 -->
  <div id="calendar" class="overflow-x-auto w-full h-60"></div>
</template>

<style scoped>

</style>
