import Vue from 'vue'
import $ from 'jquery'
import './app.scss'
import 'scripts/validator.js'
import 'scripts/form.js'
import {
	hasPermission,
	request,
	post,
	dialogOpen,
	dialogClose,
	dialogContent,
	checkedRow,
	checkedArray,
	dialogMsg,
	ConfirmForm
} from 'scripts/common.js'
import 'scripts/default.js'
// import 'assets/css/common.scss'

console.log($)
window.$ = $
/**
 * 编辑-角色管理js
 */
window.vm = new Vue({
	el:'#yutooPLT',
	data: {
		role: {
			orgId: 0,
			orgName: null
		}
	},
	methods : {
		orgTree: function() {
			dialogOpen({
				id: 'layerOrgTree',
				title: '选择机构',
		        url: '/base/role/org.html?_' + $.now(),
		        scroll : true,
		        width: "300px",
		        height: "450px",
		        yes : function(iframe) {
		        	iframe.vm.acceptClick();
				}
		    })
		},
		setForm: function() {
			post('/sys/role/info?_' + $.now(), vm.role.roleId)
				.then(res => {
					console.log(res)
					vm.role = res.data.rows
				})
		},
		acceptClick: function() {
			if (!$('#form').Validform()) {
		        return false;
		    }
				ConfirmForm({
				url: '/sys/role/update?_' + $.now(),
				data: vm.role,
				success: function (res) {
					console.log(res)
					if (res.data.code == 0) {
						console.log(top.frames)
						top.frames['main'].vm.load()
						top.layer.closeAll('iframe')
					} else {
						top.frames['main'].vm.load()
						top.layer.closeAll('iframe')
					}
				},
				fail: function (err) {
					console.error(err)
				}
			})
		}
	}
})
