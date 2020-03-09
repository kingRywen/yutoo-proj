import Vue from 'vue'
import $ from 'jquery'
import './app.scss'
import 'scripts/validator.js'
import 'scripts/form.js'
import { ConfirmForm, post, closeRefresh } from 'scripts/common';
import 'scripts/default.js'
// import 'assets/css/common.scss'

console.log($)
window.$ = $

window.vm = new Vue({
	el: '#yutooPLT',
	data: {
		area: {
			parentCode: 0,
			parentName: null,
			status: 1,
			orderNum: 0
		}
	},
	methods: {
		setForm: function () {
			post('/sys/area/info', vm.area.areaId)
				.then(res => {
					vm.area = res.data.rows
				})
		},
		acceptClick: function () {
			if (!$('#form').Validform()) {
				return false;
			}
			// ConfirmForm('/sys/area/update?_' + $.now(), {...vm.area})
			ConfirmForm({
				url: '/sys/area/update?_' + $.now(),
				data: vm.area,
				success: function (res) {
					console.log(res)
					if(res.data.code == 0) {
						// window.top.frames['main'].vm.load()
						// window.top.layer.closeAll('iframe')
						closeRefresh()
					}
				},
				fail: function(err) {
					console.error(err)
				}
			})
		}
	}
});