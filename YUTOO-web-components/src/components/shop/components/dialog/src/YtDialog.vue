<template>
  <el-dialog
    class="customDialog"
    v-on="bindEvents"
    center
    v-bind="opts"
    :visible="options.visible"
    :before-close="handleClose"
		@closed = "handleClosed"
    :width="Number.isFinite(dialogWidth) ?dialogWidth + 'px' : dialogWidth"
  >
    <span slot="title">
      <span v-if="opts.title">{{opts.title}}</span>
      <slot v-else name="title"></slot>
    </span>

    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <el-button
        
				:loading="btnLoading"
        size="small"
        type="primary"
        @click="events.handleOkClick"
      >{{opts.okBtnText || '确定'}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ShopYtDialog',
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    events: {
      type: Object,
      default: () => {}
    }
  },
	data(){
		return{
			btnLoading:false
		}
	},
  computed: {
    opts() {
      let opt = JSON.parse(JSON.stringify(this.options))
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
        beforeClose: () => {
          this.options.visible = false
        },
        ...opt
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
    handleClose(done) {
      this.options.visible = false
      done()
    },
		handleClosed(){
			this.btnLoading = false
		}
  }
}
</script>

<style>
.scroll-wrapper {
  flex: auto;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
}
</style>
