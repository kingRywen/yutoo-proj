<template>
<div class="header-wrapper">
  <div class="logo">
    <h2>LOGO</h2>
  </div>
  <div class="menu">
    <ul>
      <router-link tag="li" v-for="(menu, i) in lists" :key="i" :to="menu.url"><i class="ali-icon icon-big" v-if="menu.iconPath" v-html="$unescape(menu.iconPath)"></i>{{ menu.name }}</router-link>
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
</div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: ['lists'],
  methods: {
    exit () {
      this.LogOut()
    }
  },
  computed: {
    ...mapGetters('menu', {
      menus: 'allMenus'
    })
  }
}
</script>
<style scoped>
.header-wrapper {
  display: flex;
  justify-content: space-between
}
h2 {
  width: 180px;
  font-size: 28px;
  text-align: center
}
.menu {
  flex: auto
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
  flex: auto;
  align-items: center;
  line-height: 30px;
  cursor: pointer;
}
.el-dropdown {
  color: #ffffff
}
</style>
