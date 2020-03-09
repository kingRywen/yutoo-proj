import $ from 'jquery'
import Vue from 'vue'
import 'scripts/default.js'
import 'assets/fonts/fontawesome-all.min.css'
import 'assets/css/common.scss'
import 'scripts/ztree/css/metroStyle/metroStyle.css'
import 'scripts/bootstrap-table/bootstrap-table.min.css'
import '../../../../../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import 'scripts/bootstrap-table/bootstrap-table.min.js'
import 'scripts/bootstrap-table/locale/bootstrap-table-zh-CN.min.js'
import 'scripts/ztree/jquery.ztree.all.min.js'
import 'scripts/treegrid/jquery.treegrid.min.js'
import 'scripts/treegrid/jquery.treegrid.bootstrap3.js'
import 'scripts/treegrid/jquery.treegrid.extension.js'
import 'scripts/treegrid/tree.table.js'
import 'scripts/treegrid/jquery.treegrid.css'
import VueDate from 'vue-datepicker-local'
import {
	hasPermission,
	request,
	post,
	dialogOpen,
	dialogContent,
	checkedRow,
	checkedArray,
	dialogMsg,
	getIframeVue,
	countDay,
	today,
	formatDate,
	ConfirmForm,
	format
} from 'scripts/common.js'
import './app.scss'

$(function () {
	getGrid();
});

function getGrid() {
	$('#dataGrid').bootstrapTableEx({
		url: '/sys/log/list?_' + $.now(),
		queryParams: function (params) {
			params.username = vm.keyword;
			params.startDate = vm.startDate;
			params.endDate = vm.endDate;
			return params;
		},
		detailView: true,
		detailFormatter: function (index, row) {
			var _html = '<p>操作用户ID：' + row.userId + '</p>' +
				'<p>执行方法：' + row.method + '</p>' +
				'<p>请求参数：' + row.params + '</p>';
			return _html;
		},
		columns: [{
			checkbox: true
		}, {
			field: "id",
			title: "编号",
			width: "50px"
		}, {
			field: "username",
			title: "用户名",
			width: "150px"
		}, {
			field: "operation",
			title: "操作",
			width: "150px"
		}, {
			field: "time",
			title: "响应时间(ms)",
			width: "130px"
		}, {
			field: "ip",
			title: "IP地址",
			width: "130px"
		}, {
			field: "gmtCreate",
			title: "创建时间"
		}]
	})
}

Vue.component('VueDate', VueDate);

window.vm = new Vue({
	el: '#yutooPLT',
	data: {
		keyword: null,
		// startDate: null,
		// endDate: null,
		dateRangeText: '时间范围',
		range: [new Date(),new Date()]
	},
	components: {
		VueDate
	},
	computed: {
		startDate () {
			return format('yyyy-MM-dd',this.range[0])
		},
		endDate () {
			return format('yyyy-MM-dd',this.range[1])
		}
	},
	methods: {
		hasPermission() {
			return hasPermission.apply(window, arguments)
		},
		confirm () {
			
		},
		load: function () {
			$('#dataGrid').bootstrapTable('refresh');

		},
		dateRangeSelect: function (count) {
			if (count == 1) {
				vm.dateRangeText = '最近一天';
				vm.startDate = countDay(-1);
				vm.endDate = today();
				vm.dateRange = vm.startDate + ' - ' + vm.endDate;
			} else if (count == 7) {
				vm.dateRangeText = '最近一周';
				vm.startDate = countDay(-7);
				vm.endDate = today();
				vm.dateRange = vm.startDate + ' - ' + vm.endDate;
			} else if (count == 30) {
				vm.dateRangeText = '最近一月';
				vm.startDate = countDay(-30);
				vm.endDate = today();
				vm.dateRange = vm.startDate + ' - ' + vm.endDate;
			} else {
				vm.dateRangeText = '时间范围';
				vm.startDate = '';
				vm.endDate = '';
				vm.dateRange = '';
			}
		},
		remove: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections'),
				ids = [];
			if (checkedArray(ck)) {
				$.each(ck, function (idx, item) {
					ids[idx] = item.id;
				});
				post('../../sys/log/remove?_' + $.now(), ids)
					.then(res => {
						if (res.data.code == 0) {
							dialogMsg(res.data.msg)
							vm.load();
						} else {
							dialogMsg(res.data.msg)
						}
					})
			}
		},
		clear: function () {
			ConfirmForm({
				msg: "您确定要清空日志吗？",
				url: '/sys/log/clear?_' + $.now(),
				success: function (res) {
					console.log(res)
					if(res.data.code == 0) {
						top.frames['main'].vm.load()
						top.layer.closeAll('iframe')
					}
				},
				fail: function(err) {
					console.error(err)
				}
			})
		}
	}
})