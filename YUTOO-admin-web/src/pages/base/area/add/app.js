import Vue from 'vue'
import $ from 'jquery'
import './app.scss'
import 'scripts/validator.js'
import 'scripts/form.js'
import {
	closeRefresh
} from 'scripts/common'

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
		acceptClick: function () {
			if (!$('#form').Validform()) {
				return false;
			}
			$.SaveForm({
				url: '../../sys/area/save?_' + $.now(),
				param: vm.area,
				success: function (data) {
					closeRefresh()
				}
			});
		}
	}
})