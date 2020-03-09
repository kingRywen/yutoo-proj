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
		this.getQuartzList({}, res => {
			console.log(res)
			this.setData(res)
		})
	},
	data() {
		return {
			tableData: null,
			multiSelect: [],
			columns: [{
				prop: "jobId",
				label: "编号",
				width: "50px"
			}, {
				prop: "beanName",
				label: "类名",
				width: "200px"
			}, {
				prop: "methodName",
				label: "方法名",
				width: "200px"
			}, {
				prop: "params",
				label: "参数",
				width: "300px"
			}, {
				prop: "cronExpression",
				label: "表达式",
				width: "130px"
			}, {
				prop: "status",
				label: "状态",
				width: "60px",
			}, {
				prop: "gmtCreate",
				label: "创建时间",
				width: "200px"
			}, {
				prop: "remark",
				label: "备注"
			}],
			defaultProps: {
				prop: 'name',
				leaf: true
			},
			formInline: {
				val: ""
			},
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

		handleSizeChange(val) {
			console.log(`每页 ${val} 条`);
			this.pagesize = val
			this.getQuartzListFromDate()
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
			this.pageNo = val
			this.getQuartzListFromDate()
		},
		setData(res) {
			this.tableData = res.data.rows
			this.total = res.data.total
			this.pagesize = res.data.pageSize
			this.pageNo = res.data.pageNo
		},
		onSubmit() {
			this.getQuartzListFromDate()
		},
		refresh() {
			this.getQuartzList(null, res => {
				this.setData(res)
			})
		},
		add () {
			console.log(123)
			openIframeDialog({
				url: '/sub/quartz/add.html',
				title: '新增',
				callback: () => this.refresh()
			})
		},
		edit() {
			if (checkedArrayOne(this.multiSelect)) {
				openIframeDialog({
					url: "/sub/quartz/edit.html?jobId=" + this.multiSelect[0].jobId,
					title: '编辑',
					callback: () => this.refresh()
				})
			}
		},
		del() {
			console.log(this.multiSelect);
			deleteRows({
				multiArray: this.multiSelect,
				param: 'jobId',
				postUrl: '/quartz/job/remove',
				content: '是否要删除这一项？',
				success: () => this.refresh()
			})
		},
		getQuartzListFromDate() {
			this.getQuartzList({
				name: this.formInline.val
			}, res => {
				this.setData(res)
			})
		},
		clear() {
			let _this = this
			confirmDialog({
				msg: '您确定要清空日志吗？',
				url: '/sys/quartz/clear',
				success(res) {
					handleRes(res.data)
					_this.getQuartzListFromDate()
				}
			})
		},
		getQuartzList(obj, fn) {
			let props = Object.assign({
				"sortOrder": "asc",
				"pageSize": this.pagesize,
				"pageNumber": this.pageNo
			}, obj)
			console.log(props);
			post("/quartz/job/list", props)
				.then(res => {
					fn(res)
					setTimeout(() => {
						resize()
					});
				})
		},
		handleCommand (c) {
			if (c === 'a') {
				
			}
		},
		linkToLog () {
			console.log(top)
			top.location.hash = '#base/log/list.html'
		}
	}
})