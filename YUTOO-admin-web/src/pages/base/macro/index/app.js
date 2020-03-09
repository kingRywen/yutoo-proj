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


$(function () {
	// initialPage();
	getGrid();
});


function getGrid() {
	var colunms = TreeGrid.initColumn();
	var table = new TreeTable(TreeGrid.id, BASE_URL + '/sys/macro/list?_' + $.now(), colunms);
	table.setExpandColumn(2);
	table.setIdField("macroId");
	table.setCodeField("macroId");
	table.setParentCodeField("typeId");
	table.setExpandAll(false);
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
				title: '新增字典',
				url: '/base/macro/add.html?_' + $.now(),
				width: '600px',
				height: '450px',
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
					title: '编辑字典',
					url: '/base/macro/edit.html?_' + $.now(),
					width: '600px',
					height: '450px',
					scroll: true,
					success: function (layero) {
						let vueInstance = getIframeVue(layero)
						vueInstance.macro.macroId = ck[0].id;
						vueInstance.setForm();
					},
					yes: function (iframe) {
						iframe.vm.acceptClick();
					},
				});
			}
		},
		remove: function () {
			var ck = TreeGrid.table.getSelectedRow(),
				ids = [];
			if (checkedArray(ck)) {
				$.each(ck, function (idx, item) {
					ids[idx] = item.id;
				});
				post('../../sys/macro/remove?_' + $.now(), ids)
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
	var columns = [{
			field: 'selectItem',
			radio: true
		},
		{
			title: '编号',
			field: 'macroId',
			visible: false,
			align: 'center',
			valign: 'middle',
			width: '50px'
		},
		{
			title: '参数名',
			field: 'name',
			align: 'center',
			valign: 'middle',
			width: '180px'
		},
		{
			title: '参数值',
			field: 'value',
			align: 'center',
			valign: 'middle',
			width: '180px'
		},
		{
			title: '所属类别',
			field: 'typeName',
			align: 'center',
			valign: 'middle',
			width: '100px'
		},
		{
			title: '类型',
			field: 'type',
			align: 'center',
			valign: 'middle',
			width: '60px',
			formatter: function (item, index) {
				if (item.type === 0) {
					return '<span class="badge badge-primary">目录</span>';
				}
				if (item.type === 1) {
					return '<span class="badge badge-warning">参数</span>';
				}
			}
		},
		{
			title: '排序',
			field: 'orderNum',
			align: 'center',
			valign: 'middle',
			width: '50px'
		},
		{
			title: '可用',
			field: 'status',
			align: 'center',
			valign: 'middle',
			width: '60px',
			formatter: function (item, index) {
				if (item.status === 0) {
					return '<i class="fa fa-toggle-off"></i>';
				}
				if (item.status === 1) {
					return '<i class="fa fa-toggle-on"></i>';
				}
			}
		},
		{
			title: '备注',
			field: 'remark',
			align: 'left',
			valign: 'middle'
		}
	]
	return columns;
};