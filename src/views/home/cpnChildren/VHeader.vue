<template>
  <el-container>
    <el-header>
      <div class="header-left">
        <img src="~assets/img/kuangsan.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <div class="header-right">
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang='less' scoped>
.el-container {
  flex: 0;
}

.el-header {
  background-color: #363D40;
  color: #333;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  margin: 0;

  > .header-left {
    display: flex;
    justify-content: flex-start;
    color: #fffffe;
    align-items: center;

    > img {
      border-radius: 50%;
      height: 90%;
      margin-right: 20px;
    }
  }
}

// .el-main {
//   background-color: #E9EEF3;
//   color: #333;
//   text-align: center;
//   line-height: 160px;
// }

// body > .el-container {
//   margin-bottom: 40px;
// }

// .el-container:nth-child(5) .el-aside,
// .el-container:nth-child(6) .el-aside {
//   line-height: 260px;
// }

// .el-container:nth-child(7) .el-aside {
//   line-height: 320px;
// }
</style>