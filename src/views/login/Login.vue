<template>
  <div id="login_container">
    <div class="login_box">
      <div class="avatar">
        <img src="~assets/img/kuangsan.png" alt="">
      </div>
    <login-form></login-form>
    </div>
  </div>
</template>

<script>
  import LoginForm from './cpnChildren/LoginForm'

  export default {
    components: {
      LoginForm,
    }
  }
</script>

<style lang='less' scoped>
  #login_container {
    background: #bfa;
    height: 100vh;
    position: relative;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    padding: 10px;
    border: 1px solid #eee;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 160px;
    top: -65px;
    background: #fff;
    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      background: #eee;
    }
  }
</style>