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
import Icon from 'components/Icon.vue';

Vue.use(Element)

window.vm = new Vue({
	el: '#app',
	components: {
		Icon
	},
	created () {
		this.getMenu().then(res => {
			console.log(res);
			let rows = res.data.rows
			let obj = {}
			rows.map(el => {
				if (obj[el.parentId]) {
					// 如果已经有parentid 说明之前已经有建组了，直接 push
					obj[el.parentId].push(Object.assign(el, {
						label: el.name,
						value: el.name,
						children: []
					}))
				} else {
					// 如果没有说明第一次，需要建组
					obj[el.parentId] = []
					obj[el.parentId].push(Object.assign(el, {
						label: el.name,
						value: el.name,
						children: []
					}))
				}
			});
			console.log(obj);
			let options = []
			options.push(...obj['-1'])
			options[0].children.push(...obj['0'])
			options[0].children[0].children.push(...obj['1'])
			options[0].children[1].children.push(...obj['3'])
			options[0].children[0].children[4].children.push(...obj['47'])
			console.log(options);
			this.options = options
			// options[]
		})
	},
	data() {
		return {
			ruleForm: {
				name:'',
				url: '',
				perms: '',
				orderNum: '',
				icon: '',
			},
			open: false,
			treeSelect: [],
			typeSelect: [
				{
					label: '目录',
					value: '0'
				},
				{
					label: '菜单',
					value: '1'
				},
				{
					label: '按钮',
					value: '2'
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
				}, ]
			},
			options: []
		}
	},
	methods: {
		getMenu () {
			return request('/sys/menu/select')
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
			post('sys/menu/save', { ...this.ruleForm, ...this.parentName })
				.then(res => {
					handleRes(res.data)
				})
		}
	},
	computed: {
		parentName () {
			return this.treeSelect.join('')
		}
	}
})