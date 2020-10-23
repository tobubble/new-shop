<template>
  <el-container id="home">
    <v-header></v-header>
    <v-aside :menuData="menuData"> </v-aside>
  </el-container>
</template>

<script>
import VHeader from "./cpnChildren/VHeader";
import VAside from "./cpnChildren/VAside";

import { getMenuData } from "network/home/menu";

export default {
  name: "Home",
  data() {
    return {
      menuData: {},
    };
  },
  components: {
    VHeader,
    VAside,
  },
  methods: {
    getInitData() {
      getMenuData().then((data) => {
        console.log(data)
        if (data.status !== 200) return this.$message.error(data.data.meta.msg);
        this.menuData = data.data;
        console.log(this.menuData);
      });
    },
  },
  created() {
    this.getInitData();
  },
};
</script>

<style lang='less' scoped>
#home {
  height: 100vh; 
  display: flex;
  flex-direction: column;
}
</style>