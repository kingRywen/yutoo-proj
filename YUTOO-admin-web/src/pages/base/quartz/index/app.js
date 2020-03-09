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
// import '../../../../node_modules/layui-src/dist/css/layui.css'
// import '../../../../node_modules/layui-src/dist/layui.all.js'
// import layer from 'scripts/layer.js';
// import 'scripts/layui/css/layui.css'
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
	checkedRowGenerator
} from 'scripts/common.js'
import './app.scss'


$(function () {
	getGrid();
});


function getGrid() {
	$('#dataGrid').bootstrapTableEx({
		url: '/quartz/job/list?_' + $.now(),
		queryParams: function (params) {
			params.name = vm.keyword;
			return params;
		},
		columns: [{
			checkbox: true
		}, {
			field: "jobId",
			title: "编号",
			width: "50px"
		}, {
			field: "beanName",
			title: "类名",
			width: "200px"
		}, {
			field: "methodName",
			title: "方法名",
			width: "200px"
		}, {
			field: "params",
			title: "参数",
			width: "300px"
		}, {
			field: "cronExpression",
			title: "表达式",
			width: "130px"
		}, {
			field: "status",
			title: "状态",
			width: "60px",
			formatter: function (value, row, index) {
				if (value == '0') {
					return '<span class="label label-danger">禁用</span>';
				} else if (value == '1') {
					return '<span class="label label-success">正常</span>';
				}
			}
		}, {
			field: "gmtCreate",
			title: "创建时间",
			width: "200px"
		}, {
			field: "remark",
			title: "备注"
		}]
	})
}

window.vm = new Vue({
	el: '#yutooPLT',
	data: {
		keyword: null
	},
	methods: {
		hasPermission() {
			return hasPermission.apply(window, arguments)
		},
		load: function () {
			$('#dataGrid').bootstrapTable('refresh');
		},
		save: function () {
			dialogOpen({
				title: '新增任务',
				url: '/base/quartz/add.html?_' + $.now(),
				width: '450px',
				height: '400px',
				scroll: true,
				yes: function (iframe) {
					iframe.vm.acceptClick();

				},
			});
		},
		edit: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections');
			if (checkedRow(ck)) {
				dialogOpen({
					title: '编辑任务',
					url: '/base/quartz/edit.html?_' + $.now(),
					width: '450px',
					height: '400px',
					scroll: true,
					success: function (layero) {
						let vueInstance = getIframeVue(layero)
						vueInstance.job.jobId = ck[0].jobId;
						vueInstance.setForm();
					},
					yes: function (iframe) {
						iframe.vm.acceptClick();
					},
				});
			}
		},
		remove: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections'),
				ids = [];
			if (checkedArray(ck)) {
				$.each(ck, function (idx, item) {
					ids[idx] = item.jobId;
				});
				post('/quartz/job/remove?_' + $.now(), ids)
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
		enable: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections'),
				ids = [];
			if (checkedArray(ck)) {
				$.each(ck, function (idx, item) {
					ids[idx] = item.jobId;
				});
				$.ConfirmForm({
					msg: '您是否要启用所选任务吗？',
					url: '../../quartz/job/enable?_' + $.now(),
					param: ids,
					success: function (data) {
						vm.load();
					}
				});
			}
		},
		disable: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections'),
				ids = [];
			if (checkedArray(ck)) {
				$.each(ck, function (idx, item) {
					ids[idx] = item.jobId;
				});
				$.ConfirmForm({
					msg: '您是否要暂停所选任务吗？',
					url: '../../quartz/job/disable?_' + $.now(),
					param: ids,
					success: function (data) {
						vm.load();
					}
				});
			}
		},
		run: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections'),
				ids = [];
			if (checkedArray(ck)) {
				$.each(ck, function (idx, item) {
					ids[idx] = item.jobId;
				});
				$.ConfirmForm({
					msg: '您是否要立即运行所选任务吗？',
					url: '../../quartz/job/run?_' + $.now(),
					param: ids,
					success: function (data) {
						vm.load();
					}
				});
			}
		}
	}
})