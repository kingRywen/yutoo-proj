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


window.vm = new Vue({
	el: '#yutooPLT',
	data: {
		macro: {
			typeName: null,
			typeId: 0,
			type: 1,
			orderNum: 0,
			status: 1
		}
	},
	methods: {
		macroTree: function () {
			dialogOpen({
				id: 'layerMacroTree',
				title: '选择目录',
				url: '/base/macro/tree.html?_' + $.now(),
				scroll: true,
				width: "300px",
				height: "450px",
				yes: function (iframe) {
					iframe.vm.acceptClick()
				}
			})
		},
		acceptClick: function () {
			if (!$('#form').Validform()) {
				return false;
			}

			post('/sys/macro/save?_' + $.now(), vm.macro)
				.then(res => {
					if(res.data.code == 0) {
						closeRefresh()
					}
				})
		}
	}
})