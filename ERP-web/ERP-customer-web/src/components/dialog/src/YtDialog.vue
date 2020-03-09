<template>
  <el-dialog
    class="customDialog"
    v-on="events"
    v-bind="options"
    center
    :visible.sync="options.visible"
    :before-close="beforeClose"
    @open="handleOpen"
  >
    <!-- <slot v-if="$slots.tt" name="title" v-else>
      <slot name="tt"></slot>
    </slot>-->
    <div class="scroll-wrapper">
      <slot></slot>
    </div>

    <slot name="footer" class="dialog-footer">
      <div v-if="$slots.ft">
        <slot name="footer"></slot>
      </div>
      <template v-else>
        <!-- 有复制功能 -->
        <div v-if="options.okBtnText && copyText !== undefined">
          <el-button ref="copyBtn" size="small" type="primary" :loading="loadingBtn" :data-clipboard-text="copyText">复制</el-button>
          <!-- <el-button v-if="options.okBtnText" size="small" type="primary" @click="handleOkClick" :loading="loadingBtn">复制</el-button> -->
        </div>
        <!-- 没有复制功能 -->
        <div class="dialogBtn">
          <el-button
            v-if="options.okBtnText && copyText === undefined"
            size="small"
            type="primary"
            :loading="loadingBtn"
            @click="handleOkClick"
          >{{options.okBtnText}}</el-button>

          <el-button
            v-if="options.cancelBtnText"
            size="small"
            type="primary"
            @click="options.visible = false"
          >{{options.cancelBtnText}}</el-button>
        </div>
      </template>
    </slot>
  </el-dialog>
</template>

<script>
export default {
  name: 'yt-dialog',
  data() {
    return {
      loadingBtn: false,
      copyBtn: null
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
        width: '80%',
        fullscreen: false,
        top: '6vh',
        modal: true,
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
        close: () => {},
        closed: () => {},
        handleOkClick: () => {}
      })
    }
  },
  methods: {
    handleOpen() {
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
      this.resetForm()
      this.options.beforeClose && this.options.beforeClose()
      // 卸载复制组件
      if (this.copyBtn) {
        this.copyBtn.destroy()
        this.copyBtn = null
      }

      done()
    },

    // 保存按钮事件
    handleOkClick() {
      let simpleForm = this.$slots.default[0].child
      let childVm
      if (!simpleForm) {
        this.action()
        return
      }
      if (simpleForm.$children[0]) {
        childVm =
          simpleForm.$children[0].$el.nodeName !== 'FORM'
            ? simpleForm
            : simpleForm.$children[0] // 表单组件
      }

      if (childVm && childVm.rules && Object.keys(childVm.rules).length) {
        childVm.validate(valid => {
          if (valid) {
            this.action(simpleForm.is_edit ? true : false)
          } else {
            this.$message.warning('请填写完整正确的表单')
          }
        })
      } else {
        this.action(simpleForm.is_edit ? true : false)
      }
    },
    // 设置保存时的Loading效果，并执行提交后台的操作
    action(edit) {
      this.loadingBtn = true
      let handleName = 'handleOkClick'
      if (edit) {
        handleName = 'handleEditOkClick'
      }
      let result = this.events[handleName]()
      if (result && result.then) {
        result
          .then(res => {
            console.log(res)
            this.options.visible = false
            this.closeLoading()
            this.resetForm()
          })
          .catch(() => {
            // console.log(err)
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
        if (!childVm || !childVm.reset) {
          return
        }
        if (childVm.reset) {
          childVm.reset()
        }
        if (childVm.clearFormData) {
          childVm.clearFormData()
        }

        // this.options.visible = open
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>
.scroll-wrapper {
  flex: auto;
  width: 100%;
  height: 100%;
  max-height: 560px;
  overflow: auto;
}
.dialogBtn {
  display: flex;
  justify-content: center;
}
</style>
