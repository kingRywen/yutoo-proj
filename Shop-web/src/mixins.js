import Vue from 'vue';
import Dialog from 'Components/MainLayout/src/dialog.vue';
import store from '@/store/index'
import router from '@/router/index'
export default {
	methods: {
		async	_openDialog({ component, params, copyText, title, width, appendToBody, okBtnText, cancelBtnText, top,showMaxBtn }, attrs = {}, listeners = {}) {
			const com = await component()
			let el, vmVue
			let MyComponent = Vue.extend({
				props: {
					// 外部传入弹窗的事件
					outerEvents: {
						default: () => ({})
					},
				},
				created() {

					
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
					this.innerDialogOpts.top = top
					this.innerDialogOpts.showMaxBtn = showMaxBtn
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
					if (!vmVue.dialogComponent.component) {
						return <div></div>
					}
					
					return <Dialog options={this.innerDialogOpts}
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
								vmVue.innerDialogOpts.visible ?
									<component
										{...{
											attrs: vmVue.dialogComponent.params,
											is:vmVue.dialogComponent.component
										}}
										ref="component"
									/> : null
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
		//单个操作
		showConfirmGlobal(api, params, title) {
			//api : 接口
			//params:传递的所有数据
			//title : 名称
			this.$confirm(`此操作将${title},是否继续`, '提示', { type: 'warning' }).then(() => {
				this.$api[api](params).then(() => {
					return this.getLayoutList()
				})
			}).catch(() => { })
		},
			
		showDialogGlobal(title, width, params = {}, component, okBtnText = '确认', cancelBtnText = '取消', top = '15vh') {
			// title : 标题
			// width : 宽度
			// params : 传递的数据
			// component : 动态加载组件的路径
			// okBtnText : 确认按钮名称
			// cancelBtnText : 取消按钮名称
			return this.$refs.layout.$dialog({
				title: title,
				width: width,
				top:top,
				params: params,
				component: component,
				okBtnText: okBtnText,
				cancelBtnText: cancelBtnText
			});
		},
		
		
		//复杂对象的深拷贝
		deepCopyGlobal(obj){
			let result = Array.isArray(obj) ? [] : {};
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (typeof obj[key] === 'object' && obj[key]!==null) {
						result[key] = this.deepCopyGlobal(obj[key]); 
					} else {
						result[key] = obj[key];
					}
				}
			}
			return result;
		}
		
	},
};
