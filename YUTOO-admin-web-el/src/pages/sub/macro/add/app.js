import Vue from 'vue'
import Element from 'element-ui'
import {
	request,
	post,
	resize,
	handleRes
} from 'config'
import './app.scss'

Vue.use(Element)

window.vm = new Vue({
	el: '#app',
	created() {
		this.getMenu().then(res => {
			console.log(res)
			let options = [{
				label: '一级目录',
				value: '一级目录',
				children: [{
						label: '系统参数',
						value: '系统参数',
						children: [{
							label: '用户状态',
							value: '用户状态',
						}]
					},
					{
						label: '客户关系',
						value: '客户关系',
						children: [{
							label: '用户状态',
							value: '用户状态',
						}]
					},
				]
			}]
			this.options = options

		})
	},
	data() {
		return {
			ruleForm: {
				typeId: 0,
				type: 1,
				orderNum: '0',
				status: 1
			},
			multiSelect: [],
			typeSelect: [{
					label: '目录',
					value: 0
				},
				{
					label: '参数',
					value: 1
				},
			],
			treeSelect: [],
			options: [],
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
				}, ]
			}
		}
	},
	methods: {
		getMenu() {
			return request('/sys/macro/select')
		},
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
			post('sys/macro/save', { ...this.ruleForm,
				typeName: this.typeName
			})
				.then(res => {
					handleRes(res.data)
				})
		}
	},
	computed: {
		typeName() {
			return this.treeSelect[this.treeSelect.length - 1]
		}
	}
})