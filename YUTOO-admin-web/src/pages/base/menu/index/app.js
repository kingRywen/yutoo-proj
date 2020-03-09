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
	BASE_URL
} from 'scripts/common.js'
import './app.scss'

/**
 * 系统菜单js
 */

$(function () {
	getGrid();
});

function initialPage() {
	$(window).resize(function () {
		TreeGrid.table.resetHeight({ height: $(window).height() - 100 });
	});
}

function getGrid() {
	var colunms = TreeGrid.initColumn();
	var table = new TreeTable(TreeGrid.id, BASE_URL + '/sys/menu/list?_' + $.now(), colunms);
	table.setExpandColumn(2);
	table.setIdField("menuId");
	table.setCodeField("menuId");
	table.setParentCodeField("parentId");
	table.setExpandAll(false);
	table.setHeight('auto')
	table.init();
	TreeGrid.table = table;
}

window.vm = new Vue({
	el: '#yutooPLT',
	methods: {
		hasPermission() {
			return hasPermission.apply(window, arguments)
		},
		load: function () {
			TreeGrid.table.refresh();
		},
		save: function () {
			dialogOpen({
				title: '新增菜单',
				url: '/base/menu/add.html?_' + $.now(),
				width: '600px',
				height: '420px',
				scroll: true,
				yes: function (iframe) {
					iframe.vm.acceptClick();
				},
			});
		},
		edit: function () {
			var ck = TreeGrid.table.getSelectedRow();
			if (checkedRow(ck)) {
				dialogOpen({
					title: '编辑菜单',
					url: '/base/menu/edit.html?_' + $.now(),
					width: '600px',
					height: '420px',
					scroll: true,
					success: function (layero) {
						let vueInstance = getIframeVue(layero)
						vueInstance.menu.menuId = ck[0].id;
						vueInstance.setForm();
					},
					yes: function (iframe) {
						iframe.vm.acceptClick();
					},
				});
			}
		},
		remove: function () {
			var ck = TreeGrid.table.getSelectedRow(), ids = [];
			if (checkedArray(ck)) {
				$.each(ck, function (idx, item) {
					ids[idx] = item.id;
				});
				post('../../sys/menu/remove?_' + $.now(), ids)
					.then(res => {
						if (res.data.code == 0) {
							dialogMsg(res.data.msg)
							vm.load();
						} else {
							dialogMsg(res.data.msg)
						}
					})
			}
		}
	}
})

var TreeGrid = {
	id: "dataGrid",
	table: null,
	layerIndex: -1
};

/**
 * 初始化表格的列
 */
TreeGrid.initColumn = function () {
	var columns = [
		{ field: 'selectItem', radio: true },
		{ title: '编号', field: 'menuId', visible: false, align: 'center', valign: 'middle', width: '50px' },
		{ title: '名称', field: 'name', align: 'center', valign: 'middle', width: '180px' },
		{ title: '上级菜单', field: 'parentName', align: 'center', valign: 'middle', width: '100px' },
		{
			title: '图标', field: 'icon', align: 'center', valign: 'middle', width: '50px', formatter: function (item, index) {
				return item.icon == null ? '' : '<i class="' + item.icon + ' fa-lg"></i>';
			}
		},
		{
			title: '类型', field: 'type', align: 'center', valign: 'middle', width: '60px', formatter: function (item, index) {
				if (item.type === 0) {
					return '<span class="badge badge-primary">目录</span>';
				}
				if (item.type === 1) {
					return '<span class="badge badge-success">菜单</span>';
				}
				if (item.type === 2) {
					return '<span class="badge badge-warning">按钮</span>';
				}
			}
		},
		{ title: '排序', field: 'orderNum', align: 'center', valign: 'middle', width: '50px' },
		{ title: '菜单URL', field: 'url', align: 'center', valign: 'middle', width: '200px' },
		{ title: '授权标识', field: 'perms', align: 'center', valign: 'middle' }]
	return columns;
};
