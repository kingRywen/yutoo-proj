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
 * 新增-菜单管理js
 */
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
				window: window,
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
		acceptClick: function () {
			if (!$('#form').Validform()) {
				return false;
			}

			post('/sys/menu/save?_' + $.now(), vm.menu)
				.then(res => {
					if(res.data.code == 0) {
						closeRefresh()
					}
				})
		}
	}
})