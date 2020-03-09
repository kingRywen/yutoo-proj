import Vue from "vue";
import Dialog from "Components/MainLayout/src/dialog.vue";
import store from "@/store/index";
import router from "@/router/index";
import { handleData } from "Components/MainLayout/src/MainLayout.vue";

export function _fbpFlagAmazon(val) {
  if (val === 0) {
    return "自发货";
  } else if (val === 1) {
    return "FBA";
  } else if (val === 2) {
    return "FBA+自发货";
  }
}

export default {
  methods: {
    showTips(data, cb, errCb) {
      let vm = this;
      this.$confirm(data.msg, "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        dangerouslyUseHTMLString: true,
        beforeClose: (action, instance, done) => {
          // console.log(instance);

          function close() {
            done();
            setTimeout(() => {
              instance.confirmButtonLoading = false;
              instance.cancelButtonLoading = false;
            }, 200);
          }
          if (action === "confirm") {
            instance.confirmButtonLoading = true;
            instance.cancelButtonLoading = true;
            // instance.confirmButtonText = '执行中...';
            let res = cb();
            // close()
            res
              .then(() => {
                close();
                if (cb) {
                  vm.$refs.layout.getList();
                }
              })
              .catch(() => {
                close();
              });
          } else {
            done();
          }
        },
        type: "warning"
      })
        .then(() => {})
        .catch(() => {
          // GLOBAL.removePending()
          if (errCb) {
            return errCb();
          }
          // this.$refs.layout.getList()
        });
    },
    $_dialog(params) {
      let layout;
      if (this.$refs && this.$refs.layout) {
        layout = this.$refs.layout;
      } else {
        if (
          this.$children[0].$options &&
          this.$children[0].$options._componentTag == "main-layout"
        ) {
          layout = this.$children[0];
        } else {
          throw "未定义table组件的ref=layout,如果不想定义请使用另外一个方法 this._openDialog";
        }
      }
      layout._dialog(params);
    },

    _openDialog({ component }, attrs = {}, listeners = {}) {
      let el,
        vmVue,
        self = this,
        _arg = arguments[0];
      let MyComponent = Vue.extend({
        props: {
          // 外部传入弹窗的事件
          outerEvents: {
            default: () => ({})
          }
        },
        created() {
          component().then(com => {
            // 挂载调用的mainlayout组件
            this.layoutVm = self.$refs.layout;
            handleData.apply(this, [].concat.apply([_arg], [com]));
          });
        },
        data() {
          let vm = this;
          return {
            innerDialogOpts: {
              visible: true,
              size: null,
              width: null,
              closeOnClickModal: false,
              title: null,
              okBtnText: "",
              fullscreen: true,
              cancelBtnText: "",
              showMaxBtn: false
            },
            dialogComponent: {},
            innerEvents: {
              open() {
                setTimeout(() => {
                  vm.$nextTick(() => {
                    // 弹窗里的组件
                    let component = vm.$refs.component;
                    if (!component) {
                      return;
                    }
                    // 调用组件初始化函数
                    component && component._initData && component._initData();
                  });
                });
              },
              close() {
                // 弹窗里的组件
                let component = vm.$refs.component;
                // 调用组件关闭函数
                component && component._close && component._close();
              },
              handleOkClick() {
                let component = vm.$refs.component;
                // if (!component) {
                //   return
                // }
                if (!component._submit) {
                  throw new Error("确保弹窗组件内定义了_submit方法");
                }
                let res = component._submit();
                // debugger;
                if (!res) {
                  return Promise.reject();
                }
                // _submit方法最好返回promise, 如果是reject，弹窗不会关闭，如果是resolve("close")，弹窗会关闭且不刷新列表，否则会刷新列表
                return res.then(res => {
                  //  1 重新获取数据  2 关闭弹窗  3.重置数据
                  let status;
                  if (res === true) {
                    status = 1;
                  } else if (res === "close") {
                    status = 2;
                  } else if (typeof res === "object") {
                    let { code, success } = res;
                    if (
                      ("success" in res && success > 0) ||
                      (!("success" in res) && code == 0)
                    ) {
                      status = 1;
                    }
                  } else if (res === "reset") {
                    status = 3;
                  }

                  if (status == 1 || status == 3) {
                    vm.layoutVm && vm.layoutVm.clearSelection();
                    vm.layoutVm &&
                      vm.layoutVm.getList(undefined, res === "reset");
                  }
                  vm.innerDialogOpts.visible = false;
                });
              }
            },
            ...attrs
          };
        },
        computed: {
          events() {
            return Object.assign(this.innerEvents, this.outerEvents);
          }
        },
        destroyed() {
          // 卸载调用的mainlayout组件
          vmVue.layoutVm = null;

          if (!vmVue.$el.parentNode) {
            return;
          }

          vmVue.$el.parentNode.removeChild(vmVue.$el);
          vmVue = null;
          el = null;
          MyComponent = null;
        },
        render() {
          return (
            <Dialog
              opts={this.innerDialogOpts}
              copyText={this.dialogComponent.copyText}
              events={this.events}
              style={
                this.innerDialogOpts.visible
                  ? { animation: "dialog-fade-in 0.1s" }
                  : null
              }
              ref="Dialog"
              {...{
                on: {
                  ...listeners,
                  close: () => {
                    if (listeners.close) {
                      listeners.close();
                    }
                    setTimeout(() => {
                      vmVue.$destroy();
                    }, 100);
                  }
                }
              }}
            >
              <transition-type name="fadeIn-fadeOut">
                {this.innerDialogOpts.visible ? (
                  <component
                    is={this.dialogComponent.component}
                    {...{
                      attrs: this.dialogComponent.params,
                      on: {
                        // 关闭弹窗方法
                        "dialog.close": () => {
                          if (listeners.close) {
                            listeners.close();
                          }
                          setTimeout(() => {
                            vmVue.$destroy();
                          }, 100);
                        }
                      }
                    }}
                    ref="component"
                  ></component>
                ) : null}
              </transition-type>
            </Dialog>
          );
        }
      });
      vmVue = new MyComponent({
        router,
        store
      });
      el = document.createElement("div");
      document.body.appendChild(el);
      // debugger
      vmVue.$mount(el);
    },
    getLayoutList() {
      return this.$refs.layout.getList();
    },
    showConfirmGlobal(api, params, title) {
      //api : 接口
      //params:传递的所有数据
      //title : 名称
      this.$confirm(`此操作将${title},是否继续`, "提示", { type: "warning" })
        .then(() => {
          this.$api[api](params).then(() => {
            return this.getLayoutList();
          });
        })
        .catch(() => {});
    },
    showDialogGlobal(
      title,
      width,
      params = {},
      component,
      okBtnText = "确认",
      cancelBtnText = "取消",
      top = "15vh",
      fullscreen = true
    ) {
      // title : 标题
      // width : 宽度
      // params : 传递的数据
      // component : 动态加载组件的路径
      // okBtnText : 确认按钮名称
      // cancelBtnText : 取消按钮名称
      //top : 对话框距离顶部的距离
      //fullscreen: 是否全屏
      return this.$refs.layout._dialog({
        title,
        width,
        top,
        params: { params },
        component,
        okBtnText,
        cancelBtnText,
        fullscreen,
        height: !fullscreen ? "550px" : null
      });
    },
    //处理文本域
    moreRowText(str) {
      if (typeof str === "string") {
        return str
          .split(/[\n|\r\n|,|，]/)
          .map(el => el.trim())
          .filter(el => el !== "");
      } else {
        return str;
      }
    }
  },
  computed: {
    storeInfo() {
      return this.$store.state.storeInfo.info;
    },
    currentSite() {
      return this.$store.getters["storeInfo/currentSite"];
    },
    storeUrls() {
      return this.$store.state.storeInfo.otherData;
    }
  },
  filters: {
    _formatData(val) {
      return val == null || val === -1 || val === "" ? "-" : val;
    },
    _fbpFlagAmazon
  }
};
