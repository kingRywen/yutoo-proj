import Vue from 'vue'
import Element from 'element-ui'
import router from 'config/router'
import {
  request,
  post,
  resize,
  openIframeDialog,
  handleRes,
  openPromptDialog,
  checkedArray,
  checkedArrayOne,
  hasPermission,
  message,
  deleteRows
} from 'config'
import './app.scss'
import ComTable from 'components/ComTable.vue'
import ComDialog from 'components/dialog.vue'
import ComTree from 'components/ComTree.vue'

Vue.use(Element)


window.vm = new Vue({
  el: '#app',
  components: {
    ComTable,
    ComDialog,
    ComTree
  },
  created() {
    this.getMenuList(null, res => {
      console.log(res)
      this.tableData = res.data
    })
  },
  data() {
    return {
      tableData: null,
      columns: [
        {
          label: '编号',
          prop: 'menuId'
        },
        {
          label: '名称',
          prop: 'name'
        },
        {
          label: '图标',
          prop: 'icon',
          tag: true
        },
        {
          label: '类型',
          prop: 'type',
          tag: true
        },
        {
          label: '排序',
          prop: 'orderNum'
        },
        {
          label: '菜单URL',
          prop: 'url'
        },
        {
          label: '授权标识',
          prop: 'perms'
        }
      ],
      multiSelect: [],
    };
  },
  methods: {
    // 获取window下的主权限
    hasPermission() {
      return hasPermission.apply(null, arguments)
    },
    refresh() {
      this.getMenuList(null, res => {
        this.tableData = res.data
      })
    },
    add() {
      openIframeDialog({
        url: '/sub/menu/add.html',
        title: '新增',
        callback: () => this.refresh()
      })
    },
    edit() {
      if (checkedArrayOne(this.multiSelect)) {
        openIframeDialog({
          url: "/sub/menu/edit.html?menuid=" + this.multiSelect[0].menuId,
          title: '编辑',
          callback: () => this.refresh()
        })
      }
    },
    del() {
      deleteRows({
        multiArray: this.multiSelect,
        param: 'menuId',
        postUrl: '/sys/menu/remove',
        content: '是否要删除这一项？',
        success: () => this.refresh()
      })
    },
    onSubmit() {
      this.getMenuList(this.formInline.val, (res) => {
        this.tableData = res.data.rows
      })
    },
    getMenuList(name, fn) {
      post("/sys/menu/list")
        .then(res => {
          fn(res)
          setTimeout(() => {
            resize()
          });
        })
    },
    
    getNodes(code) {
      return request("/sys/menu/select", {
          "areaCode": code
        })
        .then(res => {
          return this.tableData = res.data;
        }).then((data) => {
          resize()
          return data
        })
    },
    clickList(h) {
      this.getNodes(h.areaCode)
    },
    loadNode(node, resolve) {
      if (!node.data) {
        return
      }
      console.log(node.data)
      this.getNodes(node.data.areaCode).then(data => {
        resolve(data)
        setTimeout(() => {
          resize()
        }, 400);
      })
    },
    handleSelectionChange (val) {
      this.multiSelect = val
    }
  }
})