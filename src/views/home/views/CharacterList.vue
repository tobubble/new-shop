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
      <!-- 添加角色按钮 -->
      <el-button type="primary">添加角色</el-button>
      <el-table
        :data="characterList"
        style="width: 100%; margin-bottom: 20px; margin-top: 20px"
        border
        stripe
      >
        <el-table-column type="expand" width="50">
          <template slot-scope="scope">
            <el-row
              type="flex"
              align="middle"
              class="borderBottom"
              :class="{ borderTop: index1 === 0 }"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="closeAuth(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  class="vcenter"
                  :class="{ borderTop: index2 !== 0 }"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="7"
                    ><el-tag
                      closable
                      @close="closeAuth(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="17">
                    <el-col>
                      <el-tag
                        class="tagRight"
                        v-for="item3 in item2.children"
                        :key="item3.id"
                        type="warning"
                        closable
                        @close="closeAuth(scope.row, item3.id)"
                        >{{ item3.authName }}</el-tag
                      >
                    </el-col>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 点击权限删除的弹出框 -->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="address" label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              @click="showRightAuthDialog(scope.row)"
              size="mini"
              type="warning"
              icon="el-icon-setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      width="50%"
      :close-on-click-modal="false"
    >
      <!-- 树形权限列表 -->
      <el-tree
        :data="rightTree"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkKeyArr"
        ref="tree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRightHandle"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { breadcrumb } from "common/mixin";

import { getCharacter } from "network/root/getCharacter";
import { deleteRightById } from "network/root/deleteRightById";
import { getRootTree } from "network/root/getRootList";
import { allotRight } from "network/root/allotRight";

export default {
  mixins: [breadcrumb],
  data() {
    return {
      // 保存所有的角色权限
      characterList: [],
      // 控制权限管理对话框的弹出
      rightDialogVisible: false,
      // 保存权限树
      rightTree: [],
      // 定义书的 props 选项
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 当前默认的被选中的节点 id
      checkKeyArr: [],
      // 当前要修改权限的 id
      roleId: '',
    };
  },
  created() {
    this.getCharacterData();
    // 获取权限树
    this.getAllRightTree();
  },
  methods: {
    // 获取角色列表数据
    async getCharacterData() {
      const { data: res } = await getCharacter();
      if (res.meta.status !== 200)
        return this.$message.error("获取数据列表失败");
      console.log(res);
      this.characterList = res.data;
    },
    // 点击 x 关闭权限的事件监听
    closeAuth(role, rightId) {
      this.$confirm("此操作将删除对应权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteRightById(role, rightId).then((res) => {
            if (res.data.meta.status !== 200)
              return this.$message.error("取消权限失败");
            console.log(res);
            this.$message.success("删除权限成功");
            // this.getCharacterData() 不建议这样使用，会整体刷新
            role.children = res.data.data; // 建议这样，局部赋值然后局部刷新
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击修改权限弹出对话框
    showRightAuthDialog(role) {
      // 将我们要修改权限的角色的 id 保存
      this.roleId = role.id
      // 初始化 选中的权限
      this.checkKeyArr = [];
      // 通过递归函数，将当前角色的 三级权限 id 放入到 checkKeyArr 中
      this.getLeafKeys(role, this.checkKeyArr);
      // 通过 refs 获取到 tree , 的 setCheckedNodes 方法来渲染选中与否
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.checkKeyArr)
      })
      this.rightDialogVisible = true;
    },
    // 获取权限树列表
    getAllRightTree() {
      getRootTree().then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取权限列表失败");
        this.rightTree = res.data.data;
      });
    },
    // 通过递归函数，将三级节点的 id 值保存到一个数组当中
    getLeafKeys(node, arr) {
      // 如果不包含有 children 属性，那么就是三级权限，将 id 保存到 arr 中
      if (!node.children) {
        return arr.push(node.id);
      } else {
        // 如果包含有 children 属性那么
        node.children.forEach((item) => {
          this.getLeafKeys(item, arr);
        });
      }
    },
    allotRightHandle() {
      // 获取到 tree 上单行角色的 选中的权限 id
      let checkKeys = this.$refs.tree.getCheckedKeys()
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // 将权限 id 解构赋值到一个新的数组当中
      const arr = [...checkKeys, ...halfCheckedKeys]
      const rids = arr.join(",")
      // 发送赋值权限的请求
      allotRight(this.roleId, rids).then(res => {
        if(res.data.meta.status !== 200) return this.$message.error("更新权限失败")
        this.rightDialogVisible = false
        // 更新视图
        this.getCharacterData()
      })
    }
  },
};
</script>

<style lang='less' scoped>
.el-card {
  margin-top: 20px;
}

.el-row {
  padding: 7px;
}

.borderTop {
  border-top: 1px solid #eee;
}

.borderBottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}

.tagRight {
  margin: 6px;
}
</style>