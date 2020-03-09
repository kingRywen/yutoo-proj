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
 * 新增-机构管理js
 */
window.vm = new Vue({
	el:'#yutooPLT',
	data: {
		org: {
			parentId: 0,
			parentName: null,
			orderNum: 0,
			status: 1,
			layer: 1
		}
	},
	methods : {
		orgTree: function() {
			dialogOpen({
				id: 'layerOrgTree',
				title: '选择机构',
		        url: '/base/org/tree.html?_' + $.now(),
		        scroll : true,
		        width: "300px",
		        height: "450px",
		        yes : function(iframe) {
							iframe.vm.acceptClick()
				}
		    })
		},
		acceptClick: function() {
			if (!$('#form').Validform()) {
		        return false;
		    }
				post('/sys/org/save?_' + $.now(), vm.org)
				.then(res => {
					closeRefresh()
				})
		}
	}
})
