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
import 'scripts/validator.js'
import 'scripts/treegrid/jquery.treegrid.css'

window.$ = $

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
	toUrl
} from 'scripts/common.js'
import './app.scss'

/**
 * 代码生成器js
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
		url: '/sys/generator/list?_' + $.now(),
		height: $(window).height() - 56,
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
/**
 * 生成代码-代码生成器js
 */
window.vm = new Vue({
	el: '#yutooPLT',
	data: {
		generator: {
			tables: null,
			type: 2
		}
	},
	methods: {
		acceptClick: function () {
			if (!$('#form').Validform()) {
				return false;
			}
			toUrl('/sys/generator/code?tables=' + vm.generator.tables +
				'&module=' + vm.generator.module +
				'&token=' + localStorage.getItem("token"));
		}
	}
})