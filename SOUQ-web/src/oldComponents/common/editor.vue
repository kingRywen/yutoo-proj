<template>
  <div>
    <script :id.prop="initId" type="text/plain"></script>
  </div>
</template>
<script>
export default {
  props: ["value"],
  name: "UE",
  data() {
    return {
      editor: null
    };
  },
  created() {
    console.log(this.props);
  },
  methods: {
    input(val) {
      this.$emit("input", val);
    }
  },
  props: {
    defaultMsg: {
      type: String
    },
    config: {
      type: Object
    },
    initId: {
      type: String
    }
  },
  mounted() {
    let iframe = top.frames["main"];
    const _this = this;
    this.editor = UE.getEditor(this.initId, this.config); // 初始化UE
    console.log("mounted");
    this.editor.addListener("ready", function() {
      console.log("ready");
      _this.editor.setContent(_this.html(_this.defaultMsg)); // 确保UE加载完成后，放入内容。
    });

    this.editor.addListener("contentChange", function() {
      console.log(_this.editor.getContentTxt());
      // 动态获取编辑器的内容
      _this.$emit("input", _this.unhtml(_this.editor.getContentTxt()));
      _this.$emit("update:source", _this.unhtml(_this.editor.getContent())); //添加一个变量，用于传给版本列表
    });
  },
  methods: {
    getUEContent() {
      // 获取内容方法
      return this.editor.getContent();
      this.$emit("input", this.editor.getContent());
    },
    unhtml(html) {
      return UE.utils.unhtml(html);
    },
    html(html) {
      return UE.utils.html(html);
    }
  },
  destroyed() {
    this.editor.destroy();
  }
};
</script>
<style>
.edui-default .edui-toolbar .edui-button,
.edui-default .edui-toolbar .edui-splitbutton,
.edui-default .edui-toolbar .edui-menubutton,
.edui-default .edui-toolbar .edui-combox {
  line-height: 1;
}
</style>
