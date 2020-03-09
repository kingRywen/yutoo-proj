import Vue from 'vue';
import Dialog from 'Components/MainLayout/src/dialog.vue';
import store from '@/store/index'
import router from '@/router/index'
export default {
	filters: {
		_formatData(val) {
			return val == null || val === -1 || val === '' ? '-' : val
		}
	},
	methods: {
		// 格式华表格数据显示
		_formatter(row, column) {
			if (!row[column.property] || row[column.property] === "" || row[column.property] === -1) {
				return "-";
			} else {
				return row[column.property];
			}
		},
		// 格式化日期
		_formatterData(row, column) {
			let val = row[column.property]
			if (!val || val === "" || val === -1) {
				return "-";
			} else {
				return val.split(' ')[0]
			}
		},
		_openDialog({ component, params, copyText, title, width, appendToBody, okBtnText, cancelBtnText }, attrs = {}, listeners = {}) {
			let el, vmVue
			let MyComponent = Vue.extend({
				props: {
					// 外部传入弹窗的事件
					outerEvents: {
						default: () => ({})
					},
				},
				created() {
					component().then(com => {
						// console.log(com);
						com.default.inheritAttrs = false
						this.dialogComponent.component = com.default
						this.dialogComponent.params = params
						this.dialogComponent.copyText = copyText
						this.innerDialogOpts.title = title
						this.innerDialogOpts.visible = true
						this.innerDialogOpts.width = width
						this.innerDialogOpts.appendToBody = appendToBody
						this.innerDialogOpts.okBtnText = okBtnText
						this.innerDialogOpts.cancelBtnText = cancelBtnText
					})
				},
				data() {
					let vm = this
					return {
						innerDialogOpts: {
							visible: true,
							size: null,
							width: null,
							closeOnClickModal: false,
							title: null,
							okBtnText: '',
							fullscreen: false,
							cancelBtnText: '',
							showMaxBtn: false
						},
						dialogComponent: {},
						innerEvents: {
							open() {
								setTimeout(() => {
									vm.$nextTick(() => {
										// 弹窗里的组件
										let component = vm.$refs.component
										if (!component) {
											return
										}
										// 调用组件初始化函数
										component && component._initData && component._initData()
									})
								})
							},
							close() {
								// 弹窗里的组件
								let component = vm.$refs.component
								// 调用组件关闭函数
								component && component._close && component._close()
							},
							handleOkClick() {
								let component = vm.$refs.component
								// if (!component) {
								//   return
								// }
								if (!component._submit) {
									throw new Error('确保弹窗组件内定义了_submit方法')
								}
								let res = component._submit()
								if (!res) {
									return Promise.reject()
								}
								// _submit方法最好返回promise, 如果是reject，弹窗不会关闭，如果是resolve("close")，弹窗会关闭且不刷新列表，否则会刷新列表
								return res.then(res => {
									if (res && res !== 'close') {
										vm.innerDialogOpts.visible = false
									}
									if (res === 'close') {
										vm.innerDialogOpts.visible = false
									}
								})
							}
						},
						...attrs
					}
				},
				computed: {
					events() {
						return Object.assign(this.innerEvents, this.outerEvents)
					},
				},
				destroyed() {
					if (!vmVue.$el.parentNode) {
						return
					}
					vmVue.$el.parentNode.removeChild(vmVue.$el)
					vmVue = null
					el = null
					MyComponent = null
				},
				render() {
					return <Dialog opts={this.innerDialogOpts}
						copyText={this.dialogComponent.copyText}
						events={this.events}
						ref="Dialog"
						{...{
							on: {
								...listeners,
								close: (e) => {
									if (listeners.close) {
										listeners.close(e)
									}
									setTimeout(() => {
										vmVue.$destroy()
									}, 100);

								}
							}
						}}
					>
						<transition-type name="fadeIn-fadeOut">
							{
								this.innerDialogOpts.visible ?
									<component
										is={this.dialogComponent.component}
										{...{
											attrs: this.dialogComponent.params
										}}
										ref="component"
									></component> : null
							}
						</transition-type>
					</Dialog>
				}
			})
			vmVue = new MyComponent({
				router,
				store,
			})
			el = document.createElement('div')
			document.body.appendChild(el)
			vmVue.$mount(el)
		},
		$dialog(params) {
			if (this.$refs && this.$refs.layout) {
				return this.$refs.layout.$dialog(params)
			}
		},
		getLayoutList() {
			return this.$refs.layout.getList()
		},
		getSelection() {
			return this.$refs.layout.selection
		},
		//单个操作
		showConfirm(api, params, title) {
			//api : 接口
			//params:传递的所有数据
			//title : 名称
			this.$confirm(`此操作将${title},是否继续`, '提示', { type: 'warning' }).then(() => {
				this.$api[api](params).then(() => {
					return this.getLayoutList()
				})
			}).catch(() => { })
		},

		//批量操作
		showConfirmGo(api, params, title) {
			//api : 接口
			//params:传递的所有数据
			//title : 名称
			this.$confirm(`此操作将${title},是否继续`, '提示', { type: 'warning' }).then(() => {
				this.$api[api](params).then((res) => {
					let result = JSON.stringify(res)
					return this.$router.push({ name: '批量提示', query: { data: result } })
				})
			}).catch(() => { })
		},


		showDialog(title, width = '100%', params = {}, component, okBtnText = null, cancelBtnText = null) {
			// title : 标题
			// width : 宽度
			// params : 传递的数据
			// component : 动态加载组件的路径
			// okBtnText : 确认按钮名称
			// cancelBtnText : 取消按钮名称
			return this.$refs.layout.$dialog({
				title: title,
				width: width,
				params: {
					params
				},
				component: component,
				okBtnText: okBtnText,
				cancelBtnText: cancelBtnText
			});
		},
	},
};
