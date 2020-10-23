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
      <!-- alert消息提示 -->
      <el-alert
        title="添加商品信息"
        :closable="false"
        type="info"
        center
        show-icon
      >
      </el-alert>

      <!-- step 导航页 -->
      <el-steps align-center :active="activeIndex" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单验证项 -->
      <el-form
        label-position="top"
        :model="addGoodsRuleForm"
        :rules="addGoodsRules"
        ref="addGoodsRuleForm"
        label-width="100px"
      >
        <!-- 左侧的 tabs 导航 -->
        <el-tabs ref="tabsNav" :before-leave="tabsSwitch" tab-position="left">
          <el-tab-pane label="基本信息">
            <!-- 基本信息中的表单 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsRuleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="addGoodsRuleForm.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model="addGoodsRuleForm.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="addGoodsRuleForm.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_catArr">
              <!-- 商品分类选择框 -->
              <el-cascader
                clearable
                :options="goodsCategory"
                @change="handleChange"
                :props="showRules"
                v-model="addGoodsRuleForm.goods_catArr"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item
              class="paramsBar"
              v-for="item in goodsParams"
              :key="item.attr_id"
            >
              <div>{{ item.attr_name }}</div>
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  v-for="item2 in item.attr_vals"
                  :key="item2"
                  :label="item2"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item
              v-for="item in goodsOnlyParams"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input :value="item.attr_vals[0]"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <!-- action 表示图片要上传到的 api 接口地址 -->
            <!-- list-type属性可以指定upload 的渲染效果 -->
            <el-upload
              :headers="uploadHeader"
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <quill-editor
              ref="myQuillEditor"
              v-model="addGoodsRuleForm.goods_introduce"
            />

            <el-button @click="addGoodsPutForm" class="addGoods" type="primary"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imgPreviewDialogVisible"
      width="30%"
    >
      <img :src="imgSrc" class="preImg" />
    </el-dialog>
  </div>
</template>

<script>
import { breadcrumb } from "common/mixin";

import { goodsCategory2 } from "network/goodsManager/goodsCategory";
import { getGoodsParams } from "network/goodsManager/classifyParams";
import { addGoods } from "network/goodsManager/goodsList";

export default {
  mixins: [breadcrumb],
  data() {
    return {
      // 保存 steps 导航中的 激活项索引
      activeIndex: 0,
      // 保存表单中的值
      addGoodsRuleForm: {
        goods_name: "", // 商品名称

        goods_catArr: [], // 商品分类 '1,2,3' 三级分类
        goods_cat: "", // 商品分类 '1,2,3' 三级分类
        goods_price: null, // 商品价格
        goods_number: null, // 商品数量
        goods_weight: null, // 商品重量
        goods_introduce: "", // 商品介绍
        pics: [], // 商品上传的图片临时路径（对象）
        attrs: [], // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
      },
      // 保存商品分类数据
      goodsCategory: [],
      // 保存选择框中的分类 id
      selectedId: [],
      // 保存商品分类的动态参数信息
      goodsParams: [],
      // 保存商品分类的静态参数信息
      goodsOnlyParams: [],
      // 保存预览图片的 url
      imgSrc: "",

      // 定义校验和其他的规则
      // 定义验证规则
      addGoodsRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_catArr: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
      },
      // 定义级联选择的展示规则
      showRules: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      // url地址
      // 上传图片的 url 地址
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
      // 上传图片的请求头
      uploadHeader: {
        Authorization: window.sessionStorage.getItem("token"),
      },

      // 控制组件的展示与关闭
      imgPreviewDialogVisible: false,
    };
  },
  created() {
    this.getGoodsCategory();
  },
  methods: {
    // 事件监听方法
    // 监听级联选择框中的数据点击
    handleChange(idArr) {
      // 点击的不是三级分类
      if (idArr.length !== 3) {
        this.addGoodsRuleForm.goods_catArr = [];
        return this.$message.error("请选择三级商品");
      }
      const id = idArr.join(",");
      console.log(idArr);
      console.log(id);
      this.addGoodsRuleForm.goods_cat = id;
    },
    // 监听 tabs 的切换
    tabsSwitch(nextTab, nowTab) {
      // 当前的是第一个 tab(切换的是同一个页面)
      if (nextTab === nowTab) {
        {
          this.activeIndex = +nextTab;
          return true;
        }
      } else if (
        nowTab == 0 &&
        this.addGoodsRuleForm.goods_catArr.length !== 3
      ) {
        this.$message.error("请完成当前页面");
        console.log();
        return false;
      } else {
        this.activeIndex = +nextTab;
        // 如果切换的是第二个商品参数列表的话
        // 基本信息跳转到商品参数信息
        // if (nextTab === "1") {
        //   this.getGoodsParamsById();
        // }
        switch (nextTab) {
          case "1":
            this.getGoodsParamsById();
            break;
          case "2":
            this.getGoodsOnlyParamsById();
            break;
        }
      }
    },
    // 监听图片预览事件
    handlePreview(file) {
      console.log(file);
      this.imgPreviewDialogVisible = true;
      const url = file.response.data.url;
      this.imgSrc = url;
    },
    // 监听图片移除事件
    handleRemove(file, fileList) {
      console.log(this.addGoodsRuleForm.pics);
      /*
        1. 获取将要删除的图片的临时路径
        2. 从 pics 数组中，找到这个图片的对应索引值
        3. 调用数组的 splice 方法，把图片从信息对象，从 pics 数组中移除
      */
      const temPath = file.response.data.tmp_path;
      const index = this.addGoodsRuleForm.pics.findIndex((item) => {
        return item.pic == temPath;
      });

      console.log(index);

      this.addGoodsRuleForm.pics.splice(index, 1);

      console.log(this.addGoodsRuleForm.pics);
    },
    // 监听图片上传成功事件
    uploadSuccess(response, file, fileList) {
      console.log(response);
      const picInfo = { pic: response.data.tmp_path };
      this.addGoodsRuleForm.pics.push(picInfo);
      console.log(this.addGoodsRuleForm.pics);
    },
    // 监听 提交表单按钮的点击（提交表单）
    addGoodsPutForm() {
      console.log(this.addGoodsRuleForm);
      console.log(this.goodsParams);
      console.log(this.goodsOnlyParams);
      this.$refs.addGoodsRuleForm.validate((valid) => {
        // 表单预校验失败
        if (!valid) return this.$message.error("请填写必要的表单项目");
        // 验证成功
        this.goodsParams.forEach((item) => {
          const attrValue = item.attr_vals.join(",");
          const attr = { attr_id: item.attr_id, attr_value: attrValue };
          this.addGoodsRuleForm.attrs.push(attr);
        });

        this.goodsOnlyParams.forEach((item) => {
          const attrValue = item.attr_vals.join(",");
          const attr = { attr_id: item.attr_id, attr_value: attrValue };
          this.addGoodsRuleForm.attrs.push(attr);
        });

        // 请求添加商品
        this.addGoodsPut()
      });
    },

    // 数据获取
    // 获取商品的数据
    getGoodsCategory() {
      goodsCategory2().then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("请求数据失败");
        this.goodsCategory = res.data.data;
      });
    },
    // 根据 id 获取动态参数
    getGoodsParamsById() {
      getGoodsParams(
        this.addGoodsRuleForm.goods_catArr[
          this.addGoodsRuleForm.goods_catArr.length - 1
        ],
        "many"
      ).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取参数失败");

        res.data.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
          if (!item.attr_vals[0]) {
            item.attr_vals.shift();
          }
        });
        this.goodsParams = res.data.data;
      });
    },
    // 根据 id 获取静态参数列表
    getGoodsOnlyParamsById() {
      getGoodsParams(
        this.addGoodsRuleForm.goods_catArr[
          this.addGoodsRuleForm.goods_catArr.length - 1
        ],
        "only"
      ).then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取参数失败");
        console.log(res);
        res.data.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
          if (!item.attr_vals[0]) {
            item.attr_vals.shift();
          }
        });
        this.goodsOnlyParams = res.data.data;
      });
    },
    // 向服务器发送商品添加的请求
    addGoodsPut() {
      console.log(this.addGoodsRuleForm);
      addGoods(this.addGoodsRuleForm).then((res) => {
        console.log(res);
        if (res.data.meta.status !== 201)
          return this.$message.error("添加商品失败");

        this.$message.success("添加商品成功");
        // 重置表单
        this.addGoodsRuleForm = {
          goods_name: "", // 商品名称

          goods_catArr: [], // 商品分类 '1,2,3' 三级分类
          goods_cat: "", // 商品分类 '1,2,3' 三级分类
          goods_price: null, // 商品价格
          goods_number: null, // 商品数量
          goods_weight: null, // 商品重量
          goods_introduce: "", // 商品介绍
          pics: [], // 商品上传的图片临时路径（对象）
          attrs: [], // 商品的参数（数组），包含 `动态参数` 和 `静态属性`
        };
        // 返回基本信息(step返回第一步)
        this.activeIndex = 0
      });
    },
  },
};
</script>

<style lang='less' scoped>
.el-steps {
  margin: 20px;
  margin-top: 30px;
  // font-size: 12px;
  height: 100%;
}

/deep/ .el-step__title {
  font-size: 14px;
}

.el-card {
  margin-top: 20px;
}

.aaa {
  background: #bfa;
}

.el-tab-pane {
  min-height: 100%;
}

.el-cascader {
  width: 300px;
}

.paramsBar {
  margin: 20px;
  margin-top: 0;

  .el-checkbox {
    margin: 0;
  }
}

.preImg {
  width: 100%;
}

/deep/ .ql-container {
  min-height: 300px;
}

.addGoods {
  margin-top: 10px;
}
</style>