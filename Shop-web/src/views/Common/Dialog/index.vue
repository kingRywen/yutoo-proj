<template>
  <div class="___common">
    <el-dialog class="customDialog" v-on="bindEvents" center v-bind="opts" :visible="options.visible" :before-close="handleClose">

      <span slot="title">
        <span v-if="opts.title">{{opts.title}}</span>
        <slot v-else name="title"></slot>
        <slot name='other'></slot>
      </span>

      <slot></slot>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" v-if="events.handleOkClick" @click="events.handleOkClick" :loading="opts.loading">{{opts.okBtnText || '确定'}}</el-button>
				<el-button size="small" @click="handleClose">{{opts.cancelBtnText || '取消'}}</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "el-dialog-yt",
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
  computed: {
    opts() {
      let opt = JSON.parse(JSON.stringify(this.options));
      delete opt.visible;
      return {
        visible: false,
        title: "提示",
        width: "60%",
        fullscreen: false,
        top: "15vh",
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: false,
        closeOnPressEscape: true,
        showClose: true,
        beforeClose: () => {
          this.options.visible = false;
        },
        ...opt
      };
    },
    bindEvents() {
      return {
        handleOkClick: () => {},
        ...this.events
      };
    }
  },
  methods: {
    handleClose(done) {
      this.options.visible = false;
      if (this.options.resetFields) {
        this.options.resetFields();
      }
      // done();
    }
  }
};
</script>

<style>
.scroll-wrapper {
  flex: auto;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
}
</style>
