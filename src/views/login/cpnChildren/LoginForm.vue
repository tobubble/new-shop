<template>
  <el-form class="form_container" :model="loginForm" :rules="rules" ref="loginRef">
    <!-- 用户名 -->
    <el-form-item prop="username">
      <el-input class="input" type="username" v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
    </el-form-item>
    <!-- 密码 -->
    <el-form-item prop="password" ref="passwordRef">
      <el-input
        class="input"
        type="password"
        v-model="loginForm.password"
        prefix-icon="el-icon-lock"
      ></el-input>
    </el-form-item>
    <el-form-item class="button_container">
      <el-button type="primary" @click="login">登录</el-button>
      <el-button type="info" @click="resetCLick">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    import {getUserInfo} from 'network/user/userInfo'

export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {min: 3, max: 13, message: "长度在 3 到 13 个字符", trigger: "blur"}
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 13, message: "长度在 6 到 13 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    resetCLick() {
      // 重置密码和用户名
      this.$refs.loginRef.resetFields()
      // 只重置密码
      // console.log(this.$refs.passwordRef.resetField())
    },
    login() {
      this.$refs.loginRef.validate(res => {
        // 验证未通过
        if(!res) return 
        getUserInfo(this.loginForm).then(res => {
          const datas = res.data
          if(datas.meta.status !== 200) return this.$message.error("登录失败")
          this.$message.success("登录成功")
          window.sessionStorage.token = datas.data.token
          this.$router.push('/home')
        })
      })
    },

  }
};
</script>

<style lang='less' scoped>
.form_container {
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
  // .input {
  //   width: 100%;
  // }
}

.button_container {
  display: flex;
  justify-content: flex-end;
}
</style>  