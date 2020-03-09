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
		this.getOrgList({}, res => {
			console.log(res)
			this.setData(res)
		})
	},
	data() {
		return {
			tableData: null,
			multiSelect: [],
			columns: [{
				prop: "orgId",
				label: "编号"
			}, {
				prop: "name",
				label: "名称"
			}, {
				prop: "orgId",
				label: "机构编码"
			}, {
				prop: "parentName",
				label: "上级机构"
			}, {
				prop: "status",
				label: "可用",
				tag: true
			}, {
				prop: "orderNum",
				label: "排序"
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
			this.getOrgListFromDate()
		},
		handleCurrentChange(val) {
			console.log(`当前页: ${val}`);
			this.pageNo = val
			this.getOrgListFromDate()
		},
		setData(res) {
			this.tableData = res.data
			this.total = res.data.total
			this.pagesize = res.data.pageSize
			this.pageNo = res.data.pageNo
		},
		onSubmit() {
			this.getOrgListFromDate()
		},
		refresh() {
			this.getOrgList(null, res => {
				console.log('$gen', res);
				this.setData(res)
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
		getOrgListFromDate() {
			this.getOrgList({
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
					_this.getOrgListFromDate()
				}
			})
		},
		getOrgList(obj, fn) {
			let props = Object.assign({
				"sortOrder": "asc",
				"pageSize": this.pagesize,
				"pageNumber": this.pageNo
			}, obj)
			console.log(props);
			post("/sys/org/list", props)
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