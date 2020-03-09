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
			idKey: "orgId",
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
			$.get('/sys/org/select', function (r) {
				ztree = $.fn.zTree
					.init($("#orgTree"), setting, r);
				let vmInstance = top.layerForm.childNodes[0].contentWindow.vm
				var node = ztree.getNodeByParam("orgId", vmInstance.org.parentId);
				ztree.selectNode(node);
				vmInstance.org.parentName = node.name;
			})
		},
		acceptClick: function () {
			var node = ztree.getSelectedNodes();
			let vmInstance = top.layerForm.childNodes[0].contentWindow.vm
			vmInstance.org.parentId = node[0].orgId;
			vmInstance.org.parentName = node[0].name;
			dialogClose();
		}
	},
	created: function () {
		this.getMenu();
	}
})