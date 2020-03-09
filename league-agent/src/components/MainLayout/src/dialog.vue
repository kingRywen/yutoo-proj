<template>
  <el-dialog
    :class="['customDialog']"
    :append-to-body="true"
    v-on="events"
    v-bind="options"
    center
    :fullscreen="options.fullscreen"
    :visible.sync="opts.visible"
    :before-close="beforeClose"
    @open="handleOpen"
    @close="handleClose"
    @closed="handleClosed"
    :width="Number.isFinite(dialogWidth) ?dialogWidth + 'px' : dialogWidth"
  >
    <template slot="title">
      <span>{{options.title}}</span>
      <i class="iconfont1 iconfangda bigIcon" v-if="options.showMaxBtn" @click="isFullMethod"></i>
    </template>
    <el-scrollbar
      v-loading="loadingBtn || $store.state.loading"
      wrap-class="default-scrollbar__wrap"
      view-class="p20-scrollbar__view"
      :key="diaKey"
      ref="scroll"
      :style="{height:options.height}"
    >
      <slot></slot>
    </el-scrollbar>

    <template slot="footer" class="dialog-footer">
      <div v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
      <template v-else>
        <!-- 有复制功能 -->
        <el-button
          v-if="options.okBtnText && copyText !== undefined"
          ref="copyBtn"
          type="primary"
          :loading="loadingBtn"
        >复制</el-button>

        <!-- 没有复制功能 -->
        <el-button
          v-if="options.okBtnText && copyText === undefined"
          type="primary"
          :loading="loadingBtn"
          @click="handleOkClick"
        >{{options.okBtnText}}</el-button>
        <slot name="btns"></slot>

        <el-button
          v-if="options.cancelBtnText"
          :type="options.cancelBtnText ==='关闭' ? 'primary':''"
          @click="handleCancelClick"
        >{{options.cancelBtnText || '取消'}}</el-button>
      </template>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'layout-dialog',
  data() {
    return {
      loadingBtn: false,
      copyBtn: null,
      diaKey: 1,
      forms: []
    }
  },
  props: {
    appendToBody: {
      default: false
    },
    scrollTop: {
      default: true
    },
    // 验证函数 ，必须返回promise, reject表示失败，resolve表示成功
    validate: {
      type: Function,
      default: null
    },
    copyText: {
      type: String,
      default: undefined
    },
    opts: {
      type: Object,
      default: () => ({
        visible: false,
        title: '提示',
        width: '70%',
        // small | medium | large
        size: 'medium',
        fullscreen: false,
        top: '6vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: false,
        closeOnPressEscape: true,
        showClose: true,
        showMaxBtn: false
      })
    },
    events: {
      type: Object,
      default: () => ({
        open: () => {},
        close: () => {},
        closed: () => {},
        handleOkClick: () => {},
        handleCancelClick: () => {}
      })
    }
  },
  computed: {
    options: {
      get() {
        return Object.assign(
          {},
          {
            visible: false,
            title: '提示',
            width: '70%',
            // small | medium | large
            size: 'medium',
            fullscreen: false,
            top: '6vh',
            modal: true,
            noShowLoading: false,
            modalAppendToBody: true,
            appendToBody: false,
            lockScroll: true,
            customClass: null,
            closeOnClickModal: false,
            closeOnPressEscape: true,
            showClose: true,
            showMaxBtn: false
          },
          this.opts
        )
      },
      set(val) {
        this.opts = val
      }
    },
    dialogWidth() {
      let { size, width } = this.options
      if (size) {
        return size === 'small' ? 500 : size === 'medium' ? 800 : 1100
      } else {
        return width
      }
    }
  },
  methods: {
    toBottom() {
      let el = document.querySelectorAll(
        '.default-scrollbar__wrap.el-scrollbar__wrap'
      )[0]
      el.scrollTop = 10000
    },

    handleCancelClick() {
      this.events.handleCancelClick && this.events.handleCancelClick()
      this.opts.visible = false
      // this.$emit('handleCancelClick')
    },
    handleClose() {
      this.$emit('close')
      // this.events.close && this.events.close()
      this.resetForm()
    },
    handleClosed() {
      this.options.fullscreen = true
    },
    handleOpen() {
      this.events.handleOpen && this.events.handleOpen()
      this.$nextTick(() => {
        // 装载复制组件
        setTimeout(() => {
          this.getElForm(this.$children)
          this.forms.map(el => el.setData(el.defaultData))
          this.forms.splice(0)
          this.$nextTick(() => {
            // this.toBottom()
            if (this.copyText == null) {
              return
            }
            this.$copyText(this.copyText).then(
              function() {
                this.$message.success('复制成功')
              },
              function() {
                this.$message.error('复制失败')
              }
            )
          })
        })
        // this.resetForm(true)
      })
    },
    beforeClose(done) {
      this.options.beforeClose && this.options.beforeClose()
      // 卸载复制组件
      if (this.copyBtn) {
        this.copyBtn.destroy()
        this.copyBtn = null
      }
      done()
    },

    isHidden(el) {
      let elStyle = window.getComputedStyle(el)
      let parent = el.parentNode,
        hidden = false
      if (elStyle.display === 'none' || elStyle.visibility === 'hidden') {
        hidden = true
      }
      while (parent !== document) {
        parent = parent.parentNode
        if (parent.nodeType === 1) {
          let style = window.getComputedStyle(parent)
          if (style.display === 'none' || style.visibility === 'hidden') {
            hidden = true
          }
        }
      }
      return hidden
    },

    // 获取children下的所有el-form,用于验证
    // @return el-form组成的数组
    getElForm(children) {
      for (const key in children) {
        if (children.hasOwnProperty(key)) {
          const element = children[key]
          if (element.$options._componentTag === 'SimpleForm') {
            if (
              !this.isHidden(element.$el) &&
              this.forms.indexOf(element) === -1
            ) {
              this.forms.push(element)
            }
          }
          if (element.$children) {
            this.getElForm(element.$children)
          }
        }
      }
      return this.forms
    },

    // 保存按钮事件
    handleOkClick() {
      if (!this.validate) {
        // 需要验证
        // let defaultVNode = this.$children
        this.getElForm(this.$children)

        Promise.all(this.forms.map(form => form.validate()))
          .then(() => {
            // 所有form验证成功
            this.forms.splice(0)
            this.action()
          })
          .catch(err => {
            if (err instanceof Error || err !== false) {
              // eslint-disable-next-line no-console
              console.error(err)
            } else {
              // 所有form验证失败
              this.$message.warning('请输入正确的必填项')
              this.forms.splice(0)
            }

            this.loadingBtn = false
          })
      } else {
        // 自己手动验证
        this.validate()
          .then(() => {
            this.action()
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    // handleOkClick() {
    //   debugger
    //   let simpleForm = this.$slots.default[0].child
    //   let childVm
    //   if (!simpleForm) {
    //     this.action()
    //     return
    //   }
    //   if (simpleForm.$children[0]) {
    //     childVm =
    //       simpleForm.$children[0].$el.nodeName !== 'FORM'
    //         ? simpleForm
    //         : simpleForm.$children[0] // 表单组件
    //   }

    //   if (childVm && childVm.rules && Object.keys(childVm.rules).length) {
    //     childVm.validate(valid => {
    //       if (valid) {
    //         this.action(simpleForm.is_edit ? true : false)
    //       } else {
    //         this.$message.warning('请填写完整正确的表单')
    //       }
    //     })
    //   } else {
    //     this.action(simpleForm.is_edit ? true : false)
    //   }
    // },
    // 设置保存时的Loading效果，并执行提交后台的操作
    action() {
      // this.loadingBtn = true
      let handleName = 'handleOkClick'
      let result = this.events[handleName]()
      if (!this.options.noShowLoading) {
        this.loadingBtn = true
      } else {
        this.loadingBtn = false
      }
      if (result && result.then) {
        result
          .then(res => {
            if (res) {
              this.opts.visible = false
            }
            this.closeLoading()
            // this.resetForm()
          })
          .catch(err => {
            if (err instanceof Error) {
              // eslint-disable-next-line no-console
              console.error(err)
            }
            if (typeof err === 'string') {
              this.$message.error(err)
            }
            this.closeLoading()
          })
      } else {
        this.closeLoading()
        this.opts.visible = false
      }
    },
    closeLoading() {
      this.loadingBtn = false
    },
    open() {
      this.opts.visible = true
    },
    isFullMethod() {
      this.$set(this.options, 'fullscreen', this.options.fullscreen)
      this.$emit('fullscreen', this.options.fullscreen)
      // eslint-disable-next-line no-undef
      GLOBAL && GLOBAL.vbus.$emit('dialog.fullscreen', this.options.fullscreen)
    },
    // 重置弹窗里的表单域
    resetForm() {
      let forms = this.getElForm(this.$children)
      if (this.scrollTop) {
        let scrollWrapper = Array.from(
          document.querySelectorAll(
            '.customDialog .default-scrollbar__wrap.el-scrollbar__wrap'
          )
        )
        // 重置滚动条
        scrollWrapper.map(el => (el.scrollTop = 0))
      }

      // 重置表单
      forms.map(el => el.reset())

      this.forms.splice(0)
    }
  }
}
</script>
<style lang="scss">
.customDialog {
  .el-dialog__footer {
    .el-button.el-button--primary {
      padding: 12px 56px;
    }
  }

  .el-dialog.is-fullscreen {
    display: flex;
    flex-direction: column;
  }
  .el-scrollbar {
    height: 100%;
  }
  .el-dialog__header {
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;
  }
  .el-dialog__body {
    padding: 10px 10px 16px 10px;
    border-bottom: 1px solid #ebeef5;
    flex: 1;
    overflow: auto;
  }
  ::-webkit-scrollbar:vertical {
    width: 0;
    height: 0;
    background: transparent;
  }
  & {
    -ms-scroll-chaining: chained;
    -ms-overflow-style: none;
    -ms-content-zooming: zoom;
    -ms-scroll-rails: none;
    -ms-content-zoom-limit-min: 100%;
    -ms-content-zoom-limit-max: 500%;
    -ms-scroll-snap-type: proximity;
    -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
    -ms-overflow-style: none;
    // overflow: auto;
  }
  .default-scrollbar__wrap {
    overflow: auto;
    // max-height: 620px;
    height: 100%;
    margin-right: 0 !important;
  }
  &.is-fullScreen {
    .is-fullscreen {
      display: flex;
      flex-direction: column;
      .el-dialog__body {
        flex: 1;
        .el-scrollbar {
          height: 800px;
        }
      }
    }

    .default-scrollbar__wrap {
      max-height: 100%;
    }
  }
  .p20-scrollbar__view {
    padding: 10px 14px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
  }
  .el-dialog__footer {
    padding: 14px;
  }
  .bigIcon {
    float: right;
    margin-right: 20px;
    cursor: pointer;
    font-size: 14px;
    color: #909399;
    margin-top: 0.8px;
  }
  .bigIcon:hover {
    color: #f8964e;
  }
}
</style>
