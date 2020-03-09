<template>
  <div class="header-wrapper">
    <div class="logo">
      <h2>LOGO</h2>
    </div>
    <div class="menu">
      <ul class='headerMenu'>
        <li>
          首页
        </li>
        <li>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{platformTitle}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="item.platformId" v-for="item in stateData">{{item.platformName}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>
          账号充值
        </li>
      </ul>
    </div>
    <div class="logged">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>Admin</span>
    </div>
    <!-- <div style="width100%;height:100px;background:red; display:block;">公用部分</div> -->
  </div>

</template>
<script>
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";

export default {
  props: ["lists"],
  data() {
    return {
      platformTitle: "选择平台"
    };
  },
  created() {
    this.getSelectPlatformApi({});
  },
  watch: {
    platformTitle(val) {}
  },
  methods: {
    ...mapActions("selectPlatform", ["getSelectPlatformApi"]),
    ...mapMutations("selectPlatform", {
      aaaaa: "addSelectPlatform",
      setplatformId: "setPlatform"
    }),

    // 选择平台
    handleCommand(command) {
      console.log(command);

      this.stateData.forEach(item => {
        if (item.platformId == command) {
          this.platformTitle = item.platformName;
        }
      });
      let obj = {
        pageNumber: 1,
        pageSize: 10
      };
      this.setplatformId(command);
    },
    // 退出
    exit() {
      this.LogOut();
    }
  },
  computed: {
    ...mapState("selectPlatform", {
      stateData: "selectPlatformData"
      // aaaa:stateData
    }),
    ...mapGetters("menu", {
      menus: "allMenus"
    })
  }
};
</script>
<style scoped>
.header-wrapper {
  display: flex;
  justify-content: space-between;
}
h2 {
  width: 180px;
  font-size: 28px;
  text-align: center;
}
.menu {
  flex: auto;
}
.menu ul {
  list-style: none;
  display: flex;
  max-width: 860px;
  /* justify-content: space-around; */
}
.menu ul li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 80px;
  width: 160px;
  /* flex: auto; */
  align-items: center;
  line-height: 30px;
  cursor: pointer;
  font-size: 20px;
  color: #fafafa;
}
.el-dropdown {
  color: #ffffff;
}
</style>
