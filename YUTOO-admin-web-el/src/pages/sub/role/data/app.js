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
	dialogClose,
	ConfirmForm
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
	},
	check: {
		enable: true,
		nocheckInherit: true,
		chkboxType: {
			"Y": "",
			"N": ""
		}
	}
};
var ztree;

window.vm = new Vue({
	el: '#yutooPLT',
	data: {
		role: {}
	},
	methods: {
		getOrg: function (menuId) {
			request('/sys/org/list?_' + $.now())
				.then(res => {
					console.log(res)
					ztree = $.fn.zTree.init($("#orgTree"), setting, res.data);
					ztree.expandAll(true);
				})
		},
		setForm: function () {
			this.getOrg();
			post('/sys/role/info?_' + $.now(), vm.role.roleId)
				.then(res => {
					console.log(res)
					vm.role = res.data.rows
					//勾选角色所拥有的数据权限
					var orgIds = vm.role.orgIdList;
					for (var i = 0; i < orgIds.length; i++) {
						var node = ztree.getNodeByParam("orgId", orgIds[i]);
						ztree.checkNode(node, true, false);
					}
				})
			
		},
		acceptClick: function () {
			var nodes = ztree.getCheckedNodes(true);
			var orgIdList = new Array();
			for (var i = 0; i < nodes.length; i++) {
				orgIdList.push(nodes[i].orgId);
			}
			vm.role.orgIdList = orgIdList;
			// $.ConfirmForm({
			// 	url: '../../sys/role/authorize/data?_' + $.now(),
			// 	param: vm.role,
			// 	success: function (data) {

			// 	}
			// });

			ConfirmForm({
				url: '/sys/role/authorize/data?_' + $.now(),
				data: vm.role,
				success: function (res) {
					console.log(res)
				},
				fail: function (err) {
					console.error(err)
				}
			})
		}
	}
})