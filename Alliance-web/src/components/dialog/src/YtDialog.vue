<template>
  <el-dialog
    class="customDialog"
    v-on="events"
    v-bind="options"
    :close-on-click-modal="false"
    center
    :visible.sync="options.visible"
    :before-close="beforeClose"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-scrollbar
      v-loading="loadingBtn || $store.state.isloading"
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
        <div v-if="options.okBtnText && copyText !== undefined">
          <el-button ref="copyBtn" size="small" type="primary" :loading="loadingBtn" :data-clipboard-text="copyText">复制</el-button>
        </div>
        <!-- 没有复制功能 -->
        <el-button
          v-if="options.okBtnText && copyText === undefined"
          size="small"
          type="primary"
          :loading="loadingBtn || $store.state.isloading"
          @click="handleOkClick"
        >{{options.okBtnText}}</el-button>

        <el-button
          v-if="options.cancelBtnText"
          style="padding: 12px 20px;"
          size="small"
          @click="handleCancelClick"
        >{{options.cancelBtnText}}</el-button>
      </template>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'yt-dialog',
  data() {
    return {
      forms: [],
      loadingBtn: false,
      copyBtn: null,
      diaKey: 1
    }
  },
  props: {
    copyText: {
      type: String,
      default: undefined
    },
    options: {
      type: Object,
      default: () => ({
        visible: false,
        title: '提示',
        width: '70%',
        fullscreen: false,
        top: '6vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: false,
        closeOnPressEscape: true,
        showClose: true
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
  methods: {
    handleCancelClick() {
      this.events.handleCancelClick && this.events.handleCancelClick()
      this.options.visible = false
      // this.$emit('handleCancelClick')
    },
    handleOpen() {
      this.$store.commit('dialogState', true)
      this.diaKey = Math.random()
      this.events.handleOpen && this.events.handleOpen()
      let vm = this
      this.$nextTick(() => {
        // 装载复制组件
        setTimeout(() => {
          this.$nextTick(() => {
            if (this.copyText == null) {
              return
            }
            this.copyBtn = new this.clipboard(this.$refs.copyBtn.$el)
            this.copyBtn.on('success', function() {
              vm.$message({
                message: '复制成功！',
                type: 'success'
              })
            })
          })
        })
        this.resetForm(true)
      })
    },
    beforeClose(done) {
      this.$store.commit('dialogState', false)
      this.resetForm()
      this.options.beforeClose && this.options.beforeClose()
      // 卸载复制组件
      if (this.copyBtn) {
        this.copyBtn.destroy()
        this.copyBtn = null
      }

      done()
    },

    handleClose() {
      this.$store.commit('dialogState', false)
      this.resetForm()
      this.options.close && this.options.close()
      if (this.copyBtn) {
        this.copyBtn.destroy()
        this.copyBtn = null
      }
    },

    // handleOkClick(noLoading = false) {
    //   let simpleForm = this.$slots.default[0].child
    //   let childVm
    //   if (!simpleForm) {
    //     this.action(undefined, noLoading)
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
    //         this.action(simpleForm.is_edit ? true : false, noLoading)
    //       } else {
    //         this.$nextTick(() => {
    //           let errorMsg = document.querySelectorAll(
    //             '.el-form-item__error'
    //           )[0].innerText
    //           this.$message.warning(errorMsg)
    //         })
    //       }
    //     })
    //   } else {
    //     this.action(simpleForm.is_edit ? true : false, noLoading)
    //   }
    // },

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
          if (element.$options._componentTag === 'el-form') {
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
    handleOkClick(noLoading = false) {
      this.getElForm(this.$children)
      if (!this.forms.length) {
        this.action(undefined, noLoading)
        return
      } else {
        Promise.all(this.forms.map(form => form.validate()))
          .then(() => {
            this.action(this.forms[0].is_edit ? true : false, noLoading)
            this.forms.splice(0)
          })
          .catch(err => {
            // console.error(err);
            this.forms.splice(0)
            this.$nextTick(() => {
              let errorMsg = document.querySelectorAll(
                '.el-form-item__error'
              )[0].innerText
              this.$message.warning(errorMsg)
            })
          })
      }

      // if (childVm && childVm.rules && Object.keys(childVm.rules).length) {
      //   childVm.validate(valid => {
      //     if (valid) {
      //       this.action(simpleForm.is_edit ? true : false, noLoading)
      //     } else {
      //       this.$nextTick(() => {
      //         let errorMsg = document.querySelectorAll(
      //           '.el-form-item__error'
      //         )[0].innerText
      //         this.$message.warning(errorMsg)
      //       })
      //     }
      //   })
      // } else {
      //   this.action(simpleForm.is_edit ? true : false, noLoading)
      // }
    },
    // 设置保存时的Loading效果，并执行提交后台的操作
    action(edit, noLoading) {
      // this.loadingBtn = true
      let handleName = 'handleOkClick'
      if (edit) {
        handleName = 'handleEditOkClick'
      }
      let result = this.events[handleName]()
      if (!this.options.noShowLoading) {
        this.loadingBtn = noLoading ? false : true
      } else {
        this.loadingBtn = false
      }
      if (result && result.then) {
        result
          .then(res => {
            if (res) {
              this.options.visible = false
            }
            this.closeLoading()
            this.resetForm()
          })
          .catch(err => {
            this.closeLoading()
          })
      } else {
        this.closeLoading()
        this.options.visible = false
      }
    },
    closeLoading() {
      this.loadingBtn = false
    },
    open() {
      this.options.visible = true
    },
    // 重置弹窗里的表单域
    resetForm() {
      try {
        let childVm = this.$slots.default[0].child
        if (childVm.reset) {
          childVm.reset()
        }
        if (childVm.clearFormData) {
          childVm.clearFormData()
        }

        // this.options.visible = open
      } catch (error) {
        // console.log(error)
      }
    }
  }
}
</script>
<style lang="scss">
.customDialog {
  .el-dialog__body {
    padding: 10px 10px 30px;
  }

  .default-scrollbar__wrap {
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      background: transparent;
    }
    overflow-x: auto;
    max-height: 560px;
    margin-right: 0 !important;
  }
  .p20-scrollbar__view {
    padding: 10px 17px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
  }
}
</style>
