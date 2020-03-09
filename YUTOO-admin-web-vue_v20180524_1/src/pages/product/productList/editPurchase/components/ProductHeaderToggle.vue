<template>
  <div class="productHeaderEditing">
    <!-- {{item}} -->
    <!-- <div>SKU： 1902765</div> -->
    <v-button v-for="(i, index) in item" :key="index" style="margin: 10px 0; border:none; background: #e8e8e8; height:48px" @click="toggle">{{i}}</v-button>

  </div>
</template>

<script>
import apis from "apis";
import { fetchData, showToast } from "common/common";

export default {
  inheritAttrs: false,
  props: ["item"],
  data() {
    return {};
  },
  methods: {
    ok() {
      // this.$listeners.set(this.ruleForm)
      fetchData({
        ...apis.PRODUCT_TRANSPORT_REL_UPDATE,
        data: { ...this.item.transportItem }
      }).then(res => {
        if (res.data.code === 0) {
          showToast("success", "编辑成功");
          this.$root.$children[0].asyncModalVisible = false;
        } else {
          showToast("error", "编辑失败");
        }
      });
    },
    toggle() {
      this.$root.$children[0].asyncModalVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
* {
  font-size: 14px;
}
.productHeaderEditing {
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    margin: 12px 0;
    span {
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 160px;
    }
  }
}
</style>
