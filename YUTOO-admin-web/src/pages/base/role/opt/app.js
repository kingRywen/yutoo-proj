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
			idKey: "menuId",
			pIdKey: "parentId",
			rootPId: 0
		},
		key: {
			url: "nourl"
		}
	},
	check: {
		enable: true,
		nocheckInherit: true
	}
};
var ztree;

window.vm = new Vue({
	el: '#yutooPLT',
	data: {
		role: {}
	},
	methods: {
		getMenu: function (menuId) {
			return request('/sys/menu/list?_' + $.now())
				.then(res => {
					console.log(res)
					ztree = $.fn.zTree.init($("#menuTree"), setting, res.data);
					ztree.expandAll(true);
				})

		},
		setForm: function () {
			this.getMenu().then(() => post('/sys/role/info', vm.role.roleId))
				.then(res => {
					console.log(res)
					vm.role = res.data.rows
					//勾选角色所拥有的菜单
					var menuIds = vm.role.menuIdList;
					for (var i = 0; i < menuIds.length; i++) {
						var node = ztree.getNodeByParam("menuId", menuIds[i]);
						ztree.checkNode(node, true, false);
					}
				})
		},
		acceptClick: function () {
			var nodes = ztree.getCheckedNodes(true);
			var menuIdList = new Array();
			for (var i = 0; i < nodes.length; i++) {
				menuIdList.push(nodes[i].menuId);
			}
			vm.role.menuIdList = menuIdList;
			// $.ConfirmForm({
			// 	url: '../../sys/role/authorize/opt?_' + $.now(),
			// 	param: vm.role,
			// 	success: function (data) {}
			// });
			ConfirmForm({
				url: '/sys/role/authorize/opt?_' + $.now(),
				data: vm.role,
				success: function (res) {
					// console.log(res)
					// if (res.data.code == 0) {
					// 	console.log(top.frames)
					// 	top.frames['main'].vm.load()
					// 	top.layer.closeAll('iframe')
					// } else {
					// 	top.frames['main'].vm.load()
					// 	top.layer.closeAll('iframe')
					// }
				},
				fail: function (err) {
					console.error(err)
				}
			})
		}
	}
})