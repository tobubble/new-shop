<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in pathArr" :key="index">{{
        pathArr[index]
      }}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 表格区域 -->
      <el-table stripe :data="rightsListData" style="width: 100%" :border="true">
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { breadcrumb } from "common/mixin";

import {getRootList} from "network/root/getRootList"

export default {
  mixins: [breadcrumb],
  data() {
    return {
      rightsListData: [],
    };
  },
  created() {
    this.getRootListData()
  },
  methods: {
    async getRootListData() {
      const {data: res} = await getRootList()
      if(res.meta.status !== 200) return this.$message.error("获取权限列表信息失败")
      console.log(res)
      this.rightsListData = res.data
    }
  }
};
</script>

<style lang='less' scoped>
.el-card {
  margin-top: 20px;
}

.rightsLevelButton {
  background: #edf5ff;
  color: #7da7c8;
}
</style>