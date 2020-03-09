import Vue from 'vue'
import Element from 'element-ui'
import {
	request,
	post,
	resize,
	showMsg,
	handleRes
} from 'config'
import './app.scss'

Vue.use(Element)

window.vm = new Vue({
	el: '#app',
	data() {
		return {
			ruleForm: {
				status: 1,
				roleIdList: ['', '']
			},
			rules: {
				username: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
				orgName: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
				password: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}],
			}
		}
	},
	methods: {
		submitForm() {
			console.log(12);
			this.$refs['ruleForm'].validate((valid) => {
				console.log(valid);
				if (valid) {
					this.postData()
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		postData() {
			post('/quartz/job/save', {
				...this.ruleForm
			})
				.then(res => {
					handleRes(res.data)
				})
		}
	}
})