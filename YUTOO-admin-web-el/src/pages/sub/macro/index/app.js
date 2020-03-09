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
Vue.use(Element)


window.vm = new Vue({
  el: '#app',
  components: {
    ComTable,
    ComDialog
  },
  created() {
    this.getMacroList(null, res => {
      console.log(res)
      this.tableData = res.data
    })
  },
  data() {
    return {
      tableData: null,
      multiSelect: [],
      leftRows: null,
      rightRows: null,
      cNodes: null,
      dialogFormVisible: false,
      defaultProps: {
        label: 'name',
        leaf: true
      },
      formInline: {
        val: ""
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    // 获取window下的主权限
    hasPermission() {
      return hasPermission.apply(null, arguments)
    },
    refresh() {
      this.getMacroList(null, res => {
        this.tableData = res.data
      })
    },
    add() {
      openIframeDialog({
        url: '/sub/macro/add.html',
        title: '新增',
        callback: () => this.refresh()
      })
    },
    edit() {
      if (checkedArrayOne(this.multiSelect)) {
        openIframeDialog({
          url: "/sub/macro/edit.html?macroId=" + this.multiSelect[0].macroId,
          title: '编辑',
          callback: () => this.refresh()
        })
      }
    },
    del() {
      deleteRows({
        multiArray: this.multiSelect,
        param: 'macroId',
        postUrl: '/sys/macro/remove',
        content: '是否要删除这一项？',
        success: () => this.refresh()
      })
    },
    onSubmit() {
      this.getMacroList(this.formInline.val, (res) => {
        this.tableData = res.data.rows
      })
    },
    getMacroList(name, fn) {
      post("/sys/macro/list")
        .then(res => {
          fn(res)
          setTimeout(() => {
            resize()
          });
        })
    },
    
    getNodes(code) {
      return request("/sys/macro/select", {
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