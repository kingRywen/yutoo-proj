<template>
  <el-dialog
     :class="['customDialog', {'is-fullScreen': options.fullscreen}]"
    v-on="bindEvents"
    center
    v-bind="opts"
    :visible="options.visible"
    :before-close="handleClose"
    @closed="handleClosed"
    :width="Number.isFinite(dialogWidth) ?dialogWidth + 'px' : dialogWidth"
  >
    <span slot="title">
      <span v-if="opts.title">{{opts.title}}</span>
      <slot v-else name="title"></slot>
      <i class="iconfont1 iconfangda bigIcon" v-if="options.showMaxBtn" @click="isFullMethod" ></i>
      <slot name='titleIn'></slot>
    </span>

    <el-scrollbar
      v-loading="$store.state.isloading || $store.state.loading"
      wrap-class="default-scrollbar__wrap"
      view-class="p20-scrollbar__view"
      ref="scroll"
      :style="{height:options.height,marginBottom:opts.showFooter?'0':'10px'}"
    >
      <slot></slot>
    </el-scrollbar>
    <span slot="footer" class="dialog-footer" v-if="opts.showFooter">
      <slot name="footer">
        <el-button
          v-if="opts.showOk"
          :loading="$store.state.isloading || $store.state.loading"
          size="small"
          type="primary"
          @click="events.handleOkClick"
        >{{opts.okBtnText || '确定'}}</el-button>
        <el-button v-if="opts.showCancel" size="small" type="primary" plain @click="options.visible = false">{{opts.cancelBtnText || (opts.showOk ? '取消' : '关闭')}}</el-button>
      </slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'yt-dialog',
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    scrollTop: {
      default: true
    },
    events: {
      type: Object,
      default: () => {}
    },
    btnLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    opts() {
      let { showFooter, ...opt } = JSON.parse(JSON.stringify(this.options))
      if (!showFooter && showFooter !== false) {
        showFooter = true
      }
      delete opt.visible
      return {
        visible: false,
        btnLoading: false,
        title: '提示',
        width: opt.width || '800px',
        // small 500 | medium 800 | large 1200
        //size: 'medium',
        fullscreen: false,
        top: '15vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: false,
        closeOnPressEscape: true,
        showClose: true,
        showCancel: true,
        showOk: true,
        beforeClose: () => {
          this.options.visible = false
        },
        ...opt,
        showFooter
      }
    },
    dialogWidth() {
      let { size, width } = this.opts
      return size
        ? size === 'small'
          ? '500px'
          : size === 'medium'
          ? '800px'
          : '1200px'
        : width
    },
    bindEvents() {
      return {
        handleOkClick: () => {},
        ...this.events
      }
    }
  },
  methods: {
    isFullMethod(){
      this.$set(this.options,'fullscreen',!this.options.fullscreen)
      this.$emit('fullscreen')
    },
    handleCancelClick() {
      this.events.handleCancelClick && this.events.handleCancelClick()
      this.options.visible = false
    },
    handleClose(done) {
      this.options.visible = false
      done()
    },
    handleClosed() {
      this.btnLoading = false
    }
  }
}
</script>

<style  lang='less' scope>
.default-scrollbar__wrap{
  max-height: 620px
}
.scroll-wrapper {
  flex: auto;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
}
.customDialog {
   &.is-fullScreen {
    .default-scrollbar__wrap {
      max-height: 100%;
    }
  }
}
</style>
