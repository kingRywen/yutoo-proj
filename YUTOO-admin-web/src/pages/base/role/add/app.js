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
 * 新增-角色管理js
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
		acceptClick: function() {
			if (!$('#form').Validform()) {
		        return false;
		    }
				post('/sys/role/save?_' + $.now(), vm.role)
				.then(res => {
					closeRefresh()
				})
		}
	}
})


