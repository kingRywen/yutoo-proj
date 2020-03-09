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

window.vm = new Vue({
	el:'#yutooPLT',
	data: {
		macro:{
			typeName: null,
			typeId: 0,
			type: 1,
			orderNum: 0,
			status: 1
		}
	},
	methods : {
		macroTree: function(){
		    dialogOpen({
				id: 'layerMacroTree',
				title: '选择目录',
		        url: '/base/macro/tree.html?_' + $.now(),
		        scroll : true,
		        width: "300px",
		        height: "450px",
		        yes : function(iframe) {
		        	iframe.vm.acceptClick()
				}
		    })
		},
		setForm: function() {
			post('/sys/macro/info?_' + $.now(), vm.macro.macroId)
				.then(res => {
					console.log(res)
					vm.macro = res.data.rows;
				})
		},
		acceptClick: function() {
			if (!$('#form').Validform()) {
		        return false;
				}
				ConfirmForm({
				url: '/sys/macro/update?_' + $.now(),
				data: vm.macro,
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
