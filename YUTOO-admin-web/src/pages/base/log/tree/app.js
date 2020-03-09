import Vue from 'vue'
import $ from 'jquery'
import './app.scss'
import 'scripts/validator.js'
import 'scripts/form.js'
import 'scripts/ztree/jquery.ztree.all.min.js'
// import 'assets/css/common.scss'
import {
	hasPermission,
	request,
	post,
	dialogOpen,
	dialogClose,
	dialogContent,
	checkedRow,
	checkedArray,
	dialogMsg
} from 'scripts/common.js'
import 'scripts/default.js'

var setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "menuId",
			pIdKey: "parentId",
			rootPId: -1
		},
		key: {
			url: "nourl"
		}
	}
};
var ztree;

window.vm = new Vue({
	el: '#yutooPLT',
	methods: {
		getMenu: function (menuId) {
			$.get('/sys/menu/select', function (r) {
				ztree = $.fn.zTree
					.init($("#menuTree"), setting, r.rows);
				var form = top.layerForm.getElementsByTagName('iframe')[0].contentWindow
				var node = ztree.getNodeByParam("menuId", form.vm.menu.parentId);
				ztree.selectNode(node);
				form.vm.menu.parentName = node.name;
			})
		},
		acceptClick: function () {
			var form = top.layerForm.getElementsByTagName('iframe')[0].contentWindow
			var node = ztree.getSelectedNodes();
			form.vm.menu.parentId = node[0].menuId;
			form.vm.menu.parentName = node[0].name;
			dialogClose()
		}
	},
	created: function () {
		this.getMenu();
	}
})