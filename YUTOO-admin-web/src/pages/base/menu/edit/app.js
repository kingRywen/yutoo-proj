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
	el: '#yutooPLT',
	data: {
		menu: {
			parentName: null,
			parentId: 0,
			type: 1,
			orderNum: 0,
			icon: 'fa fa-circle-o'
		}
	},
	methods: {
		selectIcon: function () {
			dialogOpen({
				id: 'iconSelect',
				title: '选取图标',
				url: '/common/icon.html?_' + $.now(),
				scroll: true,
				width: "1030px",
				height: "600px",
				btn: false
			})
		},
		menuTree: function () {
			dialogOpen({
				id: 'layerMenuTree',
				title: '选择菜单',
				url: '/base/menu/tree.html?_' + $.now(),
				scroll: true,
				width: "300px",
				height: "450px",
				yes: function (iframe) {
					iframe.vm.acceptClick()
				}
			})
		},
		setForm: function () {
			post('/sys/menu/info?_' + $.now(), vm.menu.menuId)
				.then(res => {
					console.log(res)
					vm.menu = res.data.rows;
				})
		},
		acceptClick: function () {
			if (!$('#form').Validform()) {
				return false;
			}
			ConfirmForm({
				url: '/sys/menu/update?_' + $.now(),
				data: vm.menu,
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