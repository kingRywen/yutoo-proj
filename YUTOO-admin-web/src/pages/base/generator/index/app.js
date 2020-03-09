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

/**
 * 代码生成器js
 */

$(function () {
	getGrid();
});


function getGrid() {
	$('#dataGrid').bootstrapTableEx({
		url: '/sys/generator/list?_' + $.now(),
		queryParams: function (params) {
			params.name = vm.keyword;
			return params;
		},
		columns: [{
			checkbox: true
		}, {
			field: "tableName",
			title: "表格名称"
		}, {
			field: "objName",
			title: "数据库引擎类型"
		}, {
			field: "tableComment",
			title: "备注"
		}, {
			field: "createTime",
			title: "创建时间"
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
		generate: function () {
			var ck = $('#dataGrid').bootstrapTable('getSelections'),
				names = [];
			if (checkedRowGenerator(ck)) {
				$.each(ck, function (idx, item) {
					names[idx] = item.tableName;
				});

				dialogOpen({
					title: '生成代码',
					url: '/base/generator/code.html?_' + $.now(),
					width: '530px',
					height: '250px',
					success: function (layero) {
						let vueInstance = getIframeVue(layero)
						vueInstance.generator.tables = names;
						vueInstance.generator.module = "com.yutoo.admin";
					},
					yes: function (iframe) {
						iframe.vm.acceptClick();
					},
				});

			}
		}
	}
})