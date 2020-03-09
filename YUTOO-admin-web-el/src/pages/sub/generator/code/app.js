import Vue from 'vue'
import Element from 'element-ui'
import {
	post,
	handleRes,
	BASE_URL
} from 'config'
import './app.scss'

Vue.use(Element)

console.log(myAttribute)
let tableName = myAttribute.tables.map(el => el.tableName)

window.vm = new Vue({
	el: '#app',
	data() {
		return {
			ruleForm: {
				tables: tableName,
				type: 2,
				module: 'com.yutoo.admin'
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
			window.location.href = BASE_URL + '/sys/generator/code?tables=' + this.ruleForm.tables.join() +
				'&module=' + this.ruleForm.module +
				'&token=' + localStorage.getItem("token")
		}
	}
})