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
 * 编辑-用户管理js
 */
window.vm = new Vue({
	el:'#yutooPLT',
	data: {
		roleList:{},
		user:{
			orgId: 0,
			orgName: null,
			status: 1,
			roleIdList:[]
		}
	},
	methods : {
		getRoleList: function(){
			request('/sys/role/select?_' + $.now())
				.then(res => {
					vm.roleList = res.data.rows
				})
		},
		orgTree: function() {
			dialogOpen({
				id: 'layerOrgTree',
				title: '选择机构',
		        url: '/base/user/org.html?_' + $.now(),
		        scroll : true,
		        width: "300px",
		        height: "450px",
		        yes : function(iframeId) {
		        	top.frames[iframeId].vm.acceptClick();
				}
		    })
		},
		setForm: function() {

			post('../../sys/user/infoUser?_' + $.now(), vm.user.userId)
				.then(res => {
					vm.user = res.data.rows
				})
		},
		acceptClick: function() {
			if (!$('#form').Validform()) {
		        return false;
		    }

				ConfirmForm({
				url: '/sys/user/update?_' + $.now(),
				data: vm.user,
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
	},
	created : function() {
		this.getRoleList();
	}
})

