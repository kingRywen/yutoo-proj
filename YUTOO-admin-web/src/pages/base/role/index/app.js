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
 * 角色管理js
 */

$(function () {
	getGrid();
});

function getGrid() {
	$('#dataGrid').bootstrapTableEx({
		url: '/sys/role/list?_' + $.now(),
		queryParams: function(params){
			params.roleName = vm.keyword;
			return params;
		},
		columns: [{
			checkbox: true
		}, {
			field : "roleId",
			title : "编号",
			width : "50px"
		}, {
			field : "roleName",
			title : "角色名称",
			width : "200px"
		}, {
			field : "roleSign",
			title : "角色标识",
			width : "200px"
		}, {
			field : "orgName",
			title : "所属机构",
			width : "200px"
		}, {
			field : "remark",
			title : "备注",
			width : "250px"
		}, {
			field : "gmtCreate",
			title : "创建时间"
		}]
	})
}

window.vm = new Vue({
	el:'#yutooPLT',
	data: {
		keyword: null
	},
	methods : {
		hasPermission() {
			return hasPermission.apply(window, arguments)
		},
		load: function() {
			$('#dataGrid').bootstrapTable('refresh');
		},
		save: function() {
			dialogOpen({
				title: '新增角色',
				url: '/base/role/add.html?_' + $.now(),
				width: '420px',
				height: '350px',
				yes : function(iframe) {
					iframe.vm.acceptClick();
				},
			});
		},
		edit: function() {
			var ck = $('#dataGrid').bootstrapTable('getSelections');
			if(checkedRow(ck)){
				dialogOpen({
					title: '编辑角色',
					url: '/base/role/edit.html?_' + $.now(),
					width: '420px',
					height: '350px',
					success: function(layero){
						let vueInstance = getIframeVue(layero)
						vueInstance.role.roleId = ck[0].roleId;
						vueInstance.setForm();
					},
					yes: function(iframe){
						iframe.vm.acceptClick();
					}
				});
			}
		},
		remove: function() {
			var ck = $('#dataGrid').bootstrapTable('getSelections'), ids = [];	
			if(checkedArray(ck)){
				$.each(ck, function(idx, item){
					ids[idx] = item.roleId;
				});
				post('/sys/role/remove?_' + $.now(), ids)
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
		authorizeOpt: function(){
			var ck = $('#dataGrid').bootstrapTable('getSelections');
			if(checkedRow(ck)){
				dialogOpen({
					title: '操作权限',
					url: '/base/role/opt.html?_' + $.now(),
					scroll : true,
					width: "300px",
					height: "450px",
					success: function(layero){
						let vueInstance = getIframeVue(layero)
						vueInstance.role.roleId = ck[0].roleId;
						vueInstance.setForm();
					},
					yes : function(iframe) {
						iframe.vm.acceptClick();
					}
				})
			}
		},
		authorizeData: function(){
			var ck = $('#dataGrid').bootstrapTable('getSelections');
			if(checkedRow(ck)){
				dialogOpen({
					title: '数据权限',
					url: '/base/role/data.html?_' + $.now(),
					scroll : true,
					width: "300px",
					height: "450px",
					success: function(layero){
						let vueInstance = getIframeVue(layero)
						vueInstance.role.roleId = ck[0].roleId;
						vueInstance.setForm();
					},
					yes : function(iframe) {
						iframe.vm.acceptClick();
					}
				})
			}
		}
	}
})