<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in pathArr" :key="index">{{
        pathArr[index]
      }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 商品查询行 -->
      <el-input v-model="searchValue" clearable class="input-with-select">
        <el-button
          @click="searchGoods"
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>
      <el-button @click="addGoods" type="primary">添加商品</el-button>

      <!-- 商品表格 -->
      <el-table :data="goodsListData.goods" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          class-name="goodName"
          label="商品名称"
          prop="goods_name"
          width="650"
        ></el-table-column>
        <el-table-column
          width="110px"
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          width="90px"
          label="商品重量"
          prop="goods_weight"
        ></el-table-column>
        <el-table-column width="140px" label="创建时间" style="width: 110px">
          <template slot-scope="scope">
            <span class="goodTime">{{ scope.row.add_time | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="+goodsListData.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsListData.total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加商品对话框 -->
    <!-- <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog> -->
  </div>
</template>

<script>
import { breadcrumb } from "common/mixin";

import { getGoodList } from "network/goodsManager/goodsList";

export default {
  mixins: [breadcrumb],
  data() {
    return {
      // 保存商品查询中的输入框数据
      searchValue: "",
      // 保存请求商品数据的参数
      goodsListParams: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      // 保存商品列表数据
      goodsListData: {
        // 商品总数据
        goods: [],
        // 商品当前的页数
        pagenum: 1,
        // 商品的总条数
        total: null,
      },
      //
    };
  },
  created() {
    this.getGoodListPut();
  },
  methods: {
    // 数据请求方法
    // 数据请求
    // 定义获取商品列表的请求
    getGoodListPut() {
      getGoodList(this.goodsListParams).then((res) => {
        this.goodsListParams.query = this.searchValue
        if (res.data.meta.status !== 200)
          return this.$message.error("请求数据失败");

        this.goodsListData = res.data.data;
        console.log(this.goodsListData);
      });
    },
    // 定义请求搜索商品数据的请求
    searchGoodsPut() {
      console.log(this.searchValue);
      getGoodList({
        query: this.searchValue,
        pagenum: 1,
        pagesize: this.goodsListParams.pagesize,
      }).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("请求数据失败");
        this.goodsListData.goods = res.data.data.goods;
        this.goodsListData.pagenum = res.data.data.pagenum;
        this.goodsListData.total = res.data.data.total;
        this.$message.success("查询成功");
      });
    },

    // 事件监听
    // 监听 分页器的每页数量变化
    handleSizeChange(size) {
      this.goodsListParams.pagesize = size;
      this.getGoodListPut();
    },
    // 监听分页器的页数变化
    handleCurrentChange(num) {
      console.log(num);
      this.goodsListParams.pagenum = num;
      this.getGoodListPut();
    },
    // 监听查询商品按钮点击
    searchGoods() {
      this.searchGoodsPut();
    },
    // 监听添加 添加商品 按钮的点击
    addGoods() {
      this.$router.push('addGoodsCpn')
    }
  },
};
</script>

<style lang='less' scoped>
.el-card {
  margin-top: 20px;
}

.input-with-select {
  width: 350px;
  margin-right: 20px;
}

/deep/ .el-table__row /deep/ .goodName {
  font-size: 12px;
}

.el-table {
  margin-top: 20px;
}

.goodTime {
  font-size: 12px;
}
</style>