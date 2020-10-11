<template>
  <el-container v-if="Object.keys(menuData).length != 0">
    <el-aside :style="{ width: asideWidth }">
      <div class="folder" @click="folderClick">| | |</div>
      <el-menu
        ref="menu"
        :collapse="isCollapse"
        :unique-opened="true"
        :collapse-transition="false"
        class="el-menu-vertical-demo"
        :class="asideWidth"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#359BFF"
        :default-active = currentIndex
      >
        <el-submenu
          :index="item.id + ''"
          v-for="item in menuData.data"
          :key="item.id"
        >
          <template slot="title">
            <i :class="iconsObj[item.id]"></i>
            <span class="item">{{ item.authName }}</span>
          </template>
          <el-menu-item
            :index="item2.id + ''"
            v-for="item2 in item.children"
            :key="item2.id"
            @click="itemClick(item2.id,item.authName,item2.authName)"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ item2.authName }}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view :pathArr="pathArr"></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    menuData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      iconsObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollapse: false,
      routerPush: {110:"userList", 111:"characterList", 112:"rootList", 104:"itemList", 115:"classifyList", 121:"itemClassify", 107:"orderList", 146:"dataReport"},
      currentIndex: '',
      pathArr: []
    };
  },
  methods: {
    folderClick() {
      this.isCollapse = !this.isCollapse;
    },
    itemClick(index, path1, path2) {
      this.pathArr = []
      this.pathArr.push(path1,path2)
      window.sessionStorage.setItem("currentIndex", index + '')
      window.sessionStorage.setItem("currentLocation", JSON.stringify(this.pathArr))
      this.$router.push(this.routerPush[index])
    }
  },
  computed: {
    asideWidth() {
      if (this.isCollapse) {
        return "64px";
      } else {
        return "250px";
      }
    },
  },
  created() {
    const currentIndex = window.sessionStorage.getItem("currentIndex")
    const currentLocation = JSON.parse(window.sessionStorage.getItem("currentLocation"))

    if(currentIndex) {
      this.currentIndex = currentIndex
    }
    if(currentLocation) {
      this.pathArr = currentLocation
    }
  }
};
</script>

<style lang='less' scoped>
.el-container {
  background: #bfa;
  width: 100%;
  height: 100%;
  > .el-aside {
    background-color: #545c64;
    color: #333;
    text-align: center;
    overflow: hidden;
  }
}

.el-menu /deep/ .el-submenu__title {
  width: 250px;
  display: flex;
  // padding-left: 0 !important;
}

.el-menu-item {
  text-align: start;
}

.folder {
  background: #4a5064;
  line-height: 25px;
  font-size: 10px;
  color: #fff;
  // letter-spacing: ; 这个可以操控字符的间距
  cursor: pointer; // 这个的作用是鼠标移入进去的时候变成 a 标签的样式
  user-select: none;
}

.collopse {
  width: 64px;
  padding: 0;
}

.item {
  margin-left: 10px;
}

.el-main {
  background: darkturquoise;
}
</style>