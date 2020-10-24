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
    <el-card class="box-card">
      <el-form label-width="80px">
        <!-- 搜索与添加区域 -->
        <el-input
          class="input"
          v-model="query.query"
          style="width: 300px"
          highlight-current-row
          clearable
        >
          <el-button
            @click="handleSearch"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button
          class="input"
          type="primary"
          @click="addDialogVisible = !addDialogVisible"
          >添加用户</el-button
        >
        <!-- 用户列表区域 -->
        <el-table
          :border="true"
          :stripe="true"
          :data="userListData.users"
          style="width: 100%"
        >
          <el-table-column type="index" label="#" width="90"> </el-table-column>
          <el-table-column prop="username" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="190">
          </el-table-column>
          <el-table-column prop="mobile" label="电话" width="190">
          </el-table-column>
          <el-table-column prop="role_name" label="角色" width="193">
          </el-table-column>
          <el-table-column prop="mg_state" label="状态" width="120">
            <template slot-scope="scope">
              <el-switch
                @change="handleSwitch(scope.row, $event)"
                v-model="scope.row.mg_state"
                active-color="#13ce66"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="operate" label="操作" width="240">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleEditCLick(scope.row.id)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteUserById(scope.row.id)"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
                @clear="handleInputClear"
              >
                <el-button
                  @click="setRoleHandle(scope.row)"
                  size="mini"
                  type="warning"
                  icon="el-icon-setting"
                >
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pagenum"
          :page-sizes="[1, 2, 4, 8]"
          :page-size="2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
        <!-- 添加用户的对话框 -->
        <el-dialog
          title="添加用户"
          :close-on-click-modal="false"
          :visible.sync="addDialogVisible"
          width="50%"
          @closed="handleDialogClose"
        >
          <el-form
            :model="ruleForm"
            :rules="addRules"
            ref="ruleFormRef"
            label-width="70px"
          >
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="ruleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="telphone">
              <el-input v-model="ruleForm.telphone"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleAddUser">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog
          title="修改用户"
          :visible.sync="editDialogVisible"
          width="50%"
          @closed="handleEditClose"
          :close-on-click-modal="false"
        >
          <el-form
            :model="editForm"
            :rules="editRules"
            ref="editeRuleForm"
            label-width="70px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="username">
              <el-input disabled v-model="editForm.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="telphone">
              <el-input v-model="editForm.telphone"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editClickHandle">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 分配角色的对话框 -->
        <el-dialog
          title="分配角色"
          :visible.sync="setRoleDialogVisible"
          width="50%"
          @close="resetSetRoleDialog"
        >
          <div class="userNow roleNow">
            当前的用户: {{ setRoleUser.username }}
          </div>
          <div class="roleNow">当前的用户: {{ setRoleUser.role_name }}</div>
          <div class="roleNow">
            分配新角色:
            <el-select ref="setRoleDialog" v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveRoleInfo"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getUserList } from "network/home/userList";
import { changeUserState } from "network/home/changeUserState";
import { searchUser } from "network/home/searchUser";
import { addUser } from "network/home/addUser";
import { getUserInfo } from "network/home/getUserInfo";
import { editUserInfo } from "network/home/editUserInfo";
import { deletUser } from "network/home/deletUser";
import { getRoleList } from "network/home/getRoleList";
import { allotUserRole } from "network/home/allotUserRole";

export default {
  props: {
    pathArr: {
      type: Array,
      default() {
        return ["1", "1"];
      },
    },
  },
  data() {
    // 自定义校验规则
    const validateEmail = (rule, value, callback) => {
      rule = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (rule.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确格式的邮箱"));
      }
    };
    const validateTelphone = (rule, value, callback) => {
      rule = /^1[3456789]\d{9}$/;
      if (rule.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确格式的电话号码"));
      }
    };
    return {
      userListData: {},
      // 获取用户列表的参数
      query: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 每页显示的个数
        pagesize: 2,
      },
      // 保存当前的数据的总的页数
      total: null,
      inputName: null,
      addDialogVisible: false,
      editDialogVisible: false,
      ruleForm: {
        userName: "",
        password: "",
        email: "",
        telphone: "",
      },
      // 添加邮箱的校验规则
      addRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 ~ 10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "长度在 6 ~ 16个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        telphone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: validateTelphone, trigger: "blur" },
        ],
      },
      editForm: {
        username: "",
        email: "",
        telphone: "",
        id: "",
      },
      editRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        telphone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { validator: validateTelphone, trigger: "blur" },
        ],
      },
      // 控制 分配角色对话框的显示
      setRoleDialogVisible: false,
      // 保存当前正在分配角色的用户 信息
      setRoleUser: {},
      // 所有的权限列表
      roleList: [],
      // 保存当前的选中的role id
      selectedRoleId: '',
    };
  },
  mounted() {},
  created() {
    this.getUserListData();
  },
  methods: {
    // ----- 获取数据相关方法
    getUserListData() {
      const query = this.query;
      getUserList(query).then((datas) => {
        let data = datas.data;
        data = data.data;
        if (datas.status != 200)
          return this.$message.error(datas.data.meta.msg);
        this.userListData = data;
        this.total = data.total;
      });
    },
    // ----- 事件监听相关方法
    switch() {
      this.value = !this.value;
    },
    // 切换按钮点击
    handleSizeChange(pagesize) {
      // console.log(pagesize);
      this.query.pagesize = pagesize;
      this.getUserListData(this.query);
    },
    // 切换按钮点击
    handleCurrentChange(pagenum) {
      // console.log(pagenum);
      this.query.pagenum = pagenum;
      this.getUserListData(this.query);
    },
    // 切换按钮点击
    handleSwitch(userInfo, state) {
      const id = userInfo.id;
      changeUserState(id, state).then((data) => {
        console.log(data);
        if (data.status != 200) {
          userInfo.mg_state = !userInfo.mg_state;
          return this.$message.error("更新信息失败");
        }
        return this.$message.success("更新信息成功");
      });
    },
    handleInputClear() {
      this.query.query = "";
      this.getUserListData();
    },
    handleSearch() {
      this.query.pagenum = 1;
      this.getUserListData();
    },
    handleDialogClose() {
      this.$refs.ruleFormRef.resetFields();
    },
    handleAddUser() {
      // 表单的预校验是否通过
      this.$refs.ruleFormRef.validate((valid) => {
        if (!valid) return false;
        addUser(this.ruleForm).then((res) => {
          if (res.status != 200) return this.$message.error("添加失败");
          this.$message.success("添加成功");
          this.addDialogVisible = false;
          this.getUserListData();
        });
      });
    },
    // 监听修改按钮的点击
    handleEditCLick(id) {
      console.log('hello')
      getUserInfo(id).then((res) => {
        if (res.status != 200) return this.$message.error("获取用户信息失败");
        let data = res.data.data;
        this.editForm.username = data.username;
        this.editForm.email = data.email;
        this.editForm.telphone = data.mobile;
        this.editForm.id = data.id;
        this.editDialogVisible = true;
      });
    },
    // 监听编辑对话框的关闭事件
    handleEditClose() {
      this.$refs.editeRuleForm.resetFields();
    },
    // 监听编辑中的确认按钮点击
    editClickHandle() {
      console.log(this.editForm);
      this.$refs.editeRuleForm.validate((validate) => {
        if (validate === false) return false;
        editUserInfo(this.editForm).then((data) => {
          console.log(data);
          if (data.data.meta.status !== 200) this.$message.error("修改失败");
          // 提示修改信息成功
          this.$message.success("修改信息成功");
          // 更新数据列表
          this.getUserListData();
        });
        this.editDialogVisible = false;
      });
    },
    // 监听删除按钮的点击事件
    async deleteUserById(id) {
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 点击确认返回字符串 confirm
      // 点击确认返回字符串 cancel
      if (res === "cancel") return this.$message("取消删除用户操作");
      deletUser(id).then((res) => {
        if (res.data.meta.status !== 200) return false;
        // 更新视图
        this.getUserListData();
        this.$message.success("删除用户成功");
      });
    },
    // 监听分配角色按钮的点击
    setRoleHandle(role) {
      // 保存当前分配角色的信息
      this.setRoleUser = role;
      // 请求获取权限列表，并保存
      getRoleList().then((res) => {
        if (res.data.meta.status !== 200)
          return this.$message.error("获取权限列表失败");
        this.roleList = res.data.data;
        // console.log(this.roleList);
      });
      // console.log(this.setRoleUser);
      this.setRoleDialogVisible = true;
    },
    // 点击确定保存角色信息
    saveRoleInfo() {
      if(!this.selectedRoleId) return this.$message.error("请选择分配的角色")
      // console.log(this.setRoleUser.id, this.selectedRoleId)
      allotUserRole(this.setRoleUser.id, this.selectedRoleId).then(res => {
        // console.log(res)
        if(res.data.meta.status !== 200) return this.$message.error("分配角色失败")
        this.$message.success("分配角色成功")
        this.getUserListData()
        this.setRoleDialogVisible = false
      })
    },
    // 重置对话框
    resetSetRoleDialog() {
      // 当对话框重置的时候，将数据个体重置
      this.selectedRoleId = ''
      // this.setRoleUser = {}
    }

  },
};
</script>

<style lang='less' scoped>
.box-card {
  margin-top: 35px;
}

.el-table {
  margin-top: 20px;
  font-size: 12px;
}

.input {
  margin-left: 15px;
}

.el-pagination {
  margin-top: 20px;
}

.roleNow {
  margin-top: 8px;
}
</style>