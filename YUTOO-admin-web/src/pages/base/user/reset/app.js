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
	closeRefresh,
	ConfirmForm
} from 'scripts/common.js'

window.vm = new Vue({
		el:'#yutooPLT',
		data: {
			user: {}
		},
		methods : {
			acceptClick: function() {
				if (!$('#form').Validform()) {
			        return false;
			    }

					ConfirmForm({
					url: '/sys/user/reset?_' + $.now(),
					data: vm.user,
					success: function (res) {
						closeRefresh()
					},
					fail: function (err) {
						console.error(err)
					}
				})
			}
		}
	})

