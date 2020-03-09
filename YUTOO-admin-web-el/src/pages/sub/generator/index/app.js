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
		this.getGenList({
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
			columns: [{
				prop: "tableName",
				label: "表格名称"
			}, {
				prop: "objName",
				label: "数据库引擎类型"
			}, {
				prop: "tableComment",
				label: "备注"
			}, {
				prop: "createTime",
				label: "创建时间"
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
			this.getGenListFromDate()
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
			this.pageNo = val
			this.getGenListFromDate()
		},
		setData(res) {
			this.tableData = res.data.rows
			this.total = res.data.total
			this.pagesize = res.data.pageSize
			this.pageNo = res.data.pageNo
		},
		onSubmit() {
			this.getGenListFromDate()
		},
		refresh() {
			this.getGenList(null, res => {
				console.log('$gen', res);
				this.setData(res)
			})
		},
		generate() {
			console.log(123)
			openIframeDialog({
				url: '/sub/generator/code.html',
				title: '新增',
				data: {
					tables: this.multiSelect
				},
				callback: () => this.refresh()
			})
		},
		getGenListFromDate() {
			this.getGenList({
				name: this.formInline.val,
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
					_this.getGenListFromDate()
				}
			})
		},
		getGenList(obj, fn) {
			let props = Object.assign({
				"sortOrder": "asc",
				"pageSize": this.pagesize,
				"pageNumber": this.pageNo
			}, obj)
			console.log(props);
			post("/sys/generator/list", props)
				.then(res => {
					fn(res)
					setTimeout(() => {
						resize()
					});
				})
		},
		handleCommand(c) {
			if (c === 'a') {

			}
		},
		linkToLog() {
			console.log(top)
			top.location.hash = '#base/log/list.html'
		}
	}
})