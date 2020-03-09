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
			post('/quartz/job/save', {
				...this.ruleForm
			})
				.then(res => {
					handleRes(res.data)
				})
		}
	}
})