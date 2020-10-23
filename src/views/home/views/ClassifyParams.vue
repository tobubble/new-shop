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
      <!-- 警告框 -->
      <el-alert
        title="注意: 只允许为第三急分类设置相关参数!"
        type="warning"
        show-icon
      >
      </el-alert>

      <!-- 选择商品分类 -->
      <!-- <div class="chooseGoods"> -->
      <el-row class="chooseGoods">
        <el-col>
          <span class="desc"> 选择商品分类: </span>
          <el-cascader
            class="chooseCascader"
            v-model="selectedGoodsId"
            :options="goodsCategoryInfo"
            @change="handleChange"
            :props="goodsOptions"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs 标签页 -->
      <el-tabs v-model="selectedTab" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="handleAddParamsButtonClick"
            :disabled="canAddParamsClick"
            type="primary"
            size="mini"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            @click="handleAddParamsButtonClick"
            :disabled="canAddParamsClick"
            type="primary"
            size="mini"
            >添加属性</el-button
          >
        </el-tab-pane>
      </el-tabs>

      <!-- 动态参数表格 -->
      <el-table
        :data="manyParamsData"
        border
        stripe
        v-if="selectedTab === 'many'"
      >
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag
              v-show="tag !== ''"
              :key="tag"
              v-for="tag in scope.row.attr_vals.split(',')"
              closable
              :disable-transitions="false"
              @close="handleClose(tag, scope.row)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(inputValue, scope.row)"
              @blur="handleInputConfirm(inputValue, scope.row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(scope.row)"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="editParams(scope.row)"
              type="primary"
              size="mini"
              icon="el el-icon-edit"
              >编辑</el-button
            >
            <el-button
              @click="deleteParams(scope.row)"
              type="danger"
              size="mini"
              icon="el el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 静态参数表格 -->
      <el-table :data="onlyParamsData" border stripe v-else>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag
              v-show="tag !== ''"
              :key="index"
              v-for="(tag, index) in scope.row.attr_vals.split(',')"
              closable
              :disable-transitions="false"
              @close="handleClose(tag, scope.row)"
            >
              {{ tag }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(inputValue, scope.row)"
              @blur="handleInputConfirm(inputValue, scope.row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(scope.row)"
              >+ New Tag</el-button
            >
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              @click="editParams(scope.row)"
              type="primary"
              size="mini"
              icon="el el-icon-edit"
              >编辑</el-button
            >
            <el-button
              @click="deleteParams(scope.row)"
              type="danger"
              size="mini"
              icon="el el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加参数和添加属性的对话框 -->
      <el-dialog
        title="添加"
        :visible.sync="addParamsDialogVisible"
        width="50%"
        @close="addDialogClose"
        :close-on-click-modal="false"
      >
        <span v-if="selectedTab === 'many'">添加参数</span>
        <span v-else>添加属性</span>
        <el-form
          :model="addParamsForm"
          :rules="addParamsFormRules"
          ref="addParamsForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            v-if="selectedTab === 'many'"
            label="参数名称"
            prop="attr_name"
          >
            <el-input v-model="addParamsForm.attr_name"></el-input>
          </el-form-item>
          <el-form-item v-else label="属性名称" prop="attr_name">
            <el-input v-model="addParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="putForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑参数的对话框 -->
      <el-dialog
        title="修改参数"
        :visible.sync="editParamsDialogVisible"
        width="50%"
        @close="editDialogClose"
        :close-on-click-modal="false"
      >
        <span v-if="selectedTab === 'many'">编辑参数</span>
        <span v-else>编辑属性</span>
        <el-form
          :model="editParamsForm"
          :rules="addParamsFormRules"
          ref="editDialogClose"
          label-width="100px"
        >
          <el-form-item
            v-if="selectedTab === 'many'"
            label="参数名称"
            prop="attr_name"
          >
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
          <el-form-item v-else label="属性名称" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editFormPut">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { breadcrumb } from "common/mixin";

import {
  goodsCategory,
  getGoodsParams,
  addGoodsParams,
  editGoodsParams,
  deleteGoodsParams,
  editGoodsParams2,
} from "network/goodsManager/classifyParams";

export default {
  mixins: [breadcrumb],
  data() {
    return {
      // 商品列表请求的参数
      goodsCategoryParams: {
        type: 3,
      },
      // 保存所有的商品分类信息
      goodsCategoryInfo: [],
      // 保存被选中的商品 id 数组
      selectedGoodsId: [],
      // 指定商品分类子元素的展示规则
      goodsOptions: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 报损tab标签中被选中的值, 默认选中第一个
      selectedTab: "many",
      // 动态参数的数据
      manyParamsData: [],
      // 静态参数的数据
      onlyParamsData: [],
      // 控制添加 对话框的显示与否
      addParamsDialogVisible: false,
      // 添加参数的表单数据
      addParamsForm: {
        attr_sel: this.selectedTab,
        attr_name: "",
        id: this.selectedGoodsIdPut,
      },
      // 添加属性的校验规则
      addParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 控制编辑对话框的显示与否
      editParamsDialogVisible: false,
      // 编辑参数的表单数据
      editParamsForm: {
        // 分类id
        id: "",
        // 属性 id
        attrid: "",
        // 新的属性名字
        attr_name: "",
        attr_sel: "",
      },
      // 保存删除请求的参数
      deleteParamsInfo: {
        id: "",
        attr_id: "",
      },
      // // 用来显示 tag 框还是 input 框
      // --------- 该属性添加到每一个商品当中
      inputVisible: false,
      // 用来绑定 input 框中的数值
      inputValue: "",
      // 正要编辑的商品参数的请求参数
      editGoodsParamsInfo: {
        id: "",
        attrId: "",
        attr_name: "",
        attr_sel: "",
        attr_vals: "",
      },
      // 将当前要修改的数据以字符串保存
      attr_vals: "",
    };
  },
  created() {
    this.getGoodsCategoryData();
  },
  methods: {
    // 获取所有商品分类的信息
    getGoodsCategoryData() {
      goodsCategory(this.goodsCategoryParams).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("请求数据失败");
        this.goodsCategoryInfo = res.data.data;
      });
    },
    // 监听级联选择器的选择
    handleChange(value) {
      // 选择的不是三级分类
      if (value.length != 3) {
        this.$message.error("请选择三级分类");
        this.selectedGoodsId = [];
        this.manyParamsData = []
        this.onlyParamsData = []
        return;
      }
      // 选中的是 三级分类
      this.getGoodsParamsByIdAndSel();
    },
    // 获取参数信息
    getGoodsParamsByIdAndSel() {
      getGoodsParams(this.selectedGoodsIdPut, this.selectedTab).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取参数信息失败");
        if (this.selectedTab === "many") {
          res.data.data.forEach((item) => {
            item.inputVisible = false;
          });
          this.manyParamsData = res.data.data;
        } else {
           res.data.data.forEach((item) => {
            item.inputVisible = false;
          });
          this.onlyParamsData = res.data.data;
        }
      });
    },
    // 监听 tab 被点击切换事件
    handleTabClick() {
      if (this.selectedGoodsId.length !== 3) {
        return false;
      }
      this.getGoodsParamsByIdAndSel();
    },
    // 监听添加参数按钮的点击
    handleAddParamsButtonClick() {
      this.addParamsDialogVisible = true;
    },
    // 监听对话框的退出事件
    addDialogClose() {
      this.$refs.addParamsForm.resetFields();
    },
    editDialogClose() {
      this.$refs.editDialogClose.resetFields();
    },
    // 监听表单确定按钮的点击
    putForm() {
      this.$refs.addParamsForm.validate((valid) => {
        // 没通过验证
        if (!valid) return;
        this.addGoodsParamsPut();
      });
    },
    // 添加参数的网络请求
    addGoodsParamsPut() {
      this.addParamsForm.attr_sel = this.selectedTab;
      this.addParamsForm.id = this.selectedGoodsIdPut;
      addGoodsParams(this.addParamsForm).then((res) => {
        if (res.data.meta.status !== 201)
          return this.$message.error("添加参数失败");
        this.$message.success("添加参数成功");
        // 刷新参数列表视图
        this.getGoodsParamsByIdAndSel();
        // 关闭对话框
        this.addParamsDialogVisible = false;
      });
    },
    // 监听编辑参数的点击
    editParams(node) {
      this.editParamsForm.id = node.cat_id;
      this.editParamsForm.attrid = node.attr_id;
      this.editParamsForm.attr_sel = node.attr_sel;
      this.editParamsForm.attr_name = node.attr_name;
      this.editParamsDialogVisible = true;
    },
    // 监听编辑对话框的提交按钮点击
    editFormPut() {
      this.$refs.editDialogClose.validate((valid) => {
        if (!valid) return;
        this.editGoodsParamsPut();
      });
    },
    // 请求修改参数信息
    editGoodsParamsPut() {
      editGoodsParams(this.editParamsForm).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("修改参数失败");
        this.$message.success("修改参数成功");
        // 更新视图
        this.getGoodsParamsByIdAndSel();
        this.editParamsDialogVisible = false;
      });
    },
    // 监听删除参数的按钮点击
    deleteParams(node) {
      this.deleteParamsInfo.id = node.cat_id;
      this.deleteParamsInfo.attr_id = node.attr_id;

      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteGoodsParamsPut();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除参数的请求
    deleteGoodsParamsPut() {
      deleteGoodsParams(this.deleteParamsInfo).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("删除参数失败");
        this.$message.success("删除参数成功");

        this.getGoodsParamsByIdAndSel();
      });
    },
    // 监听 参数的 tag 标签删除的点击
    handleClose(tag, node) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const arr = node.attr_vals.split(",");
          const index = arr.indexOf(tag);
          arr.splice(index, 1);
          const attr_vals = arr.join(",");
          this.editGoodsParamsInfo.attr_vals = attr_vals;
          this.editGoodsParamsInfo.attrId = node.attr_id;
          this.editGoodsParamsInfo.attr_name = node.attr_name;
          this.editGoodsParamsInfo.id = node.cat_id;
          this.editGoodsParamsInfo.attr_sel = node.attr_sel;
          this.editGoodsParams2Put(node);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 监听 inut 框中使用了 enter 按钮点击
    handleInputConfirm(tag, node) {
      // 如果输入值不为空
      if (this.inputValue) {
        // 添加一个数组到里面
        this.editGoodsParamsInfo.attr_vals =
          this.attr_vals + "," + this.inputValue;
        this.editGoodsParams2Put(node);
      }
      // 显示 tag 框
      node.inputVisible = false;
      // 将 input 框中的 model 值重置为 '',防止下次出现的时候是上个数据的值
      this.inputValue = "";
    },
    // 监听 添加新标签 的 tag 点击，将其转换成 input
    showInput(node) {
      // 将要修改的信息保存参数对象中
      this.attr_vals = node.attr_vals;
      this.editGoodsParamsInfo.attrId = node.attr_id;
      this.editGoodsParamsInfo.attr_name = node.attr_name;
      this.editGoodsParamsInfo.id = node.cat_id;
      this.editGoodsParamsInfo.attr_sel = node.attr_sel;
      node.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加参数的 val 请求
    editGoodsParams2Put(node) {
      editGoodsParams2(this.editGoodsParamsInfo).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("修改数据失败");
        this.$message.success("请求数据成功");
        // 更新视图（局部-> 更新局部的对应数据）
        node.attr_vals = res.data.data.attr_vals;
      });
      // 更新视图
      // node.
    },
  },
  computed: {
    // 计算属性，控制按钮是否可以点击
    canAddParamsClick() {
      if (this.selectedGoodsId.length !== 3) {
        return true;
      }
      return false;
    },
    // 根据是否选择了商品列表返回对应的 id
    selectedGoodsIdPut() {
      if (this.selectedGoodsId.length !== 3) {
        return null;
      }
      return this.selectedGoodsId[this.selectedGoodsId.length - 1];
    },
  },
};
</script>

<style lang='less' scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}

.chooseGoods {
  margin: 20px 0;
}

.desc {
  margin-right: 10px;
}

.chooseCascader {
  width: 350px;
}

.el-tabs {
  margin-bottom: 20px;
}

.el-tag {
  margin: 5px;
}

.button-new-tag {
  margin: 5px;
}

.input-new-tag {
  width: 140px;
  margin: 5px;
  vertical-align: bottom;
}
</style>