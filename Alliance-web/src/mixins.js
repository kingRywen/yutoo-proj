import Vue from 'vue';
import Dialog from 'Components/MainLayout/src/dialog.vue';
import store from '@/store/index'
import router from '@/router/index'
let res
export default {
  methods: {
    showTips(data, cb, errCb) {
      this.$confirm(data.msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消', closeOnClickModal: false,
        dangerouslyUseHTMLString: true,
        beforeClose: (action, instance, done) => {
          function close() {
            done();
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 200);
          }
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            // instance.confirmButtonText = '执行中...';
            res = cb()
            res.then(() => {
              close()
              if (cb) {
                this.$refs.layout.getList()
              }
            }).catch(() => {
              close();
            })
          } else {
            done();
          }
        },
        type: 'warning'
      })
        .then(() => {

        })
        .catch(() => {
          GLOBAL.removePending()
          if (errCb) {
            return errCb()
          }
          // this.$refs.layout.getList()
        })
    },
    $dialog(params) {
      if (this.$refs && this.$refs.layout) {
        return this.$refs.layout.$dialog(params)
      }
    },
    _openDialog({ component, params, copyText, title, width, size, appendToBody, okBtnText, cancelBtnText }, attrs = {}, listeners = {}) {
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
            this.innerDialogOpts.size = size
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
            style={this.innerDialogOpts.visible ? { animation: 'dialog-fade-in 0.3s' } : null}
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
    }
  }
};
