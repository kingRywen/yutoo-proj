import Vue from 'vue'
import Element from 'element-ui'
import {
	post,
	handleRes,
	getQueryString
} from 'config'
import './app.scss'

Vue.use(Element)

window.vm = new Vue({
	el: '#app',
	created () {
		post('/quartz/job/info', getQueryString('jobId'))
			.then(res => {
				this.ruleForm = res.data.rows
			})
	},
	data() {
		return {
			ruleForm: {
			},
		}
	},
	methods: {
		submitForm() {
			this.$refs['ruleForm'].validate((valid) => {
				if (valid) {
					this.postData()
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		postData() {
			post('/quartz/job/update', {
				...this.ruleForm
			})
				.then(res => {
					handleRes(res.data)
				})
		}
	}
})