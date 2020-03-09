<template>
  <el-dialog
    class="customDialog"
    v-on="events"
    v-bind="innerOpts"
    v-loading="editLoading"
    center
    :visible.sync="options.visible"
    @open="handleOpen"
    @close="handleClose"
  >
    <!-- <div class="scroll-wrapper">
    </div>-->
    <el-scrollbar
      wrap-class="default-scrollbar__wrap"
      view-class="p20-scrollbar__view"
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
          :loading="loadingBtn"
          @click="handleOkClick"
        >{{options.okBtnText}}</el-button>

        <el-button v-if="options.cancelBtnText" size="small" @click="handleCancel">{{options.cancelBtnText}}</el-button>
      </template>
    </template>
  </el-dialog>
</template>

<script>
/* eslint-disable */
export default {
  inheritAttrs: false,
  name: 'YtDialog',
  data() {
    return {
      forms: [],
      loadingBtn: false,
      editLoading: false,
      copyBtn: null
    }
  },
  props: {
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
    options: {
      type: Object,
      default: () => ({
        is_edit: false, // 是否编辑模式
        visible: false,
        title: '提示',
        width: '80%',
        fullscreen: false,
        top: '6vh',
        modal: true,
        okBtnText: '确认',
        // cancelBtnText: '取消',
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      })
    },
    events: {
      type: Object,
      default: () => ({
        open: () => {},
        opened: () => {},
        close: () => {},
        closed: () => {},
        handleOkClick: () => {}
      })
    }
  },
  computed: {
    innerOpts: {
      get() {
        let {
          is_edit,
          params,
          component,
          display,
          setEditData,
          ...opts
        } = this.options
        return Object.assign({}, opts, {
          beforeClose: done => {
            this.beforeClose(done)
          }
        })
      },
      set(val) {
        this.options = val
      }
    }
  },
  methods: {
    handleClose() {
      // this.events.close && this.events.close()
      this.handleCancel()
    },
    handleCancel() {
      // this.$set(this.options, 'visible', false)
      // this.innerOpts = { ...this.innerOpts, visible: false }
      // this.options.visible = false
      this.options.visible = false
      this.$emit('close')
    },
    handleOpen() {
      this.$emit('open')
      this.events.handleOpen && this.events.handleOpen()

      // 判断是否是编辑状态。如果是，请求数据并初始化数据
      if (this.options.is_edit) {
        this.options.setEditData && (this.editLoading = true)
        this.options.setEditData &&
          this.options.setEditData().then(data => {
            this.editLoading = false
          })
      }
      let vm = this
      this.$nextTick(() => {
        // 装载复制组件
        setTimeout(() => {
          this.$nextTick(() => {
            if (this.copyText == null) {
              return
            }
            this.Clipboard = this.clipboard
            this.copyBtn = new this.Clipboard(this.$refs.copyBtn.$el)
            this.copyBtn.on('success', function() {
              vm.$message({
                message: '复制成功！',
                type: 'success'
              })
            })
          })
        })
      })
    },
    beforeClose(done) {
      this.options.beforeClose && this.options.beforeClose(done)
      this.options.is_edit = false

      this.resetForm()

      // 卸载复制组件
      if (this.copyBtn) {
        this.copyBtn.destroy()
        this.copyBtn = null
      }
      if (done) {
        done()
      }
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
    handleOkClick() {
      if (!this.validate) {
        // 需要验证
        // let defaultVNode = this.$children
        this.getElForm(this.$children)

        Promise.all(this.forms.map(form => form.validate()))
          .then(res => {
            // 所有form验证成功
            this.forms.splice(0)
            this.action()
          })
          .catch(err => {
            if (err !== false) {
              console.error(err)
            }

            // 所有form验证失败
            this.$message.warning('请输入正确的必填项')
            this.forms.splice(0)
            this.loadingBtn = false
          })
      } else {
        // 自己手动验证
        this.validate()
          .then(() => {
            this.action()
          })
          .catch(() => {})
      }
    },
    // 设置保存时的Loading效果，并执行提交后台的操作
    action() {
      this.loadingBtn = true
      let handleName = 'handleOkClick'
      let edit = false
      if (this.options.is_edit) {
        handleName = 'handleEditOkClick'
        edit = true
      }
      let result = this.events.handleEditOkClick
        ? this.events[handleName]()
        : this.events.handleOkClick(edit)
      if (result && result.then) {
        result
          .then(() => {
            this.closeLoading()
            this.options.visible = false
            this.resetForm()
          })
          .catch(err => {
            if (err) {
              this.$message.error(err)
            }
            this.closeLoading()
          })
      } else {
        this.closeLoading()
        this.options.visible = false
        this.resetForm()
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
      forms.map(el => el.resetFields())
      this.forms.splice(0)
    }
  }
}
</script>

<style lang="scss">
.p20-scrollbar__view {
  height: 100%;
  & > div {
    height: 100%;
  }
}
.customDialog {
  .el-scrollbar__view {
    height: 100%;
  }

  .el-dialog__body {
    padding: 10px 10px 30px;
    & > .el-scrollbar > ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  .default-scrollbar__wrap {
    overflow-x: auto;
    max-height: 560px;
    margin: 0 !important;
    margin-right: 0 !important;
  }

  .is-fullscreen {
    .default-scrollbar__wrap {
    max-height: 880px;
  }
  }
  .p20-scrollbar__view {
    padding: 17px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.Firefox {
  .el-scrollbar__bar {
    display: none !important;
  }

  .el-scrollbar__wrap {
    overflow: auto;
  }
}
</style>
