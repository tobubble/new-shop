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
      <!-- 搜索订单 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="搜索订单" v-model="searchValue">
            <el-button
              @click="searchClick"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单表格 -->
      <el-table :data="orderListInfo.goods" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="90px">
        </el-table-column>
        <el-table-column label="是否付款" prop="order_number" width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay !== '0'"
              >已付款</el-tag
            >
            <el-tag type="warning" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="80px"
          align="center"
        >
        </el-table-column>
        <el-table-column label="下单时间" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.update_time | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="order_number" width="120px">
          <template>
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="editLocation"
            ></el-button>
            <el-button
              icon="el-icon-location-outline"
              size="mini"
              type="success"
              @click="showBoxMessage"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getListParams.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orderListInfo.total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog
      @close="editDialogClose"
      title="修改地址"
      :visible.sync="editDiologVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="location">
          <el-cascader
            v-model="editForm.location"
            :props="cityDataProps"
            :options="cityData"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="fullLocation">
          <el-input v-model="editForm.fullLocation"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDiologVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDiologVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressDioalog" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in fakeProgressData"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { breadcrumb } from "common/mixin";

import { oderList, kuaidiProgress } from "network/orderList/order";

import cityData from "common/citydata";

export default {
  mixins: [breadcrumb],
  data() {
    return {
      // 保存 搜索框的值
      searchValue: "",
      // 保存 获取商品列表的参数
      getListParams: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      // 保存所有返回的订单列表数据
      orderListInfo: {
        goods: [],
        pagenum: "",
        total: null,
      },
      // 保存修改地址对话框中的表单项
      editForm: {
        location: [], // 级联选择器的内容他是一个数组
        fullLocation: "",
      },
      // 保存所有城市的数据
      cityData,
      // 控制修改按钮的对话框显示与否
      editDiologVisible: false,
      // 控制修物流信息对话框显示与否
      progressDioalog: false,
      // 定义城市级联选择器的 props 属性
      cityDataProps: {},

      // 修改地址的表单验证项
      editRules: {
        location: [
          { required: true, message: "请填写所在的地址", trigger: "blur" },
        ],
        fullLocation: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    // 请求数据方法
    // 获取所有的订单数据列表
    getOrderList() {
      oderList(this.getListParams).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取数据失败");
        this.orderListInfo = res.data.data;
        console.log(this.orderListInfo);
      });
    },
    // 请求获取快递信息
    getKuaidiProgress() {
      kuaidiProgress().then((res) => {
        console.log(res);
      });
    },

    // 事件监听方法
    // 分页器的每页数量变化
    handleSizeChange(size) {
      this.getListParams.pagesize = size;
      this.getOrderList();
    },
    // 分页器的当前页数改变
    handleCurrentChange(page) {
      this.getListParams.pagenum = page;
      this.getOrderList();
    },
    // 监听搜索按钮的点击
    searchClick() {
      this.getListParams.query = this.searchValue;
      this.getListParams.pagenum = 1;
      console.log(this.getListParams);
      this.getOrderList();
    },
    // 监听修改地址按钮点击
    editLocation() {
      this.editDiologVisible = true;
    },
    // 监听地址级联选择器的修改
    handleChange() {},
    // 监听修改地址对话框的关闭
    editDialogClose() {
      this.$refs.editForm.resetFields();
    },
    // 监听货物的物流信息(location图标的点击)
    showBoxMessage() {
      this.progressDioalog = true;
      this.$message.success("接口暂不支持查询物流，使用假信息代替");
    },
  },
  computed: {
    fakeProgressData() {
      return [
        {
          time: "2020-09-11 09:39:00",
          context: "已签收，感谢再次使用顺丰，期待再次为您服务",
        },
        {
          time: "2020-09-10 14:39:00",
          context: "[湖北省] 武汉江夏 顺丰速递 93358为您派件",
        },
        {
          time: "2020-09-10 09:39:00",
          context: "[湖北省] 湖北市 顺丰速递 93358为您派件",
        },
        {
          time: "2020-09-09 16:39:00",
          context: "[湖南省] 湖北市 顺丰速递 93358为您派件",
        },
        {
          time: "2020-09-09 09:39:00",
          context: "[上海市] 上海 顺丰速递 93358为您派件",
        },
      ];
    },
  },
};
</script>

<style lang='less' scoped>
.el-card {
  margin: 20px 0 0 0;
}

.el-table {
  font-size: 12px;
}

.el-cascader {
  width: 100%;
}
</style>