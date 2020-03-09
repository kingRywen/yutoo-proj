import Vue from 'vue'
import Element from 'element-ui'
import {
	request,
	post,
	resize,
	handleRes,
	getQueryString,
	getVueInstance
} from 'config'
import './app.scss'

Vue.use(Element)

window.vm = new Vue({
	el: '#app',
	created () {
		console.log(getQueryString('areaid'));
		post('/sys/area/info', getQueryString('areaid'))
			.then(res => {
				this.ruleForm = res.data.rows
			})
	},
	data() {
		return {
			ruleForm: {
				"parentCode": "",
				"parentName": null,
				"status": '',
				"orderNum": 0,
				"areaCode": "",
				"name": ""
			},
			layerSelect: [
				{
					label: '省级',
					value: 1
				},
				{
					label: '地市',
					value: 2
				},
				{
					label: '区县',
					value: 3
				}
			],
			rules: {
				areaCode: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}, ],
				name: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}, ],
				parentName: [{
					required: true,
					message: '不能为空',
					trigger: 'blur'
				}, ],
			}
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
			post('/sys/area/update?_' + Date.now(), { ...this.ruleForm })
				.then(res => {
					handleRes(res.data, () => {
						let vmMain = getVueInstance('main')
						vmMain.getAreaList(null, res => {
							vmMain.leftRows = vmMain.rightRows = res.data.rows
						})
					})
				})
		}
	}
})