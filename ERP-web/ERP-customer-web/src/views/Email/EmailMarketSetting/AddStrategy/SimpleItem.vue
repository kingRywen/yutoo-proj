<template>
  <el-col :span="12" class="simple-item" v-if="visible">
    <el-form-item size="small" class="item-wrap">
      <el-row class="title-sign">
        <el-col :span="22" :class="{must: mustSign}">{{ label }}</el-col>
        <el-col :span="2">
          <el-button icon="el-icon-close" class="close" circle style="margin-top:-10px;" @click="handleClose"></el-button>
        </el-col>
      </el-row>
      <el-row class="select-sign">
        <el-col :span="24" style="height: 44px;">
          <slot></slot>
        </el-col>
        <!-- <el-col :span="18">
          <slot name="right"></slot>
        </el-col>
        <el-col style="padding-left: 10px;">
          <slot name="bottom"></slot>
        </el-col>-->
      </el-row>
    </el-form-item>
  </el-col>
</template>
<script>
export default {
  props: ['label', 'mustSign', 'selectValue'],
  data() {
    return {
      visible: false,
      form: {
        senderFlag: ''
      }
    }
  },
  created() {
    let selectValue = this.selectValue || []
    if (selectValue.includes(this.label)) {
      this.visible = true
    } else {
      this.visible = false
    }
  },
  watch: {
    selectValue(val) {
      let selectValue = val || []
      if (selectValue.includes(this.label)) {
        this.visible = true
      } else {
        this.visible = false
      }
    }
  },
  methods: {
    handleClose() {
      this.visible = false
      this.$emit('change', this.label)
    }
  }
}
</script>

<style lang="scss">
.simple-item {
  .must {
    @include must-fill-sign;
  }
  .item-wrap {
    width: 100%;
    border: 1px solid #ebeef5;
    box-sizing: border-box;

    .title-sign {
      position: relative;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      border-bottom: 1px solid #ebeef5;
      .close {
        border: none;
        padding: 5px;
        position: absolute;
        right: 0px;
        top: 10px;
        i {
          font-size: 18px;
        }
      }
    }
    .select-sign {
      padding: 8px 0;
      line-height: 40px;
      .mar10 {
        margin: 0 0 0 10px;
      }
      .normal-input {
        width: 460px;
      }
    }
  }
}
</style>
