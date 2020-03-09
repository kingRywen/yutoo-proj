import Vue from 'vue'
import Element from 'element-ui'
import router from 'config/router'
import {
  request,
  post,
  resize,
  openIframeDialog,
  checkedArrayOne,
  hasPermission,
  deleteRows
} from 'config'
import './app.scss'
import Search from 'components/search.vue'
import ComTable from 'components/ComTable.vue'
import ComDialog from 'components/dialog.vue'

Vue.use(Element)


window.vm = new Vue({
  el: '#app',
  components: {
    Search,
    ComTable,
    ComDialog
  },
  created() {
    this.getAreaList(null, res => {
      this.catelogData = this.tableData = res.data.rows
    })
  },
  data() {
    return {
      // 表格参数
      tableData: null,
      catelogData: null,
      columns: [
        {
          label: '编号',
          prop: 'areaId'
        },
        {
          label: '区域代码',
          prop: 'areaCode'
        },
        {
          label: '区域名称',
          prop: 'name'
        },
        {
          label: '层级',
          prop: 'layer',
          tag: true
        },
        {
          label: '排序',
          prop: 'orderNum'
        },
        {
          label: '可用',
          prop: 'status',
          tag: true
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],
      
      multiSelect: [],
      
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
      this.getAreaList(null, res => {
        this.catelogData = this.tableData = res.data.rows
      })
    },
    add() {
      openIframeDialog({
        url: '/sub/area/add.html',
        title: '新增',
        callback: () => this.refresh()
      })
    },
    edit() {
      if (checkedArrayOne(this.multiSelect)) {
        openIframeDialog({
          url: "/sub/area/edit.html?areaid=" + this.multiSelect[0].areaId,
          title: '编辑',
          callback: () => this.refresh()
        })
      }
    },
    del() {
      deleteRows({
        multiArray: this.multiSelect,
        param: 'areaId',
        postUrl: '/sys/area/remove',
        content: '是否要删除这一项？',
        success: () => this.refresh()
      })
    },
    enter() {
      this.getAreaList(this.formInline.val, (res) => {
        this.tableData = res.data.rows
      })
    },
    getAreaList(name, fn) {
      post("/sys/area/list", {
          "sortOrder": "asc",
          "name": name,
          "parentCode": "0"
        })
        .then(res => {
          fn(res)
          setTimeout(() => {
            resize()
          });
        })
    },
    
    getNodes(code) {
      return request("/sys/area/select", {
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
    // 懒加载node
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
    }
  }
})