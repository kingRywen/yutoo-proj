<template>
  <el-dialog :title="title" :visible="visible" @close="close" @open="open" top="10vh">
  <iframe :src="src" frameborder="0" name="dialog" id="dialog" ref="dialog" :height="height"></iframe>
  <div slot="footer" class="dialog-footer">
    <el-button @click="close">取 消</el-button>
    <el-button type="primary" @click="submit">确 定</el-button>
  </div>
</el-dialog>
</template>
<script>
export default {
  props: ["title", "src", "visible", "height", "callback", "data"],
  data() {
    return {
      isSubmit: false
    };
  },
  mounted() {
    this.$nextTick(function () {
      if (this.$refs.dialog) {
        let win = this.$refs.dialog.contentWindow;
        win.myAttribute = this.data
        console.log(win.myAttribute);
      }
    })
    
  },
  methods: {
    open() {
      this.isSubmit = false;
    },
    close() {
      this.$emit("update:visible", false);
      this.$refs.dialog.contentWindow.location.reload();
      if (this.isSubmit) {
        this.callback();
      }
    },
    submit() {
      this.isSubmit = true;
      this.$refs.dialog.contentWindow.vm.submitForm();
    }
  }
};
</script>
<style scoped>
iframe {
  width: 100%;
}
</style>
