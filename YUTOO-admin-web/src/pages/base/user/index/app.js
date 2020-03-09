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
	checkedRowGenerator,
	ConfirmForm
} from 'scripts/common.js'
import './app.scss'

/**
 * 用户管理js
 */

$(function () {
	initialPage();
	getGrid();
});

function initialPage() {
	$(window).resize(function () {
		$('#dataGrid').bootstrapTable('resetView', {
			height: $(window).height() - 56
		});
	});
}

function getGrid() {
	$('#dataGrid').bootstrapTableEx({
		url: '/sys/user/list?_' + $.now(),
		height: $(window).height() - 56,
		queryParams: function (params) {
			params.username = vm.keyword;
			return params;
		},
		columns: [{
			checkbox: true
		}, {
			field: "userId",
			title: "编号",
			width: "50px"
		}, {
			field: "username",
			title: "用户名",
			width: "200px"
		}, {
			field: "orgName",
			title: "所属机构",
			width: "200px"
		}, {
			field: "email",
			title: "邮箱",
			width: "300px"
		}, {
			field: "mobile",
			title: "手机号",
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
				title: '新增用户',
				url: '/base/user/add.html?_' + $.now(),
				width: '600px',
				height: '350px',
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
					title: '编辑用户',
					url: '/base/user/edit.html?_' + $.now(),
					width: '600px',
					height: '350px',
					scroll: true,
					success: function (layero) {
						let vueInstance = getIframeVue(layero)
						vueInstance.user.userId = ck[0].userId;
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
					ids[idx] = item.userId;
				});
				post('/sys/user/remove?_' + $.now(), ids)
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
		disable: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections'),
				ids = [];
			if (checkedArray(ck)) {
				$.each(ck, function (idx, item) {
					ids[idx] = item.userId;
				});
				ConfirmForm({
					msg: '您是否要禁用所选账户吗？',
					url: '/sys/user/disable?_' + $.now(),
					data: ids,
					success: function (res) {
						top.frames['main'].vm.load()
					},
					fail: function (err) {
						console.error(err)
					}
				})
			}
		},
		enable: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections'),
				ids = [];
			if (checkedArray(ck)) {
				$.each(ck, function (idx, item) {
					ids[idx] = item.userId;
				});
				ConfirmForm({
					msg: '您是否要启用所选账户吗？',
					url: '/sys/user/enable?_' + $.now(),
					data: ids,
					success: function (res) {
						top.frames['main'].vm.load()
					},
					fail: function (err) {
						console.error(err)
					}
				})
			}
		},
		reset: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections');
			if (checkedRow(ck)) {
				dialogOpen({
					title: '重置密码',
					url: '/base/user/reset.html?_' + $.now(),
					width: '400px',
					height: '220px',
					success: function (layero) {
						let vueInstance = getIframeVue(layero)
						vueInstance.user.userId = ck[0].userId;
					},
					yes: function (iframe) {
						iframe.vm.acceptClick();
					},
				});
			}
		}
	}
})