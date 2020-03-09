<template>
  <v-header class="header_wrapper">
    <div>
      <div class="logo" @click="toggleNav">
        <img src="~@/assets/logo.png" alt="yutoo-erp" width="120">
      </div>
      <v-menu theme="dark" mode="horizontal" :data="menuData" style="line-height: 64px"></v-menu>
    </div>

    <div class="right">
      <ul>
        <li>
          <a href="/supplier.html">
            <v-icon type="aliwangwang"></v-icon>供应商提报
          </a>
        </li>
        <!-- <li>
          <a href="#">
            <v-icon type="aliwangwang"></v-icon>联系客服</a>
        </li>
        <li>
          <a href="#">
            <v-icon type="question-circle"></v-icon>帮助中心</a>
        </li>-->
        <li>
          <a @click="logout">
            <v-icon type="question-circle"></v-icon>退出
          </a>
        </li>
      </ul>
    </div>
  </v-header>
</template>
<script>
// import bus from "common/bus.js";
import { logout, fetchData } from 'common/common'
import apis from 'apis'
let _find = require('lodash/find')

export default {
  name: 'yt-header',
  inheritAttrs: false,
  props: ['index', 'data'],
  data() {
    return {
      menuData: [],
      urls: [
        {
          path: '/product.html',
          name: '产品库中心'
        }
      ]
    }
  },
  async created() {
    if (this.data) {
      return
    }
    this.menuData = await this.getMenuData()
  },
  methods: {
    toggleNav() {
      top.location.href = '/admin.html'
    },
    logout() {
      logout()
    },
    // 获取菜单项
    async getMenuData() {
      return fetchData({ ...apis.MERCHANT_MENU_LIST_BY_USER, data: {} }).then(
        res => {
          console.log(res)
          let rows = res.data.rows
          this.setSelected(rows)
          // rows.forEach((el, i) => {
          //   el.href = el.url;
          //   if (el.url && el.url != "" && el.url.split("#")[0] === pathname) {
          //     el.selected = true;
          //     if (pathname.indexOf("product.html") >= 0) {
          //       if (
          //         el.url === "/intelligentReplenishment.html" &&
          //         el.name === "产品库中心"
          //       ) {
          //         el.selected = false;
          //       }
          //     }
          //   }
          // });
          return rows
        }
      )
    },
    // 设置选中项
    setSelected(arr) {
      let pathname = location.pathname
      arr.forEach((el, i) => {
        el.href = el.url
        if (el.url && el.url != '' && el.url.split('#')[0] === pathname) {
          el.selected = true
          if (pathname.indexOf('product.html') >= 0) {
            if (
              el.url === '/intelligentReplenishment.html' &&
              el.name === '产品库中心'
            ) {
              el.selected = false
            }
          }
        }
      })
    }
  },
  watch: {
    data(val) {
      if (val && val.length) {
        this.setSelected(val)
        this.menuData = val
      }
    }
  }
}
</script>