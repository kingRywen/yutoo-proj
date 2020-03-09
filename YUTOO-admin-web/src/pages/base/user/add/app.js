import Vue from 'vue'
import $ from 'jquery'
import './app.scss'
import 'scripts/validator.js'
import 'scripts/form.js'
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
	closeRefresh
} from 'scripts/common.js'

/**
 * 新增-用户管理js
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
		        yes : function(iframe) {
		        	iframe.vm.acceptClick();
				}
		    })
		},
		acceptClick: function() {
			if (!$('#form').Validform()) {
		        return false;
		    }

				post('/sys/user/save?_' + $.now(), vm.user)
				.then(res => {
					closeRefresh()
				})
		}
	},
	created : function() {
		this.getRoleList();
	}
})


