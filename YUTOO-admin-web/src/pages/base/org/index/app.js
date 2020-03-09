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
	BASE_URL
} from 'scripts/common.js'
import './app.scss'

/**
 * 组织机构js
 */

$(function () {
	getGrid();
});

function getGrid() {
	var colunms = TreeGrid.initColumn();
    var table = new TreeTable(TreeGrid.id, BASE_URL + '/sys/org/list?_' + $.now(), colunms);
    table.setExpandColumn(2);
    table.setIdField("orgId");
    table.setCodeField("orgId");
    table.setParentCodeField("parentId");
    table.setExpandAll(false);
    table.init();
    TreeGrid.table = table;
}

window.vm = new Vue({
	el:'#yutooPLT',
	methods : {
		hasPermission() {
			return hasPermission.apply(window, arguments)
		},
		load: function() {
			TreeGrid.table.refresh();
		},
		save: function() {
			dialogOpen({
				title: '新增机构',
				url: '/base/org/add.html?_' + $.now(),
				width: '500px',
				height: '315px',
				yes : function(iframe) {
					iframe.vm.acceptClick();
				},
			});
		},
		edit: function() {
			var ck = TreeGrid.table.getSelectedRow();
			if(checkedRow(ck)){
				dialogOpen({
					title: '编辑机构',
					url: '/base/org/edit.html?_' + $.now(),
					width: '500px',
					height: '315px',
					success: function(layero){
						let vueInstance = getIframeVue(layero)
						vueInstance.org.orgId = ck[0].id;
						vueInstance.setForm();
					},
					yes : function(iframe) {
						iframe.vm.acceptClick();
					},
				});
			}
		},
		remove: function() {
			var ck = TreeGrid.table.getSelectedRow(), ids = [];
			if(checkedArray(ck)){
				$.each(ck, function(idx, item){
					ids[idx] = item.id;
				});
				post('/sys/org/remove?_' + $.now(), ids)
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
        {field: 'selectItem', radio: true},
        {title: '编号', field: 'orgId', visible: false, align: 'center', valign: 'middle', width: '80px'},
        {title: '名称', field: 'name', align: 'center', valign: 'middle'},
        {title: '机构编码', field: 'code', align: 'center', valign: 'middle', width: '200px'},
        {title: '上级机构', field: 'parentName', align: 'center', valign: 'middle', width: '300px'},
        {title: '可用', field: 'status', align: 'center', valign: 'middle', width: '60px', formatter: function(item, index){
        	if(item.status === 0){
                return '<i class="fa fa-toggle-off"></i>';
            }
            if(item.status === 1){
                return '<i class="fa fa-toggle-on"></i>';
            }
        }},
        {title: '排序', field: 'orderNum', align: 'center', valign: 'middle', width: '80px'}]
    return columns;
};
