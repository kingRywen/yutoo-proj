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
  confirmDialog,
  checkedArray,
  checkedArrayOne,
  hasPermission,
  message,
  deleteRows,
  formatDate
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
    console.log(formatDate(new Date(Date.now() - 24 * 3600 * 1000), 'yyyy-MM-dd'));
    this.getAreaList({
      "startDate": formatDate(new Date(Date.now() - 24 * 3600 * 1000), 'yyyy-MM-dd'),
      "endDate": formatDate(new Date(), 'yyyy-MM-dd')
    }, res => {
      console.log(res)
      this.setData(res)
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
      dateRange: [new Date(Date.now() - 24 * 3600 * 1000), new Date()],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      formInline: {
        val: ""
      },
      formLabelWidth: "120px",
      multiSelect: [],
      pagesize: 10,
      pageNo: 1,
      total: 0
    };
  },
  methods: {
    // 获取window下的主权限
    hasPermission() {
      return hasPermission.apply(null, arguments)
    },
    handleSelectionChange(val) {
      this.multiSelect = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val
      this.getLogListFromDate()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pageNo = val
      this.getLogListFromDate()
    },
    setData(res) {
      this.tableData = res.data.rows
      this.total = res.data.total
      this.pagesize = res.data.pageSize
      this.pageNo = res.data.pageNo
    },
    onSubmit() {
      this.getLogListFromDate()
    },
    refresh() {
      this.getAreaList(null, res => {
        // this.leftRows = this.rightRows = res.data.rows
        this.setData(res)
      })
    },
    getLogListFromDate() {
      this.getAreaList({
        username: this.formInline.val,
        startDate: formatDate(this.dateRange[0], 'yyyy-MM-dd'),
        endDate: formatDate(this.dateRange[1], 'yyyy-MM-dd')
      }, res => {
        this.setData(res)
      })
    },
    add() {
      openIframeDialog("/sub/area/add.html", "新增")
    },
    clear() {
      let _this = this
      confirmDialog({
        msg: '您确定要清空日志吗？',
        url: '/sys/log/clear',
        success (res) {
          handleRes(res.data)
          _this.getLogListFromDate()
        }
      })
    },
    del() {
      deleteRows({
        multiArray: this.multiSelect,
        param: 'id',
        postUrl: '/sys/log/remove',
        content: '是否要删除这一项？',
        success: () => this.refresh()
      })
    },
    getAreaList(obj, fn) {
      let props = Object.assign({
        "sortOrder": "asc",
        "pageSize": this.pagesize,
        "pageNumber": this.pageNo
      }, obj)
      console.log(props);
      post("/sys/log/list", props)
        .then(res => {
          fn(res)
          setTimeout(() => {
            resize()
          });
        })
    },
  }
})