import Vue from 'vue';
import Dialog from 'Components/dialog/src/dialog.vue';
import store from '@/store/index'
import router from '@/router/index'
export default {
  methods: {
    _openDialog({ component, params, copyText, height, title, width, size, appendToBody, okBtnText, cancelBtnText }, attrs = {}, listeners = {}) {
      let el, vmVue, outerVm = this
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
            if (typeof title === 'string') {
              this.innerDialogOpts.title = title
            } else {
              this.jsxTitle = title
            }
            this.innerDialogOpts.visible = true
            this.innerDialogOpts.width = width
            this.innerDialogOpts.height = height
            this.innerDialogOpts.size = size
            this.innerDialogOpts.appendToBody = appendToBody
            this.innerDialogOpts.okBtnText = okBtnText
            this.innerDialogOpts.cancelBtnText = cancelBtnText
          })
        },
        data() {
          let vm = this
          return {
            jsxTitle: () => null,
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
                    // outerVm.clearSelection()
                    vm.innerDialogOpts.visible = false
                    outerVm.$refs.lay && outerVm.$refs.lay.reset()
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
        render(h) {
          return <Dialog opts={this.innerDialogOpts}
            copyText={this.dialogComponent.copyText}
            style={this.innerDialogOpts.visible ? { animation: 'dialog-fade-in 0.3s', width: this.innerDialogOpts.width, margin: '0 auto' } : null}
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
                  }, 300);

                }
              }
            }}
          >
            {!this.innerDialogOpts.title ? <div slot="title">{this.jsxTitle(h)}</div> : null}
            {
              this.innerDialogOpts.visible ? <transition-type name="fadeIn-fadeOut">
                <component
                  is={this.dialogComponent.component}
                  {...{
                    attrs: this.dialogComponent.params
                  }}
                  ref="component"
                ></component> </transition-type> : null
            }
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
  },
};
