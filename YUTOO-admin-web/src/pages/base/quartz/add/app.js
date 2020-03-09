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
 * 新增-定时任务js
 */
window.vm = new Vue({
	el:'#yutooPLT',
	data: {
		job: {
			
		}
	},
	methods : {
		acceptClick: function() {
			if (!$('#form').Validform()) {
		        return false;
		    }
				post('/quartz/job/save?_' + $.now(), vm.job)
				.then(res => {
					closeRefresh()
				})
		}
	}
})
