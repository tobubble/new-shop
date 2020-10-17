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
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button @click="addClassify" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        v-if="Refresh"
        class="addClassify"
        :data="goodsInfo"
        style="width: 100%; margin-bottom: 20px"
        row-key="cat_id"
        border
        stripe
        :lazy="true"
        :load="load"
        :tree-props="{ children: 'children', hasChildren: 'children' }"
      >
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="180">
        </el-table-column>
        <el-table-column label="是否有效" width="180">
          <template slot-scope="scope">
            <i
              v-if="!scope.row.cat_deleted"
              class="el el-icon-circle-check"
            ></i>
            <i v-else class="el el-icon-circle-close"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag
              size="mini"
              v-else-if="scope.row.cat_level === 1"
              type="success"
              >二级</el-tag
            >
            <el-tag size="mini" v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="editClassifyNameById(scope.row.cat_id)"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              @click="deletClassifyById(scope.row.cat_id)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsParams.pagenum"
        layout="total, sizes, prev, pager, next, jumper"
        :total="+totalNum"
        :page-sizes="[3, 5, 10]"
        :page-size="5"
      >
      </el-pagination>

      <!-- 分页区域 -->
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addClassifyDialogVisible"
      width="50%"
      @close="dialogCloseHandle"
    >
      <el-form
        ref="addClassifyForm"
        :model="addClassifyForm"
        label-width="100px"
        :rules="addClassifyRules"
      >
        <el-form-item label="分类名称 : " prop="cat_name">
          <el-input v-model="addClassifyForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称 : ">
          <!-- options 用来指定数据 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            ref="cascader"
            :clearable="true"
            :props="props"
            v-model="selectedKeys"
            :options="parentGoodsInfo"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addClassifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClassifySubmitHandle"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editClassifyDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      @close="resetEditDialog"
    >
      <el-form
        :rules="editClassify"
        ref="editClassifyName"
        :model="editClassifyName"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editClassifyName.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editClassifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
window.arr3 = [];

import { breadcrumb } from "common/mixin";

import { goodsCategory } from "network/goodsManager/goodsCategory";
import {
  addGoodsClassify,
  deleteGoodsClassify,
  editGoodsClassifyName,
  searchGoodsClassifyName,
} from "network/goodsManager/addGoodsClassify";
export default {
  mixins: [breadcrumb],
  data() {
    return {
      // 保存当前的商品的页码和分类列表 默认位 3 和 1
      goodsParams: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      parentGoddsParams: {
        type: 2,
      },
      // 保存当前页码的商品数据信息
      goodsInfo: [],
      // 保存总的数据条数
      totalNum: "",
      // 控制添加分类对话框的出现与否
      addClassifyDialogVisible: false,
      // 保存添加分类表单的数据
      addClassifyForm: {
        // 分类名
        cat_name: "",
        // 分类的等级
        cat_level: "",
        // 分类的父id
        cat_pid: "",
      },
      // 表单验证
      addClassifyRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 保存parent列表的数据
      parentGoodsInfo: [],
      // 指定 props 规则，用来表明渲染规则
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      // 用来保存级联选择器的选中值(保存的是 id )
      selectedKeys: [],
      // 控制界面刷新
      Refresh: true,
      // 控制编辑分类对话框的出现
      editClassifyDialogVisible: false,
      // 保存分类表单的表单数据
      editClassifyName: {
        id: "",
        cat_name: "",
      },
      // 编辑名称的表单验证规则
      editClassify: {
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
        ],
      },
    };
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  created() {
    this.getGoodsCategory();
  },
  // 这里，当我们挂载了组件的时候，我们要先获取到数据再进行更新视图，那么我们使用 beforeUpdate
  beforeUpdate() {},
  methods: {
    // 获取商品列表信息(不传递蚕参数的话默认就是所有的分类)
    getGoodsCategory() {
      goodsCategory(this.goodsParams).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取数据失败");
        // 赋值总商品数据
        this.goodsInfo = res.data.data.result;
        // 赋值总条数
        this.totalNum = res.data.data.total;
      });
    },
    // 获取分类 parent 的分类列表
    getParentCategory() {
      goodsCategory(this.parentGoddsParams).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取数据失败");
        this.parentGoodsInfo = res.data.data;
        console.log(this.parentGoodsInfo);
      });
    },
    // 简单的数组去重
    unique(arr) {
      return Array.from(new Set(arr));
    },
    // 监听每页显示数据的改变
    handleSizeChange(pagesize) {
      this.goodsParams.pagesize = pagesize;
      this.getGoodsCategory(this.goodsParams);
    },
    // 监听页码的改变
    handleCurrentChange(pagenum) {
      this.goodsParams.pagenum = pagenum;
      this.getGoodsCategory(this.goodsParams);
    },
    // 懒加载 ---- 需要展示数据的时候
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve(tree.children);
      });
    },
    // 监听添加分类按钮的点击
    addClassify() {
      this.getParentCategory();
      this.addClassifyDialogVisible = true;
    },
    // 监听 级联选择器的选中 （选择项发生变化）
    handleChange(value) {
      // 如果选择的数据不为空,那么
      if (value.length > 0) {
        this.addClassifyForm.cat_pid = value[value.length - 1];
        this.addClassifyForm.cat_level = value.length;
        return;
      } else {
        this.addClassifyForm.cat_pid = 0;
        this.addClassifyForm.cat_level = 0;
      }
    },
    // 监听对话框的关闭事件
    dialogCloseHandle() {
      // 重置表单(这一项就只重置了 cat_name) 原因是后面的数据通过级联选择器绑定的不属于 表单的重置内容
      this.$refs.addClassifyForm.resetFields();
      // 重置级联选择
      this.selectedKeys = [];
      // 重置 表单中要提交的数据
      this.addClassifyForm.cat_level = 0;
      this.addClassifyForm.cat_pid = 0;
    },
    // 刷新视图
    reload() {
      this.Refresh = false;
      this.$nextTick(function () {
        this.Refresh = true;
      });
    },
    // 添加分类表单中的确定按钮点击
    addClassifySubmitHandle() {
      this.$refs.addClassifyForm.validate((valid) => {
        // 通过预验证
        if (valid) {
          addGoodsClassify(this.addClassifyForm).then((res) => {
            console.log(res.data);
            if (res.data.meta.status !== 201) {
              return this.$message.error("创建分类失败");
            }
            this.$message.success("创建分类成功");
            // 刷新数据列表（由于使用的是懒加载的方式储存，那么我们需要使用特殊的方法更新视图）
            this.getGoodsCategory();
            // 使用这个更新视图
            this.reload();
            this.addClassifyDialogVisible = false;
          });
        }
      });
    },
    //  根据 id 删除对应的分类
    deletClassifyById(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteGoodsClassify(id).then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error("删除分类失败");
          });
          // 删除数据成功
          this.$message.success("删除分类成功");
          // 更新视图
          this.getGoodsCategory();
          this.reload();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 根据 id 编辑分类名称
    editClassifyNameById(id) {
      searchGoodsClassifyName(id).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取分类名称失败");
        this.editClassifyName.cat_name = res.data.data.cat_name;
        this.editClassifyName.id = id;
        this.editClassifyDialogVisible = true;
      });
    },
    // 监听 编辑分类对话框的离开(重置对话框的表单)
    resetEditDialog() {
      this.$refs.editClassifyName.resetFields();
    },
    // 监听 编辑分类对话框确定的 点击
    editDialogConfirm() {
      // 判断是否通过表单验证
      this.$refs.editClassifyName.validate(valid => {
        if(!valid) return
        editGoodsClassifyName(this.editClassifyName).then(res => {
          if(res.data.meta.status !== 200) return this.$message.error("修改分类名称失败")
          this.$message.success("修改分类名称成功")
          // 更新视图
          this.getGoodsCategory()
          this.reload()
          // 关闭对话框
          this.editClassifyDialogVisible = false
        })
      })
    }
 },
};
</script>

<style lang='less' scoped>
.el-card {
  margin-top: 20px;
}

.el-icon-circle-check {
  font-size: 18px;
  color: #67c23a;
}

.el-icon-circle-close {
  font-size: 18px;
  color: #f56c6c;
}

.addClassify {
  margin-top: 20px;
}

.el-cascader {
  width: 100%;
}
</style>