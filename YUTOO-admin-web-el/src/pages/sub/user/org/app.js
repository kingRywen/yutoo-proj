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
	dialogContent,
	checkedRow,
	checkedArray,
	dialogMsg,
	closeRefresh,
	dialogClose
} from 'scripts/common.js'

var setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "orgId",
			pIdKey: "parentId",
			rootPId: 0
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
		getOrg: function (menuId) {

			request('/sys/org/list')
				.then(res => {
					console.log(res)
					ztree = $.fn.zTree.init($("#orgTree"), setting, res.data);
					let vmInstance = top.layerForm.childNodes[0].contentWindow.vm
					if (vmInstance.user.orgId != 0) {
						var node = ztree.getNodeByParam("orgId", vmInstance.user.orgId);
						ztree.selectNode(node);
						vmInstance.user.parentName = node.name;
					}
				})
		},
		acceptClick: function () {
			let vmInstance = top.layerForm.childNodes[0].contentWindow.vm
			var node = ztree.getSelectedNodes();
			vmInstance.user.orgId = node[0].orgId;
			vmInstance.user.orgName = node[0].name;
			dialogClose();
		}
	},
	created: function () {
		this.getOrg();
	}
})