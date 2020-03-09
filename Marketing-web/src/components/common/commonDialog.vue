<!-- 公共弹窗 -->
<template>
  <div class="common_dialog __wrapper_i">
    <el-dialog :close-on-click-modal="false" :title="modalObj.title" :visible.sync="modalObj.show" :width="modalObj.width || '600px'" center :before-close="modalObj.modalClose" :modal-append-to-body="false">
      <div slot="title">
        <span class="el-dialog__title">{{modalObj.title}}</span>
        <span class="timeCss" v-if="modalObj.point">{{modalObj.point}}点/每次</span>
      </div>
      <slot>弹窗</slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["modalObj"],
  data() {
    return {};
  },

  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style lang='scss'>
.common_dialog {
  .el-dialog__header {
    padding: 15px 0px !important;
    text-align: left !important;
  }
  .spe {
    .el-form-item__label {
      line-height: 0;
    }
    .el-cascader__label {
      line-height: 30px;
      font-size: 12px;
    }
  }
}
</style>
