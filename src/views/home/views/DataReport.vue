<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in pathArr" :key="index">{{
        pathArr[index]
      }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div
        id="main"
        style="width: 750px; height: 400px"
        v-if="chartsData.legend.data"
      ></div>
    </el-card>
  </div>
</template>

<script>
import { breadcrumb } from "common/mixin";

import { chartsData } from "network/chartsData/chartsData";

export default {
  mixins: [breadcrumb],
  data() {
    return {
      // 保存表格的数据
      chartsData: {
        legend: { data: [] },
        series: [],
        xAxis: [],
        yAxis: [],
      },
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
      },
    };
  },
  methods: {
    // 定义绘制表格的方法
    drawCharts() {
      // 基于展示好的 dom， 初始化 echarts 实例
      let myChart = this.$echarts.init(document.getElementById("main"));
      // 准备数据和配置项
      //  let option = {
      //       title: {
      //           text: 'ECharts 入门示例'
      //       },
      //       tooltip: {},
      //       legend: {
      //           data:['销量']
      //       },
      //       xAxis: {
      //           data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      //       },
      //       yAxis: {},
      //       series: [{
      //           name: '销量',
      //           type: 'bar',
      //           data: [5, 20, 36, 10, 10, 20]
      //       }]
      //   };
      // 展示数据
      let chartsData = {};
      for (let key in this.chartsData) {
        chartsData[key] = this.chartsData[key];
      }
      for (let key in this.options) {
        chartsData[key] = this.options[key];
      }
      console.log(chartsData);
      myChart.setOption(chartsData);
    },
    // 获取表格的数据
    getChartsData() {
      chartsData().then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("表格数据请求失败");
        this.chartsData = res.data.data;
      });
    },
  },
  mounted() {
    this.drawCharts();
  },
  created() {
    this.getChartsData();
  },
  updated() {
    this.$nextTick(() => {
      this.drawCharts();
    });
  },
};
</script>

<style lang='less' scoped>
.el-card {
  margin-top: 20px;
}
</style>