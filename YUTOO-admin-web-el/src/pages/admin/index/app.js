import Vue from 'vue'
import Element from 'element-ui'
import router from 'config/router'
import {
  request,
  resize,
  hasPermission,
  confirmDialog,
  handleRes
} from 'config'
import './app.scss'
import ComDialog from 'components/dialog.vue'
import 'assets/fonts/fontawesome-all.min.css';

// import $ from 'jquery'
// import 'scripts/default.js'
// import '../../../../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
// import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
// import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css'
// import 'assets/fonts/fontawesome-all.min.css'
// import './app.scss'
window.$ = $;
window.windowISWHO = $(window)


window.hasPermission = hasPermission

// 修正菜单高亮
const fixSiderbarActive = () => {
  document.querySelector('.el-aside .el-menu').querySelectorAll('li').forEach(el => {
    if (el.dataset.url === location.hash.substring(1)) {
      vm.siderBarHover = el.dataset.index
      return
    }
  })
}


Vue.use(Element)

window.vm = new Vue({
  el: '#app',
  components: {
    ComDialog
  },
  created() {
    let vm = this
    this.getMenuList();
    this.getPermList();
    this.getUser();
    window.onload = function () {
      window.onresize = resize
      resize()
      fixSiderbarActive()
    }
    window.onhashchange = function () {
      fixSiderbarActive()
    }
  },
  data() {
    return {
      isCollapse: false,
      menuList: null,
      user: null,
      siderBarHover: '0-',
      active: '',
      frameSrc: '/system/index.html',
      topMenu: [
        {
          name: '系统管理',
          url: '#base/area/list.html',
          icon: 'el-icon-star-on'
        },
        {
          name: '组织机构',
          url: '#base/org/list.html',
          icon: 'el-icon-setting'
        },
      ],
      dialog: {
        frameSrc: '',
        url: '',
        title: '',
        callback: null,
        height: '',
        // open: false
      },
      dialogFormVisible: false
    }
  },
  methods: {
    setRoute() {
      // 配置路由
      let Urls = []
      let getUrl = function (arr) {
        arr.forEach(el => {
          if (el.url) {
            Urls.push(el.url)
          }
          if (el.list) {
            getUrl(el.list)
          }
        })
      }
      getUrl(this.menuList)
      console.log(Urls)
      Urls.forEach(url => {
        router(url, function () {
          let doc = window.document
          url = url.replace(/base/gi, 'sub').replace(/list/gi, 'index')
          let self = doc.querySelector('iframe#main')
          let parent = self.parentNode
          let iframe = doc.createElement('iframe')
          iframe.id = iframe.name = 'main'
          iframe.src = '/' + url
          iframe.frameborder = '0'
          iframe.allowtransparency = 'true'
          parent.removeChild(self)
          parent.appendChild(iframe)
        });
      })
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
      
    },
    selectMenu (i) {
      this.siderBarHover = i
    },
    getMenuList: function (event) {
      request("/sys/menu/user?_" + Date.now())
        .then(res => {
          this.menuList = res.data.menuList
          this.setRoute()
        })
    },
    getPermList: function (event) {
      request("/sys/user/perms?_" + Date.now())
        .then(res => {
          window.perms = res.data.rows;
        })
    },
    getUser: function () {
      request("/sys/user/info?_" + Date.now())
        .then(res => {
          this.user = res.data.user;
        })
    },
    // 点击切换iframe
    toggleUrl(e) {
      router(e.$el.dataset.url)
      // fixSiderbarActive()
    },
    handleCommand(command) {
      console.log(1);
      if (command === 'a') {
        this.logout()
      }
    },
    tourl (e) {
      console.log(e);
      this.toggleUrl(e.target.detail.dataset.url)
    },
    logout: function () {
      confirmDialog({
        msg: '注：您确定要安全退出本次登录吗？',
        url: '/sys/logout',
        success(res) {
          handleRes(res.data)
          localStorage.removeItem("token")
          window.location.replace('/login/index.html')
        }
      })
    }
  },
  computed: {
    getIndexMenu () {
      return this.siderBarHover.split('-')[0]
    }
  }
})