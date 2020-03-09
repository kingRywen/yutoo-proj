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
 * 编辑-定时任务js
 */
window.vm = new Vue({
	el: '#yutooPLT',
	data: {
		job: {
			jobId: 0
		}
	},
	methods: {
		setForm: function () {
			post('/quartz/job/info?_' + $.now(), vm.job.jobId)
				.then(res => {
					console.log(res)
					vm.job = res.data.rows
				})
		},
		acceptClick: function () {
			if (!$('#form').Validform()) {
				return false;
			}

			ConfirmForm({
				url: '/quartz/job/update?_' + $.now(),
				data: vm.job,
				success: function (res) {
					console.log(res)
					if (res.data.code == 0) {
						console.log(top.frames)
						top.frames['main'].vm.load()
						top.layer.closeAll('iframe')
					} else {
						top.frames['main'].vm.load()
						top.layer.closeAll('iframe')
					}
				},
				fail: function (err) {
					console.error(err)
				}
			})
		}
	}
})