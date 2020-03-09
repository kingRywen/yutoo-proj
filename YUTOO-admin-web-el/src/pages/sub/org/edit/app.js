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
 * 编辑-机构管理js
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
		        yes : function(iframeId) {
		        	top.frames[iframeId].vm.acceptClick();
				}
		    })
		},
		setForm: function() {
			// $.SetForm({
			// 	url: '/sys/org/info?_' + $.now(),
		  //   	param: vm.org.orgId,
		  //   	success: function(data) {
		  //   		vm.org = data;
		  //   	}
			// });
			post('/sys/org/info?_' + $.now(), vm.org.orgId)
				.then(res => {
					console.log(res)
					vm.org = res.data.rows;
				})
		},
		acceptClick: function() {
			if (!$('#form').Validform()) {
		        return false;
		    }
		    // $.ConfirmForm({
		    // 	url: '/sys/org/update?_' + $.now(),
		    // 	param: vm.org,
		    // 	success: function(data) {
		    // 		$.currentIframe().vm.load();
		    // 	}
				// });
				ConfirmForm({
				url: '/sys/org/update?_' + $.now(),
				data: vm.org,
				success: function (res) {
					console.log(res)
					if(res.data.code == 0) {
						top.frames['main'].vm.load()
						top.layer.closeAll('iframe')
					}
				},
				fail: function(err) {
					console.error(err)
				}
			})
		}
	}
})
